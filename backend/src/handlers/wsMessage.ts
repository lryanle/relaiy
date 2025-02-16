import WebSocket from 'ws';
import { createPrompt, ResponseFormat } from '../utils/prompt';
import { models } from '../utils/models';
import z from 'zod';
import { selectBestResponse } from '../utils/mcts';
import db from '../db';
import { twilioClient } from '../twilio';
import { RetellResponse } from '../types/llmWebSocket';
import { v7 as uuidv7 } from 'uuid';

const messageSchema = z.object({
    chatId: z.string(),
    message: z.string(),
    destination: z.string().optional(),
    retell: z.object({
        type: z.string(),
        data: z.any(),
        response_id: z.number().optional()
    }).optional()
});

type ChatMessage = { role: 'user' | 'assistant', content: string };

// Add interface for model response with usage
interface ModelResponse {
    content: string;
    usage_metadata?: {
        output_tokens: number;
        input_tokens: number;
        total_tokens: number;
    };
}


function parseModelResponse(content: string): ResponseFormat[] {
    try {
        // Try to find and parse JSON array in the response
        const jsonMatch = content.match(/\[.*\]/s);
        if (!jsonMatch) return [];
        
        const parsed = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(parsed)) return [];

        // Validate and transform each response
        return parsed.map(item => ({
            response: typeof item.response === 'string' ? item.response : '',
            isComplete: Boolean(item.isComplete),
            reason: typeof item.reason === 'string' ? item.reason : undefined,
            modelName: item.modelName,
            responseId: item.responseId
        })).filter(item => item.response); // Filter out empty responses
    } catch (error) {
        console.error('Failed to parse model response:', error);
        return [];
    }
}

export const wsMessage = async (ws: WebSocket, message: string) => {
    try {
        const parsedMessage = messageSchema.safeParse(JSON.parse(message));

        if (!parsedMessage.success) {
            ws.send(JSON.stringify({ error: 'Invalid message' }));
            return;
        }

        const messages = await db.chatMessage.findMany({
            where: { threadId: parsedMessage.data.chatId }
        });

        const thread = await db.chatThread.findUnique({
            where: { id: parsedMessage.data.chatId }
        });

        if (!thread) {
            ws.send(JSON.stringify({ error: 'Thread not found' }));
            return;
        }
        
        const history: ChatMessage[] = messages.map(msg => ({
            role: msg.sender === 'USER' ? 'user' : 'assistant',
            content: msg.content
        }));

        const prompt = createPrompt({
            goal: thread.goal,
            tone: thread.tones.join(', '),
            history: [...history, { role: 'user' as const, content: parsedMessage.data.message }],
            requirements: thread.requirements,
            profileInfomation: {
                name: 'Duy',
                age: 20,
                gender: 'male',
                location: 'Dallas, TX',
                interests: ['badminton', 'coding', 'traveling']
            }
        });

        // Generate response IDs pool (10 per model)
        const responseIdPools: Record<string, string[]> = {};
        Object.keys(models).forEach(modelName => {
            responseIdPools[modelName] = Array.from({ length: 10 }, () => uuidv7());
        });

        // Send initial ID pools to client
        ws.send(JSON.stringify({
            type: 'responsePools',
            chatId: parsedMessage.data.chatId,
            pools: responseIdPools,
            timestamp: new Date().toISOString()
        }));

        const responses: ResponseFormat[] = [];
        const modelUsage: Record<string, { input: number; output: number; cost: number }> = {};

        await Promise.all(Object.entries(models).map(async ([modelName, model]) => {
            try {
                const result = await model.model.invoke([{
                    role: 'user',
                    content: prompt
                }]) as ModelResponse; // Cast to our interface

                if (typeof result.content === 'string') {
                    const parsedResponses = parseModelResponse(result.content);
                    
                    // Store usage data if available
                    if (result.usage_metadata) {
                        modelUsage[modelName] = {
                            input: result.usage_metadata.input_tokens,
                            output: result.usage_metadata.output_tokens,
                            cost: ((result.usage_metadata.input_tokens * model.price.input) + 
                                   (result.usage_metadata.output_tokens * model.price.output)) / 1_000_000
                        };
                    }
;
                    // Send responses with IDs
                    if (parsedResponses.length > 0) {
                        parsedResponses.forEach((response, index) => {
                            // Use modulo to ensure we stay within the pool size of 10
                            const poolIndex = index % 10;
                            const responseId = responseIdPools[modelName][poolIndex];

                            const responseData = {
                                type: 'response',
                                chatId: parsedMessage.data.chatId,
                                responseId,
                                model: modelName,
                                response: response.response,
                                timestamp: new Date().toISOString()
                            };

                            ws.send(JSON.stringify(responseData));
                            responses.push({
                                response: response.response,
                                isComplete: response.isComplete,
                                modelName: modelName,
                                responseId: responseId
                            });
                            
                        });

                    } else {
                        console.warn(`Model ${modelName} returned no valid responses`);
                        ws.send(JSON.stringify({
                            chatId: parsedMessage.data.chatId,
                            model: modelName,
                            error: 'Model returned no valid responses',
                            timestamp: new Date().toISOString()
                        }));
                    }
                } else {
                    console.error(`Model ${modelName} returned unexpected content type:`, typeof result.content);
                }
            } catch (error) {
                console.error(`Error with model ${modelName}:`, error);
                ws.send(JSON.stringify({
                    chatId: parsedMessage.data.chatId,
                    model: modelName,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                }));
            }
        }));

        // Calculate scores and status for all responses
        if (responses.length > 0) {
            const bestResponse = selectBestResponse(responses);
            
            // Require at least 2 responses for completion voting
            const completionVotes = responses.filter(r => r.isComplete).length;
            const isComplete = responses.length >= 2 && completionVotes > responses.length / 2;

            // Calculate total usage for the best response
            const totalInputTokens = Object.values(modelUsage).reduce((sum, usage) => sum + usage.input, 0);
            const totalOutputTokens = Object.values(modelUsage).reduce((sum, usage) => sum + usage.output, 0);
            const totalCost = Object.values(modelUsage).reduce((sum, usage) => sum + usage.cost, 0);

            console.log('parsedMessage.data.message', parsedMessage.data.message);
            // Modified database transaction to include usage data
            await db.$transaction([
                db.chatMessage.createMany({
                    data: [
                        {
                            threadId: parsedMessage.data.chatId,
                            content: parsedMessage.data.message,
                            sender: 'USER'
                        },
                        {
                            threadId: parsedMessage.data.chatId,
                            content: bestResponse.bestResponse.response,
                            sender: 'ASSISTANT',
                            inputTokenUsage: totalInputTokens,
                            outputTokenUsage: totalOutputTokens,
                            cost: totalCost,
                            modelName: Object.keys(modelUsage).join(',') // Store all models used
                        }
                    ]
                }),
                
                db.chatThread.update({
                    where: { id: parsedMessage.data.chatId },
                    data: { status: isComplete ? 'COMPLETED' : 'ACTIVE' }
                }),
                
                // Add StockfishResponse transactions
                db.stockfishResponse.create({
                    data: {
                        response: bestResponse.bestResponse.response,
                        isBest: true,
                        modelName: bestResponse.bestResponse.model,
                        responseId: bestResponse.bestResponse.responseId,
                        threadId: parsedMessage.data.chatId,
                        ratio: 1
                    }
                }),
                
                // Save all other responses
                db.stockfishResponse.createMany({
                    data: bestResponse.allResponses.map(response => ({
                        response: response.response,
                        isBest: false,
                        modelName: response.model,
                        responseId: response.responseId,
                        threadId: parsedMessage.data.chatId,
                        ratio: response.ratio
                    }))
                })
            ]);

            // Send response to Retell if it's a Retell message
            if (parsedMessage.data.retell) {
                const retellResponse: RetellResponse = {
                    response_id: parsedMessage.data.retell.response_id || 0,
                    content: bestResponse.bestResponse.response,
                    content_complete: true,
                    end_call: isComplete,
                };
                
                ws.send(JSON.stringify(retellResponse));
            } else {
                // Existing response sending code
                ws.send(JSON.stringify({
                    chatId: parsedMessage.data.chatId,
                    bestResponse: bestResponse.bestResponse,
                    allResponses: bestResponse.allResponses,
                    isComplete,
                    usage: {
                        inputTokens: totalInputTokens,
                        outputTokens: totalOutputTokens,
                        cost: totalCost,
                        models: modelUsage
                    },
                    timestamp: new Date().toISOString()
                }));
            }

            if (parsedMessage.data.destination) {
                console.log('Sending message to', parsedMessage.data.destination);
                console.log('Best response', bestResponse.bestResponse.response);
                await twilioClient.messages.create({
                    body: bestResponse.bestResponse.response,
                    to: `whatsapp:${parsedMessage.data.destination}`,
                    from: 'whatsapp:+14155238886',
                });
            }
        } else {
            ws.send(JSON.stringify({
                chatId: parsedMessage.data.chatId,
                error: 'No valid responses from any model',
                timestamp: new Date().toISOString()
            }));
        }
        
    } catch (e) {
        console.error(e);
        ws.send(JSON.stringify({ error: 'Invalid message' }));
        return;
    }
};
import WebSocket from 'ws';
import { createPrompt, ResponseFormat } from '../utils/prompt';
import { models } from '../utils/models';
import z from 'zod';
import { selectBestResponse } from '../utils/mcts';
import db from '../db';
import { twilioClient } from '../twilio';

const messageSchema = z.object({
    chatId: z.string(),
    message: z.string(),
    destination: z.string().optional()
});

type ChatMessage = { role: 'user' | 'assistant', content: string };

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
            reason: typeof item.reason === 'string' ? item.reason : undefined
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
        
        const history: ChatMessage[] = messages.map(msg => ({
            role: msg.sender === 'USER' ? 'user' : 'assistant',
            content: msg.content
        }));

        const prompt = createPrompt({
            goal: 'You are trying to get a date or hanging out for the user.',
            tone: 'friendly and helpful',
            history: [...history, { role: 'user' as const, content: parsedMessage.data.message }],
            requirements: ['Keep it short and concise'],
            profileInfomation: {
                name: 'Duy',
                age: 20,
                gender: 'male',
                location: 'Ho Chi Minh City',
                interests: ['badminton', 'coding', 'traveling']
            }
        });

        const responses: ResponseFormat[] = [];

        await Promise.all(Object.entries(models).map(async ([modelName, model]) => {
            try {
                const result = await model.invoke([{
                    role: 'user',
                    content: prompt
                }]);

                if (typeof result.content === 'string') {
                    const parsedResponses = parseModelResponse(result.content);
                    
                    // Only send valid responses back to client
                    if (parsedResponses.length > 0) {
                        ws.send(JSON.stringify({
                            chatId: parsedMessage.data.chatId,
                            model: modelName,
                            responses: parsedResponses,
                            timestamp: new Date().toISOString()
                        }));

                        responses.push(...parsedResponses);
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

        // Only proceed if we have valid responses
        if (responses.length > 0) {
            const bestResponse = selectBestResponse(responses.map(response => response.response));
            
            // Require at least 2 responses for completion voting
            const completionVotes = responses.filter(r => r.isComplete).length;
            const isComplete = responses.length >= 2 && completionVotes > responses.length / 2;

            ws.send(JSON.stringify({
                chatId: parsedMessage.data.chatId,
                bestResponse,
                isComplete,
                timestamp: new Date().toISOString()
            }));

            if (parsedMessage.data.destination) {
                await twilioClient.messages.create({
                    body: bestResponse,
                    to: `whatsapp:${parsedMessage.data.destination}`,
                    from: 'whatsapp:+14155238886',
                });
            }

            // Create messages and update thread status
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
                            content: bestResponse,
                            sender: 'ASSISTANT'
                        }
                    ]
                }),
                db.chatThread.update({
                    where: { id: parsedMessage.data.chatId },
                    data: { status: isComplete ? 'COMPLETED' : 'ACTIVE' }
                })
            ]);
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
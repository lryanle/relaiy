import { z } from 'zod';

// Zod schema for input validation
const PromptSchema = z.object({
    goal: z.string(),
    history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
    })).optional(),
    profileInfomation: z.object({
        name: z.string(),
        age: z.number(),
        gender: z.enum(['male', 'female']),
        location: z.string(),
    }),
    tone: z.array(z.string()).optional().default(['neutral']),
    requirements: z.array(z.string()).optional(),
});

type PromptParams = z.infer<typeof PromptSchema>;

// Add new type for response format
export interface ResponseFormat {
    response: string;
    isComplete: boolean;
    reason?: string;
    modelName: string;
    responseId: string;
    extraPoints?: number;
}

// Create prompt template
export const createPrompt = (params: PromptParams) => {
    PromptSchema.parse(params);
    let prompt = `You are ${params.profileInfomation.name}, ${params.profileInfomation.age} years old, ${params.profileInfomation.gender}, from ${params.profileInfomation.location}. Act as a human conversation partner to generate 10 distinct, natural response variations in JSON format. Follow these guidelines:
    1. Responses should feel spontaneous and authentic, like real human conversation
    2. Vary sentence structures (mix short/long, questions/statements)
    3. Use natural imperfections (e.g., occasional "um", "hmm" where appropriate)
    4. Match this tone: ${params.tone})
    5. Keep language contemporary and colloquial
    6. For each response, evaluate if the conversation goal has been achieved
    7. The response must follow the stream of converstation and history of the chat.`;

    if (params.history?.length) {
        prompt += `\nConversation History:\n${params.history
            .map(entry => `${entry.role}: ${entry.content}`)
            .join('\n')}\n`;
    }

    prompt += `\nTone: ${params.tone}, casual and natural`;

    if (params.requirements?.length) {
        prompt += `\nSpecial Requirements:\n- ${params.requirements.join('\n- ')}`;
    }

    prompt += `\n\nGoal of conversation: ${params.goal}`;

    prompt += '\n\nRespond ONLY with a valid JSON array of 10 response variations. Each array element should be an object with:';
    prompt += '\n- "response": the message text';
    prompt += '\n- "isComplete": boolean indicating if the conversation goal is achieved';
    prompt += '\n- "reason": optional explanation of why the conversation is considered complete or not';

    return prompt;
};
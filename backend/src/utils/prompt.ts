import { z } from 'zod';


// Zod schema for input validation
const PromptSchema = z.object({
    goal: z.string(),
    history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
    })).optional(),
    tone: z.string().optional().default('neutral'),
    requirements: z.array(z.string()).optional(),
});

type PromptParams = z.infer<typeof PromptSchema>;

// Create prompt template
export const createPrompt = (params: PromptParams) => {
    PromptSchema.parse(params);
    let prompt = 'Your task is to generate 5 different responses in JSON array format based on these parameters:\n';
    prompt += `Act as a human conversation partner to generate 5 distinct, natural response variations in JSON format. Follow these guidelines:
1. Responses should feel spontaneous and authentic, like real human conversation
2. Vary sentence structures (mix short/long, questions/statements)
3. Use natural imperfections (e.g., occasional "um", "hmm" where appropriate)
4. Match this tone: ${params.tone})
5. Keep language contemporary and colloquial`;

    if (params.history?.length) {
        prompt += `\nConversation History:\n${params.history
            .map(entry => `${entry.role}: ${entry.content}`)
            .join('\n')}\n`;
    }

    prompt += `\nTone: ${params.tone}, casual and natural`;

    if (params.requirements?.length) {
        prompt += `\nSpecial Requirements:\n- ${params.requirements.join('\n- ')}`;
    }

    prompt += '\n\nRespond ONLY with a valid JSON array of 5 response variations. Each array element should be an object with a "response" field.';

    return prompt;
};
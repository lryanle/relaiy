import WebSocket from 'ws';
import { createPrompt } from '../utils/prompt';
import { models } from '../utils/models';
import z from 'zod';

const messageSchema = z.object({
    chatId: z.number(),
    message: z.string()
});

export const wsMessage = async (ws: WebSocket, message: string) => {
    try {
        const parsedMessage = messageSchema.safeParse(JSON.parse(message));

        if (!parsedMessage.success) {
            ws.send(JSON.stringify({ error: 'Invalid message' }));
            return;
        }

        const prompt = createPrompt({
            goal: 'You are trying to get a date or hanging out for the user. Your name is Duy.',
            tone: 'friendly and helpful',
            history: [{ role: 'user', content: parsedMessage.data.message }],
            requirements: ['Keep it short and concise']
        });
        const result = await models.gemini.invoke([{
            role: 'user',
            content: prompt
        }]);

        console.log(result.content);

        ws.send(JSON.stringify(result.content));
    } catch {
        ws.send(JSON.stringify({ error: 'Invalid message' }));
        return;
    }

};
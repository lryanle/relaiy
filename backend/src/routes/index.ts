import { Router } from 'express';
import prisma from '../db';
import z from 'zod';
import { twilioClient } from '../twilio';

const createChatSchema = z.object({
    goal: z.string(),
    userId: z.string(),
    firstMessage: z.string(),
    destination: z.string(),
    type: z.enum(['SMS', 'VOICE', 'EMAIL']),
    tones: z.array(z.string()),
    requirements: z.array(z.string())
});

const index = Router();

index.get('/', (req, res) => {
    res.send('Hello world!');
});

index.post('/create-chat', async (req, res) => {
    const { goal, userId, firstMessage, destination, type } = req.body;

    const validated = createChatSchema.safeParse(req.body);
    if (!validated.success) {
        res.status(400).json({ error: JSON.parse(validated.error.message) });
        return;
    }

    try {
        const chat = await prisma.chatThread.create({
            data: {
                goal,
                userId,
                accountId: userId,
                destination,
                type,
            }
        });

        await prisma.chatMessage.create({
            data: {
                threadId: chat.id,
                content: firstMessage,
                sender: 'ASSISTANT'
            }
        });

        // Send SMS if the type is 'sms'
        if (type === 'SMS') {
            try {
                await twilioClient.messages.create({
                    body: firstMessage,
                    to: `whatsapp:${destination}`,
                    from: 'whatsapp:+14155238886',
                });

            } catch (twilioError) {
                console.error('Twilio Error:', twilioError);
                // We still return the chat object even if SMS fails
                res.json({ 
                    ...chat, 
                    warning: 'Chat created but SMS delivery failed'
                });
                return;
            }
        }

        res.json(chat);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to create chat thread' });
    }
});

index.get('/get-chats', async (req, res) => {
    const chats = await prisma.chatThread.findMany();
    res.json(chats);
});

index.get('/get-messages/:id', async (req, res) => {
    const messages = await prisma.chatMessage.findMany({
        where: { threadId: req.params.id }
    });

    const stockfishResponses = await prisma.stockfishResponse.findMany({
        where: { threadId: req.params.id }
    });

    res.json({
        messages,
        stockfishResponses
    });
});


export default index;
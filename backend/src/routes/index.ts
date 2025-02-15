import { Router } from 'express';
import prisma from '../db';

const index = Router();

index.get('/', (req, res) => {
    res.send('Hello world!');
});

index.post('/create-chat', async (req, res) => {
    const chat = await prisma.chatThread.create({
        data: {
            messages: {
                create: []
            }
        }
    });
    res.json(chat);
});

index.get('/get-chats', async (req, res) => {
    const chats = await prisma.chatThread.findMany();
    res.json(chats);
});

index.get('/get-messages/:id', async (req, res) => {
    const messages = await prisma.chatMessage.findMany({
        where: { threadId: parseInt(req.params.id) }
    });
    res.json(messages);
});


export default index;
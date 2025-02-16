import { Router } from 'express';
import bodyParser from 'body-parser';
import { wsClients } from '../app';
import db from '../db';
import { wsMessage } from '../handlers/wsMessage';

const twilioRouter = Router();

twilioRouter.post('/',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
        console.log('Received webhook:', req.body);

        const { From, Body } = req.body;

        const chat = await db.chatThread.findFirst({
            where: {
                destination: From.replace('whatsapp:+1', '')
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!chat) {
            console.log('No chat found');
            res.send('OK');
            return;
        }

        console.log(chat);


        
        // Find WebSocket client with userId "1" and send the message
        const ws = wsClients.get(chat?.userId);


        if (ws) {
            wsMessage(ws, JSON.stringify({
                chatId: chat.id,
                message: Body,
                destination: From.replace('whatsapp:', '')
            }));
        }

        res.send('OK');
    }
);

export default twilioRouter;

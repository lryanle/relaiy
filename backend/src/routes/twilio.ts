import { Router } from 'express';
import bodyParser from 'body-parser';
import { wsClients } from '../app';
import db from '../db';
import { wsMessage } from '../handlers/wsMessage';

const twilioRouter = Router();

twilioRouter.post('/',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
        const { From, Body } = req.body;

        console.log(`Received message (${From})`, Body);

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
        
        let ws = wsClients.get(chat?.userId);

        console.log('chat', chat);
        console.log('chat?.userId', chat?.userId);
        console.log(ws);

        if (!ws) {
            ws = wsClients.get(chat?.accountId);
        }


        if (ws) {
            wsMessage(ws, JSON.stringify({
                chatId: chat.id,
                message: Body,
                destination: From.replace('whatsapp:', '')
            }));
        } else {
            console.log('No WebSocket client found');
        }

        res.send('OK');
    }
);

export default twilioRouter;

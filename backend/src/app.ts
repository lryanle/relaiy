import express from 'express';
import logger from 'morgan';
import 'dotenv/config';
import WebSocket from 'ws';
import expressWs from 'express-ws';
import { URL } from 'url';
import { IncomingMessage } from 'http';
import db from './db';

// Routes
import indexRouter from './routes/index';
import twilioRouter from './routes/twilio';
import { RetellRequest, RetellResponse } from './types/llmWebSocket';

// Create Express server
export const app = expressWs(express()).app;

interface ExtendedIncomingMessage extends IncomingMessage {
    params?: {
        userId: string | null;
        callId?: string | null;
    };
}

// Add a map to store WebSocket connections
export const wsClients = new Map<string, WebSocket>();

// Set up the WebSocket server with a callback to handle upgrade requests
const wss = new WebSocket.Server({
    port: 8080,
    verifyClient: (info: { req: ExtendedIncomingMessage }, callback) => {
        // Parse the URL to get search params and path
        const url = new URL(info.req.url!, 'ws://localhost:8080');
        const pathParts = url.pathname.split('/');

        // Handle different WebSocket paths
        if (url.pathname.startsWith('/llm-websocket/')) {
            // Extract call_id from path
            const callId = pathParts[2];
            info.req.params = {
                userId: null,
                callId
            };
            console.log('LLM WebSocket connection params:', {
                callId,
                timestamp: new Date().toISOString()
            });
        } else {
            // Handle existing userId-based connections
            info.req.params = {
                userId: url.searchParams.get('userId'),
                callId: null
            };
            console.log('Connection params:', {
                userId: url.searchParams.get('userId'),
                timestamp: new Date().toISOString()
            });
        }

        // Accept the connection
        callback(true);
    }
});

import { wsMessage } from './handlers/wsMessage';

// Handle WebSocket connections
wss.on('connection', (ws, request: ExtendedIncomingMessage) => {
    console.log('Client connected with params:', request.params);

    // Store the connection based on the connection type
    if (request.params?.userId) {
        wsClients.set(request.params.userId, ws);
    } else if (request.params?.callId) {
        wsClients.set(`call_${request.params.callId}`, ws);
    }

    // Handle incoming messages
    ws.on('message', (message) => {
        const clientId = request.params?.userId ||
            (request.params?.callId ? `call_${request.params.callId}` : 'unknown');
        console.log(`Received message from client ${clientId}:`, message.toString());
        wsMessage(ws, message.toString());
    });

    // Handle errors
    ws.on('error', (error) => {
        console.log(`Error occurred: ${error}`);
    });

    // Handle disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
        // Remove the connection when client disconnects
        if (request.params?.userId) {
            wsClients.delete(request.params.userId);
        } else if (request.params?.callId) {
            wsClients.delete(`call_${request.params.callId}`);
        }
    });
});

app.use(express.json());

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

app.use('/api', indexRouter);

app.use('/twilio', twilioRouter);

app.ws('/llm-websocket/:call_id', async (ws, req) => {
    const callId = req.params.call_id;
    console.log(`Client connected with callId: ${callId}`);

    // Send initial greeting
    const initialResponse: RetellResponse = {
        response_id: 0,
        content: 'Start talking now',
        content_complete: true,
        end_call: false,
    };

    const chat = await db.chatThread.findFirst({
        where: {
            type: 'VOICE',
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    console.log(chat);

    if (!chat) {
        console.error('No chat found');
        return;
    }

    ws.send(JSON.stringify(initialResponse));

    ws.on('message', (message) => {
        try {
            const request: RetellRequest = JSON.parse(message.toString());
            if (request.interaction_type !== 'response_required') return;            
            // Format message for wsMessage handler
            const formattedMessage = JSON.stringify({
                chatId: chat.id,
                message: request.transcript[request.transcript.length - 1].content,
                retell: {
                    type: 'transcript',
                    data: request,
                    response_id: request.response_id
                }
            });


            // Process message using existing handler
            wsMessage(ws, formattedMessage, true);
            
        } catch (error) {
            console.error('Error parsing message:', error);
            ws.send(JSON.stringify({
                response_id: 0,
                content: 'Sorry, there was an error processing your message.',
                content_complete: true,
                end_call: false
            }));
        }
    });
});
import express from 'express';
import logger from 'morgan';
import 'dotenv/config';
import WebSocket from 'ws';
import { URL } from 'url';
import { IncomingMessage } from 'http';

// Routes
import indexRouter from './routes/index';
import twilioRouter from './routes/twilio';

// Create Express server
export const app = express();

interface ExtendedIncomingMessage extends IncomingMessage {
    params?: {
        userId: string | null;
    };
}

// Add a map to store WebSocket connections
export const wsClients = new Map<string, WebSocket>();

// Set up the WebSocket server with a callback to handle upgrade requests
const wss = new WebSocket.Server({ 
    port: 8080,
    verifyClient: (info: { req: ExtendedIncomingMessage }, callback) => {
        // Parse the URL to get search params
        const url = new URL(info.req.url!, 'ws://localhost:8080');
        console.log('Connection params:', {
            userId: url.searchParams.get('userId'),
            timestamp: new Date().toISOString()
        });
        
        // Store the params on the request object for later use
        info.req.params = {
            userId: url.searchParams.get('userId'),
        };
        
        // Accept the connection
        callback(true);
    }
});

import { wsMessage } from './handlers/wsMessage';

// Handle WebSocket connections
wss.on('connection', (ws, request: ExtendedIncomingMessage) => {
    console.log('Client connected with params:', request.params);
    
    // Store the connection with userId as key
    if (request.params?.userId) {
        wsClients.set(request.params.userId, ws);
    }
    
    // Handle incoming messages
    ws.on('message', (message) => {
        console.log(`Received message from user ${request.params?.userId}:`, message.toString());
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
        }
    });
});

app.use(express.json());

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

app.use('/api', indexRouter);

app.use('/twilio', twilioRouter);
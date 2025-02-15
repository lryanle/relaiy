import express from 'express';
import logger from 'morgan';
import 'dotenv/config';

// Routes
import indexRouter from './routes/index';
import WebSocket from 'ws';
// Create Express server
export const app = express();

// Apply the rate limiting middleware to API calls only

// Set up the WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

import { wsMessage } from './handlers/wsMessage';

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    wsMessage(ws, message.toString());
  });

  // Handle errors
  ws.on('error', (error) => {
    console.log(`Error occurred: ${error}`);
  });

  // Handle disconnections
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

app.use('/api', indexRouter);
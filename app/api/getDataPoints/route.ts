import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getChat } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

type QueryParams = {
    chatId: string,
    index?: number
}

export async function POST(request: NextRequest) {
   

    try {
        const session = await auth.api.getSession({
          headers: request.headers
        });
    
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const { chatId, index } = await request.json() as QueryParams

        const newIdx = index ? index : 0
    
        if (!chatId) {
          return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
        }
    
        // Get chat thread and messages
        const chatThread = await prisma.chatThread.findFirst({
          where: {
            id: chatId,
            userId: session.user.id
          },
          include: {
            ChatMessage: {
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        });
    
        if (!chatThread) {
          return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }
    
        // Map to response format
        const timestamps = chatThread.ChatMessage.map(msg => ({
          timestamp: msg.createdAt.toISOString()
        }));


        // use prisma to get StockfishResponse response at the exact timestamp
        const stockfishResponse = await prisma.stockfishResponse.findMany({
          where: {
            threadId: chatId,
            createdAt: {
                equals: timestamps[newIdx].timestamp
            }
          }
        });

        console.log(stockfishResponse)

        const chat = {
            id: chatThread.id,
            status: chatThread.status.toLowerCase(),
            type: chatThread.type.toLowerCase(),
            recipient_address: chatThread.destination,
            // last_activity: thread.ChatMessage[0]?.updatedAt ?? thread.createdAt,
            last_activity: chatThread.ChatMessage[chatThread.ChatMessage.length - 1]?.updatedAt ?? chatThread.createdAt,
            message_count: chatThread.ChatMessage.length,
            goal: chatThread.goal,
            requirements: chatThread.requirements,
            tones: chatThread.tones,
            // Calculate total cost
            total_cost: chatThread.ChatMessage.reduce((sum, msg) => sum + (msg.cost || 0), 0)
        }
        
    
        return NextResponse.json({ stockfishResponse, chat });
      } catch (error) {
        console.error('Error fetching chat:', error);
        return NextResponse.json(
          { error: 'Failed to fetch chat' },
          { status: 500 }
        );
      }
}
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
        const stockfishResponse = await prisma.stockfishResponse.findFirst({
          where: {
            threadId: chatId,
            createdAt: {
                equals: timestamps[newIdx].timestamp
            }
          }
        });

        console.log(stockfishResponse)
        
    
        return NextResponse.json({ });
      } catch (error) {
        console.error('Error fetching chat:', error);
        return NextResponse.json(
          { error: 'Failed to fetch chat' },
          { status: 500 }
        );
      }
}
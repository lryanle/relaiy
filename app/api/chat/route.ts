import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

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
            createdAt: 'asc'
          }
        }
      }
    });

    if (!chatThread) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Map to response format
    const messages = chatThread.ChatMessage.map(msg => ({
      role: msg.sender.toLowerCase(),
      content: msg.content,
      timestamp: msg.createdAt.toISOString()
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat' },
      { status: 500 }
    );
  }
}

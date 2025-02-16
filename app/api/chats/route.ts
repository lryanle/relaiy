import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        })
    
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // First get the account
        const account = await prisma.account.findFirst({
            where: { userId: session.user.id },
            select: {
                requirements: true,
                tones: true
            }
        })

        // Get all chat threads for the user
        const chatThreads = await prisma.chatThread.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                ChatMessage: {
                    select: {
                        cost: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                _count: {
                    select: { ChatMessage: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Map to response format
        const chats = chatThreads.map(thread => ({
            id: thread.id,
            status: thread.status.toLowerCase(),
            type: thread.type.toLowerCase(),
            recipient_address: thread.destination,
            // last_activity: thread.ChatMessage[0]?.updatedAt ?? thread.createdAt,
            last_activity: thread.ChatMessage[thread.ChatMessage.length - 1]?.updatedAt ?? thread.createdAt,
            message_count: thread._count.ChatMessage,
            goal: thread.goal,
            requirements: account?.requirements || [],
            tones: account?.tones || [],
            // Calculate total cost
            total_cost: thread.ChatMessage.reduce((sum, msg) => sum + (msg.cost || 0), 0)
        }))

        console.log(chats) 

        return NextResponse.json(chats)
    } catch (error) {
        console.error('Error fetching chats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chats' },
            { status: 500 }
        )
    }
} 
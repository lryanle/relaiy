import { NextResponse } from "next/server"
import { Chat } from "@/types/chat"
import { auth } from "@/lib/auth"

export async function GET(
    request: Request,
) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        })
    
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
    
        console.log(session)    
    
        const body = await request.json()
        const { userId } = body
    
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }
        // Fetch chats for the user from your database
        const response = await fetch(`https://api.relaiy.tech/chats/${userId}`)
        const data = await response.json()

        // Map the response to match our schema
        const chats: Chat[] = data.map((chat: any) => ({
            status: chat.status,
            type: chat.type,
            recipient_address: chat.recipient_address,
            last_activity: new Date(chat.last_activity),
            message_count: chat.message_count,
            total_price: chat.total_price
        }))

        return NextResponse.json(chats)
    } catch (error) {
        console.error('Error fetching chats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chats' },
            { status: 500 }
        )
    }
} 
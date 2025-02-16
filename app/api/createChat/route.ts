// create a chat with a user

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

type CreateChatPayload = {
    userId: string
    goal: string
    firstMessage: string
    address: string
    type: string
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(session)    

    const body = await request.json() as CreateChatPayload
    const { userId, goal, firstMessage, address, type } = body

    if (!userId || !goal || !firstMessage || !address || !type) {
        return NextResponse.json({ 
            error: "Missing required fields", 
            required: ["userId", "goal", "firstMessage", "address", "type"]
        }, { status: 400 })
    }

    // post /api/create-chat
    const response = await fetch("https://api.relaiy.tech/api/create-chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId,
            goal,
            firstMessage,
            address,
            type
        })
    })

    console.log(response)

    if (!response.ok) {
        return NextResponse.json({ 
            error: "Failed to create chat",
            details: await response.text()
        }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json(data)
}

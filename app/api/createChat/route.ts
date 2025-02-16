// create a chat with a user

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

type CreateChatPayload = {
    userId: string
    goal: string
    firstMessage: string
    type: string
    tones: string[]
    requirements: string[]
    destination: string
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json() as CreateChatPayload
    const { goal, firstMessage, destination, type, tones, requirements } = body

    if (!goal || !firstMessage || !destination || !type || !tones || !requirements) {
        return NextResponse.json({ 
            error: "Missing required fields", 
            required: ["goal", "firstMessage", "address", "type"]
        }, { status: 400 })
    }

    /*
        {
            "goal": "You are trying to get a date or hanging out for the user.",
            "tones": ["friendly"],
            "userId": "1",
            "destination": "+14695963483",
            "requirements": ["Keep it short and concise"],
            "firstMessage": "hi hello",
            "type": "SMS"
        }
    */

    // post /api/create-chat
    const response = await fetch("https://api.relaiy.tech/api/create-chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: session.user.id,
            goal,
            firstMessage,
            destination,
            type,
            tones,
            requirements
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

    console.log(data)
    return NextResponse.json(data)
}

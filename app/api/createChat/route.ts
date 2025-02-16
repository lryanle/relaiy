// create a chat with a user

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    // post /api/create-chat
    const response = await fetch("https://api.relaiy.tech/api/create-chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
    })

    console.log(response)

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json(data)
}

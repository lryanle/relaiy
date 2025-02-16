import { Channel, Status } from "./types"

export type Chat = {
    status: "active" | "inactive" | "archived"
    type: "personal" | "group" | "support"
    recipient_address: string
    last_activity: Date
    message_count: number
    total_price: number
}

// 0
// : 
// goal
// : 
// "You are trying to get a date or hanging out for the user."
// id
// : 
// "8cb77c16-c6b1-4c2f-8ba5-6b7e46d299c9"
// last_activity
// : 
// "2025-02-16T04:33:45.756Z"
// message_count
// : 
// 1
// recipient_address
// : 
// "+14695963483"
// requirements
// : 
// ['Keep it short and concise']
// status
// : 
// "active"
// tones
// : 
// ['friendly']
// type
// : 
// "sms"

export type ChatTab = {
    goal: string
    id: string
    last_activity: string
    message_count: number
    recipient_address: string
    requirements: string[]
    status: Status
    tones: string[]
    type: Channel
}

export type ChatTabList = ChatTab[]

export type ChatMessage = {
    id: number
    content: string
    timestamp: string
    role: "user" | "assistant"
}

export type ChatMessageList = ChatMessage[] 
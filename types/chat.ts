export type Chat = {
    status: "active" | "inactive" | "archived"
    type: "personal" | "group" | "support"
    recipient_address: string
    last_activity: Date
    message_count: number
    total_price: number
}

export type ChatTab = {
    id: number
    name: string
    lastMessage: string
    lastMessageTime: string
    unreadMessages: number
    isGroup: boolean
}

export type ChatTabList = ChatTab[]

export type ChatMessage = {
    id: number
    content: string
    timestamp: string
    role: "user" | "assistant"
}

export type ChatMessageList = ChatMessage[] 
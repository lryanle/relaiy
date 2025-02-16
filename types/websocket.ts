export type ResponseStatus = "best" | "okay" | "bad" | "pending" | "error"

export type DataPoint = {
    modelType: string
    status: ResponseStatus
    messages: {
        role: "user" | "assistant"
        content: string
    }[]
    score: number
}

export type WebSocketContextType = {
    socket: WebSocket | null
    isConnected: boolean
    sendMessage: (message: any) => void
    lastMessage: any | null
    currentChatId: string | null
    setCurrentChatId: (chatId: string | null) => void
    dataPoints: Record<string, DataPoint>
}

export type WebSocketMessage = {
    type: string
    message: any
} 
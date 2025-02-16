export type WebSocketContextType = {
    socket: WebSocket | null
    isConnected: boolean
    sendMessage: (message: any) => void
    lastMessage: any | null
    currentChatId: string | null
    setCurrentChatId: (chatId: string | null) => void
}

export type WebSocketMessage = {
    type: string
    message: any
} 
export type WebSocketContextType = {
    socket: WebSocket | null
    isConnected: boolean
    sendMessage: (message: any) => void
    lastMessage: any | null
}

export type WebSocketMessage = {
    type: string
    message: any
} 
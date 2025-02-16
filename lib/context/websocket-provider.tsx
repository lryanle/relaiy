"use client"

import { toast } from "@/hooks/use-toast"
import { createContext, useContext, useEffect, useRef, useState } from "react"

type WebSocketContextType = {
    socket: WebSocket | null
    isConnected: boolean
    sendMessage: (message: any) => void
    lastMessage: any | null
}

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    isConnected: false,
    sendMessage: () => {},
    lastMessage: null,
})

export function WebSocketProvider({ 
    url,
    children 
}: { 
    url: string
    children: React.ReactNode 
}) {
    const [isConnected, setIsConnected] = useState(false)
    const [lastMessage, setLastMessage] = useState<any | null>(null)
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        // Create WebSocket connection
        const socket = new WebSocket(url)
        socketRef.current = socket

        // Connection opened
        socket.addEventListener('open', () => {
            setIsConnected(true)
            toast({
                title: "Connected",
                description: "WebSocket connection established",
            })
        })

        // Listen for messages
        socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data)
            setLastMessage(message)
        })

        // Connection closed
        socket.addEventListener('close', () => {
            setIsConnected(false)
            toast({
                title: "Disconnected",
                description: "WebSocket connection closed",
                variant: "destructive"
            })
        })

        // Connection error
        socket.addEventListener('error', (error) => {
            toast({
                title: "Error",
                description: "WebSocket connection error",
                variant: "destructive"
            })
        })

        // Cleanup on unmount
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close()
            }
        }
    }, [url])

    const sendMessage = (message: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message))
        } else {
            toast({
                title: "Error",
                description: "WebSocket is not connected",
                variant: "destructive"
            })
        }
    }

    return (
        <WebSocketContext.Provider 
            value={{
                socket: socketRef.current,
                isConnected,
                sendMessage,
                lastMessage,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    )
}

export function useWebSocket() {
    const context = useContext(WebSocketContext)
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider")
    }
    return context
} 
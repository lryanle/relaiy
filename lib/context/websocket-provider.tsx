"use client"

import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/context/auth-provider"
import { WebSocketContextType } from "@/types/websocket"
import { createContext, useContext, useEffect, useRef, useState } from "react"

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

    const { user } = useAuth()

    useEffect(() => {

        if (!user?.id) {
            return
        }

        // Create WebSocket connection
        const socket = new WebSocket(url + "?userId=" + user?.id)
        socketRef.current = socket

        // Connection opened
        socket.addEventListener('open', () => {
            setIsConnected(true)
            toast({
                title: "Connected",
                description: "WebSocket connection established",
            })

            // send initial message
            // sendMessage({
            //     type: "initial",
            //     message: user?.id
            // })
        })

        // Listen for messages
        socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data)
            toast({
                title: "Message",
                description: JSON.stringify(message),
            })
            // setLastMessage(message)
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
    }, [user?.id])

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
"use client"

import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/context/auth-provider"
import { WebSocketContextType } from "@/types/websocket"
import { useQueryClient } from "@tanstack/react-query"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    isConnected: false,
    sendMessage: () => { },
    lastMessage: null,
    currentChatId: null,
    setCurrentChatId: () => { },
})

type ResponsePool = {
    type: "responsePools"
    chatId: string
    pools: {
        gemini: string[]
        mistral: string[]
        cohere: string[]
    }
    timestamp: string
}

type ResponseStatus = "best" | "okay" | "bad" | "pending" | "error"

type DataPoint = {
    modelType: string
    status: ResponseStatus
    messages: {
        role: "user" | "assistant"
        content: string
    }[]
    score: number
}

type SingleResponse = {
    type: "response"
    response: string
    model: string
    responseId: string
    timestamp: string
    chatId: string
}

type ResponseWithScore = {
    type: "response"
    response: string
    ratio: number
    score: number
    status: ResponseStatus
    model: string
    responseId: string
}

type BestResponseMessage = {
    type: "bestResponse"
    chatId: string
    bestResponse: ResponseWithScore & { score: number, status: "best" }
    allResponses: ResponseWithScore[]
    isComplete: boolean
    usage: {
        inputTokens: number
        outputTokens: number
        cost: number
        models: {
            mistral: { input: number, output: number, cost: number }
            gemini: { input: number, output: number, cost: number }
            cohere: { input: number, output: number, cost: number }
        }
    }
    timestamp: string
}

type WebSocketMessage = ResponsePool | SingleResponse | BestResponseMessage


export function WebSocketProvider({
    url,
    children
}: {
    url: string
    children: React.ReactNode
}) {
    const [isConnected, setIsConnected] = useState(false)
    const [lastMessage, setLastMessage] = useState<any | null>(null)
    const [currentChatId, setCurrentChatId] = useState<string | null>(null)
    const socketRef = useRef<WebSocket | null>(null)
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const [ids, setIds] = useState<Record<string, DataPoint>>({})
    const [bestId, setBestId] = useState<DataPoint | null>(null)

    const handleMessage = useCallback(async (event: MessageEvent) => {
        try {
            const message: WebSocketMessage = JSON.parse(event.data)
            setLastMessage(message)

            // Handle different message types
            switch (message.type) {
                case "responsePools":
                    // Store response pools if needed
                    // loop through the pools and set the ids
                    if (currentChatId) {
                        await queryClient.invalidateQueries({ queryKey: ["chat", currentChatId] })
                        await queryClient.invalidateQueries({ queryKey: ["chats"] })
                    }
                    for (const [model, ids] of Object.entries(message.pools)) {
                        for (const id of ids) {
                            setIds(prevIds => ({
                                ...prevIds,
                                [id]: {
                                    modelType: model,
                                    status: "pending",
                                    messages: [],
                                    score: 0
                                }
                            }))
                        }
                    }
                    break

                case "response":
                    // Handle individual model responses
                    // You might want to store these or update UI

                    /*

                "type": "response",
                "chatId": "301ec6de-8203-46ed-abca-ddc2906b2a6c",
                "responseId": "01950e41-ca3c-743a-89ac-6aa7b4fbd176",
                "model": "mistral",
                "response": "You're really good at making me feel comfortable.",
                "timestamp": "2025-02-16T10:15:50.302Z"
                    */

                    setIds(prevIds => ({
                        ...prevIds,
                        [message.responseId]: {
                            ...prevIds[message.responseId],
                            modelType: message.model,
                            status: "okay",
                            messages: [{ role: "assistant", content: message.response }],
                            score: 0
                        }
                    }))

                    break

                default:
                    // Handle best response

                    if (message.bestResponse.responseId) {
                        setBestId(ids[message.bestResponse.responseId] || null)
                        setIds(prevIds => ({
                            ...prevIds,
                            [message.bestResponse.responseId]: {
                                ...prevIds[message.bestResponse.responseId],
                                status: "best",
                                messages: [{ role: "assistant", content: message.bestResponse.response }],
                                score: message.bestResponse.score
                            }
                        }))

                        for (const [id, response] of Object.entries(message.allResponses)) {
                            setIds(prevIds => ({
                                ...prevIds,
                                [id]: {
                                    ...prevIds[id],
                                    status: response.status,
                                    messages: [{ role: "assistant", content: response.response }],
                                    score: response.score
                                }
                            }))
                        }
                    }
                    if (currentChatId) {
                        await queryClient.invalidateQueries({ queryKey: ["chat", currentChatId] })
                        await queryClient.invalidateQueries({ queryKey: ["chats"] })
                    }
                    break
            }
        } catch (error) {
            console.error("Error parsing message:", error)
        }


    }, [currentChatId, queryClient])

    // Set up WebSocket connection
    useEffect(() => {
        if (!user?.id) return

        const socket = new WebSocket(url + "?userId=" + user?.id)
        socketRef.current = socket

        socket.addEventListener('open', () => {
            setIsConnected(true)
            toast({
                title: "Connected",
                description: "WebSocket connection established",
            })
        })

        socket.addEventListener('close', () => {
            setIsConnected(false)
            toast({
                title: "Disconnected",
                description: "WebSocket connection closed",
                variant: "destructive"
            })
        })

        socket.addEventListener('error', () => {
            toast({
                title: "Error",
                description: "WebSocket connection error",
                variant: "destructive"
            })
        })

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close()
            }
        }
    }, [user?.id, url])

    // Set up message listener
    useEffect(() => {
        const socket = socketRef.current
        if (!socket) return

        socket.addEventListener('message', handleMessage)

        return () => {
            socket.removeEventListener('message', handleMessage)
        }
    }, [handleMessage, currentChatId]);

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
                currentChatId,
                setCurrentChatId,
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
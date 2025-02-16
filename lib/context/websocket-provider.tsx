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

type ResponseStatus = "best" | "okay" | "bad"

type DataPoint = {
    response?: string
    model: string
    responseId: string
    timestamp?: string
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

            // parse the message as one of the following:
            /*
            {
        "type": "responsePools",
        "chatId": "301ec6de-8203-46ed-abca-ddc2906b2a6c",
        "pools": {
            "gemini": [
                "01950e41-ca3b-776f-9b22-7f5e0dabed8e",
                "01950e41-ca3c-743a-89ac-3fe08523c749",
                "01950e41-ca3c-743a-89ac-43c50fd63162",
                "01950e41-ca3c-743a-89ac-462afba99d0c",
                "01950e41-ca3c-743a-89ac-491e0bfe8927",
                "01950e41-ca3c-743a-89ac-4fcdf1017c1f",
                "01950e41-ca3c-743a-89ac-52ca7442ba40",
                "01950e41-ca3c-743a-89ac-552146e7eac5",
                "01950e41-ca3c-743a-89ac-5993c8ed582a",
                "01950e41-ca3c-743a-89ac-5eb7213c0561"
            ],
            "mistral": [
                "01950e41-ca3c-743a-89ac-63e902a5e7db",
                "01950e41-ca3c-743a-89ac-66e31fe6f7bf",
                "01950e41-ca3c-743a-89ac-6aa7b4fbd176",
                "01950e41-ca3c-743a-89ac-6fd6d302bcaa",
                "01950e41-ca3c-743a-89ac-725c721f5f2a",
                "01950e41-ca3c-743a-89ac-74b8467c7148",
                "01950e41-ca3c-743a-89ac-7a76207d4771",
                "01950e41-ca3c-743a-89ac-7c72e82d85df",
                "01950e41-ca3c-743a-89ac-832c7d707a9c",
                "01950e41-ca3c-743a-89ac-84b748551139"
            ],
            "cohere": [
                "01950e41-ca3c-743a-89ac-896839182c77",
                "01950e41-ca3c-743a-89ac-8debb6bb29e0",
                "01950e41-ca3c-743a-89ac-9286908659bb",
                "01950e41-ca3c-743a-89ac-962f2d0391b6",
                "01950e41-ca3c-743a-89ac-9aa2a8c90282",
                "01950e41-ca3c-743a-89ac-9fbdf81c2802",
                "01950e41-ca3c-743a-89ac-a0fd3484787b",
                "01950e41-ca3c-743a-89ac-a66c3f3c9b2c",
                "01950e41-ca3c-743a-89ac-ab53f596b59a",
                "01950e41-ca3c-743a-89ac-af1430d8340b"
            ]
        },
        "timestamp": "2025-02-16T10:15:47.516Z"
    }
        */

            /*
            {
                "type": "response",
                "chatId": "301ec6de-8203-46ed-abca-ddc2906b2a6c",
                "responseId": "01950e41-ca3c-743a-89ac-6aa7b4fbd176",
                "model": "mistral",
                "response": "You're really good at making me feel comfortable.",
                "timestamp": "2025-02-16T10:15:50.302Z"
            }
                */

            /*
            {
                "chatId": "301ec6de-8203-46ed-abca-ddc2906b2a6c",
                "bestResponse": {
                    "response": "Hmm... Well, I guess I'll just say *you're* probably amazing in some way. What makes you a great person?",
                    "score": 40.76950767001923,
                    "model": "gemini",
                    "responseId": "01950e41-ca3c-743a-89ac-3fe08523c749",
                    "status": "best"
                },
                "allResponses": [
                    {
                        "response": "You know, you're really good at making me laugh.",
                        "ratio": 0.5985061816683995,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-63e902a5e7db"
                    },
                    {
                        "response": "I think you have a great sense of humor.",
                        "ratio": 0.6117077039158709,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-66e31fe6f7bf"
                    },
                    {
                        "response": "You're really good at making me feel comfortable.",
                        "ratio": 0.5968728486929745,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-6aa7b4fbd176"
                    },
                    {
                        "response": "Hmm, you're really good at making me think.",
                        "ratio": 0.6007799759144995,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-6fd6d302bcaa"
                    },
                    {
                        "response": "You're really good at making me feel at ease.",
                        "ratio": 0.5980511957467384,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-725c721f5f2a"
                    },
                    {
                        "response": "You're really good at making me feel happy.",
                        "ratio": 0.6116514243709398,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-74b8467c7148"
                    },
                    {
                        "response": "You're really good at making me feel like I can be myself.",
                        "ratio": 0.669165744031698,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-7a76207d4771"
                    },
                    {
                        "response": "You're really good at making me feel like I'm not alone.",
                        "ratio": 0.6665830904157518,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-7c72e82d85df"
                    },
                    {
                        "response": "You're really good at making me feel like I can trust you.",
                        "ratio": 0.6680281268157997,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-832c7d707a9c"
                    },
                    {
                        "response": "You're really good at making me feel like I can be myself around you.",
                        "ratio": 0.6640659961728068,
                        "status": "bad",
                        "model": "mistral",
                        "responseId": "01950e41-ca3c-743a-89ac-84b748551139"
                    },
                    {
                        "response": "Alright, alright... no need to be mysterious! But seriously, what's a cool thing you've done lately?",
                        "ratio": 0.7630896072529941,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3b-776f-9b22-7f5e0dabed8e"
                    },
                    {
                        "response": "Hmm... Well, I guess I'll just say *you're* probably amazing in some way. What makes you a great person?",
                        "ratio": 0.8153901534003846,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-3fe08523c749"
                    },
                    {
                        "response": "Okay, okay, I see how it is. But come on, gotta be something you're proud of, yeah?",
                        "ratio": 0.7816047099372977,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-43c50fd63162"
                    },
                    {
                        "response": "Seriously though, what do *you* think is your best quality? Or something you're good at?",
                        "ratio": 0.6216338892410592,
                        "status": "bad",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-462afba99d0c"
                    },
                    {
                        "response": "You're making this hard! But okay, what's something you're, like, uniquely good at?",
                        "ratio": 0.7497973821911926,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-491e0bfe8927"
                    },
                    {
                        "response": "Alright, I'm calling you a cool cat! What's your superpower (even if it's a small one)?",
                        "ratio": 0.7819120680747584,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-4fcdf1017c1f"
                    },
                    {
                        "response": "Fine. I'll say you seem like a chill person. What's one thing you're really good at?",
                        "ratio": 0.7678545805084163,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-52ca7442ba40"
                    },
                    {
                        "response": "Okay, I'm betting you're got a hidden talent. Spill!",
                        "ratio": 0.7100113830661375,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-552146e7eac5"
                    },
                    {
                        "response": "Seriously though, I'm sure you're awesome. So... what's something you're naturally good at?",
                        "ratio": 0.781264843426732,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-5993c8ed582a"
                    },
                    {
                        "response": "Alright, I bet you're clever. Now tell me, what makes you *you*?",
                        "ratio": 0.7588444143721158,
                        "status": "okay",
                        "model": "gemini",
                        "responseId": "01950e41-ca3c-743a-89ac-5eb7213c0561"
                    },
                    {
                        "response": "Well, you know, I guess I'm pretty good at badminton. It's my favorite sport, and I've been playing for a few years now. I also like to think I'm decent at coding; I've been taking some online courses and building projects.",
                        "ratio": 0.5948930997563452,
                        "status": "bad",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-896839182c77"
                    },
                    {
                        "response": "I'm always up for a good adventure! I love exploring new places, trying different cuisines, and meeting new people. Traveling is definitely one of my passions.",
                        "ratio": 0.655958152124257,
                        "status": "bad",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-8debb6bb29e0"
                    },
                    {
                        "response": "Hmm, I'm thinking of taking a road trip soon. Maybe down to Mexico or up to the mountains of Colorado. Where do you think I should go? Any recommendations are welcome!",
                        "ratio": 0.6913409957811221,
                        "status": "bad",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-9286908659bb"
                    },
                    {
                        "response": "I'm a big fan of learning new languages. I'm currently studying Spanish, and I think it's super cool how it opens up opportunities to connect with people from different cultures.",
                        "ratio": 0.6632908037638467,
                        "status": "bad",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-962f2d0391b6"
                    },
                    {
                        "response": "You know, I'm pretty bad at drawing. I tried taking a few art classes in high school, but it just wasn't my thing. I'd rather focus on my hobbies.",
                        "ratio": 0.7121709895534681,
                        "status": "okay",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-9aa2a8c90282"
                    },
                    {
                        "response": "I'm a huge fan of indie music. You should check out some local bands here in Dallas. There's a pretty active music scene, and I think you'd enjoy it.",
                        "ratio": 0.6980394295697842,
                        "status": "bad",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-9fbdf81c2802"
                    },
                    {
                        "response": "Man, I really want to improve my fitness. I've been thinking about joining a local gym, but I'm not sure if it's the right move. Any tips or advice would be great!",
                        "ratio": 0.6553488338403687,
                        "status": "bad",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-a0fd3484787b"
                    },
                    {
                        "response": "I'm definitely a night owl. I tend to stay up late working on projects or playing video games. I'm a huge fan of the Witcher series!",
                        "ratio": 0.7126333763308172,
                        "status": "okay",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-a66c3f3c9b2c"
                    },
                    {
                        "response": "I'm a bit of a foodie, always up for trying new restaurants. Dallas has some amazing Tex-Mex places, and I'm always down for a good BBQ joint. Any hidden gems you know of?",
                        "ratio": 0.7015454151075309,
                        "status": "okay",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-ab53f596b59a"
                    },
                    {
                        "response": "Hey, I just got a new drone! I've been wanting to try aerial photography, and it's been a ton of fun so far. I might take it to the park this weekend and get some cool shots.",
                        "ratio": 0.7186888525513597,
                        "status": "okay",
                        "model": "cohere",
                        "responseId": "01950e41-ca3c-743a-89ac-af1430d8340b"
                    }
                ],
                "isComplete": false,
                "usage": {
                    "inputTokens": 1218,
                    "outputTokens": 1766,
                    "cost": 0.0009630749999999999,
                    "models": {
                        "mistral": {
                            "input": 413,
                            "output": 415,
                            "cost": 0.0004974
                        },
                        "gemini": {
                            "input": 405,
                            "output": 600,
                            "cost": 0.000210375
                        },
                        "cohere": {
                            "input": 400,
                            "output": 751,
                            "cost": 0.00025529999999999997
                        }
                    }
                },
                "timestamp": "2025-02-16T10:15:52.600Z"
            }
            */

            // Handle different message types
            switch (message.type) {
                case "responsePools":
                    // Store response pools if needed
                    // loop through the pools and set the ids
                    for (const [model, ids] of Object.entries(message.pools)) {
                        for (const id of ids) {
                            setIds(prevIds => ({
                                ...prevIds,
                                [id]: { model, responseId: id }
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
                        [message.responseId]: { ...message }
                    }))

                    break

                case "bestResponse":
                    // Handle best response
                    setBestId(ids[message.bestResponse.responseId] || null)
                    break
            }

            toast({
                title: "Message",
                description: JSON.stringify(message),
            })
        } catch (error) {
            console.error("Error parsing message:", error)
        }

        if (currentChatId) {
            await queryClient.invalidateQueries({ queryKey: ["chat", currentChatId] })
            await queryClient.invalidateQueries({ queryKey: ["chats"] })
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
    }, [handleMessage])

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
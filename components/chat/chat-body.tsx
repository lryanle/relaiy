import { useState } from "react"

import { useAuth } from "@/lib/context/auth-provider"
import { useWebSocket } from "@/lib/context/websocket-provider"
import { cn, getOldDataPoints } from "@/lib/utils"
import { ChatMessage } from "@/types/chat"
import { Conversation } from "@/types/types"
import { useEffect, useRef } from "react"
import { ConversationState, InspectAgent } from "../agent/inspectagent"

interface ChatBodyProps {
    chatId: string
    messages: ChatMessage[]
}

export default function ChatBody({ chatId, messages }: ChatBodyProps) {

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        messagesEndRef.current?.scrollTo({
            top: messagesEndRef.current?.scrollHeight,
            behavior: "smooth"
        })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    function isWaitingForResponse() {
        if (messages.length === 0) return false
        const lastMessage = messages[messages.length - 1]
        return lastMessage.role === "assistant"
    }

    const {
        isLive,
        dataPoints
    } = useWebSocket()

    const { user } = useAuth()


    const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)
    const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(0)
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null)
    const [newDataPoints, setNewDataPoints] = useState<ConversationState[]>([])

    function getStatusFromScore(score: number, maxScore: number, minScore: number) {
        if (score === maxScore) {
            return "best"
        } else if (score > 0.75) {
            return "good"
        } else if (score > 0.65) {
            return "okay"
        } else {
            return "bad"
        }
    }

    async function _getOldDataPoints() {

        if (!selectedMessageIndex) return

        // get messages index
        const idx = messages.length - 1 - selectedMessageIndex!

        const data = await getOldDataPoints(chatId, idx)
        setSelectedConvo(data.chat)
        const maxScore = Math.max(...data.stockfishResponse.map(state => state.ratio))
        const minScore = Math.min(...data.stockfishResponse.map(state => state.ratio))

        setNewDataPoints(data.stockfishResponse.map(state => ({
            status: getStatusFromScore(state.ratio, maxScore, minScore),
            modelType: state.modelName ?? "",
            messages: [
                {
                    role: "assistant",
                    content: state.response
                }
            ],
            score: state.ratio
        })))

        console.log(data.stockfishResponse)
    }

    useEffect(() => {
        if (selectedMessage) {
            _getOldDataPoints()
        }
    }, [selectedMessage])

    useEffect(() => {
        if (user) {
            _getOldDataPoints()
        }
    }, [user])

    return (
        <div className="relative flex flex-row justify-center items-center h-full w-full">

            <div className="absolute top-0 left-0 w-full pointer-events-none gap-2 p-5 z-10 flex flex-row items-center justify-center">
                {isWaitingForResponse() ? (<div className="flex flex-row items-center justify-center gap-2 bg-muted rounded-full py-3 px-8 animate-fade-up-scale-in duration-300">
                    <p className="text-sm">Waiting for response</p>
                </div>) : (<div className="flex flex-row items-center justify-center gap-2 bg-muted rounded-full py-3 px-8 animate-fade-up-scale-in duration-300">
                    <p className="text-sm">Responding</p>
                </div>)}
            </div>

            <div className="flex flex-grow flex-col gap-4 p-6 h-full overflow-y-auto relative" ref={messagesEndRef}>
                {messages.map((message, i) => (
                    <div
                        onClick={() => {

                            if (selectedMessage === message || i === 0) {
                                setSelectedMessage(null)
                                setSelectedMessageIndex(null)
                                setNewDataPoints([])
                                return
                            }

                            if (message.role === "assistant") {
                                setSelectedMessage(message)
                                setSelectedMessageIndex(i)
                                setNewDataPoints([])
                            }
                        }}
                        key={i}
                        className={cn(
                            "flex flex-col max-w-[80%] rounded-lg p-4 animate-fade-up-scale-in duration-300",
                            message.role === "user"
                                ? "bg-primary text-primary-foreground self-end"
                                : "bg-muted self-start",
                            message.role === "assistant" ? "cursor-pointer" : ""
                        )}
                    >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>

            {(isLive || (selectedConvo && newDataPoints.length > 0)) && (
                <div className="pt-2 pr-4 animate-slide-left-in duration-600 overflow-x-visible">
                    <InspectAgent
                        selectedConvo={selectedConvo!}
                        states={isLive ? Object.values(dataPoints) : newDataPoints}
                    />
                </div>
            )}
        </div>
    )
}
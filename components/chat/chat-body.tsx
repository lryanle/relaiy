import { useState } from "react"

import { cn, getOldDataPoints } from "@/lib/utils"
import { ChatMessage } from "@/types/chat"
import { Conversation } from "@/types/types"
import { DataPoint } from "@/types/websocket"
import { useEffect, useRef } from "react"
import { InspectAgent } from "../agent/inspectagent"

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


    const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null)
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([])

    async function _getOldDataPoints() {
        const data = await getOldDataPoints(chatId, messages.length - 1)  
        // setSelectedConvo(data.chatThread)
        setDataPoints(data.stockfishResponse.map(state => ({
            status: "best",
            modelType: state.modelName ?? "",
            messages: [
                {
                    role: "assistant",
                    content: state.response
                }
            ],
            score: 0 // TODO: Add relay score
        })))
    }

    useEffect(() => {
        _getOldDataPoints()
    }, [chatId, messages])

    return (
        <div className="relative flex flex-row justify-center items-center">

            <div className="absolute top-0 left-0 w-full pointer-events-none gap-2 p-5 z-10 flex flex-row items-center justify-center">
                {isWaitingForResponse() ? (<div className="flex flex-row items-center justify-center gap-2 bg-muted rounded-full py-3 px-8 animate-fade-up-scale-in duration-300">
                    <p className="text-sm">Waiting for response</p>
                </div>) : (<div className="flex flex-row items-center justify-center gap-2 bg-muted rounded-full py-3 px-8 animate-fade-up-scale-in duration-300">
                    <p className="text-sm">Responding</p>
                </div>)}
            </div>

            <div className="flex flex-col gap-4 p-6 h-full overflow-y-auto relative" ref={messagesEndRef}>
                {messages.map((message, i) => (
                    <div
                        onClick={() => {

                            if (selectedMessage === message) {
                                setSelectedMessage(null)
                                return
                            }

                            if (message.role === "assistant") {
                                setSelectedMessage(message)
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

            {selectedMessage && selectedConvo && (
            <InspectAgent
                    selectedConvo={selectedConvo}
                    states={[]}
                />
            )}
        </div>
    )
}
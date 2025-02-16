"use client"

import ChatBody from "@/components/chat/chat-body"
import Spinner from "@/components/ui/spinner"
import { useAuth } from "@/lib/context/auth-provider"
import { useWebSocket } from "@/lib/context/websocket-provider"
import { getChat } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { use, useEffect } from "react"

export default function Chat({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { setCurrentChatId } = useWebSocket()
  const { user } = useAuth()

  const { data: messages, isLoading } = useQuery({
    queryKey: ["conversation", slug],
    queryFn: () => getChat(slug),
  })

  useEffect(() => {
    if (user) {
      setCurrentChatId(slug)
    }
    return () => {
      setCurrentChatId(null)
    }
  }, [slug, user, setCurrentChatId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      <ChatBody chatId={slug} messages={messages?.messages || []} />
    </div>
  )
}
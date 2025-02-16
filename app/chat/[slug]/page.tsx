"use client"

import ChatBody from "@/components/chat/chat-body"
import { getChat } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { use } from "react"

export default function Chat({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const { data: messages, isLoading } = useQuery({
    queryKey: ["chat", slug],
    queryFn: () => getChat(slug),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-full">
      <ChatBody chatId={slug} messages={messages?.messages || []} />
    </div>
  )
}
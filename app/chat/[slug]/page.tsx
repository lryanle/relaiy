"use client"

import ChatBody from "@/components/chat/chat-body"
import { getChat } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

export default function Chat({ params }: { params: { slug: string } }) {
  const { slug } = params

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
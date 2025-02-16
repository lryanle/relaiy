"use client"

import { columns } from "@/components/table/columns"
import { DataTable } from "@/components/table/data-table"
import { getChatsForUser } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

export default function Home() {
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getChatsForUser,
  })

  const tableData = chats?.map(chat => ({
    id: chat.id,
    status: chat.status,
    channel: chat.type,
    recipient: chat.recipient_address,
    goal: chat.goal,
    lastActivity: new Date(chat.last_activity),
    messageCount: chat.message_count,
    totalPrice: chat.total_cost,
  })) || []

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      {/* <h1 className="text-2xl font-bold mb-5">Automated Conversations</h1> */}
      <DataTable 
        columns={columns} 
        data={tableData} 
      />
    </div>
  )
}

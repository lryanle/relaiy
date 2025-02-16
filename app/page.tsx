"use client"

import { columns } from "@/components/table/columns"
import { DataTable } from "@/components/table/data-table"
import Spinner from "@/components/ui/spinner"
import { getChatsForUser } from "@/lib/utils"
import { Conversation } from "@/types/types"
import { useQuery } from "@tanstack/react-query"

const data: Conversation[] = [
  {
    id: "1",
    status: "active",
    channel: "voice",
    recipient: "john@example.com",
    goal: "Schedule a meeting Schedule a meeting Schedule a meeting Schedule a meetingSchedule a meeting Schedule a meeting Schedule a meeting Schedule a meetingSchedule a meeting Schedule a meeting Schedule a meeting Schedule a meetingSchedule a meeting Schedule a meeting Schedule a meeting Schedule a meeting Schedule a meeting",
    lastActivity: new Date(),
    messageCount: 5,
    totalPrice: 2.5,
  },
  {
    id: "2",
    status: "complete",
    channel: "sms",
    recipient: "+1234567890",
    goal: "Confirm appointment",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messageCount: 3,
    totalPrice: 1.2,
  },
  {
    id: "3",
    status: "inactive",
    channel: "email",
    recipient: "sarah@example.com",
    goal: "Follow-up on proposal",
    lastActivity: new Date(Date.now() - 1000 * 60 * 2),
    messageCount: 2,
    totalPrice: 0.75,
  },
  {
    id: "4",
    status: "active",
    channel: "discord",
    recipient: "@discord_user",
    goal: "Asking out on a date",
    lastActivity: new Date(),
    messageCount: 8,
    totalPrice: 3.8,
  },
]

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
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* <h1 className="text-2xl font-bold mb-5">Automated Conversations</h1> */}
      <DataTable 
        columns={columns} 
        data={tableData} 
      />
    </div>
  )
}

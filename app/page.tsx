"use client"

import { InspectAgent } from "@/components/agent/inspectagent"
import { columns } from "@/components/table/columns"
import { DataTable } from "@/components/table/data-table"
import Spinner from "@/components/ui/spinner"
import { useWebSocket } from "@/lib/context/websocket-provider"
import { getChatsForUser, getOldDataPoints } from "@/lib/utils"
import { Conversation } from "@/types/types"
import { DataPoint } from "@/types/websocket"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

// const data: Conversation[] = [
//   {
//     id: "1",
//     status: "active",
//     channel: "voice",
//     recipient: "john@example.com",
//     goal: "Schedule a meeting Schedule a meeting Schedule a meeting Schedule a meetingSchedule a meeting Schedule a meeting Schedule a meeting Schedule a meetingSchedule a meeting Schedule a meeting Schedule a meeting Schedule a meetingSchedule a meeting Schedule a meeting Schedule a meeting Schedule a meeting Schedule a meeting",
//     lastActivity: new Date(),
//     messageCount: 5,
//     totalPrice: 2.5,
//   },
//   {
//     id: "2",
//     status: "complete",
//     channel: "sms",
//     recipient: "+1234567890",
//     goal: "Confirm appointment",
//     lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
//     messageCount: 3,
//     totalPrice: 1.2,
//   },
//   {
//     id: "3",
//     status: "inactive",
//     channel: "email",
//     recipient: "sarah@example.com",
//     goal: "Follow-up on proposal",
//     lastActivity: new Date(Date.now() - 1000 * 60 * 2),
//     messageCount: 2,
//     totalPrice: 0.75,
//   },
//   {
//     id: "4",
//     status: "active",
//     channel: "discord",
//     recipient: "@discord_user",
//     goal: "Asking out on a date",
//     lastActivity: new Date(),
//     messageCount: 8,
//     totalPrice: 3.8,
//   },
// ]


export default function Home() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null)
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getChatsForUser,
  })

  const [newDataPoints, setNewDataPoints] = useState<DataPoint[]>([])

  const { dataPoints, currentChatId } = useWebSocket()

  async function _getOldDataPoints(id: string, idx: number) {

    if (currentChatId === id) {
      setNewDataPoints(Object.values(dataPoints))
      return
    }

    const data = await getOldDataPoints(id, idx)
    setNewDataPoints(data.stockfishResponse.map(state => ({
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
    if (selectedConvo) {
      _getOldDataPoints(selectedConvo.id, 0)
    }
  }, [selectedConvo])

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

  const maxScore = Math.max(...newDataPoints.map(state => state.score))
  const minScore = Math.min(...newDataPoints.map(state => state.score))
  console.log(maxScore, minScore)

  function getStatusFromScore(score: number) {
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

  return (
    <div className="p-4 container mx-auto flex flex-col md:flex-row gap-4 justify-center items-start">
      <DataTable
        columns={columns}
        data={tableData}
        onRowClick={setSelectedConvo}
        selectedConvo={selectedConvo}
      />
      {selectedConvo && <InspectAgent setSelectedConvo={setSelectedConvo} selectedConvo={selectedConvo} states={newDataPoints.map(state => ({
        ...state,
        status: getStatusFromScore(state.score)
      }))} />}
    </div>
  )
}

"use client"

import { InspectAgent } from "@/components/agent/inspectagent"
import { columns } from "@/components/table/columns"
import { DataTable } from "@/components/table/data-table"
import Spinner from "@/components/ui/spinner"
import { useWebSocket } from "@/lib/context/websocket-provider"
import { getChatsForUser } from "@/lib/utils"
import { StateStatus } from "@/types/types"
import { useQuery } from "@tanstack/react-query"

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

const states = [
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-4o",
    status: "pending",
    messages: [{"role": "user", "content": "hi, this is a test!"}],
    score: -1
  },
  {
    modelType: "llama3.1",
    status: "error",
    messages: [{"role": "user", "content": "hi, this is a test #2!"}],
    score: -1
  },
  {
    modelType: "gemini-flash-2.0",
    status: "bad",
    messages: [{"role": "user", "content": "hi, this is a test #3!"}],
    score: 2
  },
  {
    modelType: "sonnet3.5",
    status: "okay",
    messages: [{"role": "user", "content": "hi, this is a test #4!"}],
    score: 5
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  },
  {
    modelType: "gpt-o1",
    status: "good",
    messages: [{"role": "user", "content": "hi, this is a test #5!"}],
    score: 7
  },
  {
    modelType: "gpt-3.5-turbo",
    status: "best",
    messages: [{"role": "user", "content": "hi, this is a test #6!"}],
    score: 9
  }
  
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

  const {dataPoints} = useWebSocket()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  const maxScore = Math.max(...Object.values(dataPoints).map(state => state.score))
  const minScore = Math.min(...Object.values(dataPoints).map(state => state.score))
  console.log(maxScore, minScore) 

  return (
    <div className="p-4 container mx-auto flex flex-col md:flex-row gap-4 justify-center items-start">
      <DataTable 
        columns={columns} 
        data={tableData} 
      />
      <InspectAgent states={Object.values(dataPoints).map(state => ({
        ...state,
        status: state.status.toLowerCase() as StateStatus,
        score: (state.score) / (maxScore)
      }))} />
    </div>
  )
}

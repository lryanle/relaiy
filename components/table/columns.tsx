"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Conversation, Channel, Status } from "@/types/types"
import { Mail, MessageCircle, Phone, CircleHelp } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import TimeEmbed from "@/components/timeembed"

const getChannelIcon = (channel: Conversation["channel"]) => {
  switch (channel) {
    case "Voice":
      return <Phone className="w-6 h-6" />
    case "SMS":
      return <MessageCircle className="w-6 h-6" />
    case "Email":
      return <Mail className="w-6 h-6" />
    case "Discord":
      return <FaDiscord className="w-6 h-6" />
    default:
      return <CircleHelp className="w-8 h-8" />
  }
}

export const columns: ColumnDef<Conversation>[] = [
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as Conversation["status"]
  //     return (
  //       <Badge variant="outline" className={`px-1 group font-semibold ${status === "Active" ? "bg-green-500/15 text-green-500 border-green-500/30" : status === "Complete" ? "bg-slate-500/15 text-slate-500 border-slate-500/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"}`}>
  //         {status === "Active" ? <CirclePlay className="w-4 h-4" /> : status === "Inactive" ? <CircleMinus className="w-4 h-4" /> : <CircleCheck className="w-4 h-4" />}
  //         <span className="ml-1">{status === "Active" ? "Active" : status === "Inactive" ? "Inactive" : "Complete"}</span>
  //       </Badge>
  //     )
  //   },
  // },
  {
    accessorKey: "channel",
    header: "Type",
    cell: ({ row }) => {
      const channel = row.getValue("channel") as Conversation["channel"]
      return (
        // <Badge variant="outline" className={`px-1 group font-semibold`}>
        //   <span className="mr-1">{getChannelIcon(channel)}</span> {channel}
        // </Badge>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <span className={`cursor-help p-2 pr-2.5 mr-4 flex items-center justify-start ${row.original.status === "Active" ? "bg-green-500/15 text-green-500 border-green-500/30" : row.original.status === "Complete" ? "bg-slate-500/15 text-slate-500 border-slate-500/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"}`}>{getChannelIcon(channel)}</span>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={0}>
              <div className="flex flex-col items-start">
                <p>{`Channel: ${channel} `}</p>
                <p>{`Status: ${row.original.status}`}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
    cell: ({ row }) => {
      const recipient = row.getValue("recipient") as string
      return (
        <div className="select-all px-3 py-1 w-min font-[family-name:var(--font-oxygen-mono)] bg-gray-100 dark:bg-[#1F1F23] rounded-md">
          {recipient}
        </div>
      )
    },
  },
  {
    accessorKey: "goal",
    header: "Conversational Goal",
    cell: ({ row }) => {
      const goal = row.getValue("goal") as string
      return <span className="px-2">{goal}</span>
    },
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => {
      const date = row.getValue("lastActivity") as Date
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <TimeEmbed className="cursor-help px-2" timestamp={date.getTime()} />
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={0}>
              <div className="flex flex-col items-start">
                <p>{formatDateTime(date, true)}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "messageCount",
    header: "Messages",
    cell: ({ row }) => {
      const count = row.getValue("messageCount") as number
      return <span className="px-2">{count}</span>
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalPrice"))
      return <span className="px-2">{formatCurrency(amount)}</span>
    },
  },
]


"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Conversation } from "@/types/types"
import { Mail, MessageCircle, Phone, CircleHelp } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { formatCurrency, formatDateTime, formatReceipientId } from "@/lib/utils"
import TimeEmbed from "@/components/timeembed"

const getChannelIcon = (channel: Conversation["channel"]) => {
  switch (channel) {
    case "voice":
      return <Phone className="w-6 h-6" />
    case "sms":
      return <MessageCircle className="w-6 h-6" />
    case "email":
      return <Mail className="w-6 h-6" />
    case "discord":
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
    maxSize: 80,
    size: 80,
    cell: ({ row }) => {
      const channel = row.getValue("channel") as Conversation["channel"]
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="h-full">
              <span className={`h-full cursor-help p-2 pr-2.5 flex items-center justify-start ${row.original.status === "active" ? "bg-green-500/15 text-green-500 border-green-500/30" : row.original.status === "complete" ? "bg-slate-500/15 text-slate-500 border-slate-500/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"}`}>{getChannelIcon(channel)}</span>
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
    size: 160,
    maxSize: 160,
    cell: ({ row }) => {
      const recipient = row.getValue("recipient") as string
      return (
        <div className="select-all px-2 py-1 w-fit bg-gray-100 dark:bg-[#1F1F23] rounded-md whitespace-nowrap">
          {formatReceipientId(recipient, row.original.channel)}
        </div>
      )
    },
  },
  {
    accessorKey: "goal",
    header: "Conversational Goal",
    size: 999,
    cell: ({ row }) => {
      const goal = row.getValue("goal") as string
      return <span className="px-2 py-1 block whitespace-normal overflow-y-scroll max-h-10">{goal}</span>
    },
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    size: 120,
    maxSize: 120,
    cell: ({ row }) => {
      const date = row.getValue("lastActivity") as Date
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <TimeEmbed className="cursor-help px-2 whitespace-nowrap" timestamp={date.getTime()} />
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
    header: "# Msgs",
    size: 100,
    maxSize: 100,
    cell: ({ row }) => {
      const count = row.getValue("messageCount") as number
      return <span className="px-2 text-left block w-full whitespace-nowrap">{count}</span>
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Σ Price",
    size: 100,
    maxSize: 100,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalPrice"))
      return <span className="px-2 text-left block w-full whitespace-nowrap">{formatCurrency(amount)}</span>
    },
  },
]


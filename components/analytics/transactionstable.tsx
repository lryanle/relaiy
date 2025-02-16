"use client"

import { DataTable } from "@/components/table/data-table"
import { formatDateTime, getProviderIconFromModel } from "@/lib/utils"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import TimeEmbed from "@/components/timeembed"
import { type ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type Transaction = {
  id: string
  timestamp: Date
  model: string
  cost: number
  tokens: {
    input: number
    output: number
  }
  type: string
}

interface TransactionsTableProps {
  data: Transaction[]
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      const date = row.getValue("timestamp") as Date
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <TimeEmbed 
                className="cursor-help px-2 whitespace-nowrap py-2" 
                timestamp={date.getTime()} 
              />
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={0}>
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
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <div className="py-2 px-2 flex items-center justify-start gap-1">
        <Avatar className="h-6 w-6 bg-gray-100">
          <AvatarImage src={getProviderIconFromModel(row.getValue("model"))} />
          <AvatarFallback>
            {row.getValue("model")}
          </AvatarFallback>
        </Avatar>

        {row.getValue("model")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="py-2 px-2">
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "tokens",
    header: "Tokens",
    cell: ({ row }) => {
      const tokens = row.original.tokens
      return (
        <div className="py-2 px-2">
          {tokens.input + tokens.output}
        </div>
      )
    },
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => (
      <div className="py-2 px-2">
        ${row.original.cost.toFixed(4)}
      </div>
    ),
  },
]

export default function TransactionsTable({ data }: TransactionsTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data}
      onRowClick={() => {}}
      selectedConvo={null}
    />
  )
} 
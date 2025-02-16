"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RequestStatusProps {
  data: {
    status: string
    count: number
  }[]
}

export default function RequestStatus({ data }: RequestStatusProps) {
  return (
    <ChartContainer
      config={{
        count: {
          label: "Requests",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px] w-full"
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="count" 
          fill="hsl(var(--chart-2))" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
} 
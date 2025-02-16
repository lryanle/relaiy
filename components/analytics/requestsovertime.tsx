"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RequestsOverTimeProps {
  data: {
    date: string
    requests: number
  }[]
}

export default function RequestsOverTime({ data }: RequestsOverTimeProps) {
  return (
    <ChartContainer
      config={{
        requests: {
          label: "Requests",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px] w-full"
    >
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line 
          type="monotone" 
          dataKey="requests" 
          stroke="var(--color-requests)" 
          strokeWidth={2} 
        />
      </LineChart>
    </ChartContainer>
  )
}


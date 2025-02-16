"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CostOverTimeProps {
  data: {
    date: string
    cost: number
  }[]
}

export default function CostOverTime({ data }: CostOverTimeProps) {
  return (
    <ChartContainer
      config={{
        cost: {
          label: "Cost",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px] w-full"
    >
      <AreaChart data={data}>
        <XAxis dataKey="date" />
        <YAxis 
          tickFormatter={(value) => `$${value}`}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area 
          type="monotone" 
          dataKey="cost" 
          stroke="var(--color-cost)" 
          fill="var(--color-cost)" 
          fillOpacity={0.3} 
        />
      </AreaChart>
    </ChartContainer>
  )
}


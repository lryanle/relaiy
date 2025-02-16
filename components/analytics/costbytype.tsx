"use client"

import { PieChart, Pie, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CostByTypeProps {
  data: {
    name: string
    cost: number
  }[]
}

const COLORS = ["hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-1))", "hsl(var(--chart-4))"]

export default function CostByType({ data }: CostByTypeProps) {
  return (
    <ChartContainer
      config={{
        sms: {
          label: "SMS",
          color: "hsl(var(--chart-1))",
        },
        voice: {
          label: "Voice",
          color: "hsl(var(--chart-2))",
        },
        email: {
          label: "Email",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px] w-full"
    >
      <PieChart>
        <Pie 
          data={data} 
          cx="50%" 
          cy="50%" 
          labelLine={false} 
          outerRadius={128} 
          fill="#8884d8" 
          dataKey="cost"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
      </PieChart>
    </ChartContainer>
  )
}


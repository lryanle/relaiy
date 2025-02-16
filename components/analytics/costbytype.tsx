"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart } from "recharts"

interface CostByTypeData {
  type: string
  cost: number
}

export default function CostByType() {
  const [data, setData] = useState<CostByTypeData[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      setData(result.costByType.map((item: any) => ({
        name: item.type,
        cost: item._sum.cost
      })))
    }
    fetchData()
  }, [])

  const COLORS = ["hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-1))", "hsl(var(--chart-4))"]

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


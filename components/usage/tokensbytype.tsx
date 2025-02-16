"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TokensByTypeProps {
  data: {
    name: string
    input: number
    output: number
  }[]
}

export default function TokensByType({ data }: TokensByTypeProps) {
  return (
    <ChartContainer
      config={{
        input: {
          label: "Input Tokens",
          color: "hsl(var(--chart-1))",
        },
        output: {
          label: "Output Tokens",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px] w-full"
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar dataKey="input" fill="var(--color-input)" />
        <Bar dataKey="output" fill="var(--color-output)" />
      </BarChart>
    </ChartContainer>
  )
}


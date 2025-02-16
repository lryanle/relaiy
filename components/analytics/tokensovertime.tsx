"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TokensOverTimeProps {
  data: {
    date: string
    tokens: {
      input: number
      output: number
    }
  }[]
}

export default function TokensOverTime({ data }: TokensOverTimeProps) {
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
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="tokens.input" 
          stroke="var(--color-input)" 
          strokeWidth={2} 
        />
        <Line 
          type="monotone" 
          dataKey="tokens.output" 
          stroke="var(--color-output)" 
          strokeWidth={2} 
        />
      </LineChart>
    </ChartContainer>
  )
}


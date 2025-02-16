"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RequestsOverTime from "@/components/analytics/requestsovertime"
import CostOverTime from "@/components/analytics/costovertime"
import CostByType from "@/components/analytics/costbytype"
import TokensByType from "@/components/analytics/tokensbytype"
import TokensOverTime from "@/components/analytics/tokensovertime"
import TotalUsageCard from "@/components/analytics/totalusage"
import ModelUsageCard from "@/components/analytics/modelusage"
import TransactionsTable from "@/components/analytics/transactionstable"
import RequestStatus from "@/components/analytics/requeststatus"
import { Transaction } from "@/types/types"

//! TODO: @bryant connect with api data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    timestamp: new Date("2023-06-01"),
    model: "GPT-4",
    cost: 0.123,
    tokens: { input: 100, output: 150 },
    type: "SMS",
    status: "completed"
  },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  const totalStats = useMemo(() => {
    return transactions.reduce((acc, curr) => ({
      requests: acc.requests + 1,
      cost: acc.cost + curr.cost,
      inputTokens: acc.inputTokens + curr.tokens.input,
      outputTokens: acc.outputTokens + curr.tokens.output
    }), {
      requests: 0,
      cost: 0,
      inputTokens: 0,
      outputTokens: 0
    })
  }, [transactions])

  const modelUsage = useMemo(() => {
    const usage = transactions.reduce((acc, curr) => {
      acc[curr.model] = (acc[curr.model] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const total = Object.values(usage).reduce((a, b) => a + b, 0)
    return Object.entries(usage).map(([model, count]) => ({
      model,
      percentage: (count / total) * 100
    }))
  }, [transactions])

  // Group data by date for time-series charts
  const timeSeriesData = useMemo(() => {
    const grouped = transactions.reduce((acc, curr) => {
      const date = curr.timestamp.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = {
          date,
          requests: 0,
          cost: 0,
          tokens: { input: 0, output: 0 }
        }
      }
      acc[date].requests++
      acc[date].cost += curr.cost
      acc[date].tokens.input += curr.tokens.input
      acc[date].tokens.output += curr.tokens.output
      return acc
    }, {} as Record<string, any>)

    return Object.values(grouped)
  }, [transactions])
  
  const typeData = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = {
          name: curr.type,
          cost: 0,
          input: 0,
          output: 0
        }
      }
      acc[curr.type].cost += curr.cost
      acc[curr.type].input += curr.tokens.input
      acc[curr.type].output += curr.tokens.output
      return acc
    }, {} as Record<string, any>)
  }, [transactions])

  // Calculate request status data
  const statusData = useMemo(() => {
    const statusCounts = transactions.reduce((acc, curr) => {
      const status = curr.status || "Unknown"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }))
  }, [transactions])

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TotalUsageCard stats={totalStats} />
        <ModelUsageCard models={modelUsage} />
      </div>
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Requests Over Time</CardTitle>
                <CardDescription>Number of requests made over the selected time period</CardDescription>
              </CardHeader>
              <CardContent>
                <RequestsOverTime data={timeSeriesData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Request Status Overview</CardTitle>
                <CardDescription>Distribution of requests by their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <RequestStatus data={statusData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="cost">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Over Time</CardTitle>
                <CardDescription>Total cost over the selected time period</CardDescription>
              </CardHeader>
              <CardContent>
                <CostOverTime data={timeSeriesData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cost by Type</CardTitle>
                <CardDescription>Cost breakdown by channel type</CardDescription>
              </CardHeader>
              <CardContent>
                <CostByType data={Object.values(typeData)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="tokens">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tokens by Type</CardTitle>
                <CardDescription>Token usage breakdown by channel type</CardDescription>
              </CardHeader>
              <CardContent>
                <TokensByType data={Object.values(typeData)} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tokens Over Time</CardTitle>
                <CardDescription>Token usage over the selected time period</CardDescription>
              </CardHeader>
              <CardContent>
                <TokensOverTime data={timeSeriesData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>List of all transactions in the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable data={transactions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


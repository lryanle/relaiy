import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TotalUsageCardProps {
  stats: {
    requests: number
    cost: number
    inputTokens: number
    outputTokens: number
  }
}

export default function TotalUsageCard({ stats }: TotalUsageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Total Requests</p>
            <p className="text-2xl font-bold">{stats.requests.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Total Cost</p>
            <p className="text-2xl font-bold">${stats.cost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Input Tokens</p>
            <p className="text-2xl font-bold">{stats.inputTokens.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Output Tokens</p>
            <p className="text-2xl font-bold">{stats.outputTokens.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


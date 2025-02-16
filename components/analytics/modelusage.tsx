import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ModelUsageCardProps {
  models: {
    model: string
    percentage: number
  }[]
}

export default function ModelUsageCard({ models }: ModelUsageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {models.map(({ model, percentage }) => (
            <div key={model}>
              <div className="flex justify-between">
                <span className="font-medium">{model}</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        // Fetch data for analytics
        const transactions = await prisma.transaction.findMany({
            select: {
                id: true,
                timestamp: true,
                model: true,
                cost: true,
                tokens: {
                    select: {
                        input: true,
                        output: true
                    }
                },
                type: true
            }
        })

        // Aggregate data for charts
        const costByType = await prisma.transaction.groupBy({
            by: ['type'],
            _sum: {
                cost: true
            }
        })

        const requestsOverTime = await prisma.transaction.groupBy({
            by: ['timestamp'],
            _count: {
                id: true
            }
        })

        const tokensOverTime = await prisma.transaction.groupBy({
            by: ['timestamp'],
            _sum: {
                input: true,
                output: true
            }
        })

        return NextResponse.json({
            transactions,
            costByType,
            requestsOverTime,
            tokensOverTime
        })
    } catch (error) {
        console.error('Error fetching analytics data:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
    }
} 
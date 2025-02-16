import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { selectedTones, toggleStates, requirements } = await request.json()

        const account = await prisma.account.findFirst({
            where: { userId: session.user.id }
        })

        if (!account) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 })
        }

        // Convert toggles to requirements
        const toggleRequirements = Object.entries(toggleStates)
            .filter(([_, enabled]) => enabled)
            .map(([key, _]) => {
                switch(key) {
                    case "noUppercase": return "No uppercase letters"
                    case "allCaps": return "Use all capital letters"
                    case "extraEmojis": return "Use extra emojis"
                    case "fewEmojis": return "Use minimal emojis"
                    case "noEndPeriod": return "Don't end sentences with periods"
                    default: return ""
                }
            })
            .filter(req => req !== "")

        // Update account with combined requirements
        const updatedAccount = await prisma.account.update({
            where: { id: account.id },
            data: {
                tones: selectedTones,
                requirements: [...requirements, ...toggleRequirements]
            }
        })

        return NextResponse.json(updatedAccount)
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const account = await prisma.account.findFirst({
            where: { userId: session.user.id },
            select: {
                tones: true,
                requirements: true
            }
        })

        // Extract toggle states from requirements
        const toggleStates = {
            noUppercase: account?.requirements.includes("No uppercase letters") || false,
            allCaps: account?.requirements.includes("Use all capital letters") || false,
            extraEmojis: account?.requirements.includes("Use extra emojis") || false,
            fewEmojis: account?.requirements.includes("Use minimal emojis") || false,
            noEndPeriod: account?.requirements.includes("Don't end sentences with periods") || false
        }

        // Filter out toggle requirements from the requirements list
        const filteredRequirements = account?.requirements.filter(req => 
            !["No uppercase letters", "Use all capital letters", "Use extra emojis", 
              "Use minimal emojis", "Don't end sentences with periods"].includes(req)
        ) || []

        return NextResponse.json({
            tones: account?.tones || [],
            requirements: filteredRequirements,
            toggleStates
        })
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
} 
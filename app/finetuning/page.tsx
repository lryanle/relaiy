"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowRightIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const tones = [
  "Boomer Tone",
  "Gen X Tone",
  "Millennial Tone",
  "Gen Z Tone",
  "Gen A Tone",
  "Business Professional",
  "Professional",
  "Casual",
  "Extra Casual",
  "Informal",
  "Academic",
  "Humorous",
  "Sarcastic",
]

const toggles = [
  { id: "noUppercase", label: "No uppercase" },
  { id: "allCaps", label: "All caps" },
  { id: "extraEmojis", label: "Extra Emojis" },
  { id: "fewEmojis", label: "Few Emojis" },
  { id: "noEndPeriod", label: "No end period" },
]

const id2Label: Record<string, string> = {
    noUppercase: "No uppercase",
    allCaps: "All caps",
    extraEmojis: "Extra Emojis",
    fewEmojis: "Few Emojis",
    noEndPeriod: "No end period"
}

export default function FineTuning() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedTones, setSelectedTones] = useState<string[]>([])
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({})
  const [requirements, setRequirements] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState("")

  const { data: settings } = useQuery({
    queryKey: ['finetuning'],
    queryFn: async () => {
      const response = await fetch('/api/finetuning')
      if (!response.ok) throw new Error('Failed to fetch settings')
      return response.json()
    }
  })

  useEffect(() => {
    if (settings) {
      setSelectedTones(settings.tones || [])
      setToggleStates(settings.toggleStates || {})
      setRequirements(settings.requirements || [])
    }
  }, [settings])

  const handleToneChange = (tone: string) => {
    setSelectedTones((prev) => (prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]))
  }

  const handleToggleChange = (toggleId: string) => {
    setToggleStates((prev) => ({ ...prev, [toggleId]: !prev[toggleId] }))
  }

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements((prev) => [...prev, newRequirement.trim()])
      setNewRequirement("")
    }
  }

  const handleRemoveRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSettings = useMutation({
    mutationFn: async (settings: {
      selectedTones: string[]
      toggleStates: Record<string, boolean>
      requirements: string[]
    }) => {
      const response = await fetch('/api/finetuning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      if (!response.ok) {
        throw new Error('Failed to update settings')
      }
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your fine-tuning settings have been saved.",
      })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive"
      })
    }
  })

  const handleSubmit = () => {
    const enabledToggles = Object.entries(toggleStates)
        .filter(([_, enabled]) => enabled)
        .reduce((acc, [key]) => ({
            ...acc,
            [key]: true
        }), {} as Record<string, boolean>)

    updateSettings.mutate({
        selectedTones,
        toggleStates: enabledToggles,
        requirements
    })
  }

  return (
    <div className="p-4 container mx-auto flex flex-col md:flex-row gap-4 justify-center items-start">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-between w-full gap-2">
            <span className="text-gray-900 dark:text-gray-100">Fine-Tuning Settings</span>
            <Link href="/settings" onClick={(e) => {
              e.preventDefault()
              toast({
                title: "LLM Config Feature WIP",
                description: "LLM editing is coming soon!",
              })
            }}>
              <Button variant="outline" className="gap-2" disabled>
                <span>LLM Settings (WIP)</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>Customize the voice, tone, style, and restrictions of your conversational agent to meet your specific needs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tones</h3>
            <div className="grid grid-cols-2 gap-4">
              {tones.map((tone) => (
                <div key={tone} className="flex items-center space-x-2">
                  <Checkbox
                    id={tone}
                    checked={selectedTones.includes(tone)}
                    onCheckedChange={() => handleToneChange(tone)}
                  />
                  <Label htmlFor={tone}>{tone}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Toggles</h3>
            {toggles.map((toggle) => (
              <div key={toggle.id} className="flex items-center justify-between">
                <Label htmlFor={toggle.id}>{toggle.label}</Label>
                <Switch
                  id={toggle.id}
                  checked={toggleStates[toggle.id] || false}
                  onCheckedChange={() => handleToggleChange(toggle.id)}
                />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Requirements</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddRequirement()}
              />
              <Button onClick={handleAddRequirement}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="group relative cursor-pointer transition-all hover:pr-8 text-sm bg-gray-100 dark:bg-[#1F1F23] text-gray-900 dark:text-gray-100 dark:border-gray-200/20 border-[#1F1F23]/20"
                >
                  {req}
                  <span
                    onClick={() => handleRemoveRequirement(index)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Submit Fine-Tuning Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


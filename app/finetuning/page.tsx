"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, TrashIcon } from "lucide-react"
import Link from "next/link"

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

export default function FineTuning() {
  const [selectedTones, setSelectedTones] = useState<string[]>([])
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({})
  const [requirements, setRequirements] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState("")

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

  const handleSubmit = () => {
    //! TODO: @Bryant
    console.log("Selected Tones:", selectedTones)
    console.log("Toggle States:", toggleStates)
    console.log("Requirements:", requirements)
  }

  return (
    <div className="p-4 container mx-auto flex flex-col md:flex-row gap-4 justify-center items-start">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-between w-full gap-2">
            <span className="text-gray-900 dark:text-gray-100">Fine-Tuning Settings</span>
            <Link href="/settings">
              <Button variant="outline" className="gap-2">
                <span>LLM Settings</span>
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


"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createNewChat, isValidDestination } from "@/lib/utils"
import { MessageSquare, Phone, Plus, Mail, Check, Dice6 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaDiscord } from "react-icons/fa"
import { Channel } from "@/types/types"

const randomGoals = [
  "Be as rude as possible.",
  "Try and sell them toothpaste.",
  "Get them to agree to climate change.",
  "Get them to ask you on a date.",
  "Get them to give you a compliment.",
]

export function NewChatModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    goal: "",
    firstMessage: "",
    destination: "",
    type: "SMS",
    tones: ["friendly"],
    requirements: ["Keep it short and concise"]
  })

  const channelTypes = [
    { value: "SMS", icon: MessageSquare, label: "SMS" },
    { value: "VOICE", icon: Phone, label: "Voice" },
    { value: "DISCORD", icon: FaDiscord, label: "Discord" },
    { value: "EMAIL", icon: Mail, label: "Email" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const chats = await createNewChat(formData)
      if (chats) {
        router.push(`/chat/${chats[0].id}`)
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const handleChannelChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value,
      destination: ""
    }))
  }

  const getDestinationPlaceholder = (type: string) => {
    switch (type) {
      case "SMS":
        return "+1 (123) 456-7890"
      case "DISCORD":
        return "@username"
      case "EMAIL":
        return "email@example.com"
      case "VOICE":
        return "+1 (123) 456-7890"
      default:
        return "Enter destination"
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ''
    
    let formatted = ''
    if (numbers.length > 0) {
      formatted = '+1 ('
      formatted += numbers.slice(0, Math.min(3, numbers.length))
      if (numbers.length > 3) formatted += ') '
      if (numbers.length > 3) formatted += numbers.slice(3, Math.min(6, numbers.length))
      if (numbers.length > 6) formatted += '-'
      if (numbers.length > 6) formatted += numbers.slice(6, Math.min(10, numbers.length))
    }
    
    return formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const currentFormatted = formatPhoneNumber(formData.destination)
    
    if (input.length < currentFormatted.length) {
      setFormData(prev => ({
        ...prev,
        destination: prev.destination.slice(0, -1)
      }))
      return
    }
    
    const lastChar = input[input.length - 1]
    if (lastChar && !lastChar.match(/[0-9]/)) {
      e.target.value = currentFormatted
      return
    }
    
    const newNumbers = input.replace(/\D/g, '')
    const lastNumber = newNumbers[newNumbers.length - 1]
    if (lastNumber && formData.destination.length < 10) {
      setFormData(prev => ({
        ...prev,
        destination: prev.destination + lastNumber
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="success" className="bg-green-600 hover:bg-green-700 text-white">
          <Plus strokeWidth={3} className="h-4 w-4" />
          New Convo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a New Conversation</DialogTitle>
            <DialogDescription>
              Configure a new conversational agent to chat with a specified recipient with respect to a goal.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col justify-center items-start gap-2 w-full">
            <Label className="flex justify-start items-center gap-1 w-full" htmlFor="destination">
              <span>Designated Recipient</span>
              {isValidDestination(formData.destination, formData.type.toLowerCase() as Channel) && <Check strokeWidth={4} className="w-3.5 h-3.5 text-green-500" />}
            </Label>
            <div className="flex justify-center items-center gap-2 w-full">
              <Select onValueChange={handleChannelChange} value={formData.type}>
                <SelectTrigger className="w-[8rem]">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Channel</SelectLabel>
                    {channelTypes.map(({ value, icon: Icon, label }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                id="destination"
                placeholder={getDestinationPlaceholder(formData.type)}
                value={formData.type === "SMS" || formData.type === "VOICE" 
                  ? formatPhoneNumber(formData.destination)
                  : formData.destination}
                onChange={formData.type === "SMS" || formData.type === "VOICE"
                  ? handlePhoneChange
                  : (e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="flex justify-start items-center gap-1 w-full" htmlFor="goal">
                <span>Conversational Goal</span>
                {formData.goal.length >= 10 && <Check strokeWidth={4} className="w-3.5 h-3.5 text-green-500" />}
              </Label>
              <div className="flex justify-start items-center gap-2 w-full">
                <Input
                  id="goal"
                  placeholder="What should the agent try to achieve?"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 px-2"
                      onClick={(e) => {
                        e.preventDefault()
                        const randomGoal = randomGoals[Math.floor(Math.random() * randomGoals.length)]
                        setFormData({ ...formData, goal: randomGoal })
                      }}
                    >
                        <Dice6 strokeWidth={2} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select a random goal</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="flex justify-start items-center gap-1 w-full" htmlFor="firstMessage">
                <span>Initial Message</span>
                {formData.firstMessage.length >= 5 && <Check strokeWidth={4} className="w-3.5 h-3.5 text-green-500" />}
              </Label>
              <Input
                id="firstMessage"
                placeholder="Initial message to send"
                value={formData.firstMessage}
                onChange={(e) => setFormData({ ...formData, firstMessage: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={formData.goal.length < 10 || formData.firstMessage.length < 5 || !isValidDestination(formData.destination, formData.type.toLowerCase() as Channel) || loading } type="submit"className="bg-green-600 hover:bg-green-700 text-white">
              Begin Conversation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
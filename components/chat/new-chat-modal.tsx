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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createNewChat } from "@/lib/utils"
import { MessageSquare, Phone, Plus, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaDiscord } from "react-icons/fa"

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
            <Label>Designated Recipient</Label>
            <div className="flex justify-center items-center gap-2">
            <Select>
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
                placeholder={formData.type === "DISCORD" ? "@username" : "+1234567890"}
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full"
              />
            </div>
          </div>




          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                placeholder="What should the agent try to achieve?"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstMessage">Initial Message</Label>
              <Input
                id="firstMessage"
                placeholder="Initial message to send"
                value={formData.firstMessage}
                onChange={(e) => setFormData({ ...formData, firstMessage: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? "Creating..." : "Begin Conversation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
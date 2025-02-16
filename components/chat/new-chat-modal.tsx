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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createNewChat } from "@/lib/utils"
import { MessageSquare, Phone, Plus } from "lucide-react"
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
          <Plus className="h-4 w-4 mr-2" />
          New C-Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Chat Agent</DialogTitle>
            <DialogDescription>
              Configure your new conversational agent
            </DialogDescription>
          </DialogHeader>
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
              <Label htmlFor="firstMessage">First Message</Label>
              <Input
                id="firstMessage"
                placeholder="Initial message to send"
                value={formData.firstMessage}
                onChange={(e) => setFormData({ ...formData, firstMessage: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Channel Type</Label>
              <div className="flex gap-2">
                {channelTypes.map(({ value, icon: Icon, label }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={formData.type === value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setFormData({ ...formData, type: value })}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder={formData.type === "DISCORD" ? "@username" : "+1234567890"}
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? "Creating..." : "Create Chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
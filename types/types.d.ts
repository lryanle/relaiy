export type Group = "Overview" | "Modifications" | "Settings";
export type Channel = "voice" | "sms" | "email" | "discord"
export type Status = "active" | "inactive" | "completed"
export type StateStatus = "pending" | "error" | "bad" | "okay" | "good" | "best"

export type Route = {
    name: string;
    icon: LucideIcon;
    href: string;
    group: Group;
}

export type CAgent = {
    id: string;
    recentActivity: Date; 
    status: Status;
    type: Channel;
    receipientId: string
}

export type Conversation = {
  id: string
  status: Status
  channel: Channel
  recipient: string
  goal: string
  lastActivity: Date
  messageCount: number
  totalPrice: number
}

export type Transaction = {
  id: string
  timestamp: Date
  model: string
  cost: number
  tokens: {
    input: number
    output: number
  }
  type: "SMS" | "Voice" | "Email"
}
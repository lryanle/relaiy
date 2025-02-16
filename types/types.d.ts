export type Group = "Overview" | "Modifications" | "Settings";
export type Channel = "Voice" | "SMS" | "Email" | "Discord"
export type Status = "Active" | "Inactive" | "Complete"

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
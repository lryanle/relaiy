export type Group = "Overview" | "Modifications" | "Settings";
export type Channel = "Voice" | "SMS" | "Email" | "Discord"
export type Status = "active" | "inactive" | "complete"

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
import { columns } from "@/components/table/columns"
import { DataTable } from "@/components/table/data-table"

const data = [
  {
    id: "1",
    status: "Active",
    channel: "Voice",
    recipient: "john@example.com",
    goal: "Schedule a meeting",
    lastActivity: new Date(),
    messageCount: 5,
    totalPrice: 2.5,
  },
  {
    id: "2",
    status: "Complete",
    channel: "SMS",
    recipient: "+1234567890",
    goal: "Confirm appointment",
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messageCount: 3,
    totalPrice: 1.2,
  },
  {
    id: "3",
    status: "Inactive",
    channel: "Email",
    recipient: "sarah@example.com",
    goal: "Follow-up on proposal",
    lastActivity: new Date(Date.now() - 1000 * 60 * 2),
    messageCount: 2,
    totalPrice: 0.75,
  },
  {
    id: "4",
    status: "Active",
    channel: "Discord",
    recipient: "@discord_user",
    goal: "Asking out on a date",
    lastActivity: new Date(),
    messageCount: 8,
    totalPrice: 3.8,
  },
]

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      {/* <h1 className="text-2xl font-bold mb-5">Automated Conversations</h1> */}
      <DataTable 
        columns={columns as any} 
        data={data} 
      />
    </div>
  );
}

import { cn } from "@/lib/utils"
import { ChatMessage } from "@/types/chat"

interface ChatBodyProps {
  chatId: string
  messages: ChatMessage[]
}

export default function ChatBody({ chatId, messages }: ChatBodyProps) {

    // const messages = [
    //     {
    //         id: 1,
    //         content: "Hello, how are you?",
    //         sender: "user",
    //         timestamp: new Date()
    //     },
    //     {
    //         id: 2,
    //         content: "I'm good, thank you!",
    //         sender: "assistant",
    //         timestamp: new Date()
    //     },
    //     {
    //         id: 3,
    //         content: "What's your name?",
    //         sender: "user",
    //         timestamp: new Date()
    //     },
    //     {
    //         id: 4,
    //         content: "I'm a chatbot",
    //         sender: "assistant",
    //         timestamp: new Date()
    //     }
    // ]







  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      {messages.map((message, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col max-w-[80%] rounded-lg p-4",
            message.role === "user" 
              ? "bg-primary text-primary-foreground self-end" 
              : "bg-muted self-start"
          )}
        >
          <p className="text-sm">{message.content}</p>
          <span className="text-xs opacity-70 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  )
}
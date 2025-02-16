import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChatMessageList, ChatTabList } from "@/types/chat"
import { Channel } from "@/types/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Error = {
  error: string
}

// Get all chats for a user
export const getAllChats = async (): Promise<ChatTabList> => {
    const response = await fetch("/api/allChats")
    const data = await response.json()
    return data.chats
}

// Get chats for a user
export const getChatsForUser = async (): Promise<ChatTabList | null> => {
    const response = await fetch("/api/chats")
    const data = await response.json()

    if (data.error) {
      return null
    }

    return data
}

// Get specific chat messages
export const getChat = async (id: number): Promise<ChatMessageList> => {
    const response = await fetch(`/api/chat?chatId=${id}`)
    const data = await response.json()
    return data.messages
}

// Create a new chat
export const createNewChat = async (): Promise<ChatTabList> => {
    const response = await fetch("/api/createChat", {
        method: "POST",
        body: JSON.stringify({
            goal: "You are trying to get a date or hanging out for the user.",
            firstMessage: "yo yo yo",
            destination: "+14695963483",
            type: "SMS",
            tones: ["angry"],
            requirements: ["Keep it short and concise"]
        })
    })
    const data = await response.json()
    return data.chats
}

// Get total cost
export const getCost = async (): Promise<number> => {
    const response = await fetch("/api/cost")
    const data = await response.json()
    return data.cost
}

export function formatReceipientId(id: string, type: Channel) {
  if (type === "Voice" || type === "SMS") {
    return `+1 (${id.slice(0, 3)}) ${id.slice(3, 6)}-${id.slice(6, 10)}`;
  } else if (type === "Discord") {
    return `@${id}`;
  }
  return id;
}

export function formatTimeAgo(date: Date) {
  console.log(date)
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes === 0) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else {
    return `${Math.round(diffMinutes / 60)}hr${diffMinutes === 1 ? "" : "s"} ago`;
  }
}

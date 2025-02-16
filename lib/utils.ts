import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChatMessageList, ChatTabList } from "@/types/chat"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get all chats for a user
export const getAllChats = async (): Promise<ChatTabList> => {
    const response = await fetch("/api/allChats")
    const data = await response.json()
    return data.chats
}

// Get specific chat messages
export const getChat = async (id: number): Promise<ChatMessageList> => {
    const response = await fetch(`/api/chat?chatId=${id}`)
    const data = await response.json()
    return data.messages
}

// Get total cost
export const getCost = async (): Promise<number> => {
    const response = await fetch("/api/cost")
    const data = await response.json()
    return data.cost
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChatMessageList, ChatTabList } from "@/types/chat"
import { Channel } from "@/types/types"

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

export function formatReceipientId(id: string, type: Channel) {
  if (type === "Voice" || type === "SMS") {
    return `+1 (${id.slice(0, 3)}) ${id.slice(3, 6)}-${id.slice(6, 10)}`;
  } else if (type === "Discord") {
    return `@${id}`;
  }
  return id;
}

export function formatTimeAgo(date: Date) {
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

export function titleCase(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDateTime(date: Date, includeDayOfWeek: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  
  if (includeDayOfWeek) {
    options.weekday = 'long';
  }

  return date.toLocaleDateString('en-US', options);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}
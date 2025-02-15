import { ChatTabList } from "@/lib/client/allChats/_types";
// call the api route for all chats

export const getAllChats = async (): Promise<ChatTabList> => {
  const response = await fetch("/api/allChats");
  const data = await response.json();
  return data.chats;
};
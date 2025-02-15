import { ChatMessageList } from "@/lib/client/chats/_types";

// call the api route for chat with id

export const getChat = async (id: number): Promise<ChatMessageList> => {
  const response = await fetch(`/api/chat?chatId=${id}`);
  const data = await response.json();
  return data.messages;
};

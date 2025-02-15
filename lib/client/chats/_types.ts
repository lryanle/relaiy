// types for chats

export type ChatMessage = {
  id: number;
  content: string;
  timestamp: string;
  role: "user" | "assistant";
};

export type ChatMessageList = ChatMessage[];
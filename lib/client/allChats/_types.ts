// types for chat tabs

export type ChatTab = {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
  isGroup: boolean;
};

export type ChatTabList = ChatTab[];
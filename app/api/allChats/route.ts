import { NextResponse } from "next/server";
import { allChatsOutputSchema, AllChatsOutput } from "./_schema";

export async function GET(request: Request) {
  // ask the db for all chats

  /*
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hello, how are you?",
    lastMessageTime: "2021-01-01",
    unreadMessages: 1,
    isGroup: false,
  }
  */

  const chats = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hello, how are you?",
      lastMessageTime: "2021-01-01",
      unreadMessages: 1,
      isGroup: false,
    },
  ] as const satisfies AllChatsOutput["chats"];

  return NextResponse.json({
    chats: chats,
  });
}

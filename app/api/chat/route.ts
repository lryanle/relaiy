import { NextResponse } from "next/server";
import { chatInputSchema, ChatInput, chatOutputSchema, ChatOutput } from "./_schema";

export async function GET(request: Request) {
  // ask the db for chat with id
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  const input = chatInputSchema.parse({
    id: chatId,
  });

  // ask the db for the chat with the given id

  // list of messages in openai format with timestamp in iso format
  /*
  [
    {
      role: "user",
      content: "Hello, how are you?",
      timestamp: new Date().toISOString(),
    },
    {
      role: "assistant",
      content: "I'm fine, thank you!",
      timestamp: new Date().toISOString(),
    },
  ]
  */

  const messages = [
    {
      role: "user",
      content: "Hello, how are you?",
      timestamp: new Date().toISOString(),
    },
    ] as const satisfies ChatOutput["messages"];

  return NextResponse.json({
    messages: messages,
  });
}

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // ask the db for the cost total of all chats token usage

  /*
  {
    totalCost: 100,
    totalTokens: 1000,
  }
  */

  return NextResponse.json({
    totalCost: 100,
    totalTokens: 1000,
  });
}

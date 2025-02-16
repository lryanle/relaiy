"use client"

import ChatBody from "@/components/chat/chat-body";

export default function Chat({ params }: { params: { slug: string } }) {
  
  const { slug } = params

  // useEffect(() => {
  //   const fetchChat = async () => {
  //     const chat = await getChat(Number(slug))
  //     console.log(chat)
  //   }
  //   fetchChat()
  // }, [slug])
  
  return (
    <div>
      <h1>Chat</h1>
      <p>{params.slug}</p>
      <ChatBody chatId={Number(slug)} />
    </div>
  );
}
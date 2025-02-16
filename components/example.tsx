import { useWebSocket } from "@/lib/context/websocket-provider"

export function Example() {
    const { isConnected, sendMessage, lastMessage } = useWebSocket()

    const handleSendMessage = () => {
        sendMessage({
            type: "chat",
            content: "Hello!"
        })
    }

    return (
        <div>
            <p>Connection status: {isConnected ? "Connected" : "Disconnected"}</p>
            <button onClick={handleSendMessage}>Send Message</button>
            {lastMessage && (
                <p>Last message: {JSON.stringify(lastMessage)}</p>
            )}
        </div>
    )
} 
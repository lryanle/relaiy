import z from "zod"

export const allChatsInputSchema = z.object({})

export type AllChatsInput = z.input<typeof allChatsInputSchema>;

export const allChatsOutputSchema = z.object({
    chats: z.array(z.object({
        id: z.number(),
        name: z.string(),
        lastMessage: z.string(),
        lastMessageTime: z.string(),
        unreadMessages: z.number(),
        isGroup: z.boolean(),
    })),
})

export type AllChatsOutput = z.infer<typeof allChatsOutputSchema>;
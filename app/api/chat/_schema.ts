import z from "zod"

export const chatInputSchema = z.object({
    id: z.number(),
})

export type ChatInput = z.input<typeof chatInputSchema>;

export const chatOutputSchema = z.object({
    messages: z.array(z.object({
        role: z.string(),
        content: z.string(),
        timestamp: z.string(),
    })),
})

export type ChatOutput = z.infer<typeof chatOutputSchema>;
import { User } from "@prisma/client"

export type AuthContextType = {
    user: User | null
    isLoading: boolean
    error: string | null
    signIn: (email: string, password: string) => void
    signInWithGithub: () => void
    signInWithDiscord: () => void
    signUp: (email: string, password: string, name: string) => void
    signOut: () => void
    isPending: boolean
    refetch: () => void
} 
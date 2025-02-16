"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/context/auth-provider"
import { useState } from "react"
import { FaDiscord, FaGithub } from "react-icons/fa"

export function SignInModal() {
    const { signInWithGithub, signInWithDiscord, isPending } = useAuth()
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={isPending}>Sign In</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Button 
                        variant="outline" 
                        onClick={() => signInWithGithub()}
                        className="w-full"
                    >
                        <FaGithub className="mr-2 h-4 w-4" />
                        Continue with GitHub
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => signInWithDiscord()}
                        className="w-full"
                    >
                        <FaDiscord className="mr-2 h-4 w-4" />
                        Continue with Discord
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
} 
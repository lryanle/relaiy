"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
export default function Test() {
    return (
        <div>
            <Button onClick={() => authClient.signUp.email({
                email: 'test@test.com',
                password: 'this is a test password',
                name: 'test'
            })}>Sign Up</Button>

            <Button onClick={() => authClient.signIn.email({
                email: 'test@test.com',
                password: 'this is a test password'
            })}>Sign In</Button>
        </div>
    )
}
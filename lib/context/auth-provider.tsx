"use client"

// create context for auth provider using better-auth

import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => void;
    signInWithGithub: () => void;
    signUp: (email: string, password: string, name: string) => void;
    signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    error: null,
    signIn: () => {},
    signInWithGithub: () => {},
    signUp: () => {},
    signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (session) {
            setUser({
                ...session.user,
                image: session.user.image ?? null
            });
        }
    }, [session]);

    function signIn(email: string, password: string) {
        // sign in with better-auth
        toast({
            title: "Signing in",
            description: `Attempting to sign in with email: ${email}`,
        });
        
        authClient.signIn.email({
            email: email,
            password: password, 
        }).then((user) => {
            if (user.data?.user) {
                toast({
                    title: "Success",
                    description: "Signed in successfully",
                });
                setUser({
                    ...user.data.user,
                    image: user.data.user.image ?? null
                });
            } else {
                toast({
                    title: "Error",
                    description: user.error?.message ?? "Unknown error occurred",
                    variant: "destructive"
                });
            }
        }).catch((error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        });
    }

    function signInWithGithub() {
        toast({
            title: "Signing in",
            description: "Redirecting to GitHub...",
        });
        
        authClient.signIn.social({
            provider: "github",
        })
    }

    function signUp(email: string, password: string, name: string) {
        toast({
            title: "Creating account",
            description: `Creating account for ${email}`,
        });
        
        authClient.signUp.email({
            email: email,
            password: password,
            name: name,
        }).then((user) => {
            if (user.data?.user) {
                toast({
                    title: "Success",
                    description: "Account created successfully",
                });
                setUser({
                    ...user.data.user,
                    image: user.data.user.image ?? null
                });
            } else {
                toast({
                    title: "Error",
                    description: user.error?.message ?? "Unknown error occurred",
                    variant: "destructive"
                });
                setErrorMessage(user.error?.message ?? "Unknown error occurred");
            }
        }).catch((error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
            setErrorMessage(error.message);
        });
    }

    function signOut() {
        authClient.signOut().then(() => {
            toast({
                title: "Success",
                description: "Signed out successfully",
            });
            setUser(null);
        }).catch((error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
            setErrorMessage(error.message);
        });
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            error: errorMessage,
            signIn, 
            signInWithGithub,
            signUp, 
            signOut 
        }}>
            {children}
        </AuthContext.Provider>
    )   
    

};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

import { betterAuth } from "better-auth";
import { Pool } from 'pg';
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {  
        enabled: true
    },
    socialProviders: { 
    //    github: { 
    //     clientId: process.env.GITHUB_CLIENT_ID, 
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET, 
    //    } 
    }, 
})
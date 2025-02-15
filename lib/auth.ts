import { betterAuth } from "better-auth";
import { Pool } from 'pg';
 
export const auth = betterAuth({
    database: new Pool({
        // connection options
    }),
    emailAndPassword: {  
        enabled: true
    },
    socialProviders: { 
       github: { 
        clientId: process.env.GITHUB_CLIENT_ID, 
        clientSecret: process.env.GITHUB_CLIENT_SECRET, 
       } 
    }, 
})
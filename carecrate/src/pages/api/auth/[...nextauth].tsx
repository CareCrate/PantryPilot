import NextAuth from 'next-auth';
import GoogleProvider  from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { cert } from "firebase-admin/app"


export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            allowDangerousEmailAccountLinking: true
        })
    ],
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: process.env.FIREBASE_AUTH_ADMIN_PROJECT_ID || '',
            clientEmail: process.env.FIREBASE_AUTH_ADMIN_CLIENT_EMAIL || '',
            privateKey: process.env.FIREBASE_AUTH_ADMIN_PRIVATE_KEY || ''
        })
    }),
    secret: process.env.secret,
    session: { strategy: 'jwt' }, 
    
    // Change this in production
    debug: true
});
import NextAuth from 'next-auth';
import GoogleProvider  from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';


export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            allowDangerousEmailAccountLinking: true
        })
    ],
    adapter: FirestoreAdapter(),
    secret: process.env.secret,
    session: { strategy: 'jwt' }, 
    
    // Change this in production
    debug: true
});
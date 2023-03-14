import NextAuth from 'next-auth';
import GoogleProvider  from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: '',
            clientSecret: '',
            allowDangerousEmailAccountLinking: true
        })
    ],
    adapter: FirestoreAdapter()
});
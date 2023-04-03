import NextAuth from 'next-auth';
import { User } from 'next-auth';
import WorkspaceProvider from '@/providers/workspaceProvider';
import { WorkspaceUser } from '@/types';
import { AdapterUser } from 'next-auth/adapters';


export default NextAuth({
    providers: [ WorkspaceProvider ],
    secret: process.env.secret,
    session: { strategy: 'jwt' }, 
    
    // Change this in production
    debug: true,

    // Custom Provider Callbacks
    callbacks: {
        async jwt({ token, user }: { token: any; user: AdapterUser | User | undefined }) {
            if (user && 'workspaceId' in user) {
                token.id = user.id;
                token.workspaceId = user.workspaceId;
            }
            return token;
        },
        async session({ session, user, token }) {
            if (token && session) {
                const { id, workspaceId } = token;
                session.user = {
                    ...user,
                    id,
                    workspaceId
                };
            }
            return session;
        }
    }
});
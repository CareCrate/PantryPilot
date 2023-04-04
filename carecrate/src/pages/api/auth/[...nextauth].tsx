import NextAuth, { User } from 'next-auth';
import WorkspaceProvider from '@/providers/workspaceProvider';
import { WorkspaceUser, SessionUser } from '@/types';
import { AdapterUser } from 'next-auth/adapters';
import { isWorkspaceUser } from '@/service/utils';


export default NextAuth({
    providers: [ WorkspaceProvider ],
    secret: process.env.secret,
    session: { strategy: 'jwt' }, 
    
    // Change this in production
    debug: true,

    // Custom Pages Override
    pages: {
        signIn: '/login'
    },

    // Custom Provider Callbacks
    callbacks: {
        async jwt({ token, user }: { token: any; user: AdapterUser | User | WorkspaceUser | undefined }) {
            if (user && isWorkspaceUser(user)) {
                token.id = user.id;
                token.workspaceId = user.workspaceId as unknown as string;
                token.role = user.role;
            }
            console.log("Token in jwt callback: ", token)
            return token;
        },
        async session({ session, user, token }) {
            if (token && session) {
                const { id, workspaceId, name, role } = token;
                if (id && workspaceId && role) {
                    const sessionUser: SessionUser = {
                        ...user,
                        id: id as string,
                        workspaceId: workspaceId as string,
                        name: name as string,
                        role: role as string
                    };
                    session.user = sessionUser;
                }
            }
            console.log("Session in session callback: ", session);
            return session;
        }
    }
});
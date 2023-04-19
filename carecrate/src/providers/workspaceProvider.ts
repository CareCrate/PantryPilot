import { CredentialsConfig } from 'next-auth/providers';
import { RequestInternal } from 'next-auth';
import { db } from '../firebase/initFirebase';
import { collection , query, where, getDocs, doc } from 'firebase/firestore';
import { WorkspaceUser, WorkspaceCredentials } from '@/types';

const WorkspaceProvider: CredentialsConfig = {
    id: "workspace",
    name: "Workspace",
    type: "credentials",
    credentials: {
        email: { label: "Email", type: "text", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
        workspace: { label: "Workspace", type: "text", placeholder: "myworkspace" },
    },
    authorize: async (credentials: Record<string, string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) => {
        if (!credentials) {
            return null;
        }
        const workspaceCredentials: WorkspaceCredentials = {
            workspace: credentials.workspace,
            email: credentials.email,
            password: credentials.password
        };
        const user = await validateWorkspaceCredentials(workspaceCredentials);
        if (user) {
            return { ...user, account: { workspaceId: user.workspaceId }};
        }
        return Promise.resolve(null);
    }
};

async function validateWorkspaceCredentials(credentials: WorkspaceCredentials): Promise<WorkspaceUser | null> {
    try {
        const { email, password, workspace } = credentials;
        const workspaceSnapshot = await getDocs(query(collection(db, "workspaces"), where("name", "==", workspace)));
        if (workspaceSnapshot.empty) {
            return null;
        }
        const workspaceId = workspaceSnapshot.docs[0].id;
        const userSnapshot = await getDocs(query(collection(doc(db, "workspaces", workspaceId), "users"), where("email", "==", email), where("password", "==", password)));
        if (userSnapshot.empty) {
            return null;
        }
        const userData = userSnapshot.docs[0].data();
        const userId = userSnapshot.docs[0].id;
        const user: WorkspaceUser = {
            id: userId,
            workspaceId: parseInt(workspaceId),
            name: userData.name,
            email: userData.email,
            role: userData.role
        }
        console.log("Fetched user from Firestore: ", user);
        return user;
    } catch (error) {
        console.error("Error validating workspace creds: ", error);
        return null;
    }
}

export default WorkspaceProvider;
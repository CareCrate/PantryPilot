import { WorkspaceUser } from "@/types";
import { User } from "next-auth";

export function isWorkspaceUser(user: User | WorkspaceUser): user is WorkspaceUser {
    return "workspaceId" in user;
}

export function isWorkspaceUserInSession(user: any): user is WorkspaceUser {
    return user && "workspaceId" in user;
}
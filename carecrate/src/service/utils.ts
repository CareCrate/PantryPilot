import { WorkspaceUser } from "@/types";
import { User } from "next-auth";

export function isWorkspaceUser(user: User | WorkspaceUser): user is WorkspaceUser {
    return "workspaceId" in user;
}

export function isWorkspaceUserInSession(user: any): user is WorkspaceUser {
    return user && "workspaceId" in user;
}

export async function updateSession(user: Partial<WorkspaceUser>) {
  const response = await fetch('http://localhost:3000/api/auth/update-session', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred while updating the session.');
  }

  return await response.json();
}

export async function saveSession(user: Partial<WorkspaceUser>) {
  await updateSession(user);
}
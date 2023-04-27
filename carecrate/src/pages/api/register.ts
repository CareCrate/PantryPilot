import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/initFirebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const { workspace, name, email, password } = req.body;
    try {
        // Check if Possible Duplicate Exists
        const workspaceSnapshot = await getDocs(query(collection(db, 'workspaces'), where('name', '==', workspace)));
        if (!workspaceSnapshot.empty) {
            res.status(400).json({ message: 'A workspace with this name already exists' });
            console.log('An error occurred while creating the workspace and admin user because the workspace name already exists. Please choose a new workspace name.');
            return;
        }
        // New Workspace
        const workspaceRef = collection(db, 'workspaces');
        const workspaceDoc = await addDoc(workspaceRef, { name: workspace });
        // New Admin User
        const usersRef = collection(workspaceDoc, 'users');
        const userDoc = await addDoc(usersRef, { email, name, password, role: 'admin' });
        res.status(201).json({ message: 'Workspace and admin user created successfully' });
        console.log('Workspace and admin user created successfully');
    } catch(error) {
        console.error('Error creating workspace and admin user:', error);
        res.status(500).json({ message: 'An error occurred while creating the workspace and admin user' });
        console.log('An error occurred while creating the workspace and admin user:', error);
    }
}
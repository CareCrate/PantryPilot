import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const currentSession = await getSession({ req });
      const updatedUser = JSON.parse(req.body);

      if (currentSession) {
        const newSession: Session = {
          ...currentSession,
          user: { ...currentSession.user, ...updatedUser },
        };

        res.status(200).json(newSession);
      } else {
        res.status(400).json({ error: 'No session found.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the session.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}

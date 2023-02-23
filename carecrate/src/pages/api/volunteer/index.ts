import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import * as credentials from "../../../../firebase-key.json";
import type { Volunteer } from "../../../types";

// TODO: try/catch, promise, etc.

admin.initializeApp({
  credential: admin.credential.cert(credentials as admin.ServiceAccount),
});

const db = admin.firestore();
const collectionName: string = "volunteers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const volunteer: Volunteer = req.body;
    const id: string = volunteer.phoneNumber;
    const response = db.collection(collectionName).doc(id).set(volunteer);
    res.status(201).send(response);
  }
}

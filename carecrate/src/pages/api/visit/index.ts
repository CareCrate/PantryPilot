import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import * as credentials from "../../../../firebase-key.json";
import type { Visit } from "../../../types";

// TODO: try/catch, promise, etc.

admin.initializeApp({
  credential: admin.credential.cert(credentials as admin.ServiceAccount),
});

const db = admin.firestore();
const collectionName: string = "visits";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const visit: Visit = req.body;
    const id: string = visit.visitId;
    const response = db.collection(collectionName).doc(id).set(visit);
    res.status(201).send(response);
  }
}

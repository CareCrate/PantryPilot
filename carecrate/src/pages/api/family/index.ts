import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import * as credentials from "../../../../firebase-key.json";
import type { Family } from "../../../types";

// TODO: try/catch, promise, etc.

admin.initializeApp({
  credential: admin.credential.cert(credentials as admin.ServiceAccount),
});

const db = admin.firestore();
const collectionName: string = "families";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const family: Family = req.body;
    const id: string = family.phoneNumber;
    const response = db.collection(collectionName).doc(id).set(family);
    res.status(201).send(response);
  }
}

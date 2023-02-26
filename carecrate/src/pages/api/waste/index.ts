import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import * as credentials from "../../../../firebase-key.json";
import type { Waste } from "../../../types";

admin.initializeApp({
  credential: admin.credential.cert(credentials as admin.ServiceAccount),
});

const db = admin.firestore();
const collectionName: string = "waste";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const waste: Waste = req.body;
    const id: string = waste.timeOfWaste; // Waste is stored by its timestamp
    const response = db.collection(collectionName).doc(id).set(waste); //add waste to db
    res.status(201).send(response);
  }
}

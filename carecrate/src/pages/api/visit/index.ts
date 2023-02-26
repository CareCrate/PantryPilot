import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as credentials from "../../../../firebase-key.json";
import type { Visit } from "../../../types";

admin.initializeApp({
  credential: admin.credential.cert(credentials as admin.ServiceAccount),
});

const db = admin.firestore();
const collectionName: string = "visits";

/**
 * Update the family's array of visits each time they check in.
 */
function updateFamilyVisits(
  timestamp: string,
  family: admin.firestore.DocumentReference<admin.firestore.DocumentData>
) {
  family.update({
    visits: FieldValue.arrayUnion(timestamp),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const visit: Visit = req.body;
    const id: string = visit.timeOfVisit; //visits are stored by their timestamp
    const response = db.collection(collectionName).doc(id).set(visit); //add visit to db
    updateFamilyVisits(id, db.collection("families").doc(req.body.phoneNumber));
    res.status(201).send(response);
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import firebaseApp from "../../../firebase/initFirebase";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import type { Visit } from "../../../types";

const db = getFirestore(firebaseApp);
const collectionName: string = "visits";

/**
 * Update the family's array of visits each time they check in.
 */
async function updateFamilyVisits(
  timestamp: string,
  familyRef: any //TODO: update this type
) {
  await updateDoc(familyRef, {
    visits: arrayUnion(timestamp),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const visit: Visit = req.body;
    const docId: string = visit.timeOfVisit; //visits are stored by their timestamp
    const response = await setDoc(doc(db, collectionName, docId), visit); //add visit to db
    await updateFamilyVisits(docId, doc(db, "families", visit.phoneNumber));
    res.status(201).send(response);
  }
}

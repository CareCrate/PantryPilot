import type { NextApiRequest, NextApiResponse } from "next";
import firebaseApp from "../../../firebase/initFirebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import type { Waste } from "../../../types";

const db = getFirestore(firebaseApp);
const collectionName: string = "waste";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const waste: Waste = req.body;
    const docId: string = waste.timeOfWaste; // Waste is stored by its timestamp
    const response = await setDoc(doc(db, collectionName, docId), waste); //add waste to db
    res.status(201).send(response);
  }
}

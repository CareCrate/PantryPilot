import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/initFirebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import type { Visit } from "../../../types";

const collectionName: string = "visits";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const visit: Visit = req.body;
    const docId: string = visit.id.toString(); //visits are stored by their timestamp
    const response = await setDoc(doc(db, collectionName, docId), visit); //add visit to db

    // update the family's array of visits each time they check in.
    await updateDoc(doc(db, "families", visit.phoneNumber), {
      visits: arrayUnion(docId),
    });
    res.status(201).send(response);
  } else if (req.method === "GET") {
    let timestamp: string = "";
    // verify that the timestamp param is not undefined
    if (req.query.timestamp) {
      timestamp = req.query.timestamp.toString();
    }
    const docRef = doc(db, collectionName, timestamp);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No such document");
    } else {
      console.log("Document Data: ", docSnap.data());
    }
    return res.status(200).send({ status: "Success", data: docSnap.data() });
  }
}

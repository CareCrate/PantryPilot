import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase/initFirebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { Family } from "../../../types";

const collectionName: string = "families";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const family: Family = req.body;
    const docId: string = family.phoneNumber; // Families are stored by their phone numbers
    const response = await setDoc(doc(db, collectionName, docId), family); //add family document to db
    res.status(201).send(response);
  } else if (req.method === "GET") {
    let phoneNumber: string = "";
    // verify that the phone number param is not undefined
    if (req.query.phoneNumber) {
      phoneNumber = req.query.phoneNumber.toString();
    }
    const docRef = doc(db, collectionName, phoneNumber);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No such document");
    } else {
      console.log("Document Data: ", docSnap.data());
    }
    return res.status(200).send({ status: "Success", data: docSnap.data() });
  }
}

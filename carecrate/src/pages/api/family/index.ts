import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import * as credentials from "../../../../firebase-key.json";
import type { Family } from "../../../types";

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
    const id: string = family.phoneNumber; // Families are stored by their phone numbers
    const response = db.collection(collectionName).doc(id).set(family); //add family document to db
    res.status(201).send(response);
  } else if (req.method === "GET") {
    let phoneNumber: string = "";
    // verify that the phone number param is not undefined
    if (req.query.phoneNumber) {
      phoneNumber = req.query.phoneNumber.toString();
    }
    const familiesRef = db.collection(collectionName).doc(phoneNumber);
    const doc = await familiesRef.get();

    if (!doc.exists) {
      console.log("No such document");
    } else {
      console.log("Document Data: ", doc.data());
    }
    return res.status(200).send({ status: "Success", data: doc.data() });
  }
}

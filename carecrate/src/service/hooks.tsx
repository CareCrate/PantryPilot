import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../firebase/initFirebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  collection,
  getDocs,
  where,
  DocumentReference,
  DocumentData,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import type { Family, Visit, Waste } from "../types";
import { useState } from "react";
import { useLocalStorage } from "./localStorage";

/*
1. Create states for each type of data that will be returned from Firebase

2. Create React useEffect Hook which will act as local storage for your whole application. 
Make a new useEffect hook for each type of firebase call

3. Create methods for all the firebase calls that you need and seperate them out into their own methods
*/

// FAMILY FUNCTIONS
const familyCollection: string = "family";

/**
 * Saves a family to the database
 * USAGE: Create new family in check-in modals
 * @param family
 */
export const saveFamily = async (family: Family) => {
  const docId: string = family.phoneNumber; // Families are stored by their phone numbers
  await setDoc(doc(db, familyCollection, docId), family); //add family document to db
};

/**
 * Retries a family from the database
 * USAGE: Pull up existing family in check-in modals
 * @param phoneNumber
 */
export const getFamily = async (phoneNumber: string) => {
  const docRef: DocumentReference<DocumentData> = doc(
    db,
    familyCollection,
    phoneNumber
  );
  const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

  if (!docSnap.exists()) {
    // if no data exists, user should enter family data manually on UI.
    return;
  }

  return docSnap.data();
};

// VISIT FUNCTIONS
const visitsCollection: string = "visits";

/**
 * Adds a new visit to the database
 * USAGE: Checking in a new family with the check-in modals
 * @param visit
 */
export const saveVisit = async (visit: Visit) => {
  const docId: string = visit.id.toString(); //visits are stored by their timestamp
  await setDoc(doc(db, visitsCollection, docId), visit); //add visit to db

  // update the family's array of visits each time they check in.
  await updateDoc(doc(db, "families", visit.phoneNumber), {
    visits: arrayUnion(docId),
  });
};

/**
 * Queries all visits that occur after a certain timestamp
 * USAGE: Listening to changes in the visits collection and updating the table on the dashboard
 */
export const useVisits = () => {
  //State to store the Vistis data
  const [visits, setVisits] = useState<[]>([]);
  // const [visits, setVisits] = useLocalStorage('the key', [values]);

  //Fetch the Vists data
  const q: Query<DocumentData> = query(
    collection(db, "visits"),
    where("id", ">=", 1677449483936) // this can be any timestamp
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const visitDocs: any = [];
    querySnapshot.forEach((doc) => {
      visitDocs.push(doc.data());
    });
    setVisits(visitDocs);
  });

  return visits;
};

//  const [visits, setVisits] = useVisits();

// WASTE FUNCTIONS
const wasteCollection: string = "waste";

export const saveWaste = async (waste: Waste) => {
  const docId: string = waste.timeOfWaste; // Waste is stored by its timestamp
  await setDoc(doc(db, wasteCollection, docId), waste); //add waste to db
};

export const getWaste = async (timestamp: string) => {
  const q: Query<DocumentData> = query(
    collection(db, "waste"),
    where("timeOfWaste", ">=", 1678479399162) // this can be any timestamp
  );
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
  const dataArray: any = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots (comment is from Firebase docs)
    dataArray.push(doc.data());
    console.log(doc.data());
  });
  return dataArray;
};

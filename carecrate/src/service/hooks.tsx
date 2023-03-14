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
import { useEffect, useState } from "react";
import { useLocalStorage } from "./localStorage";

/*
1. Create states for each type of data that will be returned from Firebase

2. Create React useEffect Hook which will act as local storage for your whole application. 
Make a new useEffect hook for each type of firebase call

3. Create methods for all the firebase calls that you need and seperate them out into their own methods
*/

const familyCollection: string = "family";

//TODO: Finish fixing these with proper return statements
export const useFirestore = () => {
  const saveFamily = async (family: Family) => {
    console.log("Trying to save family");
    const docId: string = family.phoneNumber; // Families are stored by their phone numbers
    const set = await setDoc(doc(db, familyCollection, docId), family); //add family document to db
    return set;
  };

  const getFamily = async (phoneNumber: string) => {
    const docRef: DocumentReference<DocumentData> = doc(
      db,
      familyCollection,
      phoneNumber
    );
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

    if (!docSnap.exists()) {
      // if no data exists, user should enter family data manually on UI.
      return "no data";
    }

    console.log(docSnap.data());
    return docSnap.data();
  };

  const saveVisit = async (visit: Visit) => {
    const docId: string = visit.id.toString(); //visits are stored by their timestamp
    await setDoc(doc(db, visitsCollection, docId), visit); //add visit to db

    // update the family's array of visits each time they check in.
    await updateDoc(doc(db, "families", visit.phoneNumber), {
      visits: arrayUnion(docId),
    });
  };

  const saveWaste = async (waste: Waste) => {
    const docId: string = waste.timeOfWaste; // Waste is stored by its timestamp
    await setDoc(doc(db, wasteCollection, docId), waste); //add waste to db
  };

  const getWaste = async (timestamp: string) => {
    // const q: Query<DocumentData> = query(
    //   collection(db, "waste"),
    //   where("timeOfWaste", ">=", 1678479399162) // this can be any timestamp
    // );
    // const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    // const dataArray: any = [];
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots (comment is from Firebase docs)
    //   dataArray.push(doc.data());
    //   console.log(doc.data());
    // });
    // return dataArray;
  };

  return { saveFamily, getFamily, saveVisit, saveWaste, getWaste };
};

// FAMILY FUNCTIONS
// const familyCollection: string = "family";

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

// Update the current phone number whenever it is changed
// useEffect to rerun the logic of useFamily whenever currentPhoneNumber is changed

let currentPhoneNumber = "345";
export const setCurrentPhoneNumber = (phoneNumber: string) => {
  currentPhoneNumber = phoneNumber;
};

export const useFamily = async () => {
  const [family, setFamily] = useState({});

  // useEffect(() => {
  //   const docRef: DocumentReference<DocumentData> = doc(
  //     db,
  //     familyCollection,
  //     currentPhoneNumber
  //   );

  //   const getDocSnap = async () => {
  //     const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setFamily(docSnap.data());
  //     } // else, if family does not exist, send some kind of indication to the DOM so user can enter info manually
  //   };

  //   getDocSnap().catch(console.error);
  // }, [currentPhoneNumber]);

  const docRef: DocumentReference<DocumentData> = doc(
    db,
    familyCollection,
    currentPhoneNumber
  );

  const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
  if (docSnap.exists()) {
    setFamily(docSnap.data());
  } // else, if family does not exist, send some kind of indication to the DOM so user can enter info manually

  // getDocSnap().catch(console.error);
  return family;
};

// VISIT FUNCTIONS
const visitsCollection: string = "visits";

/**
 * Adds a new visit to the database.
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

const compareArrays = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

/**
 * Queries all visits that occur after a certain timestamp.
 * USAGE: Listening to changes in the visits collection and updating the table on the dashboard
 */
export const useVisitsListener = () => {
  const [currentVisits, setCurrentVisits] = useState<[]>([]);
  // const [visits, setVisits] = useLocalStorage('the key', [values]);
  const [tempVisitDocs, setTempVisitDocs] = useState<[]>([]);

  // This listener should only be created on mount, not for every render
  useEffect(() => {
    // Query visits
    const q: Query<DocumentData> = query(
      collection(db, "visits"),
      where("id", ">=", 1678580485135) // This should either be the timestamp of when that day started, or when the user logged in
    );

    // Listen to Query
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const visitDocs: any = [];
      querySnapshot.forEach((doc) => {
        visitDocs.push(doc.data());
        console.log("Snapshot");
      });

      // Only set state when visitDocs changes
      if (!compareArrays(visitDocs, tempVisitDocs)) {
        console.log("Compared visits arrays");
        setTempVisitDocs(visitDocs);
      }
    });
  }, []);

  useEffect(() => {
    setCurrentVisits(tempVisitDocs);
  }, [tempVisitDocs]);

  return currentVisits;
};

//  const [visits, setVisits] = useVisits();

// WASTE FUNCTIONS
const wasteCollection: string = "waste";

export const saveWaste = async (waste: Waste) => {
  const docId: string = waste.timeOfWaste; // Waste is stored by its timestamp
  await setDoc(doc(db, wasteCollection, docId), waste); //add waste to db
};

export const getWaste = async (timestamp: string) => {
  // const q: Query<DocumentData> = query(
  //   collection(db, "waste"),
  //   where("timeOfWaste", ">=", 1678479399162) // this can be any timestamp
  // );
  // const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
  // const dataArray: any = [];
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots (comment is from Firebase docs)
  //   dataArray.push(doc.data());
  //   console.log(doc.data());
  // });
  // return dataArray;
};
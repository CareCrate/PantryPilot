import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../firebase/initFirebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, query, collection, getDocs, where, DocumentReference, DocumentData, DocumentSnapshot, Query, QuerySnapshot, onSnapshot, addDoc, CollectionReference, FieldValue, increment } from "firebase/firestore";
import type { Family, Visit, Weight } from "../types";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./localStorage";

// Collection names
const familyCollection: string = "familyAccounts";
const familySubCollection: string = "families";
const visitsCollection: string = "visits";
const wasteCollection: string = "waste";
const driveInWeightCollection: string = "driveInWeight";
const reportsCollection: string = "reports";
const startOfDay: number = new Date().setUTCHours(0, 0, 0, 0); //TODO: fix this time
const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();
const currentMonth: string = months[date.getMonth()] + " " + date.getFullYear();

export const useFirestore = () => {
  const newSaveFamily = async (family: Family) => {
    console.log("New Save Family");
    const docId: string = family.phoneNumber;
    const familyID: string = family.firstName + " " + family.lastName;
    const docRef: DocumentReference<DocumentData> = doc(db, familyCollection, docId, familySubCollection, familyID);

    const save = async () => {
      await setDoc(docRef, family);
    };

    save();
  };

  const queryFamilies = async (phoneNumber: string) => {
    const docId: string = phoneNumber;
    const docRef: DocumentReference<DocumentData> = doc(db, familyCollection, docId);
    const colRef: CollectionReference<DocumentData> = collection(docRef, familySubCollection);

    const q = query(colRef);
    let families: any = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      families.push(doc.data());
    });

    return families;
  };

  const saveVisit = async (visit: Visit) => {
    const docId: string = visit.id.toString(); //visits are stored by their timestamp

    const save = async () => {
      await setDoc(doc(db, visitsCollection, docId), visit); //add visit to db
    };

    const docRef: DocumentReference<DocumentData> = doc(db, familyCollection, visit.phoneNumber, familySubCollection, visit.firstName + " " + visit.lastName);

    // update the family's array of visits each time they check in.
    const update = async () => {
      await updateDoc(docRef, {
        visits: arrayUnion(docId)
      });
    };

    save();
    update();
  };

  const saveWaste = async (waste: number) => {
    const docRef = doc(db, reportsCollection, currentMonth);
    const docSnap = await getDoc(docRef);

    // if not exist, save initial data. If does exist, increment data
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        totalHouseholds: 0,
        numInHousehold: 0,
        numChildren: 0,
        numElderly: 0,
        foodWeight: 0,
        wasteWeight: waste
      });
    } else {
      const update = async () => {
        await updateDoc(docRef, {
          wasteWeight: increment(waste)
        });
      };

      update();
    }
  };

  const updateFoodWeight = async (weight: number) => {
    const docId: string = "weight";
    const weightDoc = {
      weight
    };

    const save = async () => {
      await setDoc(doc(db, driveInWeightCollection, docId), weightDoc);
    };

    save();
  };

  const getMonthlyReport = async (id: string) => {
    const docRef = doc(db, "reports", id);
    const docSnap = await getDoc(docRef);

    console.log(docSnap.data());

    // return docSnap.data();
  };

  return {
    newSaveFamily,
    queryFamilies,
    saveVisit,
    saveWaste,
    updateFoodWeight,
    getMonthlyReport
  };
};

export const useVisitsListener = () => {
  const [currentVisits, setCurrentVisits] = useState<[]>([]);
  // const [visits, setVisits] = useLocalStorage('the key', [values]);
  const effectHasRun = useRef(false);

  // This listener should only be created on mount, not for every render
  useEffect(() => {
    if (!effectHasRun.current) {
      // Query visits
      const q: Query<DocumentData> = query(
        collection(db, visitsCollection),
        where("id", ">=", startOfDay) // This should either be the timestamp of when that day started, or when the user logged in
      );

      // Listen to Query
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const visitDocs: any = [];
        querySnapshot.forEach(doc => {
          visitDocs.push(doc.data());
        });

        setCurrentVisits(visitDocs.reverse());
      });

      return () => {
        effectHasRun.current = true;
      };
    }
  }, []);

  return currentVisits;
};

export const useDriveInWeightListener = (): Weight => {
  const [driveInWeight, setDriveInWeight] = useState<Weight>();
  let weight: any = {};
  const effectHasRun = useRef(false);

  useEffect(() => {
    if (!effectHasRun.current) {
      const unsubscribe = onSnapshot(doc(db, driveInWeightCollection, "weight"), doc => {
        console.log(`Data`);
        console.log(doc.data());
        if (doc.data()) {
          weight = doc.data();
        }

        setDriveInWeight(weight);
      });

      return () => {
        effectHasRun.current = true;
      };
    }
  }, []);

  return driveInWeight ? driveInWeight : { weight: 0 };
};

export const useReportGenerator = () => {
  const generate = async (numInHousehold: number, numChildren: number, numElderly: number, foodWeight: number) => {
    const docRef = doc(db, reportsCollection, currentMonth);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        totalHouseholds: 1,
        numInHousehold,
        numChildren,
        numElderly,
        foodWeight,
        wasteWeight: 0
      });
    } else {
      const update = async () => {
        await updateDoc(docRef, {
          totalHouseholds: increment(1),
          numInHousehold: increment(numInHousehold),
          numChildren: increment(numChildren),
          numElderly: increment(numElderly),
          foodWeight: increment(foodWeight)
        });
      };

      update();
    }
  };

  return { generate };
};

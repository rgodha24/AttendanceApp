import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
   apiKey: "AIzaSyCsS2X6EmlFI-_RlkAtrAGU2JDrjBWuwc4",
   authDomain: "brophyattendance-v2.firebaseapp.com",
   databaseURL: "https://brophyattendance-v2-default-rtdb.firebaseio.com",
   projectId: "brophyattendance-v2",
   storageBucket: "brophyattendance-v2.appspot.com",
   messagingSenderId: "789299971852",
   appId: "1:789299971852:web:6bdd247aee0a530fcc2b29",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);

import firebase from 'firebase/compat/app';
import { Firestore, getFirestore } from "firebase/firestore";

const FIREBASE_PROD = {
  apiKey: "AIzaSyCgeY9tB_-okdEw18DWw44WwoPr4SHUfsc",
  authDomain: "idea-hacks-2022.firebaseapp.com",
  projectId: "idea-hacks-2022",
  storageBucket: "idea-hacks-2022.appspot.com",
  messagingSenderId: "14411425444",
  appId: "1:14411425444:web:9e455baef0e1c20b34a831",
  measurementId: "G-STQYVHZD7X"
};

const app =
  !firebase.apps.length
    ? (firebase.initializeApp(FIREBASE_PROD))
    : firebase.app();

export class _Firebase {
  public readonly db: Firestore = getFirestore();
}

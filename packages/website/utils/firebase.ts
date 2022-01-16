import firebase from 'firebase/compat/app';
import { doc, Firestore, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";

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


interface PutProps {
  path: string;
  data: Record<string, any>;
  defaults?: Record<string, any>;
}

export class _Firebase {
  public readonly db: Firestore = getFirestore();

  public doc(path: string) {
    return doc(this.db, path);
  }

  public async put({path, data, defaults = {}}: PutProps): Promise<boolean> {
    const item = await getDoc(this.doc(path));
    const action = item.exists()
      ? updateDoc(this.doc(path), data)
      : setDoc(this.doc(path), {...data, ...defaults});

    return action
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}

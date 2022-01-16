import firebase from 'firebase/compat/app';
import { arrayUnion, doc, Firestore, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";

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

interface PutFieldProps {
  path: string;
  key: string;
  value: any;
}

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
    const docRef = this.doc(path);
    const item = await getDoc(docRef);
    const action = item.exists()
      ? updateDoc(docRef, data)
      : setDoc(docRef, {...data, ...defaults});

    return action
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  public async updateArrayField({path, key, value}: PutFieldProps): Promise<boolean> {
    const docRef = this.doc(path);
    const item = await getDoc(docRef);
    if (!item.exists) return false;
    return updateDoc(docRef, {[key]: arrayUnion(value)})
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "./firebase";

export const saveUser = (user: User) =>
  setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  );
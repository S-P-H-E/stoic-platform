"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { DocumentReference, doc, getDoc, setDoc } from "firebase/firestore";

// Define types for user and context
interface User {
  uid: string;
  email: string | null;
  name: string | null;
  photoUrl: string | null;
}

interface FirebaseContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// Create the Firebase context
const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

// Create a FirebaseProvider component
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userObj: User = {
          uid: authUser.uid,
          email: authUser.email,
          name: authUser.displayName,
          photoUrl: authUser.photoURL,
        };

        // Check if the user document already exists in Firestore
        const userDocRef: DocumentReference = doc(db, "users", userObj.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // User document does not exist, set the status to "user"
          await saveUserDataToFirestore(userObj);
        }

        setUser(userObj);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const saveUserDataToFirestore = async (user: User) => {
    try {
      const userDocRef: DocumentReference = doc(db, "users", user.uid);
      const userData = { ...user, status: "user" }; // Add the "status" field
      await setDoc(userDocRef, userData, { merge: true });
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, signInWithGoogle, signOut, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/utils/firebase';
import { User } from 'firebase/auth';

const UserDataFetcherContext = createContext(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Specify the correct type


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    //@ts-expect-error
    <UserDataFetcherContext.Provider value={ user }>
      {children}
    </UserDataFetcherContext.Provider>
  );
};

// custom hook to get userName, userId, and user.email etc.
export function UserDataFetcher() {
  const [user, fetching] = useAuthState(auth);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', user.email));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserName(userData.name);
          setUserId(querySnapshot.docs[0].id);
        }
      });

      return unsubscribe; // Unsubscribe cuz if you dont it will create memory leaks 😠
    }
  }, [user]);

  return { userName, user, userId, fetching };
}

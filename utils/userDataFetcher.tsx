"use client"

import { useEffect, useState, ReactNode } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/utils/firebase';
import { useRouter } from 'next/navigation';

// custom hook to get userName, userId, and user.email etc.
export function UserDataFetcher() {
  const [user, fetching] = useAuthState(auth);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLastLesson, setUserLastLesson] = useState(null);

  const router = useRouter()

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // Things to do when user is authenticated
      } else {
        router.push('/')
      }
    });

    if (user) {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', user.email));
      
      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
            setUserLastLesson(userData.lastlesson);
            setUserName(userData.name);
            setUserId(querySnapshot.docs[0].id);
        }
      });

      return () => {
        unsubscribeAuth();
        unsubscribeFirestore();
      };
    }

    return unsubscribeAuth;
  }, [user, router]);

  return { userName, userLastLesson, user, userId, fetching };
}
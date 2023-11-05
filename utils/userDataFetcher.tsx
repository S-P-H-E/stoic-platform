"use client"

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/utils/firebase';
import { useRouter } from 'next/navigation';

// custom hook to get userName, userId, and user.email etc.
export function UserDataFetcher() {
  const [user, fetching] = useAuthState(auth);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>();
  const [generalLastCourse, setGeneralLastCourse] = useState('')
  const [generalLastLesson, setGeneralLastLesson] = useState('')

  const router = useRouter()

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // Things to do when user is authenticated
      } else {
        router.push('/')
      }
    }); // push to buy premium page

    if (user) {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', user.email));
      
      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
            setUserName(userData.name);
            setUserStatus(userData.status);
            setUserId(querySnapshot.docs[0].id);
            setGeneralLastCourse(userData.generalLastCourse);
            setGeneralLastLesson(userData.generalLastLesson)

            const newUserStatus = userData.status;
            setUserStatus(newUserStatus);
/*          if (newUserStatus === "free") {
            router.push('/upgrade');
            } */
        }
      });

      return () => {
        unsubscribeAuth();
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
        }
      };
    }

    return unsubscribeAuth;
  }, [user, router]);

  return { generalLastCourse, generalLastLesson, userName, userStatus, user, userId, fetching };
}
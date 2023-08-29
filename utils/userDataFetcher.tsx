
"use client"

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';

export function UserDataFetcher() {
  const [user, loading] = useAuthState(auth);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (user) {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', user.email));
      getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserName(userData.name);
        }
      });
    }
  }, [user]);

  return { userName, user, loading };
}

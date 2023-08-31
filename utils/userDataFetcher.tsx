"use client"

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/utils/firebase';

export function UserDataFetcher() {
  const [user, loading] = useAuthState(auth);
  const [userName, setUserName] = useState(null);
  const [profile, setProfile] = useState()

  const [userId, setUserId] = useState<string | null>(null); // Explicitly define the type


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
  
      return unsubscribe; // Unsubscribe from the listener when component unmounts
    }
  }, [user]);

<<<<<<< HEAD
  return { userName, user, loading, profile };
=======
  return { userName, user, loading, userId };
>>>>>>> refs/remotes/origin/main
}

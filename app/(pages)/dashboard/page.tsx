"use client"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';

export default function Dashboard() {
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

  return (
    <div className='h-screen flex flex-col ml-[16rem] m-4'>
      <div>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
      </div>
      <div className="flex flex-col">
        <p>Welcome, {userName ? userName : 'loading...'}</p>
        <p>Your email address: {userName ? user?.email : "loading..."}</p>
      </div>
    </div>
  );
}

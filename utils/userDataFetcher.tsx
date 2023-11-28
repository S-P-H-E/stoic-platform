"use client"

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/utils/firebase';
import { useRouter } from 'next/navigation';

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}
// custom hook to get userName, userId, and user.email etc.
export function UserDataFetcher() {
  const [user, fetching] = useAuthState(auth);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>();
  const [userRoles, setUserRoles] = useState<Role[] | "User">();
  const [userEmail, setUserEmail] = useState<string>();
  const [generalLastCourse, setGeneralLastCourse] = useState('')
  const [generalLastLesson, setGeneralLastLesson] = useState('')
  const [userProfileImageUrl, setUserProfileImageUrl] = useState('')
  const [userProfileBannerUrl, setUserProfileBannerUrl] = useState('')

  const [roles, setRoles] = useState<Role[]>([]);

  const router = useRouter()

  useEffect(() => {
    const rolesCollection = collection(db, 'roles');

    const unsubscribe = onSnapshot(rolesCollection, (snapshot) => {
      const rolesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        color: doc.data().color,
        order: doc.data().order,
      }));
      setRoles(rolesData);
    });

    return () => unsubscribe();
  }, []);

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

          const userRoles = userData.roles && userData.roles.map((roleName: string) => {
            const role = roles.find((r) => r.name === roleName);
            return role || { name: roleName, color: 'white' }; // Default color if role not found
          });

            setUserName(userData.name);
            setUserEmail(userData.email);
            setUserProfileBannerUrl(userData.bannerUrl);
            setUserStatus(userData.status);
            setUserRoles(userRoles || "User")
            setUserId(querySnapshot.docs[0].id);
            setUserProfileImageUrl(userData.photoUrl)
            setGeneralLastCourse(userData.generalLastCourse);
            setGeneralLastLesson(userData.generalLastLesson)

            const newUserStatus = userData.status;
            setUserStatus(newUserStatus);
/*          if (newUserStatus === "user") {
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
  }, [user, router, roles]);

  return { userRoles, generalLastCourse, userEmail, generalLastLesson, userName, userStatus, user, userId, fetching, userProfileImageUrl, userProfileBannerUrl};
}
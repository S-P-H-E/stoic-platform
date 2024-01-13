"use client"

import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

export function UserDataFetcherById(userId: string) {
  const [userName, setUserName] = useState(null);
  const [userStatus, setUserStatus] = useState<string>();
  const [userRoles, setUserRoles] = useState<Role[] | "User">();
  const [userEmail, setUserEmail] = useState<string>();
  const [generalLastCourse, setGeneralLastCourse] = useState('')
  const [generalLastLesson, setGeneralLastLesson] = useState('')
  const [userProfileImageUrl, setUserProfileImageUrl] = useState('')
  const [userProfileBannerUrl, setUserProfileBannerUrl] = useState('')
  const [userStripeId, setUserStripeId] = useState('')
  const [userDescription, setUserDescription] = useState('')

  const [roles, setRoles] = useState<Role[]>([]);

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
    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      const userData = docSnapshot.data();

      if (userData) {
        const userRoles = userData.roles && userData.roles.map((roleName: string) => {
          // Assuming roles data is already fetched and available globally
          const role = roles.find((r) => r.name === roleName);
          return role || { name: roleName, color: 'white' };
        });

        setUserName(userData.name);
        setUserEmail(userData.email);
        setUserProfileBannerUrl(userData.bannerUrl);
        setUserStatus(userData.status);
        setUserRoles(userRoles || "User")
        setUserProfileImageUrl(userData.photoUrl)
        setGeneralLastCourse(userData.generalLastCourse);
        setGeneralLastLesson(userData.generalLastLesson)
        setUserStripeId(userData.stripe_customer_id);
        setUserDescription(userData.description)
      }
    });

    return () => unsubscribe();
  }, [userId, roles]);

  return { userDescription, userStripeId, userRoles, generalLastCourse, userEmail, generalLastLesson, userName, userStatus, userProfileImageUrl, userProfileBannerUrl };
}

"use client"

import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import {Activity, SocialInfo} from "@/types/types";

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

export function UserDataFetcherById(userId: string) {
  const [userUid, setUserUid] = useState(undefined);
  const [userName, setUserName] = useState(null);
  const [userStatus, setUserStatus] = useState<string>();
  const [userRoles, setUserRoles] = useState<Role[] | "User">();
  const [userEmail, setUserEmail] = useState<string>();
  const [generalLastCourse, setGeneralLastCourse] = useState('')
  const [generalLastLesson, setGeneralLastLesson] = useState('')
  const [userProfileImageUrl, setUserProfileImageUrl] = useState('')
  const [userProfileBannerUrl, setUserProfileBannerUrl] = useState('')
  const [userStripeId, setUserStripeId] = useState('')
  const [userSocial, setUserSocial] = useState<SocialInfo>({});
  const [userDescription, setUserDescription] = useState('')
  const [userOnboarding, setUserOnboarding] = useState(false)
  const [userCreatedAt, setUserCreatedAt] = useState<Date | undefined>(undefined)
  const [userEmailVerified, setUserEmailVerified] = useState(false)
  const [userActivities, setUserActivities] = useState<Activity[]>([]);

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
          const role = roles.find((r) => r.name === roleName);
          return role || { name: roleName, color: 'white' };
        });

        setUserName(userData.name);
        setUserEmail(userData.email);
        setUserProfileBannerUrl(userData.bannerUrl);
        setUserStatus(userData.status);
        setUserRoles(userRoles || "User");
        setUserProfileImageUrl(userData.photoUrl);
        setGeneralLastCourse(userData.generalLastCourse);
        setGeneralLastLesson(userData.generalLastLesson);
        setUserStripeId(userData.stripe_customer_id);
        setUserDescription(userData.description);
        setUserSocial(userData.social);
        setUserOnboarding(userData.onboarding);
        setUserEmailVerified(userData.emailVerified);
        setUserCreatedAt(userData.createdAt);
        setUserUid(userData.uid);
      }
    });

    const activitiesRef = collection(db, `users/${userId}/activities`);
    const activitiesQuery = query(activitiesRef);

    const unsubscribeActivities = onSnapshot(activitiesQuery, (activitiesSnapshot) => {
      const activitiesData = activitiesSnapshot.docs.map(doc => doc.data() as Activity);
      setUserActivities(activitiesData);
    });

    return () => {
      unsubscribe();
      unsubscribeActivities();
    };
  }, [userId, roles]);


  return { userActivities, userUid, userEmailVerified, userCreatedAt, userDescription, userSocial, userStripeId, userRoles, generalLastCourse, userEmail, generalLastLesson, userName, userOnboarding, userStatus, userProfileImageUrl, userProfileBannerUrl };
}

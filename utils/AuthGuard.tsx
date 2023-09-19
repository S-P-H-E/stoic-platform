"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { UserDataFetcher } from './userDataFetcher';

interface AuthGuardProps {
  children: React.ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const {userStatus} = UserDataFetcher()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (userStatus === 'free') {
      router.push('/upgrade');
    }
  }, [loading, user, userStatus, router]);

  return <>{children}</>;
}

export default AuthGuard;
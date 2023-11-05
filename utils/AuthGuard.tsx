"use client"

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { UserDataFetcher } from './userDataFetcher';

interface AuthGuardProps {
  children: React.ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  const {userStatus} = UserDataFetcher()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } 
    else if (userStatus !== 'premium' && pathname == '/') {
      router.push('/dashboard')
    }
/*  else if (userStatus === 'user' && pathname !== '/upgrade') {
      router.push('/upgrade');
    } */
    console.log(userStatus)
  }, [loading, user, userStatus, router, pathname]);

  return <>{children}</>;
}

export default AuthGuard;
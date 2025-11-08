'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth'; // Corrected import
import { useAuth } from '@/firebase/provider'; // Adjusted import path

export interface UserAuthHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export function useUser(): UserAuthHookResult {
  const auth = useAuth();
  const [state, setState] = useState<UserAuthHookResult>({
    user: auth.currentUser,
    isUserLoading: !auth.currentUser,
    userError: null,
  });

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setState({ user, isUserLoading: false, userError: null });
      },
      (error) => {
        setState({ user: null, isUserLoading: false, userError: error });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return state;
}

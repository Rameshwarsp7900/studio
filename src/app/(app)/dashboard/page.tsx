'use client';

import { UserCard } from '@/components/user-card';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfileDialog } from '@/components/user-profile-dialog';
import { useState } from 'react';
import type { User as UserData } from '@/lib/data';
import { sampleUsers } from '@/lib/sample-data';

export default function DashboardPage() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserData>(usersCollectionRef);

  const handleUserCardClick = (user: UserData) => {
    setSelectedUser(user);
  }

  const handleDialogClose = () => {
    setSelectedUser(null);
  }
  
  // Filter out the current user from the list
  const otherUsers = users?.filter(u => u.id !== currentUser?.uid);

  // If there are no other users from Firestore, show the sample users.
  // This ensures the page is populated for new users.
  const displayUsers = (!isLoading && otherUsers && otherUsers.length > 0) ? otherUsers : sampleUsers.filter(u => u.id !== 'current-user-placeholder');


  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Here are some people we think you'll vibe with.</p>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-32 w-full rounded-lg" />
                      <div className="space-y-2 pt-10">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayUsers.map((user) => (
                    <UserCard key={user.id} user={user} onClick={() => handleUserCardClick(user)} />
                ))}
            </div>
        )}
      </div>

      <UserProfileDialog
        isOpen={!!selectedUser}
        user={selectedUser}
        onClose={handleDialogClose}
      />
    </>
  );
}

'use client';

import { UserCard } from '@/components/user-card';
import { getSkillRecommendations } from '@/ai/flows/skill-recommendations';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfileDialog } from '@/components/user-profile-dialog';
import { useState } from 'react';
import type { User as UserData } from '@/lib/data';


export default function DashboardPage() {
  const firestore = useFirestore();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserData>(usersCollectionRef);

  // Example of how to use the GenAI flow.
  // For this build, we will use static mock data.
  // const recommendations = await getSkillRecommendations({
  //   profile: "...",
  //   skillsOffered: ["React"],
  //   skillsSought: ["Node.js"],
  //   location: "San Francisco, CA",
  // });

  const handleUserCardClick = (user: UserData) => {
    setSelectedUser(user);
  }

  const handleDialogClose = () => {
    setSelectedUser(null);
  }

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
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users?.map((user) => (
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

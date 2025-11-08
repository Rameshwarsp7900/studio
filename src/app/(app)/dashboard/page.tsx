'use client';

import { UserCard } from '@/components/user-card';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfileDialog } from '@/components/user-profile-dialog';
import { useState } from 'react';
import type { User as UserData } from '@/lib/data';
import { sampleUsers } from '@/lib/sample-data';
import { DashboardHeader } from '@/components/dashboard-header';

export default function DashboardPage() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredUsers = displayUsers.filter(user => {
    const query = searchQuery.toLowerCase();
    const nameMatch = user.fullName.toLowerCase().includes(query);
    const offeredSkillMatch = user.skillsOffered?.some(skill => skill.name.toLowerCase().includes(query));
    const soughtSkillMatch = user.skillsSought?.some(skill => skill.name.toLowerCase().includes(query));
    return nameMatch || offeredSkillMatch || soughtSkillMatch;
  });


  return (
    <>
       <DashboardHeader onSearchChange={setSearchQuery} />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="h-[400px] w-full rounded-lg" />
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredUsers.map((user) => (
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

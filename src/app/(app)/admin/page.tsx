'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc, increment } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function AdminPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading: areUsersLoading } = useCollection(usersCollectionRef);

  const [creditsToAdd, setCreditsToAdd] = useState<{ [key: string]: number }>({});

  if (isProfileLoading) {
    return <div>Loading admin status...</div>;
  }

  if (!userProfile?.isAdmin) {
    router.push('/dashboard');
    return null;
  }

  const handleAddCredits = (userId: string) => {
    const amount = creditsToAdd[userId];
    if (!amount || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a positive number of credits.',
      });
      return;
    }

    const targetUserDocRef = doc(firestore, 'users', userId);
    updateDocumentNonBlocking(targetUserDocRef, {
      creditsBalance: increment(amount),
    });

    toast({
      title: 'Credits Added',
      description: `Successfully added ${amount} credits to the user.`,
    });

    setCreditsToAdd(prev => ({ ...prev, [userId]: 0 }));
  };

  const handleCreditInputChange = (userId: string, value: string) => {
    const amount = parseInt(value, 10);
    setCreditsToAdd(prev => ({ ...prev, [userId]: isNaN(amount) ? 0 : amount }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Admin Panel</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View users and manage their credit balances.</CardDescription>
        </CardHeader>
        <CardContent>
          {areUsersLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Credits</TableHead>
                  <TableHead className="w-[250px]">Add Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map(u => {
                   const avatar = PlaceHolderImages.find(p => p.id === 'user-1'); // Simplified avatar
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {avatar && <AvatarImage src={avatar.imageUrl} />}
                            <AvatarFallback>{u.fullName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{u.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.creditsBalance}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Amount"
                            className="w-24 h-9"
                            value={creditsToAdd[u.id] || ''}
                            onChange={(e) => handleCreditInputChange(u.id, e.target.value)}
                            min="1"
                          />
                          <Button size="sm" onClick={() => handleAddCredits(u.id)}>Add</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPage;

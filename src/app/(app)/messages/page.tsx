
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import Link from "next/link";
import type { User, Conversation } from '@/lib/data';
import { MessageSquare } from "lucide-react";
import { sampleUsers, sampleConversations } from "@/lib/sample-data";


function getOtherUser(conversation: any, currentUserId: string, users: User[] | null) {
  if (!users) return null;
  const otherUserId = conversation.user1Id === currentUserId ? conversation.user2Id : conversation.user1Id;
  return users.find(u => u.id === otherUserId);
}

export default function MessagesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: usersFromDB, isLoading: areUsersLoading } = useCollection<User>(usersCollectionRef);

  const conversationsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'conversations'),
      where('memberIds', 'array-contains', user.uid)
    );
  }, [firestore, user]);

  const { data: conversationsFromDB, isLoading: areConversationsLoading, error } = useCollection<Conversation>(conversationsQuery);

  const isLoading = areUsersLoading || areConversationsLoading;

  const displayUsers = (!isLoading && usersFromDB && usersFromDB.length > 0) ? usersFromDB : sampleUsers;
  const displayConversations = (!isLoading && conversationsFromDB && conversationsFromDB.length > 0) ? conversationsFromDB : sampleConversations;

  const userAvatars: {[key: string]: any} = {};
  if (displayUsers) {
    displayUsers.forEach(u => {
        // A placeholder mapping. In a real app, this would be `u.profilePictureUrlId`
        userAvatars[u.id] = PlaceHolderImages.find(p => p.id === 'user-1'); 
    });
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Messages</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Conversations</CardTitle>
          <CardDescription>Select a conversation to view messages.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-destructive">Error loading conversations. Please check security rules.</p>}
          {!isLoading && displayConversations && displayConversations.length > 0 && (
             <div className="space-y-2">
                {displayConversations.map((convo) => {
                    const currentUserId = user ? user.uid : 'current-user-placeholder';
                    const otherUser = getOtherUser(convo, currentUserId, displayUsers);
                    const avatar = otherUser ? userAvatars[otherUser.id] : null;
                    return (
                        <Link href="#" key={convo.id} className="block hover:bg-accent rounded-lg p-3">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt="User avatar" />}
                                    <AvatarFallback>{otherUser ? otherUser.fullName.charAt(0) : '?'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{otherUser?.fullName || 'Unknown User'}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {convo.lastMessage || 'No messages yet...'}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
          )}
           {!isLoading && (!displayConversations || displayConversations.length === 0) && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">No conversations yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start a conversation with someone from the Discover page.
              </p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

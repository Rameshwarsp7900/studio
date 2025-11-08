'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import Link from "next/link";
import { users } from "@/lib/data"; // for mock data

function getOtherUser(conversation: any, currentUserId: string) {
  const otherUserId = conversation.user1Id === currentUserId ? conversation.user2Id : conversation.user1Id;
  return users.find(u => u.id === otherUserId);
}

export default function MessagesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const conversationsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'conversations'),
      where('userIds', 'array-contains', user.uid)
    );
  }, [firestore, user]);

  const { data: conversations, isLoading, error } = useCollection(conversationsQuery);

  const userAvatars: {[key: string]: any} = {};
  users.forEach(u => {
    userAvatars[u.id] = PlaceHolderImages.find(p => p.id === u.profilePictureUrlId);
  });
  
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
          {error && <p className="text-destructive">Error loading conversations.</p>}
          {!isLoading && conversations && conversations.length > 0 && (
             <div className="space-y-2">
                {conversations.map((convo) => {
                    const otherUser = getOtherUser(convo, user!.uid);
                    const avatar = otherUser ? userAvatars[otherUser.id] : null;
                    return (
                        <Link href="#" key={convo.id} className="block hover:bg-accent rounded-lg p-3">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    {avatar && <AvatarImage src={avatar.imageUrl} alt="User avatar" />}
                                    <AvatarFallback>{otherUser ? otherUser.name.charAt(0) : '?'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{otherUser?.name || 'Unknown User'}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {convo.lastMessage || 'No messages yet...'}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleTimeString() : ''}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
          )}
           {!isLoading && (!conversations || conversations.length === 0) && (
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
import { MessageSquare } from "lucide-react";


'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { User, Message as MessageData } from '@/lib/data';

function getOtherUser(conversation: any, currentUserId: string, users: User[] | null) {
  if (!users || !conversation) return null;
  const otherUserId = conversation.memberIds.find((id: string) => id !== currentUserId);
  return users.find(u => u.id === otherUserId);
}

export default function ConversationPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: users, isLoading: areUsersLoading } = useCollection<User>(usersCollectionRef);

  const conversationDocRef = useMemoFirebase(() => {
    if (!firestore || !conversationId) return null;
    return doc(firestore, 'conversations', conversationId);
  }, [firestore, conversationId]);
  const { data: conversation, isLoading: isConversationLoading } = useDoc(conversationDocRef);
  
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !conversationId) return null;
    return query(collection(firestore, 'conversations', conversationId, 'messages'), orderBy('createdAt', 'asc'));
  }, [firestore, conversationId]);
  const { data: messages, isLoading: areMessagesLoading } = useCollection<MessageData>(messagesQuery);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isLoading = areUsersLoading || isConversationLoading || areMessagesLoading;
  const otherUser = getOtherUser(conversation, user?.uid || '', users);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !firestore || !conversationId) return;

    const messagesColRef = collection(firestore, 'conversations', conversationId, 'messages');
    const messageData = {
      senderId: user.uid,
      text: newMessage,
      createdAt: serverTimestamp(),
    };
    
    addDocumentNonBlocking(messagesColRef, messageData);
    
    if (conversationDocRef) {
      updateDocumentNonBlocking(conversationDocRef, {
        lastMessage: newMessage,
        lastMessageAt: serverTimestamp(),
      });
    }

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 border-b p-4">
        <Button variant="ghost" size="icon" asChild>
           <Link href="/messages">
            <ArrowLeft />
           </Link>
        </Button>
        {isLoading ? (
          <div className="flex items-center gap-3">
             <Skeleton className="h-10 w-10 rounded-full" />
             <Skeleton className="h-5 w-32" />
          </div>
        ) : (
          otherUser && (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{otherUser.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="font-semibold">{otherUser.fullName}</div>
            </div>
          )
        )}
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-3/4 ml-auto" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        ) : (
          messages?.map(msg => {
            const isCurrentUser = msg.senderId === user?.uid;
            const messageDate = msg.createdAt instanceof Timestamp ? msg.createdAt.toDate() : new Date();
            
            return (
              <div key={msg.id} className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                {!isCurrentUser && otherUser && (
                   <Avatar className="h-8 w-8">
                     <AvatarFallback>{otherUser.fullName.charAt(0)}</AvatarFallback>
                   </Avatar>
                )}
                 <div
                  className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg rounded-xl p-3',
                    isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                   <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form */}
      <footer className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || isLoading}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}

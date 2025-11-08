'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, increment } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/data';
import { CalendarDays, Video } from "lucide-react";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";

function SessionCard({ session, allUsers }: { session: any, allUsers: User[] | null }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const isTeacher = session.teacherId === user?.uid;
    const otherUserId = isTeacher ? session.learnerId : session.teacherId;
    const otherUser = allUsers?.find(u => u.id === otherUserId);
    const userAvatar = otherUser ? PlaceHolderImages.find(p => p.id === 'user-1') : null; // Simplified
    
    const sessionDate = session.scheduledAt?.toDate ? session.scheduledAt.toDate() : new Date(session.scheduledAt);

    const handleCompleteSession = () => {
        if (!firestore || !user) return;
        
        const sessionRef = doc(firestore, 'sessions', session.id);
        const teacherRef = doc(firestore, 'users', session.teacherId);
        const learnerRef = doc(firestore, 'users', session.learnerId);

        updateDocumentNonBlocking(sessionRef, { status: 'completed' });

        const creditsToAward = session.durationHours || 1;
        updateDocumentNonBlocking(teacherRef, {
            creditsBalance: increment(creditsToAward)
        });

        toast({
            title: "Session Completed",
            description: `The session has been marked as complete and ${creditsToAward} credit(s) have been awarded.`
        });
    };

    return (
        <Card>
            <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" />}
                    <AvatarFallback>{otherUser?.fullName.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-lg">{otherUser?.fullName || 'Unknown User'}</p>
                            <p className="text-sm text-muted-foreground">{session.skillName || 'Skill not specified'}</p>
                        </div>
                        <Badge variant={session.status === 'completed' ? 'secondary' : 'default'}>{session.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4"/>
                            <span>{sessionDate.toLocaleDateString()} at {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Video className="h-4 w-4"/>
                            <span>{session.sessionType}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Button size="sm">Details</Button>
                    {session.status === 'in_progress' && isTeacher && (
                        <Button size="sm" variant="secondary" onClick={handleCompleteSession}>Complete Session</Button>
                    )}
                    {session.status === 'accepted' && (
                         <Button size="sm" variant="outline">Start Session</Button>
                    )}
                    {session.status === 'requested' && !isTeacher && <Button size="sm" variant="outline">Cancel</Button>}
                    {session.status === 'requested' && isTeacher && (
                        <>
                         <Button size="sm" variant="secondary">Accept</Button>
                         <Button size="sm" variant="destructive">Decline</Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function SessionsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const sessionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'sessions'),
      where('memberIds', 'array-contains', user.uid)
    );
  }, [firestore, user]);

  const { data: allSessions, isLoading: isLoadingSessions } = useCollection(sessionsQuery);

  const usersCollectionRef = useMemoFirebase(() => {
    if(!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: allUsers, isLoading: isLoadingUsers } = useCollection<User>(usersCollectionRef);
  
  const isLoading = isLoadingSessions || isLoadingUsers;

  const upcomingSessions = (allSessions || [])
    .filter(s => s.status !== 'completed' && s.status !== 'cancelled')
    .sort((a, b) => (a.scheduledAt?.toDate ? a.scheduledAt.toDate() : new Date(a.scheduledAt)) - (b.scheduledAt?.toDate ? b.scheduledAt.toDate() : new Date(b.scheduledAt)));
  const pastSessions = (allSessions || [])
    .filter(s => s.status === 'completed' || s.status === 'cancelled')
    .sort((a, b) => (b.scheduledAt?.toDate ? b.scheduledAt.toDate() : new Date(b.scheduledAt)) - (a.scheduledAt?.toDate ? a.scheduledAt.toDate() : new Date(a.scheduledAt)));

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Sessions</h1>
      <p className="text-muted-foreground mt-1">Manage your upcoming and past skill swap sessions.</p>
      
      <Tabs defaultValue="upcoming" className="mt-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
           {isLoading ? (
               <div className="space-y-4 mt-4">
                  {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
               </div>
           ) : upcomingSessions.length > 0 ? (
               <div className="space-y-4 mt-4">
                   {upcomingSessions.map(session => <SessionCard key={session.id} session={session} allUsers={allUsers} />)}
               </div>
           ) : (
              <Card className="mt-4">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  You have no upcoming sessions.
                </CardContent>
              </Card>
           )}
        </TabsContent>
        <TabsContent value="past">
           {isLoading ? (
                <div className="space-y-4 mt-4">
                    {[...Array(1)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                </div>
           ) : pastSessions.length > 0 ? (
               <div className="space-y-4 mt-4">
                   {pastSessions.map(session => <SessionCard key={session.id} session={session} allUsers={allUsers} />)}
               </div>
           ) : (
            <Card className="mt-4">
              <CardContent className="pt-6 text-center text-muted-foreground">
                You have no past sessions.
              </CardContent>
            </Card>
           )}
        </TabsContent>
      </Tabs>

    </div>
  );
}

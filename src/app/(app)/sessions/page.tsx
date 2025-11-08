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
import { CalendarDays, Video, CheckCircle, Clock } from "lucide-react";
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

    const handleSessionAction = (newStatus: 'accepted' | 'in_progress' | 'completed' | 'cancelled') => {
        if (!firestore || !user) return;
        
        const sessionRef = doc(firestore, 'sessions', session.id);
        updateDocumentNonBlocking(sessionRef, { status: newStatus });

        let toastTitle = '';
        let toastDescription = '';

        if (newStatus === 'completed') {
            const teacherRef = doc(firestore, 'users', session.teacherId);
            const creditsToAward = session.durationHours || 1;
            updateDocumentNonBlocking(teacherRef, {
                creditsBalance: increment(creditsToAward)
            });
            toastTitle = "Session Completed";
            toastDescription = `The session has been marked as complete and ${creditsToAward} credit(s) have been awarded to the teacher.`;
        } else if (newStatus === 'in_progress') {
            toastTitle = "Session Started";
            toastDescription = "The session is now in progress.";
        } else if (newStatus === 'accepted') {
            toastTitle = "Session Accepted";
            toastDescription = "The learner will be notified.";
        } else if (newStatus === 'cancelled') {
            toastTitle = "Session Cancelled";
            toastDescription = "The session has been cancelled.";
        }

        toast({ title: toastTitle, description: toastDescription });
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
                            <p className="text-sm text-muted-foreground">{session.skillId || 'Skill not specified'}</p>
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
                <div className="flex flex-col gap-2 w-32">
                    {session.status === 'completed' && <Button size="sm" disabled>Finished</Button>}
                    {session.status === 'in_progress' && isTeacher && (
                        <Button size="sm" variant="secondary" onClick={() => handleSessionAction('completed')}>Complete Session</Button>
                    )}
                    {session.status === 'accepted' && (
                         <Button size="sm" variant="outline" onClick={() => handleSessionAction('in_progress')}>Start Session</Button>
                    )}
                    {session.status === 'requested' && !isTeacher && <Button size="sm" variant="outline" onClick={() => handleSessionAction('cancelled')}>Cancel</Button>}
                    {session.status === 'requested' && isTeacher && (
                        <>
                         <Button size="sm" variant="secondary" onClick={() => handleSessionAction('accepted')}>Accept</Button>
                         <Button size="sm" variant="destructive" onClick={() => handleSessionAction('cancelled')}>Decline</Button>
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

  const { data: allSessions, isLoading: isLoadingSessions, error } = useCollection(sessionsQuery);

  const usersCollectionRef = useMemoFirebase(() => {
    if(!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: allUsers, isLoading: isLoadingUsers } = useCollection<User>(usersCollectionRef);
  
  const isLoading = isLoadingSessions || isLoadingUsers;

  const upcomingSessions = (allSessions || [])
    .filter(s => s.status !== 'completed' && s.status !== 'cancelled' && s.status !== 'disputed')
    .sort((a, b) => (a.scheduledAt?.toDate ? a.scheduledAt.toDate() : new Date(a.scheduledAt)) - (b.scheduledAt?.toDate ? b.scheduledAt.toDate() : new Date(b.scheduledAt)));
  const pastSessions = (allSessions || [])
    .filter(s => s.status === 'completed' || s.status === 'cancelled' || s.status === 'disputed')
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
                  {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-[105px] w-full" />)}
               </div>
           ) : error ? (
            <Card className="mt-4">
                <CardContent className="pt-6 text-center text-destructive">
                    There was an error loading your sessions. Please check your connection and security rules.
                </CardContent>
            </Card>
           ) : upcomingSessions.length > 0 ? (
               <div className="space-y-4 mt-4">
                   {upcomingSessions.map(session => <SessionCard key={session.id} session={session} allUsers={allUsers} />)}
               </div>
           ) : (
              <Card className="mt-4">
                <CardContent className="pt-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                  <Clock className="h-12 w-12" />
                  <h3 className="font-semibold text-lg">No upcoming sessions</h3>
                  <p>When you schedule a new session, it will appear here.</p>
                </CardContent>
              </Card>
           )}
        </TabsContent>
        <TabsContent value="past">
           {isLoading ? (
                <div className="space-y-4 mt-4">
                    {[...Array(1)].map((_, i) => <Skeleton key={i} className="h-[105px] w-full" />)}
                </div>
           ) : error ? (
            <Card className="mt-4">
                <CardContent className="pt-6 text-center text-destructive">
                    There was an error loading your sessions.
                </CardContent>
            </Card>
           ) : pastSessions.length > 0 ? (
               <div className="space-y-4 mt-4">
                   {pastSessions.map(session => <SessionCard key={session.id} session={session} allUsers={allUsers} />)}
               </div>
           ) : (
            <Card className="mt-4">
              <CardContent className="pt-12 text-center text-muted-foreground flex flex-col items-center gap-4">
                <CheckCircle className="h-12 w-12" />
                <h3 className="font-semibold text-lg">No past sessions</h3>
                <p>Completed or cancelled sessions will be shown here.</p>
              </CardContent>
            </Card>
           )}
        </TabsContent>
      </Tabs>

    </div>
  );
}

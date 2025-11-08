'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Camera, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading } = useDoc(userDocRef);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    locationCity: '',
    locationCountry: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        bio: userProfile.bio || '',
        locationCity: userProfile.locationCity || '',
        locationCountry: userProfile.locationCountry || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    if (userDocRef) {
      setDocumentNonBlocking(userDocRef, formData, { merge: true });
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
      });
      setIsEditing(false);
    }
  };
  
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-1');

  if (isLoading || !userProfile) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">My Profile</h1>
        </div>
        <Card>
          <CardHeader className="relative">
            <Skeleton className="h-40 w-full" />
            <div className="absolute -bottom-12 left-6">
              <Skeleton className="h-24 w-24 rounded-full border-4 border-card" />
            </div>
          </CardHeader>
          <CardContent className="pt-20">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">My Profile</h1>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="p-0 relative">
          <div className="relative h-40 w-full bg-muted">
            {/* Placeholder for cover photo */}
            {isEditing && (
              <Button size="icon" variant="outline" className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background">
                <Camera className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="absolute -bottom-12 left-6">
              <Avatar className="h-24 w-24 border-4 border-card">
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" />}
                  <AvatarFallback>{userProfile.fullName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/50 hover:bg-background">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
          </div>
        </CardHeader>
        <CardContent className="pt-16">
          {isEditing ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={formData.fullName} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={formData.bio} onChange={handleInputChange} placeholder="Tell us about yourself..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="locationCity">City</Label>
                  <Input id="locationCity" value={formData.locationCity} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="locationCountry">Country</Label>
                  <Input id="locationCountry" value={formData.locationCountry} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold font-headline">{userProfile.fullName}</h2>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <p className="mt-4">{userProfile.bio || 'No bio yet. Click "Edit Profile" to add one!'}</p>
              <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                <span className="font-semibold text-foreground">Location:</span> 
                {userProfile.locationCity && userProfile.locationCountry ? `${userProfile.locationCity}, ${userProfile.locationCountry}` : 'Not set'}
              </div>
            </>
          )}

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Skills I'm Offering</h3>
            <div className="flex flex-wrap gap-2">
              {/* This should come from userSkills subcollection */}
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">UI/UX Design</Badge>
              {isEditing && <Button size="sm" variant="outline">+</Button>}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Skills I'm Seeking</h3>
            <div className="flex flex-wrap gap-2">
              {/* This should come from userSkills subcollection */}
              <Badge>Node.js</Badge>
              <Badge>PostgreSQL</Badge>
              {isEditing && <Button size="sm" variant="outline">+</Button>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore, useUser } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from "@/hooks/use-toast";
import type { Skill } from '@/lib/data';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user && isCreatingProfile) {
        const userDocRef = doc(firestore, "users", user.uid);
        
        // Mock data for skills
        const skillsOffered: Skill[] = [{ name: 'JavaScript', level: 'Intermediate' }];
        const skillsSought: Skill[] = [{ name: 'Python', level: 'Beginner' }];

        const userData = {
        id: user.uid,
        email: user.email,
        fullName: fullName,
        bio: `A new member of the SkillSwap community, excited to learn and share!`,
        profilePictureUrlId: `user-${Math.ceil(Math.random() * 12)}`,
        locationCity: "New York",
        locationCountry: "USA",
        latitude: 40.7128,
        longitude: -74.0060,
        skillsOffered,
        skillsSought,
        verificationStatus: "unverified",
        trustScore: 50,
        creditsBalance: 10, // Start with 10 credits
        createdAt: new Date().toISOString(),
        isAdmin: false, // Default to not an admin
        };
        setDocumentNonBlocking(userDocRef, userData, { merge: true });
        setIsCreatingProfile(false); // Reset flag
        router.push('/dashboard');
    }
  }, [user, isUserLoading, isCreatingProfile, firestore, fullName, router]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields.",
      });
      return;
    }
    setIsCreatingProfile(true);
    initiateEmailSignUp(auth, email, password);
  };
  
  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  // Redirect if user is already logged in and not in the process of signing up.
  if (user && !isCreatingProfile) {
    router.push('/dashboard');
    return null;
  }


  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input 
                  id="full-name"
                  placeholder="Ada Lovelace"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isCreatingProfile}>
              {isCreatingProfile ? 'Creating Account...' : 'Create an account'}
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Sign up with Google
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

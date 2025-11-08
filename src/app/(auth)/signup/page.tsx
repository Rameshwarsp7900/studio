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
    if (!isUserLoading && user && isCreatingProfile && firestore) {
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
        
        // Create some sample users for demonstration
        createSampleUsers();

        setIsCreatingProfile(false); // Reset flag
        router.push('/dashboard');
    }
  }, [user, isUserLoading, isCreatingProfile, firestore, fullName, router]);

  const createSampleUsers = () => {
    const sampleUsers = [
      {
        id: 'sample-user-1',
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        profilePictureUrlId: 'user-1',
        bio: 'Graphic designer and illustrator with a passion for vibrant colors and clean designs. Love to teach and learn!',
        locationCity: 'Austin',
        locationCountry: 'TX',
        skillsOffered: [{ name: 'Illustration', level: 'Expert' }, { name: 'Branding', level: 'Intermediate' }],
        skillsSought: [{ name: 'Photography', level: 'Beginner' }],
        trustScore: 92,
        creditsBalance: 15,
        isAdmin: false,
      },
      {
        id: 'sample-user-2',
        fullName: 'Bob Williams',
        email: 'bob@example.com',
        profilePictureUrlId: 'user-2',
        bio: 'Full-stack developer with 10 years of experience. I enjoy building scalable web applications and mentoring junior developers.',
        locationCity: 'San Francisco',
        locationCountry: 'CA',
        skillsOffered: [{ name: 'React', level: 'Expert' }, { name: 'Node.js', level: 'Expert' }],
        skillsSought: [{ name: 'Machine Learning', level: 'Beginner' }],
        trustScore: 95,
        creditsBalance: 5,
        isAdmin: false,
      },
      {
        id: 'sample-user-3',
        fullName: 'Charlie Brown',
        email: 'charlie@example.com',
        profilePictureUrlId: 'user-3',
        bio: 'Professional musician and music teacher. Can teach guitar, piano, and music theory.',
        locationCity: 'Nashville',
        locationCountry: 'TN',
        skillsOffered: [{ name: 'Guitar', level: 'Expert' }, { name: 'Piano', level: 'Intermediate' }],
        skillsSought: [{ name: 'Songwriting', level: 'Intermediate' }],
        trustScore: 88,
        creditsBalance: 20,
        isAdmin: false,
      },
       {
        id: 'sample-user-4',
        fullName: 'Diana Prince',
        email: 'diana@example.com',
        profilePictureUrlId: 'user-4',
        bio: 'Certified yoga instructor and wellness coach. Helping people find balance and strength.',
        locationCity: 'Miami',
        locationCountry: 'FL',
        skillsOffered: [{ name: 'Yoga', level: 'Expert' }, { name: 'Meditation', level: 'Expert' }],
        skillsSought: [{ name: 'Nutrition', level: 'Beginner' }],
        trustScore: 99,
        creditsBalance: 12,
        isAdmin: false,
      },
      {
        id: 'sample-user-5',
        fullName: 'Ethan Hunt',
        email: 'ethan@example.com',
        profilePictureUrlId: 'user-5',
        bio: 'Language enthusiast. Fluent in Spanish, French, and learning Japanese. Let\'s practice!',
        locationCity: 'London',
        locationCountry: 'UK',
        skillsOffered: [{ name: 'Spanish', level: 'Expert' }, { name: 'French', level: 'Intermediate' }],
        skillsSought: [{ name: 'Japanese', level: 'Beginner' }],
        trustScore: 91,
        creditsBalance: 8,
        isAdmin: false,
      },
      {
        id: 'sample-user-6',
        fullName: 'Fiona Glenanne',
        email: 'fiona@example.com',
        profilePictureUrlId: 'user-6',
        bio: 'Culinary artist and former pastry chef. I can teach you the art of French baking.',
        locationCity: 'Paris',
        locationCountry: 'France',
        skillsOffered: [{ name: 'Baking', level: 'Expert' }, { name: 'Cooking', level: 'Intermediate' }],
        skillsSought: [{ name: 'Cocktail Making', level: 'Beginner' }],
        trustScore: 94,
        creditsBalance: 25,
        isAdmin: false,
      }
    ];

    if (!firestore) return;

    sampleUsers.forEach(sampleUser => {
      const sampleUserDocRef = doc(firestore, "users", sampleUser.id);
      setDocumentNonBlocking(sampleUserDocRef, sampleUser, { merge: true });
    });
  }


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

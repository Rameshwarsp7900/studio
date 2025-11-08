'use client';

import { UserCard } from '@/components/user-card';
import { getSkillRecommendations } from '@/ai/flows/skill-recommendations';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfileDialog } from '@/components/user-profile-dialog';
import { useState, useEffect } from 'react';
import type { User as UserData, Skill } from '@/lib/data';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';


export default function DashboardPage() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

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
      },
      {
        id: 'sample-user-7',
        fullName: 'George Costanza',
        email: 'george@example.com',
        profilePictureUrlId: 'user-7',
        bio: 'Architectural designer with a love for urban planning and sustainable design.',
        locationCity: 'New York',
        locationCountry: 'NY',
        skillsOffered: [{ name: 'Architecture', level: 'Expert' }, { name: 'Urban Planning', level: 'Intermediate' }],
        skillsSought: [{ name: 'Public Speaking', level: 'Beginner' }],
        trustScore: 85,
        creditsBalance: 18,
        isAdmin: false,
      },
      {
        id: 'sample-user-8',
        fullName: 'Hannah Montana',
        email: 'hannah@example.com',
        profilePictureUrlId: 'user-8',
        bio: 'Pop-star by night, student by day. Can teach you how to sing or how to get through high school.',
        locationCity: 'Los Angeles',
        locationCountry: 'CA',
        skillsOffered: [{ name: 'Singing', level: 'Expert' }, { name: 'Stage Presence', level: 'Expert' }],
        skillsSought: [{ name: 'Algebra', level: 'Beginner' }],
        trustScore: 97,
        creditsBalance: 100,
        isAdmin: false,
      },
      {
        id: 'sample-user-9',
        fullName: 'Indiana Jones',
        email: 'indy@example.com',
        profilePictureUrlId: 'user-9',
        bio: 'Archaeologist and adventurer. Can teach you about ancient history and how to use a whip.',
        locationCity: 'Cairo',
        locationCountry: 'Egypt',
        skillsOffered: [{ name: 'Archaeology', level: 'Expert' }, { name: 'History', level: 'Expert' }],
        skillsSought: [{ name: 'Modern Technology', level: 'Beginner' }],
        trustScore: 89,
        creditsBalance: 30,
        isAdmin: false,
      },
      {
        id: 'sample-user-10',
        fullName: 'Jack Sparrow',
        email: 'jack@example.com',
        profilePictureUrlId: 'user-10',
        bio: 'Captain of the Black Pearl. Can teach you how to sail, find treasure, and run from the law.',
        locationCity: 'Tortuga',
        locationCountry: 'Caribbean',
        skillsOffered: [{ name: 'Sailing', level: 'Expert' }, { name: 'Sword Fighting', level: 'Intermediate' }],
        skillsSought: [{ name: 'Honesty', level: 'Beginner' }],
        trustScore: 25,
        creditsBalance: 1000,
        isAdmin: false,
      },
      {
        id: 'sample-user-11',
        fullName: 'Katniss Everdeen',
        email: 'katniss@example.com',
        profilePictureUrlId: 'user-11',
        bio: 'Expert archer and survivalist from District 12. Can teach you how to hunt and gather.',
        locationCity: 'District 12',
        locationCountry: 'Panem',
        skillsOffered: [{ name: 'Archery', level: 'Expert' }, { name: 'Survival Skills', level: 'Expert' }],
        skillsSought: [{ name: 'Baking', level: 'Beginner' }],
        trustScore: 90,
        creditsBalance: 5,
        isAdmin: false,
      },
      {
        id: 'sample-user-12',
        fullName: 'Luke Skywalker',
        email: 'luke@example.com',
        profilePictureUrlId: 'user-12',
        bio: 'Jedi Knight from a galaxy far, far away. Can teach you the ways of the Force.',
        locationCity: 'Tatooine',
        locationCountry: 'Outer Rim',
        skillsOffered: [{ name: 'The Force', level: 'Expert' }, { name: 'Lightsaber Combat', level: 'Expert' }],
        skillsSought: [{ name: 'Moisture Farming', level: 'Beginner' }],
        trustScore: 99,
        creditsBalance: 50,
        isAdmin: false,
      }
    ];

    if (!firestore) return;

    sampleUsers.forEach(sampleUser => {
      const sampleUserDocRef = doc(firestore, "users", sampleUser.id);
      setDocumentNonBlocking(sampleUserDocRef, sampleUser, { merge: true });
    });
  }

  const usersCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserData>(usersCollectionRef);

  useEffect(() => {
    // If users are loaded and there's only 1 user (the current user), create sample data.
    if (users && users.length <= 1) {
      createSampleUsers();
    }
  }, [users]);


  // Example of how to use the GenAI flow.
  // For this build, we will use static mock data.
  // const recommendations = await getSkillRecommendations({
  //   profile: "...",
  //   skillsOffered: ["React"],
  //   skillsSought: ["Node.js"],
  //   location: "San Francisco, CA",
  // });

  const handleUserCardClick = (user: UserData) => {
    setSelectedUser(user);
  }

  const handleDialogClose = () => {
    setSelectedUser(null);
  }
  
  // Filter out the current user from the list
  const otherUsers = users?.filter(u => u.id !== currentUser?.uid);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Here are some people we think you'll vibe with.</p>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherUsers?.map((user) => (
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

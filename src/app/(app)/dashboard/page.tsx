import { UserCard } from '@/components/user-card';
import { users } from '@/lib/data';
import { getSkillRecommendations } from '@/ai/flows/skill-recommendations';

export default async function DashboardPage() {
  // Example of how to use the GenAI flow. 
  // For this build, we will use static mock data.
  // const recommendations = await getSkillRecommendations({
  //   profile: "...",
  //   skillsOffered: ["React"],
  //   skillsSought: ["Node.js"],
  //   location: "San Francisco, CA",
  // });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Welcome back, Alice!</h1>
        <p className="text-muted-foreground">Here are some people we think you'll vibe with.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">My Profile</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is where you'll view and edit your profile, skills, and settings.</p>
        </CardContent>
      </Card>
    </div>
  );
}

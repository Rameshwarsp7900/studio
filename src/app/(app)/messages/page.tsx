import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Messages</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your conversation threads with other users will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

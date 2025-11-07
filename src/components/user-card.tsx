import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { type User } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

type UserCardProps = {
  user: User;
};

export function UserCard({ user }: UserCardProps) {
  const profileImage = PlaceHolderImages.find(p => p.id === user.profilePictureUrlId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-32 w-full">
            {profileImage && (
                <Image
                src={profileImage.imageUrl}
                alt={`${user.name}'s profile picture`}
                fill
                className="object-cover"
                data-ai-hint={profileImage.imageHint}
                />
            )}
            <div className="absolute -bottom-10 left-6">
                <Avatar className="h-20 w-20 border-4 border-card">
                    {profileImage && <AvatarImage src={profileImage.imageUrl} alt={`${user.name}'s profile picture`} />}
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
        </div>
        <div className="pt-12 px-6 pb-2">
            <h3 className="text-xl font-headline font-bold">{user.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{user.location}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-primary">OFFERING</h4>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsOffered.map((skill) => (
              <Badge key={skill.name} variant="secondary">{skill.name}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 text-accent-foreground">SEEKING</h4>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsSought.map((skill) => (
              <Badge key={skill.name} variant="outline">{skill.name}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
}

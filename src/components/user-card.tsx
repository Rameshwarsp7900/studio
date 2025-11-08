import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { type User } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type UserCardProps = {
  user: User;
  onClick: () => void;
  className?: string;
};

export function UserCard({ user, onClick, className }: UserCardProps) {
  const profileImage = PlaceHolderImages.find(p => p.id === 'user-1'); // Simplified for now
  const rating = 4.5; // Static for now, can be dynamic later

  return (
    <Card 
      className={cn("flex flex-col overflow-hidden transition-all hover:shadow-lg cursor-pointer", className)}
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative h-32 w-full">
            {profileImage && (
                <Image
                src={profileImage.imageUrl}
                alt={`${user.fullName}'s profile picture`}
                fill
                className="object-cover"
                data-ai-hint={profileImage.imageHint}
                />
            )}
            <div className="absolute -bottom-10 left-6">
                <Avatar className="h-20 w-20 border-4 border-card">
                    {profileImage && <AvatarImage src={profileImage.imageUrl} alt={`${user.fullName}'s profile picture`} />}
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
        </div>
        <div className="pt-12 px-6 pb-2">
            <h3 className="text-xl font-headline font-bold">{user.fullName}</h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{user.locationCity}, {user.locationCountry}</span>
              </div>
              <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary" />
                  <span>{rating.toFixed(1)}</span>
              </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 pt-2">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-primary">OFFERING</h4>
          <div className="flex flex-wrap gap-1.5">
            {/* Mock data for now */}
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">Photography</Badge>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 text-accent-foreground">SEEKING</h4>
          <div className="flex flex-wrap gap-1.5">
            {/* Mock data for now */}
            <Badge variant="outline">Node.js</Badge>
            <Badge variant="outline">Spanish</Badge>
          </div>
        </div>
      </CardContent>
      {/* Footer can be added back if needed */}
    </Card>
  );
}

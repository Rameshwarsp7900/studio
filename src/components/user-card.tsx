import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { type User } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type UserCardProps = {
  user: User;
  onClick: () => void;
  className?: string;
};

export function UserCard({ user, onClick, className }: UserCardProps) {
  const profileImage = PlaceHolderImages.find(p => p.id === user.profilePictureUrlId);
  const rating = 4.5; // Static for now, can be dynamic later

  return (
    <Card 
      className={cn("overflow-hidden transition-all hover:scale-105 cursor-pointer group", className)}
      onClick={onClick}
    >
        <div className="relative h-64 w-full">
            {profileImage && (
                <Image
                src={profileImage.imageUrl}
                alt={`${user.fullName}'s profile picture`}
                fill
                className="object-cover"
                data-ai-hint={profileImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-headline font-bold">{user.fullName}</h3>
                <div className="flex items-center text-sm opacity-80">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{user.locationCity}, {user.locationCountry}</span>
                </div>
            </div>
             <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span>{rating.toFixed(1)}</span>
              </div>
        </div>
      <CardContent className="flex-1 space-y-3 p-4">
        <div>
          <h4 className="text-xs font-semibold mb-2 text-primary tracking-wider uppercase">OFFERING</h4>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsOffered?.map(skill => <Badge key={skill.name} variant="secondary">{skill.name}</Badge>) ?? <p className='text-sm text-muted-foreground'>No skills to offer yet.</p>}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold mb-2 text-primary/80 tracking-wider uppercase">SEEKING</h4>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsSought?.map(skill => <Badge key={skill.name} variant="default">{skill.name}</Badge>) ?? <p className='text-sm text-muted-foreground'>Not seeking any skills right now.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

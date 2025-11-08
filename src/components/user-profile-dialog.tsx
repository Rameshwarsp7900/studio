'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { User } from '@/lib/data';
import { Star, MapPin, X, Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserProfileDialogProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

const userImages = PlaceHolderImages.filter(p => p.id.startsWith('user-')).slice(0, 4);

export function UserProfileDialog({ isOpen, user, onClose }: UserProfileDialogProps) {
  const router = useRouter();

  if (!user) return null;

  const rating = 4.5; // Static for now

  const handleMessageClick = () => {
    onClose();
    // In a real app, you would create a new conversation or navigate to an existing one.
    // For now, we just navigate to the messages page.
    router.push('/messages');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 border-0 gap-0">
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {userImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[28rem] w-full">
                    <Image src={img.imageUrl} alt={`User image ${index + 1}`} fill className="object-cover rounded-t-lg" data-ai-hint={img.imageHint} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
          </Carousel>

           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
              <h2 className="text-3xl font-bold font-headline text-white">{user.fullName}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-200">
                <MapPin className="h-4 w-4" />
                <span>{user.locationCity}, {user.locationCountry}</span>
              </div>
           </div>
        </div>

        <div className="p-6 bg-background">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} />
                        ))}
                        <span className="ml-1 text-muted-foreground text-sm">({rating.toFixed(1)})</span>
                    </div>
                    <Badge variant="secondary">Trust: {user.trustScore}%</Badge>
                </div>
            </div>

          <p className="text-muted-foreground mb-6 text-sm">{user.bio || 'No bio provided.'}</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold mb-2 text-primary tracking-wider uppercase">Offering</h3>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered?.map(skill => <Badge key={skill.name} variant="secondary">{skill.name}</Badge>) ?? <p className='text-sm text-muted-foreground'>No skills to offer yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold mb-2 text-primary/80 tracking-wider uppercase">Seeking</h3>
              <div className="flex flex-wrap gap-2">
                {user.skillsSought?.map(skill => <Badge key={skill.name}>{skill.name}</Badge>) ?? <p className='text-sm text-muted-foreground'>Not seeking any skills right now.</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-around p-4 border-t bg-background/50 rounded-b-lg">
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-white shadow-lg hover:bg-destructive/10 border-gray-200" onClick={onClose}>
                <X className="h-8 w-8 text-destructive" />
            </Button>
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-white shadow-lg hover:bg-primary/10 border-gray-200" onClick={handleMessageClick}>
                <MessageCircle className="h-8 w-8 text-primary" />
            </Button>
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-white shadow-lg hover:bg-green-500/10 border-gray-200">
                <Heart className="h-8 w-8 text-green-500" />
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

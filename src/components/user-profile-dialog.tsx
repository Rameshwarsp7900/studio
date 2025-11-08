'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { User } from '@/lib/data';
import { Star, MapPin, X, Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface UserProfileDialogProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

const userImages = PlaceHolderImages.filter(p => p.id.startsWith('user-')).slice(0, 4);

export function UserProfileDialog({ isOpen, user, onClose }: UserProfileDialogProps) {
  if (!user) return null;

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-1');
  const rating = 4.5; // Static for now

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 border-0 gap-0">
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {userImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-96 w-full">
                    <Image src={img.imageUrl} alt={`User image ${index + 1}`} fill className="object-cover rounded-t-lg" data-ai-hint={img.imageHint} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>

           <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
              <h2 className="text-3xl font-bold font-headline text-white">{user.fullName}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{user.locationCity}, {user.locationCountry}</span>
              </div>
           </div>
        </div>

        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                        ))}
                        <span className="ml-1 text-muted-foreground text-sm">({rating.toFixed(1)})</span>
                    </div>
                    <Badge variant="outline">Trust Score: {user.trustScore}%</Badge>
                </div>
            </div>

          <p className="text-muted-foreground mb-6">{user.bio || 'No bio provided.'}</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-primary">OFFERING</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">UI/UX Design</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-accent-foreground">SEEKING</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Node.js</Badge>
                <Badge>PostgreSQL</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-around p-4 border-t">
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-white shadow-lg">
                <X className="h-8 w-8 text-destructive" />
            </Button>
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-white shadow-lg">
                <MessageCircle className="h-8 w-8 text-primary" />
            </Button>
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full bg-white shadow-lg">
                <Heart className="h-8 w-8 text-green-500" />
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Search, Recycle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-section');

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-secondary">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[10px_10px] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-400/[0.05] dark:bg-[10px_10px] dark:[mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary tracking-tighter">
                Teach What You Know, Learn What You Don't.
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                Join a community of learners and mentors. SkillSwap is a credit-based barter system for exchanging knowledge and skills.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg" className="font-bold">
                    <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-bold">
                    <Link href="#how-it-works">Learn More</Link>
                </Button>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">How It Works</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Getting started with SkillSwap is as easy as 1-2-3.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary text-primary-foreground">
                  <Search className="h-10 w-10" />
                </div>
                <h3 className="mt-6 text-xl font-headline font-bold">1. Find a Skill</h3>
                <p className="mt-2 text-muted-foreground">
                  Search for skills you want to learn, from coding to cooking. Our AI helps you find the perfect match.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary text-primary-foreground">
                  <Recycle className="h-10 w-10" />
                </div>
                <h3 className="mt-6 text-xl font-headline font-bold">2. Swap & Learn</h3>
                <p className="mt-2 text-muted-foreground">
                  Use credits to book sessions. Earn credits by teaching others. No money involved, just pure knowledge exchange.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary text-primary-foreground">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="mt-6 text
-xl font-headline font-bold">3. Grow Your Skills</h3>
                <p className="mt-2 text-muted-foreground">
                  Attend sessions, complete tasks, and build your expertise. Track your progress and earn badges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Everything You Need to Grow</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                SkillSwap provides a comprehensive platform for a seamless learning and teaching experience.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="text-primary" />
                    AI-Powered Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our smart algorithm suggests the most compatible partners for your skill exchange journey, based on your interests and goals.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Recycle className="text-primary" />
                    Credit-Based Barter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our cashless system uses credits for a fair and simple exchange. Earn by teaching, spend by learning.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="text-primary" />
                    Flexible Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Choose between in-person meetups or remote video calls. Learn and teach at your own convenience.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Swap Your Skills?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Create your profile, add your skills, and start your learning journey today.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="font-bold">
                <Link href="/signup">
                  Join SkillSwap Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

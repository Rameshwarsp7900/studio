'use client';

import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AppLoadingSkeleton() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
         <div className="p-4 border rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 animate-spin text-primary"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
         </div>
        <p className="text-muted-foreground">Loading your experience...</p>
      </div>
    </div>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Always render the layout shell to prevent hydration errors.
  // Show a loading skeleton inside if user data is still being fetched.
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <main className="flex-1 flex flex-col bg-background">
            {(isUserLoading || !user) ? <AppLoadingSkeleton /> : children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

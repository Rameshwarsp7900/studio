'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="hidden md:block">
        {/* Placeholder for breadcrumbs or page title */}
        <h1 className="font-headline text-xl font-bold tracking-tight">Discover</h1>
      </div>
      <div className="flex flex-1 items-center gap-4 justify-end">
        <form className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for skills or people..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </form>
        {/* Potentially add User menu here for mobile */}
      </div>
    </header>
  );
}

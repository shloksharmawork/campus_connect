'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import OnlineUsers from '@/components/OnlineUsers';
import MobileNav from '@/components/MobileNav';
import { Search } from 'lucide-react';

export default function DiscoverPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pt-8 px-4 pb-20 no-scrollbar">
          <div className="max-w-2xl mx-auto space-y-6">
            <header className="flex items-center gap-4 mb-8">
              <div className="bg-primary/20 p-3 rounded-2xl">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold italic tracking-tight">Discover</h1>
                <p className="text-muted-foreground font-medium">Connect with students online right now</p>
              </div>
            </header>

            <div className="glass-panel p-6 rounded-[2.5rem]">
               <OnlineUsers className="flex flex-col gap-6" />
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

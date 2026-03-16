'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/services/authService';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Feed from '@/components/Feed';
import OnlineUsers from '@/components/OnlineUsers';
import ConnectionRequests from '@/components/ConnectionRequests';
import MobileNav from '@/components/MobileNav';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="max-w-2xl mx-auto pt-6 px-4">
            <ConnectionRequests />
            <Feed />
          </div>
        </main>

        <OnlineUsers className="w-80 glass-panel border-l border-white/5 h-[calc(100vh-4rem)] p-6 hidden lg:flex flex-col gap-6" />
      </div>
      <MobileNav />
    </div>
  );
}

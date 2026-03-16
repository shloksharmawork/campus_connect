'use client';

import { useAuthStore } from '@/services/authService';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { User, Mail, GraduationCap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pt-8 px-4 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel rounded-[2.5rem] overflow-hidden">
              {/* Cover Banner */}
              <div className="h-32 bg-gradient-to-r from-primary/30 to-accent/30" />
              
              <div className="px-8 pb-8 relative">
                {/* Profile Image */}
                <div className="absolute -top-16 left-8 w-32 h-32">
                  <Image
                    src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    fill
                    className="rounded-[2rem] border-4 border-[#0f172a] shadow-2xl ring-1 ring-white/10 object-cover"
                    unoptimized
                  />
                </div>

                <div className="pt-20">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold flex items-center gap-2">
                        {user.name}
                        <ShieldCheck className="h-6 w-6 text-primary" />
                      </h1>
                      <p className="text-muted-foreground font-medium">@{user.email.split('@')[0]}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-secondary/30 p-4 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                        <Mail className="h-3 w-3" /> Email
                      </div>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    
                    <div className="bg-secondary/30 p-4 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                        <GraduationCap className="h-3 w-3" /> College
                      </div>
                      <p className="text-sm font-medium">MITS Gwalior</p>
                    </div>

                    <div className="bg-secondary/30 p-4 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                        <User className="h-3 w-3" /> Student ID
                      </div>
                      <p className="text-sm font-medium">{user.email.split('@')[0].toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 glass-panel p-6 rounded-3xl border border-white/5">
              <h3 className="font-bold mb-4">Account Stats</h3>
              <div className="flex gap-4">
                <div className="flex-1 text-center p-4 bg-secondary/20 rounded-2xl">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Posts</p>
                </div>
                <div className="flex-1 text-center p-4 bg-secondary/20 rounded-2xl">
                  <p className="text-2xl font-bold text-accent">0</p>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Friends</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

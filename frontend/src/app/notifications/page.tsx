'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Bell, ShieldCheck, Mail, Info } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pt-8 px-4 pb-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <header className="flex items-center gap-4 mb-8">
              <div className="bg-accent/20 p-3 rounded-2xl">
                <Bell className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold italic tracking-tight">Notifications</h1>
                <p className="text-muted-foreground font-medium">Stay updated with campus activity</p>
              </div>
            </header>

            <div className="space-y-4">
              <div className="glass-panel p-4 flex items-center gap-4 hover:bg-white/5 transition-all">
                <div className="p-2 bg-primary/20 rounded-xl">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">Welcome to Campus Connect!</p>
                    <p className="text-xs text-muted-foreground">You are now part of the MITS Gwalior student network.</p>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Now</span>
              </div>

              <div className="glass-panel p-12 rounded-3xl text-center border-dashed border-white/10">
                <Info className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No new notifications</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

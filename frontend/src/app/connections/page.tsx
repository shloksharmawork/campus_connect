'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ConnectionRequests from '@/components/ConnectionRequests';
import { Users } from 'lucide-react';

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pt-8 px-4 pb-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex items-center gap-4 mb-8">
              <div className="bg-primary/20 p-3 rounded-2xl">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold italic tracking-tight">Connections</h1>
                <p className="text-muted-foreground font-medium">Manage your network and requests</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <section>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Pending Requests</h3>
                  <ConnectionRequests />
                </section>
                
                <section>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Suggested People</h3>
                  <div className="glass-panel p-8 rounded-3xl text-center">
                    <p className="text-muted-foreground">Find more students from MITS Gwalior</p>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                 <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Quick Stats</h3>
                 <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-2xl">
                        <span className="text-sm font-medium">Total Friends</span>
                        <span className="text-xl font-bold text-primary">0</span>
                    </div>
                    <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-2xl">
                        <span className="text-sm font-medium">Pending Sent</span>
                        <span className="text-xl font-bold text-accent">0</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

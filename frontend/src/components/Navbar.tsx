'use client';

import { useAuthStore } from '@/services/authService';
import { LogOut, GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="h-16 glass-panel border-b border-white/5 sticky top-0 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary/20 p-2 rounded-xl">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block">
          Campus<span className="text-primary">Connect</span>
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-secondary/50 px-3 py-1.5 rounded-full border border-white/5">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt="Profile"
                fill
                className="rounded-full ring-2 ring-primary/20 object-cover"
                unoptimized
              />
            </div>
            <span className="text-sm font-medium hidden md:block">{user.name}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      )}
    </nav>
  );
}

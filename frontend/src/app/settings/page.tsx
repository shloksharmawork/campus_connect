'use client';

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Settings, User, Bell, Palette, Lock, LogOut } from 'lucide-react';
import { useAuthStore } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const settingsGroups = [
    { 
      title: 'Account', 
      items: [
        { icon: User, label: 'Edit Profile', href: '/profile' }, 
        { icon: Lock, label: 'Privacy', href: '/settings' }
      ] 
    },
    { 
      title: 'Preferences', 
      items: [
        { icon: Bell, label: 'Notifications', href: '/notifications' }, 
        { icon: Palette, label: 'Theme & Appearance', href: '/settings' }
      ] 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto pt-8 px-4 pb-12">
          <div className="max-w-xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
              <div className="bg-secondary p-3 rounded-2xl">
                <Settings className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground font-medium">Customize your campus experience</p>
              </div>
            </header>

            <div className="space-y-6">
              {settingsGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4">{group.title}</h3>
                  <div className="glass-panel overflow-hidden border border-white/5 rounded-3xl">
                    {group.items.map((item, i) => (
                      <button 
                        key={item.label}
                        onClick={() => router.push(item.href)}
                        className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all text-left ${i !== group.items.length - 1 ? 'border-b border-white/5' : ''}`}
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-6">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-3xl border border-destructive/20 transition-all font-bold"
                >
                  <LogOut className="h-5 w-5" />
                  Logout from Device
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

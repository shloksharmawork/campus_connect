'use client';

import { useAuthStore } from '@/services/authService';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Bell, 
  Settings,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/utils';

const menuItems = [
  { icon: MessageSquare, label: 'Feed', href: '/dashboard' },
  { icon: Users, label: 'Connections', href: '/connections' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: UserIcon, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className="w-64 glass-panel border-r border-white/5 h-[calc(100vh-4rem)] flex flex-col p-4 gap-4 hidden md:flex">
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
              pathname === item.href 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="bg-secondary/30 rounded-2xl p-4 border border-white/5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">College ID</h3>
        <p className="text-sm font-mono text-foreground font-medium">
          {user?.email?.split('@')[0].toUpperCase()}
        </p>
      </div>
    </div>
  );
}

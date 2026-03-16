'use client';

import { 
  MessageSquare, 
  Users, 
  Bell, 
  User as UserIcon,
  Settings
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

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-white/5 flex items-center justify-around px-2 z-50 md:hidden pb-safe">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[4rem]",
            pathname === item.href 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <item.icon className={cn(
            "h-5 w-5",
            pathname === item.href && "fill-primary/10"
          )} />
          <span className="text-[10px] font-medium">{item.label}</span>
          {pathname === item.href && (
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
          )}
        </Link>
      ))}
    </div>
  );
}

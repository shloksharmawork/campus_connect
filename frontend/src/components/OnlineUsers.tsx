'use client';

import { useState, useEffect } from 'react';
import { useSocketStore } from '@/services/socketService';
import api from '@/services/api';
import { User } from '@/types';
import { UserPlus, Search, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import ChatWindow from './ChatWindow';

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const { socket } = useSocketStore();

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const [onlineRes, friendsRes] = await Promise.all([
          api.get('/users/online'),
          api.get('/connections?status=accepted')
        ]);
        
        setOnlineUsers(onlineRes.data);
        
        // Extract friend IDs
        const ids = new Set<string>();
        friendsRes.data.forEach((conn: any) => {
          // If requester is not me, requester is friend. Otherwise receiver is friend.
          // Wait, we need to know who "me" is. But let's just use both IDs.
          ids.add(conn.requesterId._id || conn.requesterId);
          ids.add(conn.receiverId._id || conn.receiverId);
        });
        setFriendIds(ids);
      } catch (err) {
        console.error('Failed to fetch online users', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();

    if (socket) {
      socket.on('userOnline', async () => {
        // When someone comes online, we could fetch their info or just refresh the list
        // For simplicity, let's just refresh the list to ensure data consistency
        const { data } = await api.get('/users/online');
        setOnlineUsers(data);
      });

      socket.on('userOffline', (userId: string) => {
        setOnlineUsers((prev) => prev.filter((u) => u._id !== userId));
      });
    }

    return () => {
      if (socket) {
        socket.off('userOnline');
        socket.off('userOffline');
      }
    };
  }, [socket]);

  const handleSendRequest = async (receiverId: string) => {
    try {
      await api.post('/connections/request', { receiverId });
      alert('Connection request sent!');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="w-80 glass-panel border-l border-white/5 h-[calc(100vh-4rem)] p-6 hidden lg:flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg flex items-center gap-2">
          Online Students
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </h2>
        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full text-muted-foreground">
          {onlineUsers.length}
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search students..."
          className="w-full bg-secondary/50 rounded-xl pl-10 pr-4 py-2 text-sm outline-none border border-white/5 focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-secondary rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-secondary rounded w-24" />
                <div className="h-2 bg-secondary rounded w-16" />
              </div>
            </div>
          ))
        ) : onlineUsers.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-8">No other students online right now.</p>
        ) : (
          onlineUsers.map((user) => (
            <div key={user._id} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt={user.name}
                  fill
                  className="rounded-full ring-2 ring-primary/10 object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full z-10" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">Student</p>
              </div>
              {friendIds.has(user._id) ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChat(user);
                  }}
                  className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-all" 
                  title="Send Message"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendRequest(user._id);
                  }}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all" 
                  title="Send Request"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {activeChat && (
        <ChatWindow 
          friend={activeChat} 
          onClose={() => setActiveChat(null)} 
        />
      )}
    </div>
  );
}

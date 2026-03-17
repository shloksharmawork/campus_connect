'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ConnectionRequests from '@/components/ConnectionRequests';
import ChatWindow from '@/components/ChatWindow';
import MobileNav from '@/components/MobileNav';
import { Users, MessageCircle, UserCheck } from 'lucide-react';
import { User } from '@/types';
import api from '@/services/api';
import Image from 'next/image';

export default function ConnectionsPage() {
  const [friends, setFriends] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [chatFriend, setChatFriend] = useState<User | null>(null);

  const fetchFriends = async () => {
    try {
      const { data } = await api.get<User[]>('/connections');
      setFriends(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFriends(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pt-8 px-4 pb-20 no-scrollbar">
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
              {/* Left: Requests + Friends */}
              <div className="md:col-span-2 space-y-8">

                {/* Pending Requests */}
                <section>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Pending Requests</h3>
                  <ConnectionRequests onAccepted={fetchFriends} />
                </section>

                {/* Friends List */}
                <section>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    My Friends ({friends.length})
                  </h3>
                  {loadingFriends ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-panel p-4 rounded-2xl animate-pulse h-20" />
                      ))}
                    </div>
                  ) : friends.length === 0 ? (
                    <div className="glass-panel p-8 rounded-3xl text-center border border-white/5">
                      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <p className="text-muted-foreground text-sm">No friends yet — go to <strong>Explore</strong> to connect!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {friends.map((friend) => (
                        <div
                          key={friend._id}
                          className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-white/5 hover:border-white/20 transition-all"
                        >
                          <div className="relative w-12 h-12 shrink-0">
                            <Image
                              src={friend.profileImage || `https://ui-avatars.com/api/?name=${friend.name}&background=random`}
                              alt={friend.name}
                              fill
                              className="rounded-full object-cover ring-2 ring-primary/20"
                              unoptimized
                            />
                            {friend.onlineStatus && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{friend.name}</p>
                            <p className={`text-xs font-medium ${friend.onlineStatus ? 'text-green-500' : 'text-muted-foreground'}`}>
                              {friend.onlineStatus ? 'Online' : 'Offline'}
                            </p>
                          </div>
                          <button
                            onClick={() => setChatFriend(friend)}
                            title={`Chat with ${friend.name}`}
                            className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all hover:scale-105"
                          >
                            <MessageCircle className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </div>

              {/* Right: Stats */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Quick Stats</h3>
                <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-2xl">
                    <span className="text-sm font-medium">Total Friends</span>
                    <span className="text-xl font-bold text-primary">{friends.length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-2xl">
                    <span className="text-sm font-medium">Online Now</span>
                    <span className="text-xl font-bold text-green-500">
                      {friends.filter((f) => f.onlineStatus).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chat Window */}
      {chatFriend && (
        <ChatWindow friend={chatFriend} onClose={() => setChatFriend(null)} />
      )}

      <MobileNav />
    </div>
  );
}

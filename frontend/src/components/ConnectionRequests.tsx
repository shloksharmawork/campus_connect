'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Check, X, UserPlus } from 'lucide-react';
import Image from 'next/image';

import { User } from '@/types';

export default function ConnectionRequests() {
  const [requests, setRequests] = useState<{ _id: string; requesterId: User }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/connections/pending');
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (connectionId: string, action: 'accept' | 'reject') => {
    try {
      await api.post(`/connections/respond/${connectionId}`, { action });
      setRequests((prev) => prev.filter((r) => r._id !== connectionId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;
  if (requests.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
        <UserPlus className="h-3 w-3" />
        Connection Requests
      </h3>
      <div className="space-y-2">
        {requests.map((req) => (
          <div key={req._id} className="glass-panel p-3 rounded-xl flex items-center gap-3 border-primary/20 bg-primary/5">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src={req.requesterId.profileImage || `https://ui-avatars.com/api/?name=${req.requesterId.name}&background=random`}
                alt={req.requesterId.name}
                fill
                className="rounded-full object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{req.requesterId.name}</p>
              <p className="text-xs text-muted-foreground">Wants to connect</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleAction(req._id, 'accept')}
                className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                title="Accept"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleAction(req._id, 'reject')}
                className="p-1.5 bg-secondary text-muted-foreground rounded-lg hover:bg-muted transition-colors"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

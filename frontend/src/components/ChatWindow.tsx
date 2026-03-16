'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocketStore } from '@/services/socketService';
import { useAuthStore } from '@/services/authService';
import api from '@/services/api';
import { User, Message } from '@/types';
import { Send, X, User as UserIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/utils/utils';

interface ChatWindowProps {
  friend: User;
  onClose: () => void;
}

export default function ChatWindow({ friend, onClose }: ChatWindowProps) {
  const { user } = useAuthStore();
  const { socket } = useSocketStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${friend._id}`);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    if (socket) {
      socket.on('receiveMessage', (message: Message) => {
        if (message.senderId === friend._id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }

    return () => {
      if (socket) socket.off('receiveMessage');
    };
  }, [friend._id, socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      receiverId: friend._id,
      content: newMessage.trim()
    };

    try {
      const { data } = await api.post('/chat', messageData);
      
      // Emit via socket for real-time
      if (socket) {
        socket.emit('privateMessage', messageData);
      }

      setMessages((prev) => [...prev, data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 md:w-96 h-[500px] glass-panel rounded-3xl shadow-2xl flex flex-col z-[60] border border-white/10 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src={friend.profileImage || `https://ui-avatars.com/api/?name=${friend.name}&background=random`}
              alt={friend.name}
              fill
              className="rounded-full ring-2 ring-primary/20 object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-sm font-bold truncate max-w-[150px]">{friend.name}</p>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-50">
            <div className="p-4 bg-secondary rounded-full">
              <UserIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No messages yet.</p>
            <p className="text-xs">Start the conversation by saying Hi!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?._id;
            return (
              <div 
                key={idx} 
                className={cn(
                  "flex flex-col max-w-[80%]",
                  isMe ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "px-4 py-2 rounded-2xl text-sm shadow-sm",
                  isMe ? "bg-primary text-white rounded-tr-none" : "bg-secondary/80 text-foreground rounded-tl-none"
                )}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {format(new Date(msg.createdAt), 'HH:mm')}
                </span>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-secondary/30 border-t border-white/5 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-secondary/50 rounded-xl px-4 py-2 text-sm outline-none border border-white/5 focus:border-primary/50 transition-colors"
        />
        <button 
          type="submit"
          title="Send message"
          disabled={!newMessage.trim()}
          className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

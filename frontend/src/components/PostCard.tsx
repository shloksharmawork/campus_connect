'use client';

import { Post, Reaction } from '@/types';
import { Mic, FileText, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/services/authService';
import { useState } from 'react';
import api from '@/services/api';
import Image from 'next/image';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

function getReactionCounts(reactions: Reaction[]) {
  const counts: Record<string, number> = {};
  reactions.forEach((r) => {
    counts[r.emoji] = (counts[r.emoji] || 0) + 1;
  });
  return counts;
}

export default function PostCard({ post, onDelete, onUpdate }: { 
  post: Post; 
  onDelete?: (id: string) => void;
  onUpdate?: (post: Post) => void;
}) {
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [localReactions, setLocalReactions] = useState<Reaction[]>(post.reactions || []);
  const [audioUrl, setAudioUrl] = useState<string>(post.audioUrl || '');
  const [refreshingAudio, setRefreshingAudio] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const isOwner =
    user?._id === post.userId?._id ||
    (typeof post.userId === 'string' && user?._id === post.userId);

  const myReaction = localReactions.find((r) => r.userId === user?._id);
  const reactionCounts = getReactionCounts(localReactions);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefreshAudio = async () => {
    setRefreshingAudio(true);
    try {
      const { data } = await api.post<Post>(`/posts/${post._id}/refresh-audio`);
      setAudioUrl(data.audioUrl || '');
    } catch (err) {
      console.error('Failed to refresh audio URL', err);
      alert('Could not refresh audio. Please try again.');
    } finally {
      setRefreshingAudio(false);
    }
  };

  const handleReact = async (emoji: string) => {
    setShowEmojiPicker(false);
    if (!user) return;

    // Optimistic update
    const prev = [...localReactions];
    const existing = localReactions.find((r) => r.userId === user._id);
    let next: Reaction[];
    if (existing) {
      if (existing.emoji === emoji) {
        next = localReactions.filter((r) => r.userId !== user._id);
      } else {
        next = localReactions.map((r) => r.userId === user._id ? { ...r, emoji } : r);
      }
    } else {
      next = [...localReactions, { userId: user._id, emoji }];
    }
    setLocalReactions(next);

    try {
      const { data } = await api.post<Post>(`/posts/${post._id}/react`, { emoji });
      setLocalReactions(data.reactions || []);
      if (onUpdate) onUpdate(data);
    } catch (err) {
      console.error(err);
      setLocalReactions(prev); // rollback
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 hover:border-white/20 transition-all border border-white/5 relative group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative w-10 h-10 shrink-0">
          <Image
            src={post.userId?.profileImage || `https://ui-avatars.com/api/?name=${post.userId?.name}&background=random`}
            alt={post.userId?.name || 'User'}
            fill
            className="rounded-full ring-2 ring-primary/20 object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm">{post.userId?.name}</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${post.type === 'voice' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
              {post.type === 'voice' ? <Mic className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              {post.type === 'voice' ? 'Voice Note' : 'Text Post'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all disabled:opacity-50"
            title="Delete post"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Content */}
      {post.type === 'text' && post.content && (
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap mb-4">{post.content}</p>
      )}

      {post.type === 'image' && post.imageUrl && (
        <div className="mb-4 rounded-2xl overflow-hidden border border-white/5">
          <div className="relative w-full">
            <Image
              src={post.imageUrl}
              alt="Post image"
              width={800}
              height={500}
              className="w-full object-cover max-h-[480px]"
              unoptimized
            />
          </div>
          {post.content && (
            <p className="px-4 py-2 text-sm text-foreground/80 bg-secondary/20 border-t border-white/5">
              {post.content}
            </p>
          )}
        </div>
      )}

      {post.type === 'voice' && audioUrl && (
        <div className="space-y-2 mb-4">
          <div className="rounded-xl overflow-hidden bg-secondary/50 p-2">
            <audio
              controls
              key={audioUrl}
              className="w-full h-10 accent-accent"
              src={audioUrl}
              onError={() => {}}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="flex items-center gap-3 px-2">
            <button
              onClick={handleRefreshAudio}
              disabled={refreshingAudio}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              title="Refresh audio if it's not playing"
            >
              {refreshingAudio
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <RefreshCw className="h-3 w-3" />}
              {refreshingAudio ? 'Refreshing...' : 'Refresh audio'}
            </button>
          </div>
        </div>
      )}

      {/* Reactions Bar */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
        {/* Existing reactions */}
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105 ${
              myReaction?.emoji === emoji
                ? 'bg-primary/20 border-primary/40 text-primary'
                : 'bg-secondary/60 border-white/5 text-foreground/70 hover:border-white/20'
            }`}
          >
            <span>{emoji}</span>
            <span>{count}</span>
          </button>
        ))}

        {/* Add reaction button */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker((p) => !p)}
            title="Add reaction"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-white/5 bg-secondary/40 hover:bg-secondary/80 transition-all text-muted-foreground hover:text-foreground"
          >
            {myReaction ? myReaction.emoji : '＋'} React
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-9 left-0 z-20 flex gap-1 bg-secondary/95 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-xl">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="text-xl hover:scale-125 transition-transform p-1"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Post } from '@/types';
import { Mic, FileText, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/services/authService';
import { useState } from 'react';
import api from '@/services/api';
import Image from 'next/image';

export default function PostCard({ post, onDelete }: { post: Post, onDelete?: (id: string) => void }) {
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  const isOwner = user?._id === post.userId?._id || (typeof post.userId === 'string' && user?._id === post.userId);

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

  return (
    <div className="glass-panel rounded-2xl p-5 hover:border-white/20 transition-all border border-white/5 relative group">
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

      {post.type === 'text' && (
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{post.content}</p>
      )}

      {post.type === 'voice' && post.audioUrl && (
        <div className="space-y-2">
          <div className="rounded-xl overflow-hidden bg-secondary/50 p-2">
            <audio controls className="w-full h-10 accent-accent" src={post.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
          <a 
            href={post.audioUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-2"
          >
            Trouble playing? Open audio file directly
          </a>
        </div>
      )}
    </div>
  );
}

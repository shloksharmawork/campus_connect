'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Post } from '@/types';
import PostCard from './PostCard';
import VoiceRecorder from './VoiceRecorder';
import { Send, Mic, FileText, Loader2 } from 'lucide-react';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<'text' | 'voice'>('text');

  const fetchFeed = async () => {
    try {
      const { data } = await api.get('/posts/feed');
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleTextPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/posts/text', { content: text });
      setPosts([data, ...posts]);
      setText('');
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Failed to create post';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoicePost = async (blob: Blob) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'voice-note.webm');
      const { data } = await api.post('/posts/voice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts([data, ...posts]);
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Failed to send voice note';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p._id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-8 max-w-2xl mx-auto w-full">
      {/* Composer */}
      <div className="glass-panel rounded-2xl p-5 mb-6 mt-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'text' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <FileText className="h-4 w-4" /> Text Post
          </button>
          <button
            onClick={() => setTab('voice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'voice' ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <Mic className="h-4 w-4" /> Voice Note
          </button>
        </div>

        {tab === 'text' ? (
          <form onSubmit={handleTextPost} className="flex flex-col gap-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share something with your campus..."
              className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none border border-white/5 focus:border-primary/50 resize-none min-h-[90px] transition-colors"
            />
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="btn-primary self-end flex items-center gap-2"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post
            </button>
          </form>
        ) : (
          <VoiceRecorder onSubmit={handleVoicePost} submitting={submitting} />
        )}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-1">No posts yet</p>
          <p className="text-sm">Connect with classmates to see their posts here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}
    </div>
  );
}

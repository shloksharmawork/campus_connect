'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import { Post } from '@/types';
import PostCard from './PostCard';
import VoiceRecorder from './VoiceRecorder';
import { Send, Mic, FileText, ImagePlus, Loader2, X, Upload } from 'lucide-react';
import Image from 'next/image';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<'text' | 'voice' | 'image'>('text');

  // Image post state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => { fetchFeed(); }, []);

  const handleTextPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/posts/text', { content: text });
      setPosts([data, ...posts]);
      setText('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to create post');
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
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to send voice note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX = 10 * 1024 * 1024;
    if (file.size > MAX) { alert('Image must be under 10 MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImagePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      if (imageCaption.trim()) formData.append('content', imageCaption);
      const { data } = await api.post('/posts/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts([data, ...posts]);
      clearImage();
      setImageCaption('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = (id: string) => setPosts(posts.filter(p => p._id !== id));
  const handleUpdatePost = (updated: Post) => setPosts(posts.map(p => p._id === updated._id ? updated : p));

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-8 max-w-2xl mx-auto w-full">
      {/* Composer */}
      <div className="glass-panel rounded-2xl p-5 mb-6 mt-4">
        {/* Tab Bar */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'text' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <FileText className="h-4 w-4" /> Text
          </button>
          <button
            onClick={() => setTab('voice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'voice' ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <Mic className="h-4 w-4" /> Voice
          </button>
          <button
            onClick={() => setTab('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'image' ? 'bg-green-600 text-white' : 'text-muted-foreground hover:bg-secondary'}`}
          >
            <ImagePlus className="h-4 w-4" /> Image
          </button>
        </div>

        {/* Text Tab */}
        {tab === 'text' && (
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
        )}

        {/* Voice Tab */}
        {tab === 'voice' && (
          <VoiceRecorder onSubmit={handleVoicePost} submitting={submitting} />
        )}

        {/* Image Tab */}
        {tab === 'image' && (
          <form onSubmit={handleImagePost} className="flex flex-col gap-3">
            {/* Drop zone */}
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500/50 hover:bg-green-500/5 transition-all"
              >
                <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">Click to select an image</p>
                <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WEBP · Max 10 MB</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <div className="relative w-full aspect-video">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain bg-black/30"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageSelect}
            />

            {imagePreview && (
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Add a caption... (optional)"
                className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-sm outline-none border border-white/5 focus:border-green-500/50 transition-colors"
              />
            )}

            <button
              type="submit"
              disabled={submitting || !imageFile}
              className="self-end flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              Share Image
            </button>
          </form>
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
            <PostCard key={post._id} post={post} onDelete={handleDeletePost} onUpdate={handleUpdatePost} />
          ))}
        </div>
      )}
    </div>
  );
}

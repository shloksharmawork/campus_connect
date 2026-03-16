'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../services/authService';
import { useSocketStore } from '../services/socketService';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth, isAuthenticated, token, isLoading } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && token) {
      connect(token);
    } else {
      disconnect();
    }
  }, [isAuthenticated, token, connect, disconnect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-center">
        <div className="max-w-md glass-panel p-8 rounded-3xl border-destructive/20 bg-destructive/5">
          <h2 className="text-xl font-bold text-destructive mb-4">Configuration Missing</h2>
          <p className="text-muted-foreground mb-6">
            Google Client ID is not configured. Please create a <code className="bg-secondary px-1.5 py-0.5 rounded text-white font-mono">.env.local</code> file in the <code className="bg-secondary px-1.5 py-0.5 rounded text-white font-mono">frontend/</code> directory with:
          </p>
          <pre className="bg-black/40 p-4 rounded-xl text-xs font-mono text-left text-primary-foreground/80 mb-6 overflow-x-auto">
            NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id_here
          </pre>
          <p className="text-xs text-muted-foreground">Restart your development server after creating the file.</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

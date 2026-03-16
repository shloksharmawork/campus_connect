'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/services/authService';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      setError(null);
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 403) {
        setError('Only MITS Gwalior students can access this platform.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[128px] translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md glass-panel p-8 rounded-[2rem] relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="bg-primary/20 p-4 rounded-2xl ring-1 ring-primary/50">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Campus Connect</h1>
            <p className="text-muted-foreground">Sign in to join your college network</p>
          </div>

          {error && (
            <div className="w-full bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="w-full h-12 flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError('Google Sign-In failed')}
              theme="filled_blue"
              shape="pill"
            />
          </div>

          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            Please use your official <span className="text-primary font-medium">@mitsgwl.ac.in</span> email address to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}

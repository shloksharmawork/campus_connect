'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Send, Loader2, Trash2 } from 'lucide-react';

interface VoiceRecorderProps {
  onSubmit: (blob: Blob) => void;
  submitting: boolean;
}

export default function VoiceRecorder({ onSubmit, submitting }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setSeconds(0);
  };

  const handleSubmit = () => {
    if (audioBlob) onSubmit(audioBlob);
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}

      {!audioUrl ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-destructive text-white scale-110 shadow-lg shadow-destructive/40 animate-pulse'
                : 'bg-accent text-white hover:bg-accent/90 hover:scale-105'
            }`}
          >
            {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
          {isRecording && (
            <p className="text-destructive font-mono text-lg font-bold">{formatTime(seconds)}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Recording… click to stop' : 'Click to start recording'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <audio controls className="w-full accent-accent" src={audioUrl} />
          <div className="flex gap-2 justify-end">
            <button onClick={discardRecording} className="btn-secondary flex items-center gap-2 text-sm">
              <Trash2 className="h-4 w-4" /> Discard
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex items-center gap-2 text-sm bg-accent hover:bg-accent/90"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

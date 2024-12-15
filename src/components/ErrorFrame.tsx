import { XCircle } from 'lucide-react';

interface ErrorFrameProps {
  error: string;
}

export function ErrorFrame({ error }: ErrorFrameProps) {
  return (
    <iframe className="w-full h-32 bg-red-950/20 rounded-lg border border-red-500/20">
      <div className="p-4 flex items-start gap-3">
        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
        <div className="text-red-200">{error}</div>
      </div>
    </iframe>
  );
}
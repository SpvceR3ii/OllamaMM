import React from 'react';
import { Box } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Box className="w-8 h-8 text-blue-400" />
        <div className="absolute inset-0 blur-lg bg-blue-400/20" />
      </div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
        Ollama Model Manager
      </h1>
    </div>
  );
}
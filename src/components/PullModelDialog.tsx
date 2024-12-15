import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { pullModel } from '../services/api';
import { PullProgress } from '../types/model';

interface PullModelDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function PullModelDialog({ onClose, onSuccess }: PullModelDialogProps) {
  const [modelName, setModelName] = useState('');
  const [progress, setProgress] = useState<PullProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePull = async () => {
    if (!modelName.trim()) return;
    
    try {
      setError(null);
      await pullModel(modelName, (progress) => {
        setProgress(progress);
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pull model');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-gray-100">Pull New Model</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="modelName" className="block text-sm font-medium text-gray-300 mb-2">
              Model Name
            </label>
            <input
              id="modelName"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., llama2:latest"
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg py-2 px-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {progress && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{progress.status}</span>
                {progress.completed && progress.total && (
                  <span>{Math.round((progress.completed / progress.total) * 100)}%</span>
                )}
              </div>
              {progress.completed && progress.total && (
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-950/20 border border-red-500/20 rounded-lg p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePull}
              disabled={!modelName.trim() || !!progress}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pull Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
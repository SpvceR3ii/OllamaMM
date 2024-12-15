import React, { useState } from 'react';
import { OllamaModel } from '../types/model';
import { Box, Info, Database, Clock, Trash2, Edit3 } from 'lucide-react';
import { formatSize, formatDate } from '../utils/formatters';
import { deleteModel, renameModel } from '../services/api';

interface ModelDetailsProps {
  model: OllamaModel;
  onClose: () => void;
  onModelUpdated: () => void;
}

export function ModelDetails({ model, onClose, onModelUpdated }: ModelDetailsProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(model.name);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRename = async () => {
    if (!newName.trim() || newName === model.name) return;
    
    try {
      setError(null);
      await renameModel(model.name, newName);
      onModelUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename model');
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    
    try {
      setError(null);
      await deleteModel(model.name);
      onModelUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete model');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-800">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Box className="w-8 h-8 text-blue-400" />
            {isRenaming ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-2xl font-bold bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-100">{model.name}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isRenaming ? (
              <>
                <button
                  onClick={() => setIsRenaming(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors px-3 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsRenaming(true)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  title="Rename"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className={`text-gray-400 hover:text-red-400 transition-colors ${
                    isDeleting ? 'text-red-400' : ''
                  }`}
                  title={isDeleting ? 'Click again to confirm' : 'Delete'}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200 transition-colors ml-2"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/20 border border-red-500/20 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Database className="w-4 h-4" />
                <span>Size</span>
              </div>
              <p className="text-lg text-gray-100">{formatSize(model.size)}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                <span>Last Modified</span>
              </div>
              <p className="text-lg text-gray-100">{formatDate(model.modified_at)}</p>
            </div>
          </div>

          {model.details && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <Info className="w-4 h-4" />
                <span>Model Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Format</p>
                  <p className="text-gray-100">{model.details.format}</p>
                </div>
                <div>
                  <p className="text-gray-400">Family</p>
                  <p className="text-gray-100">{model.details.family}</p>
                </div>
                <div>
                  <p className="text-gray-400">Parameter Size</p>
                  <p className="text-gray-100">{model.details.parameter_size}</p>
                </div>
                <div>
                  <p className="text-gray-400">Quantization</p>
                  <p className="text-gray-100">{model.details.quantization_level}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
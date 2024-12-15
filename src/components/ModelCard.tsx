import React from 'react';
import { Box, HardDrive, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { OllamaModel } from '../types/model';
import { formatSize, formatDate } from '../utils/formatters';

interface ModelCardProps {
  model: OllamaModel;
  onSelect: (model: OllamaModel) => void;
}

export function ModelCard({ model, onSelect }: ModelCardProps) {
  return (
    <motion.div 
      onClick={() => onSelect(model)}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 
                hover:bg-gray-800/70 transition-all cursor-pointer group relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-100">{model.name}</h3>
          <Box className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <HardDrive className="w-4 h-4" />
            <span>{formatSize(model.size)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(model.modified_at)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
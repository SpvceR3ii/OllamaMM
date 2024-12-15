import React from 'react';
import { OllamaModel } from '../types/model';
import { ModelCard } from './ModelCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ModelGridProps {
  models: OllamaModel[];
  onSelect: (model: OllamaModel) => void;
}

export function ModelGrid({ models, onSelect }: ModelGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {models.map((model) => (
          <motion.div
            key={model.digest}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ModelCard model={model} onSelect={onSelect} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
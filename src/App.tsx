import { useState } from 'react';
import { Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './components/Logo';
import { SearchBar } from './components/SearchBar';
import { ModelGrid } from './components/ModelGrid';
import { ModelDetails } from './components/ModelDetails';
import { ErrorFrame } from './components/ErrorFrame';
import { PullModelDialog } from './components/PullModelDialog';
import { useModels } from './hooks/useModels';
import { OllamaModel } from './types/model';

function App() {
  const { models, error, isLoading, reloadModels } = useModels();
  const [selectedModel, setSelectedModel] = useState<OllamaModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPullDialog, setShowPullDialog] = useState(false);

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <motion.div 
        className="bg-gradient-to-b from-gray-800 to-gray-900 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex justify-between items-center">
            <Logo />
            <motion.button
              onClick={() => setShowPullDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 transition-colors relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Pull Model</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 
                          opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <main className="container mx-auto px-4 py-8">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {error && <ErrorFrame error={error} />}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-400 py-12"
            >
              Loading models
            </motion.div>
          ) : (
            <ModelGrid 
              key="grid"
              models={filteredModels} 
              onSelect={setSelectedModel} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedModel && (
            <ModelDetails
              model={selectedModel}
              onClose={() => setSelectedModel(null)}
              onModelUpdated={reloadModels}
            />
          )}

          {showPullDialog && (
            <PullModelDialog
              onClose={() => setShowPullDialog(false)}
              onSuccess={reloadModels}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
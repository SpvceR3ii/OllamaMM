import { useState, useEffect, useCallback } from 'react';
import { OllamaModel } from '../types/model';
import { fetchModels } from '../services/api';

export function useModels() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadModels = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchModels();
      const sortedModels = data.sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name);
        if (nameCompare !== 0) return nameCompare;
        return new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime();
      });
      setModels(sortedModels);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return { models, error, isLoading, reloadModels: loadModels };
}
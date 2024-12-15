import { OllamaModel, PullProgress } from '../types/model';

const API_BASE_URL = 'http://localhost:11434/api';

export async function fetchModels(): Promise<OllamaModel[]> {
  const response = await fetch(`${API_BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }
  const data = await response.json();
  return data.models || [];
}

export async function deleteModel(name: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete model');
  }
}

export async function renameModel(oldName: string, newName: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/copy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ source: oldName, destination: newName }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to rename model');
  }
  
  await deleteModel(oldName);
}

export async function pullModel(name: string, onProgress: (progress: PullProgress) => void): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pull`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to start model pull');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to read response stream');
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = new TextDecoder().decode(value);
      const lines = text.split('\n').filter(Boolean);
      
      for (const line of lines) {
        const progress = JSON.parse(line);
        onProgress(progress);
      }
    }
  } finally {
    reader.releaseLock();
  }
}
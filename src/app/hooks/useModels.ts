import { useState, useEffect } from 'react';

export interface Model {
  _id: string;
  name: string;
  slug: string;
  category: string;
  modelFile: {
    url: string;
    publicId: string;
    size: number;
  };
  thumbnail?: {
    url: string;
    publicId: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  description: string;
  tags: string[];
  isWallMounted: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface UseModelsResult {
  models: Model[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useModels(filters?: {
  category?: string;
  isWallMounted?: boolean;
  search?: string;
}): UseModelsResult {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('status', 'active');
      params.append('limit', '100'); // Get all active models
      
      if (filters?.category) {
        params.append('category', filters.category);
      }
      
      if (filters?.isWallMounted !== undefined) {
        params.append('isWallMounted', filters.isWallMounted.toString());
      }
      
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const response = await fetch(`/api/models?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch models');
      }

      setModels(data.data || []);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [filters?.category, filters?.isWallMounted, filters?.search]);

  return {
    models,
    loading,
    error,
    refetch: fetchModels,
  };
}
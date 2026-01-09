'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useModels } from '@/app/hooks/useModels';

interface Model {
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

export default function ModelTemplatesPage() {
  const { models, loading, error, refetch } = useModels();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(modelId);
    try {
      const response = await fetch(`/api/models/${modelId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete model');
      }

      // Refresh the models list
      refetch();
    } catch (error) {
      console.error('Error deleting model:', error);
      alert('Failed to delete model. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">3D Model Templates</h1>
        <Link 
          href="/dashboard/model-templates/add"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Upload New Model
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">
          Manage 3D models (.glb files) that users can use to decorate their rooms. 
          Maximum file size: 5MB per model.
        </p>
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading models...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">Error loading models: {error}</p>
            <button 
              onClick={refetch}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && models.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-500 mb-4">Get started by uploading your first 3D model.</p>
            <Link 
              href="/dashboard/model-templates/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Upload Model
            </Link>
          </div>
        )}

        {!loading && !error && models.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <div key={model._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{model.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    model.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : model.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                  </span>
                </div>
                
                {model.thumbnail && (
                  <div className="mb-3">
                    <img 
                      src={model.thumbnail.url} 
                      alt={model.name}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>📁 {model.slug}.glb</span>
                    <span className="font-medium">{formatFileSize(model.modelFile.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📏 {model.dimensions.width}' × {model.dimensions.height}' × {model.dimensions.depth}'</span>
                    <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{model.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📅 {formatDate(model.createdAt)}</span>
                  </div>
                  {model.isWallMounted && (
                    <div className="flex items-center gap-1">
                      <span className="text-purple-600">🖼️ Wall Mountable</span>
                    </div>
                  )}
                  {model.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {model.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {model.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">+{model.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <a 
                    href={model.modelFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 text-center"
                  >
                    Preview
                  </a>
                  <Link 
                    href={`/dashboard/model-templates/edit/${model._id}`}
                    className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm hover:bg-green-200 text-center"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(model._id)}
                    disabled={deleteLoading === model._id}
                    className="bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 disabled:opacity-50"
                  >
                    {deleteLoading === model._id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
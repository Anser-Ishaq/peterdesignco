'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";
import CustomSwitch from "@/app/components/ui/customSwitch/customSwitch";

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
}

export default function EditModelTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.id as string;
  
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    model?: boolean;
    thumbnail?: boolean;
  }>({});
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    description: '',
    width: '',
    height: '',
    depth: '',
    tags: '',
    status: 'active' as 'active' | 'inactive' | 'draft',
  });

  const [isWallMounted, setIsWallMounted] = useState(false);
  
  const [files, setFiles] = useState<{
    model?: File;
    thumbnail?: File;
  }>({});

  // Load model data
  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await fetch(`/api/models/${modelId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch model');
        }
        
        const data = await response.json();
        const modelData = data.data;
        
        setModel(modelData);
        setFormData({
          name: modelData.name,
          slug: modelData.slug,
          category: modelData.category,
          description: modelData.description,
          width: modelData.dimensions.width.toString(),
          height: modelData.dimensions.height.toString(),
          depth: modelData.dimensions.depth.toString(),
          tags: modelData.tags.join(', '),
          status: modelData.status,
        });
        setIsWallMounted(modelData.isWallMounted);
      } catch (error) {
        console.error('Error fetching model:', error);
        alert('Failed to load model data');
        router.push('/dashboard/model-templates');
      } finally {
        setLoading(false);
      }
    };

    if (modelId) {
      fetchModel();
    }
  }, [modelId, router]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: generateSlug(value) })
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (fileList: FileList | null, type: 'model' | 'thumbnail') => {
    if (fileList && fileList[0]) {
      const file = fileList[0];
      
      if (type === 'model' && !file.name.toLowerCase().endsWith('.glb')) {
        alert('Please select a GLB file for the 3D model.');
        return;
      }
      
      if (type === 'thumbnail' && !file.type.startsWith('image/')) {
        alert('Please select an image file for the thumbnail.');
        return;
      }
      
      const maxSize = type === 'model' ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size must be less than ${maxSize / (1024 * 1024)}MB.`);
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const uploadFile = async (file: File, type: 'model' | 'thumbnail') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    setUploadProgress(prev => ({ ...prev, [type]: true }));

    try {
      const response = await fetch('/api/models/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    } finally {
      setUploadProgress(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!model) return;

    setSaving(true);

    try {
      let modelFileData = model.modelFile;
      let thumbnailData = model.thumbnail;

      // Upload new model file if selected
      if (files.model) {
        const uploadedModel = await uploadFile(files.model, 'model');
        modelFileData = {
          url: uploadedModel.url,
          publicId: uploadedModel.publicId,
          size: uploadedModel.size
        };
      }

      // Upload new thumbnail if selected
      if (files.thumbnail) {
        const uploadedThumbnail = await uploadFile(files.thumbnail, 'thumbnail');
        thumbnailData = {
          url: uploadedThumbnail.url,
          publicId: uploadedThumbnail.publicId
        };
      }

      // Update model record
      const updatePayload = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        dimensions: {
          width: parseFloat(formData.width),
          height: parseFloat(formData.height),
          depth: parseFloat(formData.depth)
        },
        modelFile: modelFileData,
        ...(thumbnailData && { thumbnail: thumbnailData }),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isWallMounted,
        status: formData.status,
      };

      const response = await fetch(`/api/models/${modelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update model');
      }

      router.push('/dashboard/model-templates');
    } catch (error) {
      console.error('Error updating model:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to update model'}`);
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading model...</span>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Model not found</h2>
        <button
          onClick={() => router.push('/dashboard/model-templates')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Models
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit 3D Model</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Model Information */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Model Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CustomInput
                  id="name"
                  name="name"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="Enter model name"
                  label="Model Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              <div>
                <CustomInput
                  id="slug"
                  name="slug"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="model-slug"
                  label="URL Slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="chair">Chair</option>
                  <option value="table">Table</option>
                  <option value="sofa">Sofa</option>
                  <option value="bed">Bed</option>
                  <option value="shelf">Shelf</option>
                  <option value="tv">TV</option>
                  <option value="cabinet">Cabinet</option>
                  <option value="lamp">Lamp</option>
                  <option value="plant">Plant</option>
                  <option value="decoration">Decoration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <CustomInput
                  id="tags"
                  name="tags"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="modern, office, wooden (comma separated)"
                  label="Tags (optional)"
                  value={formData.tags}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>

            <div className="mt-4">
              <CustomTextarea
                id="description"
                name="description"
                label="Model Description"
                placeholder="Enter a description of this 3D model"
                value={formData.description}
                onChange={handleTextareaChange}
                required
                border="border border-gray-300 rounded-lg"
                backgroundColor="bg-white"
                padding="py-3 px-4"
                rows={3}
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Model Dimensions (in feet)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <CustomInput
                  id="width"
                  name="width"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="0.0"
                  label="Width (feet)"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.width}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              <div>
                <CustomInput
                  id="height"
                  name="height"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="0.0"
                  label="Height (feet)"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              <div>
                <CustomInput
                  id="depth"
                  name="depth"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="0.0"
                  label="Depth (feet)"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.depth}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>
          </div>

          {/* Current Files */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Files</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded border">
                <h4 className="font-medium mb-2">3D Model File</h4>
                <p className="text-sm text-gray-600">
                  Size: {formatFileSize(model.modelFile.size)}
                </p>
                <a 
                  href={model.modelFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Current File
                </a>
              </div>
              
              {model.thumbnail && (
                <div className="p-3 bg-white rounded border">
                  <h4 className="font-medium mb-2">Thumbnail</h4>
                  <img 
                    src={model.thumbnail.url} 
                    alt="Current thumbnail"
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                  <a 
                    href={model.thumbnail.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Full Size
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Update Files (Optional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace 3D Model File (.glb)
                </label>
                <input
                  type="file"
                  accept=".glb"
                  onChange={(e) => handleFileChange(e.target.files, 'model')}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-white"
                />
                {files.model && (
                  <div className="mt-2 p-2 bg-purple-100 rounded text-sm">
                    <strong>New File:</strong> {files.model.name} ({formatFileSize(files.model.size)})
                  </div>
                )}
                {uploadProgress.model && (
                  <div className="mt-2 text-sm text-blue-600">Uploading model file...</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files, 'thumbnail')}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-white"
                />
                {files.thumbnail && (
                  <div className="mt-2 p-2 bg-purple-100 rounded text-sm">
                    <strong>New Thumbnail:</strong> {files.thumbnail.name} ({formatFileSize(files.thumbnail.size)})
                  </div>
                )}
                {uploadProgress.thumbnail && (
                  <div className="mt-2 text-sm text-blue-600">Uploading thumbnail...</div>
                )}
              </div>
            </div>
          </div>

          {/* Model Properties */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-4">Model Properties</h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg border">
                <CustomSwitch
                  id="isWallMounted"
                  name="isWallMounted"
                  checked={isWallMounted}
                  onChange={setIsWallMounted}
                  label="This model can be wall-mounted"
                  size="md"
                  color="green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  required
                  className="w-full md:w-1/3 border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating Model...' : 'Update Model'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
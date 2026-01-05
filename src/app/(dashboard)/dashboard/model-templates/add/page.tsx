'use client';

import { useState } from 'react';
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";
import CustomSwitch from "@/app/components/ui/customSwitch/customSwitch";

export default function AddModelTemplatePage() {
  const [isWallMounted, setIsWallMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    
    // Dimensions
    width: '',
    height: '',
    depth: '',
    
    // File details
    fileName: '',
    fileSize: '',
    
    // Display properties
    color: '#8B4513',
    textureUrl: '',
    
    // Settings
    status: 'active',
    category: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setFormData({
        ...formData,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const handleTextureChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setFormData({
        ...formData,
        textureUrl: url
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const modelData = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      
      dimensions: {
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        depth: parseFloat(formData.depth)
      },
      
      fileName: formData.fileName,
      fileSize: formData.fileSize,
      color: formData.color,
      textureUrl: formData.textureUrl,
      
      isWallMounted: isWallMounted,
      status: formData.status,
      category: formData.category,
      
      uploadDate: new Date().toISOString(),
      downloads: 0,
      isDefault: false
    };
    
    console.log('3D Model Data:', modelData);
    // Here you would upload the file and send data to your API
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Upload 3D Model</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">Upload a new 3D model (.glb file) for users to decorate their rooms.</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Model Information */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Model Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Model Name */}
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

              {/* Model Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Type <span className="text-red-500">*</span>
                </label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select model type</option>
                  <option value="chair">Chair</option>
                  <option value="table">Table</option>
                  <option value="sofa">Sofa</option>
                  <option value="bed">Bed</option>
                  <option value="tv">TV</option>
                  <option value="shelf">Shelf</option>
                  <option value="plant">Plant</option>
                  <option value="decoration">Decoration</option>
                  <option value="lighting">Lighting</option>
                  <option value="room">Room/Interior</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="decoration">Decoration</option>
                  <option value="lighting">Lighting</option>
                  <option value="storage">Storage</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>

              {/* Default Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Color
                </label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full h-[50px] border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <CustomTextarea
                id="description"
                name="description"
                label="Model Description"
                placeholder="Enter a description of this 3D model"
                value={formData.description}
                onChange={handleTextareaChange}
                border="border border-gray-300 rounded-lg"
                backgroundColor="bg-white"
                padding="py-3 px-4"
                rows={3}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">File Upload</h3>
            
            <div className="space-y-4">
              {/* GLB File */}
              <div>
                <CustomInput
                  label="3D Model File (.glb)"
                  id="modelFile"
                  name="modelFile"
                  type="file"
                  accept=".glb"
                  onFileChange={handleFileChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
                {formData.fileName && (
                  <div className="mt-2 p-2 bg-purple-100 rounded text-sm">
                    <strong>File:</strong> {formData.fileName} ({formData.fileSize})
                  </div>
                )}
              </div>
            </div>

            {/* File Guidelines */}
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">File Requirements:</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• File format: .glb (GLTF Binary)</li>
                <li>• Maximum file size: 50 MB</li>
              </ul>
            </div>
          </div>

          {/* Dimensions */}
          {/* <div className="p-4 bg-green-50 rounded-lg border border-green-200">
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
                  min="0"
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
                  min="0"
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
                  min="0"
                  value={formData.depth}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>
          </div> */}

          {/* Model Properties */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-4">Model Properties</h3>
            
            <div className="space-y-4">
              {/* Wall Mounted Switch */}
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
                {isWallMounted && (
                  <p className="text-sm text-orange-600 mt-2">
                    Wall-mounted models can be placed on room walls and moved vertically.
                  </p>
                )}
              </div>

              {/* Status */}
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
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium"
            >
              Upload Model
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium"
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="bg-red-100 text-red-700 px-8 py-3 rounded-lg hover:bg-red-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
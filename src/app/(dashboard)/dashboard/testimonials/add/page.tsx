'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddTestimonialPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    review: '',
    rating: 5,
    imageUrl: '',
    imagePublicId: '',
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const uploadImage = async (file: File) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    const response = await fetch('/api/testimonials/upload', {
      method: 'POST',
      credentials: 'include',
      body: uploadFormData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to upload image');
    }

    return data.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.review) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }

    try {
      setLoading(true);
      
      let imageData = null;
      if (selectedFile) {
        setUploading(true);
        imageData = await uploadImage(selectedFile);
        setUploading(false);
      }

      const testimonialData = {
        ...formData,
        ...(imageData && {
          imageUrl: imageData.url,
          imagePublicId: imageData.publicId,
        }),
      };

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(testimonialData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Testimonial created successfully!');
        router.push('/dashboard/testimonials');
      } else {
        alert(data.error || 'Failed to create testimonial');
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      alert('Failed to create testimonial');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-2xl cursor-pointer ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => setFormData(prev => ({ ...prev, rating: index + 1 }))}
      >
        ★
      </span>
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Testimonial</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Please log in to add testimonials.</p>
        </div>
      </div>
    );
  }

  const isSubmitting = loading || uploading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Add New Testimonial</h1>
        <Link
          href="/dashboard/testimonials"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back to List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter job position"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPEG, PNG, WebP. Max size: 5MB
              </p>
            </div>
          </div>

          {imagePreview && (
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full border"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review *
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the testimonial review"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.review.length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center gap-2">
              {renderStars(formData.rating)}
              <span className="text-sm text-gray-600 ml-2">
                ({formData.rating}/5)
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Click on stars to set rating
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active (visible on website)
            </label>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading Image...' : loading ? 'Creating...' : 'Create Testimonial'}
            </button>
            <Link
              href="/dashboard/testimonials"
              className="flex-1 text-center bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Preview */}
      {(formData.name || formData.review) && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={formData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {formData.name ? formData.name.charAt(0) : '?'}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900">
                  {formData.name || 'Client Name'}
                </h4>
                <p className="text-sm text-gray-600">
                  {formData.position || 'Position'}
                  {formData.company && ` at ${formData.company}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {renderStars(formData.rating)}
            </div>
            <p className="text-gray-700 text-sm">
              {formData.review || 'Testimonial review will appear here...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
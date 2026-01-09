"use client";

import { useState } from "react";
import CustomInput from "@/app/components/ui/customInput/customInput";
import CustomTextarea from "@/app/components/ui/customTextarea/customTextarea";
import CustomSwitch from "@/app/components/ui/customSwitch/customSwitch";
import Image from "next/image";

interface UploadedImage {
  url: string;
  publicId: string;
  alt: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export default function AddProductPage() {
  const [isOnSale, setIsOnSale] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic product info
    name: "",
    slug: "",
    category: "",
    description: "",
    sku: "",
    status: "active",

    // Pricing
    originalPrice: "",
    salePrice: "",
    discountPercent: "",

    // Stock
    stockQuantity: "",
    stockStatus: "in_stock",

    // Quality and rating
    quality: "",
    rating: "0",
  });

  const [thumbnailImage, setThumbnailImage] = useState<UploadedImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData({
        ...formData,
        [name]: value,
        slug: slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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

  const handleThumbnailUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setThumbnailUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("images", files[0]);
      formDataUpload.append("imageType", "thumbnail");

      const response = await fetch("/api/products/upload", {
        method: "POST",
        credentials: "include",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success) {
        setThumbnailImage(data.data);
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"]:not([multiple])') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        alert(data.message || "Failed to upload thumbnail");
      }
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      alert("Failed to upload thumbnail");
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    try {
      const formDataUpload = new FormData();
      Array.from(files).forEach((file) => {
        formDataUpload.append("images", file);
      });
      formDataUpload.append("imageType", "gallery");

      const response = await fetch("/api/products/upload", {
        method: "POST",
        credentials: "include",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success) {
        // Add new images to existing gallery images instead of replacing
        setGalleryImages(prevImages => [...prevImages, ...data.data]);
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        alert(data.message || "Failed to upload gallery images");
      }
    } catch (error) {
      console.error("Gallery upload error:", error);
      alert("Failed to upload gallery images");
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thumbnailImage) {
      alert("Please upload a thumbnail image");
      return;
    }

    setIsSubmitting(true);

    // Construct the product object matching the API schema
    const productData = {
      name: formData.name,
      slug: formData.slug,
      category: formData.category,

      thumbnail: {
        url: thumbnailImage.url,
        alt: thumbnailImage.alt,
      },

      images: galleryImages.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),

      rating: parseFloat(formData.rating),

      pricing: {
        original: parseFloat(formData.originalPrice),
        sale: isOnSale ? parseFloat(formData.salePrice) : null,
        discountPercent: isOnSale ? parseFloat(formData.discountPercent) : null,
      },

      stock: {
        quantity: parseInt(formData.stockQuantity),
        status: formData.stockStatus,
      },

      quality: formData.quality,
      description: formData.description,
      sku: formData.sku,
      status: formData.status,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Product created successfully!");
        // Reset form or redirect
        window.location.href = "/dashboard/products";
      } else {
        alert(data.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">This is the add product demo page.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Product Information */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <CustomInput
                  id="name"
                  name="name"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="Enter product name"
                  label="Product Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Auto-generated Slug */}
              <div>
                <CustomInput
                  id="slug"
                  name="slug"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="auto-generated-from-name"
                  label="Product Slug (URL)"
                  value={formData.slug}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-gray-100"
                  padding="py-3 px-4"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* SKU */}
              <div>
                <CustomInput
                  id="sku"
                  name="sku"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="e.g., CHAIR-WD-001"
                  label="SKU (Stock Keeping Unit)"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Category */}
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
                  <option value="furniture">Furniture</option>
                  <option value="office">Office</option>
                  <option value="living-room">Living Room</option>
                  <option value="dining">Dining</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-4">
              <CustomTextarea
                id="description"
                name="description"
                label="Product Description"
                placeholder="Enter detailed product description"
                value={formData.description}
                onChange={handleTextareaChange}
                required
                border="border border-gray-300 rounded-lg"
                backgroundColor="bg-white"
                padding="py-3 px-4"
                rows={4}
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              Product Images
            </h3>

            <div className="space-y-8">
              {/* Thumbnail Image Upload */}
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Thumbnail Image (Single) <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Upload one main image that will be used as the product thumbnail.
                </p>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleThumbnailUpload(e.target.files)}
                    disabled={thumbnailUploading}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {thumbnailUploading && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Uploading thumbnail...</span>
                    </div>
                  )}
                  {thumbnailImage && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">Thumbnail Preview:</span>
                      <div className="relative inline-block">
                        <Image
                          src={thumbnailImage.url}
                          alt={thumbnailImage.alt}
                          width={150}
                          height={150}
                          className="rounded-lg border border-gray-300 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setThumbnailImage(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images Upload */}
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Gallery Images (Multiple)
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Select multiple images at once or upload them in batches. You can add more images later.
                </p>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleGalleryUpload(e.target.files)}
                    disabled={galleryUploading}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {galleryUploading && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Uploading gallery images...</span>
                    </div>
                  )}
                  {galleryImages.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Gallery Images ({galleryImages.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setGalleryImages([])}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {galleryImages.map((image, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              width={120}
                              height={120}
                              className="rounded-lg border border-gray-300 object-cover w-full h-24"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Pricing Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Price */}
              <div>
                <CustomInput
                  id="originalPrice"
                  name="originalPrice"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="0.00"
                  label="Original Price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Rating */}
              <div>
                <CustomInput
                  id="rating"
                  name="rating"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="0.0"
                  label="Product Rating (0-5)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>
            </div>

            {/* Sale Switch */}
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <CustomSwitch
                id="isOnSale"
                name="isOnSale"
                checked={isOnSale}
                onChange={setIsOnSale}
                label="This product is on sale"
                size="md"
                color="green"
              />
            </div>

            {/* Sale Details - Only show when sale is enabled */}
            {isOnSale && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-300">
                <h4 className="text-md font-semibold text-green-800 mb-3">
                  Sale Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomInput
                      id="salePrice"
                      name="salePrice"
                      width="w-full"
                      height="h-[50px]"
                      placeholder="0.00"
                      label="Sale Price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      required={isOnSale}
                      border="border border-green-300 rounded-lg"
                      backgroundColor="bg-white"
                      padding="py-3 px-4"
                    />
                  </div>

                  <div>
                    <CustomInput
                      id="discountPercent"
                      name="discountPercent"
                      width="w-full"
                      height="h-[50px]"
                      placeholder="0"
                      label="Discount Percentage (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercent}
                      onChange={handleInputChange}
                      border="border border-green-300 rounded-lg"
                      backgroundColor="bg-white"
                      padding="py-3 px-4"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stock & Quality Information */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-4">
              Stock & Quality
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stock Quantity */}
              <div>
                <CustomInput
                  id="stockQuantity"
                  name="stockQuantity"
                  width="w-full"
                  height="h-[50px]"
                  placeholder="0"
                  label="Stock Quantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  required
                  border="border border-gray-300 rounded-lg"
                  backgroundColor="bg-white"
                  padding="py-3 px-4"
                />
              </div>

              {/* Stock Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="stockStatus"
                  value={formData.stockStatus}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 bg-white h-[50px] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select quality</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Status */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Product Status
            </h3>

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
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting || thumbnailUploading || galleryUploading}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Product...</span>
                </>
              ) : (
                <span>Add Product</span>
              )}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => window.location.href = "/dashboard/products"}
              className="bg-red-100 text-red-700 px-8 py-3 rounded-lg hover:bg-red-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

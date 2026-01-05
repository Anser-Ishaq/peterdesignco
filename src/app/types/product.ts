export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductThumbnail {
  url: string;
  alt: string;
}

export interface ProductPricing {
  original: number;
  sale: number | null;
  discountPercent: number | null;
}

export interface ProductStock {
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  thumbnail: ProductThumbnail;
  images: ProductImage[];
  rating: number;
  pricing: ProductPricing;
  stock: ProductStock;
  quality: 'Basic' | 'Standard' | 'Premium' | 'Luxury';
  description: string;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
}

export interface ProductFormData {
  // Basic product info
  name: string;
  slug: string;
  category: string;
  description: string;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  
  // Pricing
  originalPrice: string;
  salePrice: string;
  discountPercent: string;
  
  // Stock
  stockQuantity: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  
  // Quality and rating
  quality: 'Basic' | 'Standard' | 'Premium' | 'Luxury' | '';
  rating: string;
  
  // Images
  thumbnailUrl: string;
  thumbnailAlt: string;
}
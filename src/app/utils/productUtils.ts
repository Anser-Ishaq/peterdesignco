import { Product, ProductFormData, ProductImage } from '@/app/types/product';

export function convertFormDataToProduct(
  formData: ProductFormData,
  productImages: ProductImage[],
  isOnSale: boolean
): Omit<Product, 'id'> {
  return {
    name: formData.name,
    slug: formData.slug,
    category: formData.category,
    
    thumbnail: {
      url: formData.thumbnailUrl,
      alt: formData.thumbnailAlt,
    },
    
    images: productImages,
    
    rating: parseFloat(formData.rating) || 0,
    
    pricing: {
      original: parseFloat(formData.originalPrice),
      sale: isOnSale && formData.salePrice ? parseFloat(formData.salePrice) : null,
      discountPercent: isOnSale && formData.discountPercent ? parseFloat(formData.discountPercent) : null,
    },
    
    stock: {
      quantity: parseInt(formData.stockQuantity),
      status: formData.stockStatus,
    },
    
    quality: formData.quality as 'Basic' | 'Standard' | 'Premium' | 'Luxury',
    description: formData.description,
    sku: formData.sku,
    status: formData.status,
  };
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateSKU(category: string, name: string): string {
  const categoryCode = category.toUpperCase().substring(0, 4);
  const nameCode = name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 3);
  const timestamp = Date.now().toString().slice(-3);
  
  return `${categoryCode}-${nameCode}-${timestamp}`;
}

export function validateProductForm(formData: ProductFormData, isOnSale: boolean): string[] {
  const errors: string[] = [];
  
  if (!formData.name.trim()) errors.push('Product name is required');
  if (!formData.category) errors.push('Category is required');
  if (!formData.description.trim()) errors.push('Description is required');
  if (!formData.sku.trim()) errors.push('SKU is required');
  if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
    errors.push('Original price must be greater than 0');
  }
  if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
    errors.push('Stock quantity must be 0 or greater');
  }
  if (!formData.quality) errors.push('Quality level is required');
  
  if (isOnSale) {
    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      errors.push('Sale price must be greater than 0 when product is on sale');
    }
    if (formData.salePrice && formData.originalPrice && 
        parseFloat(formData.salePrice) >= parseFloat(formData.originalPrice)) {
      errors.push('Sale price must be less than original price');
    }
  }
  
  return errors;
}
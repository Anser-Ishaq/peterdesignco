import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: any[];
  quality?: string | number;
  format?: string;
}

/**
 * Upload file to Cloudinary (supports images and 3D models)
 * @param file - File buffer
 * @param options - Upload options
 * @returns Promise with upload result
 */
export async function uploadToCloudinary(
  file: Buffer,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  try {
    // Determine resource type based on file format
    const isModel = options.format === 'glb' || options.format === 'gltf';
    
    // Configuration for different file types
    const uploadOptions = {
      folder: options.folder || (isModel ? '3d-models' : 'team-members'),
      quality: options.quality || 'auto:good',
      transformation: isModel ? undefined : (options.transformation || [
        { 
          width: 800, 
          height: 800, 
          crop: 'fill', 
          gravity: 'face'
        }
      ]),
      resource_type: isModel ? 'raw' as const : 'image' as const,
      overwrite: true,
      invalidate: true,
    };

    // Convert Buffer to base64 string with appropriate MIME type
    let fileToUpload: string;
    if (isModel) {
      fileToUpload = `data:model/gltf-binary;base64,${file.toString('base64')}`;
    } else {
      fileToUpload = `data:image/jpeg;base64,${file.toString('base64')}`;
    }

    const result = await cloudinary.uploader.upload(fileToUpload, uploadOptions);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width || 0,
      height: result.height || 0,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 * @returns Promise with deletion result
 */
export async function deleteFromCloudinary(publicId: string): Promise<{ result: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

/**
 * Generate optimized image URL
 * @param publicId - Public ID of the image
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: string;
    gravity?: string;
  } = {}
): string {
  const defaultOptions = {
    quality: 'auto:good',
    fetch_format: 'auto',
    crop: 'fill',
    gravity: 'face',
    ...options,
  };

  return cloudinary.url(publicId, defaultOptions);
}

export default cloudinary;
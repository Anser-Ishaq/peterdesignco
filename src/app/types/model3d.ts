export interface Model3DDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Model3D {
  id: number;
  name: string;
  type: string;
  description?: string;
  dimensions: Model3DDimensions;
  fileName: string;
  fileSize: string;
  color: string;
  textureUrl?: string;
  isWallMounted: boolean;
  status: 'active' | 'draft' | 'inactive';
  category?: string;
  uploadDate: string;
  downloads: number;
  isDefault: boolean;
}

export interface Model3DFormData {
  name: string;
  type: string;
  description: string;
  width: string;
  height: string;
  depth: string;
  fileName: string;
  fileSize: string;
  color: string;
  textureUrl: string;
  status: 'active' | 'draft' | 'inactive';
  category: string;
}

export type Model3DType = 
  | 'chair'
  | 'table'
  | 'sofa'
  | 'bed'
  | 'tv'
  | 'shelf'
  | 'plant'
  | 'decoration'
  | 'lighting'
  | 'room'
  | 'other';

export type Model3DCategory = 
  | 'furniture'
  | 'electronics'
  | 'decoration'
  | 'lighting'
  | 'storage'
  | 'outdoor';

export type Model3DStatus = 'active' | 'draft' | 'inactive';
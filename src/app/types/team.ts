export interface TeamMemberImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface TeamMemberSocialLinks {
  linkedin?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}

export interface TeamMember {
  _id: string;
  name: string;
  slug: string;
  role: TeamRole;
  position: string;
  image: TeamMemberImage;
  bio: string[];
  socialLinks: TeamMemberSocialLinks;
  order: number;
  status: 'active' | 'inactive';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberFormData {
  // Basic info
  name: string;
  slug: string;
  role: TeamRole;
  position: string;
  
  // Image
  imageUrl: string;
  imagePublicId: string;
  imageAlt?: string;
  
  // Bio
  bioText: string;
  
  // Social links
  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  
  // Order and status
  order: number;
  status: 'active' | 'inactive';
}

export interface TeamApiResponse {
  success: boolean;
  message?: string;
  data?: TeamMember | TeamMember[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

export interface ImageUploadResponse {
  success: boolean;
  message?: string;
  data?: {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
  error?: string;
}

export type TeamRole = 
  | 'architecture'
  | 'interior'
  | 'construction'
  | 'project-management'
  | 'sales'
  | 'marketing'
  | 'administration';
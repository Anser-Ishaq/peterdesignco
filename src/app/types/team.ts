export interface TeamMemberImage {
  url: string;
  alt: string;
}

export interface TeamMemberSocialLinks {
  linkedin: string | null;
  instagram: string | null;
}

export interface TeamMember {
  id: number;
  name: string;
  slug: string;
  role: string;
  position: string;
  image: TeamMemberImage;
  bio: string[];
  socialLinks: TeamMemberSocialLinks;
  order: number;
  status: 'active' | 'inactive';
}

export interface TeamMemberFormData {
  // Basic info
  name: string;
  slug: string;
  role: string;
  position: string;
  
  // Image
  imageUrl: string;
  imageAlt: string;
  
  // Bio
  bioText: string;
  
  // Social links
  linkedinUrl: string;
  instagramUrl: string;
  
  // Order and status
  order: string;
  status: 'active' | 'inactive';
}

export type TeamRole = 
  | 'architecture'
  | 'interior'
  | 'construction'
  | 'project-management'
  | 'sales'
  | 'marketing'
  | 'administration';
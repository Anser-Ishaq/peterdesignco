import { TeamMember, TeamRole, TeamMemberFormData } from '@/app/types/team';

/**
 * Generate a URL-friendly slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate team member data
 */
export function validateTeamMemberData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!data.slug || typeof data.slug !== 'string' || !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  if (!data.role || !isValidTeamRole(data.role)) {
    errors.push('Invalid role specified');
  }

  if (!data.position || typeof data.position !== 'string' || data.position.trim().length < 2) {
    errors.push('Position must be at least 2 characters long');
  }

  if (!data.image?.url || !data.image?.publicId) {
    errors.push('Image URL and public ID are required');
  }

  if (data.bio && !Array.isArray(data.bio)) {
    errors.push('Bio must be an array of strings');
  }

  if (data.order !== undefined && (typeof data.order !== 'number' || data.order < 0)) {
    errors.push('Order must be a non-negative number');
  }

  if (data.status && !['active', 'inactive'].includes(data.status)) {
    errors.push('Status must be either "active" or "inactive"');
  }

  // Validate social links
  if (data.socialLinks) {
    if (data.socialLinks.linkedin && !isValidUrl(data.socialLinks.linkedin, 'linkedin.com')) {
      errors.push('Invalid LinkedIn URL');
    }
    if (data.socialLinks.instagram && !isValidUrl(data.socialLinks.instagram, 'instagram.com')) {
      errors.push('Invalid Instagram URL');
    }
    if (data.socialLinks.facebook && !isValidUrl(data.socialLinks.facebook, 'facebook.com')) {
      errors.push('Invalid Facebook URL');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a role is valid
 */
export function isValidTeamRole(role: string): role is TeamRole {
  const validRoles: TeamRole[] = [
    'architecture',
    'interior',
    'construction',
    'project-management',
    'sales',
    'marketing',
    'administration',
  ];
  return validRoles.includes(role as TeamRole);
}

/**
 * Validate URL for specific domain
 */
function isValidUrl(url: string, domain?: string): boolean {
  try {
    const urlObj = new URL(url);
    if (domain) {
      return urlObj.hostname.includes(domain);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Format team member data for API response
 */
export function formatTeamMemberForResponse(teamMember: any): TeamMember {
  return {
    _id: teamMember._id.toString(),
    name: teamMember.name,
    slug: teamMember.slug,
    role: teamMember.role,
    position: teamMember.position,
    image: {
      url: teamMember.image.url,
      publicId: teamMember.image.publicId,
      alt: teamMember.image.alt,
    },
    bio: teamMember.bio || [],
    socialLinks: {
      linkedin: teamMember.socialLinks?.linkedin || null,
      instagram: teamMember.socialLinks?.instagram || null,
      facebook: teamMember.socialLinks?.facebook || null,
    },
    order: teamMember.order || 0,
    status: teamMember.status,
    createdBy: {
      _id: teamMember.createdBy._id.toString(),
      name: teamMember.createdBy.name,
      email: teamMember.createdBy.email,
    },
    updatedBy: {
      _id: teamMember.updatedBy._id.toString(),
      name: teamMember.updatedBy.name,
      email: teamMember.updatedBy.email,
    },
    createdAt: teamMember.createdAt.toISOString(),
    updatedAt: teamMember.updatedAt.toISOString(),
  };
}

/**
 * Get team members grouped by role
 */
export function groupTeamMembersByRole(teamMembers: TeamMember[]): Record<TeamRole, TeamMember[]> {
  const grouped: Record<TeamRole, TeamMember[]> = {
    architecture: [],
    interior: [],
    construction: [],
    'project-management': [],
    sales: [],
    marketing: [],
    administration: [],
  };

  teamMembers.forEach((member) => {
    if (grouped[member.role]) {
      grouped[member.role].push(member);
    }
  });

  return grouped;
}

/**
 * Sort team members by order and creation date
 */
export function sortTeamMembers(teamMembers: TeamMember[]): TeamMember[] {
  return [...teamMembers].sort((a, b) => {
    // First sort by order
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    // Then by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: TeamRole): string {
  const roleMap: Record<TeamRole, string> = {
    'architecture': 'Architecture',
    'interior': 'Interior Design',
    'construction': 'Construction',
    'project-management': 'Project Management',
    'sales': 'Sales',
    'marketing': 'Marketing',
    'administration': 'Administration',
  };
  
  return roleMap[role] || role;
}

/**
 * Convert form data to team member data
 */
export function convertFormDataToTeamMember(formData: TeamMemberFormData): any {
  return {
    name: formData.name.trim(),
    slug: formData.slug.toLowerCase().trim(),
    role: formData.role,
    position: formData.position.trim(),
    image: {
      url: formData.imageUrl,
      publicId: formData.imagePublicId,
      alt: formData.imageAlt || `${formData.name} - ${formData.position}`,
    },
    bio: formData.bioText ? formData.bioText.split('\n').filter(line => line.trim()) : [],
    socialLinks: {
      linkedin: formData.linkedinUrl || null,
      instagram: formData.instagramUrl || null,
      facebook: formData.facebookUrl || null,
    },
    order: formData.order,
    status: formData.status,
  };
}

/**
 * Generate team slug from name
 */
export function generateTeamSlug(name: string): string {
  return generateSlug(name);
}

/**
 * Generate image alt text
 */
export function generateImageAlt(name: string, position: string): string {
  return `${name} - ${position}`;
}

/**
 * Validate team form data
 */
export function validateTeamForm(formData: TeamMemberFormData): string[] {
  const errors: string[] = [];
  
  if (!formData.name.trim()) {
    errors.push('Full name is required');
  }
  
  if (!formData.slug.trim()) {
    errors.push('Slug is required');
  } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
  }
  
  if (!formData.role) {
    errors.push('Role is required');
  }
  
  if (!formData.position.trim()) {
    errors.push('Position/Title is required');
  }
  
  if (!formData.imageUrl || !formData.imagePublicId) {
    errors.push('Profile image is required');
  }
  
  if (formData.order < 0) {
    errors.push('Display order cannot be negative');
  }
  
  // Validate URLs if provided
  if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl, 'linkedin.com')) {
    errors.push('LinkedIn URL must be a valid LinkedIn URL');
  }
  
  if (formData.instagramUrl && !isValidUrl(formData.instagramUrl, 'instagram.com')) {
    errors.push('Instagram URL must be a valid Instagram URL');
  }
  
  if (formData.facebookUrl && !isValidUrl(formData.facebookUrl, 'facebook.com')) {
    errors.push('Facebook URL must be a valid Facebook URL');
  }
  
  return errors;
}

/**
 * Get next display order
 */
export function getNextDisplayOrder(existingMembers: TeamMember[]): number {
  if (existingMembers.length === 0) return 1;
  
  const maxOrder = Math.max(...existingMembers.map(member => member.order));
  return maxOrder + 1;
}
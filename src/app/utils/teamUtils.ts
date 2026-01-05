import { TeamMember, TeamMemberFormData } from '@/app/types/team';

export function convertFormDataToTeamMember(
  formData: TeamMemberFormData,
  bioPoints: string[]
): Omit<TeamMember, 'id'> {
  return {
    name: formData.name,
    slug: formData.slug,
    role: formData.role,
    position: formData.position,
    
    image: {
      url: formData.imageUrl,
      alt: formData.imageAlt,
    },
    
    bio: bioPoints.filter(point => point.trim() !== ''), // Remove empty bio points
    
    socialLinks: {
      linkedin: formData.linkedinUrl || null,
      instagram: formData.instagramUrl || null,
    },
    
    order: parseInt(formData.order),
    status: formData.status,
  };
}

export function generateTeamSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateImageAlt(name: string, position: string): string {
  return `${name} - ${position}`;
}

export function validateTeamForm(
  formData: TeamMemberFormData,
  bioPoints: string[]
): string[] {
  const errors: string[] = [];
  
  if (!formData.name.trim()) errors.push('Full name is required');
  if (!formData.role) errors.push('Role is required');
  if (!formData.position.trim()) errors.push('Position/Title is required');
  if (!formData.imageUrl) errors.push('Profile image is required');
  if (!formData.order || parseInt(formData.order) < 1) {
    errors.push('Display order must be 1 or greater');
  }
  
  const validBioPoints = bioPoints.filter(point => point.trim() !== '');
  if (validBioPoints.length === 0) {
    errors.push('At least one bio point is required');
  }
  
  // Validate URLs if provided
  if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
    errors.push('LinkedIn URL must be a valid URL');
  }
  if (formData.instagramUrl && !isValidUrl(formData.instagramUrl)) {
    errors.push('Instagram URL must be a valid URL');
  }
  
  return errors;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
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

export function getNextDisplayOrder(existingMembers: TeamMember[]): number {
  if (existingMembers.length === 0) return 1;
  
  const maxOrder = Math.max(...existingMembers.map(member => member.order));
  return maxOrder + 1;
}
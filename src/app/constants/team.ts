import { TeamRole } from '@/app/types/team';

export const TEAM_ROLES: { value: TeamRole; label: string }[] = [
  { value: 'architecture', label: 'Architecture' },
  { value: 'interior', label: 'Interior Design' },
  { value: 'construction', label: 'Construction' },
  { value: 'project-management', label: 'Project Management' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'administration', label: 'Administration' },
];

export const TEAM_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const IMAGE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const CLOUDINARY_CONFIG = {
  folder: 'team-members',
  transformation: {
    width: 800,
    height: 800,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto:good',
  },
};

export const API_ENDPOINTS = {
  team: '/api/team',
  teamById: (id: string) => `/api/team/${id}`,
  teamUpload: '/api/team/upload',
};

export const PAGINATION_CONFIG = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultPage: 1,
};
import { Career, CareerFormData } from '@/app/types/career';

export function convertFormDataToCareer(
  formData: CareerFormData,
  requirements: string[],
  responsibilities: string[]
): Omit<Career, 'id'> {
  return {
    title: formData.title,
    slug: formData.slug,
    department: formData.department,
    
    location: formData.location,
    workMode: formData.workMode,
    employmentType: formData.employmentType,
    
    experienceLevel: formData.experienceLevel,
    
    salaryRange: {
      min: parseInt(formData.salaryMin),
      max: parseInt(formData.salaryMax),
      currency: formData.salaryCurrency,
    },
    
    description: formData.description,
    
    requirements: requirements.filter(req => req.trim() !== ''),
    responsibilities: responsibilities.filter(resp => resp.trim() !== ''),
    
    status: formData.status,
    postedAt: formData.postedAt,
    applyBy: formData.applyBy,
  };
}

export function generateCareerSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatSalaryRange(min: number, max: number, currency: string): string {
  return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function validateCareerForm(
  formData: CareerFormData,
  requirements: string[],
  responsibilities: string[]
): string[] {
  const errors: string[] = [];
  
  if (!formData.title.trim()) errors.push('Job title is required');
  if (!formData.department) errors.push('Department is required');
  if (!formData.location.trim()) errors.push('Location is required');
  if (!formData.description.trim()) errors.push('Job description is required');
  
  if (!formData.salaryMin || parseInt(formData.salaryMin) <= 0) {
    errors.push('Minimum salary must be greater than 0');
  }
  if (!formData.salaryMax || parseInt(formData.salaryMax) <= 0) {
    errors.push('Maximum salary must be greater than 0');
  }
  if (formData.salaryMin && formData.salaryMax && 
      parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
    errors.push('Maximum salary must be greater than minimum salary');
  }
  
  if (!formData.postedAt) errors.push('Posted date is required');
  if (!formData.applyBy) errors.push('Apply by date is required');
  
  if (formData.postedAt && formData.applyBy && 
      new Date(formData.postedAt) >= new Date(formData.applyBy)) {
    errors.push('Apply by date must be after posted date');
  }
  
  const validRequirements = requirements.filter(req => req.trim() !== '');
  if (validRequirements.length === 0) {
    errors.push('At least one job requirement is required');
  }
  
  const validResponsibilities = responsibilities.filter(resp => resp.trim() !== '');
  if (validResponsibilities.length === 0) {
    errors.push('At least one job responsibility is required');
  }
  
  return errors;
}

export function getExperienceLevelDisplayName(level: string): string {
  const levelMap: Record<string, string> = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'executive': 'Executive Level',
  };
  
  return levelMap[level] || level;
}

export function getWorkModeDisplayName(mode: string): string {
  const modeMap: Record<string, string> = {
    'onsite': 'Onsite',
    'remote': 'Remote',
    'hybrid': 'Hybrid',
  };
  
  return modeMap[mode] || mode;
}

export function getEmploymentTypeDisplayName(type: string): string {
  const typeMap: Record<string, string> = {
    'full time': 'Full Time',
    'part time': 'Part Time',
    'contract': 'Contract',
    'internship': 'Internship',
  };
  
  return typeMap[type] || type;
}

export function isCareerExpired(applyByDate: string): boolean {
  return new Date(applyByDate) < new Date();
}

export function getDaysUntilExpiry(applyByDate: string): number {
  const today = new Date();
  const expiryDate = new Date(applyByDate);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
export interface CareerSalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface Career {
  id: number;
  title: string;
  slug: string;
  department: string;
  location: string;
  workMode: 'onsite' | 'remote' | 'hybrid';
  employmentType: 'full time' | 'part time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  salaryRange: CareerSalaryRange;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: 'active' | 'draft' | 'expired';
  postedAt: string;
  applyBy: string;
}

export interface CareerFormData {
  // Basic info
  title: string;
  slug: string;
  department: string;
  
  // Location and work details
  location: string;
  workMode: 'onsite' | 'remote' | 'hybrid';
  employmentType: 'full time' | 'part time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  
  // Salary
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  
  // Content
  description: string;
  
  // Dates
  postedAt: string;
  applyBy: string;
  
  // Status
  status: 'active' | 'draft' | 'expired';
}

export type Department = 
  | 'Design'
  | 'Architecture'
  | 'Operations'
  | 'Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance';

export type WorkMode = 'onsite' | 'remote' | 'hybrid';
export type EmploymentType = 'full time' | 'part time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
export type CareerStatus = 'active' | 'draft' | 'expired';
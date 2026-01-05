export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  notes?: string;
  address?: string;
  preferredContact: 'email' | 'phone' | 'whatsapp' | 'in-person';
  createdAt: string;
  lastContact: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  notes: string;
  address: string;
  preferredContact: 'email' | 'phone' | 'whatsapp' | 'in-person';
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type LeadSource = 'website' | 'social-media' | 'referral' | 'google-ads' | 'facebook-ads' | 'walk-in' | 'phone-call' | 'email' | 'other';
export type ProjectType = 'interior-design' | 'architecture' | 'home-renovation' | 'office-design' | 'consultation' | '3d-modeling' | 'other';
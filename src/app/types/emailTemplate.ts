export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  message: string;
  type: string;
  status: 'active' | 'draft' | 'inactive';
  createdAt: string;
  lastModified: string;
}

export interface EmailTemplateFormData {
  name: string;
  subject: string;
  message: string;
  type: string;
  status: 'active' | 'draft' | 'inactive';
}

export type EmailTemplateType = 
  | 'lead-follow-up'
  | 'welcome'
  | 'thank-you'
  | 'appointment-confirmation'
  | 'project-update'
  | 'quote-request'
  | 'newsletter'
  | 'promotional';

export type EmailTemplateStatus = 'active' | 'draft' | 'inactive';
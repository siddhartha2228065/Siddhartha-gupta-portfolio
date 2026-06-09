export interface ServiceOption {
  id: string;
  label: string;
  description: string;
}

export interface Inquiry {
  id: string;
  services: string[]; // Options: 'Hiring', 'Freelance Build', 'Collab', 'General Chat'
  description: string; // The message or project goals
  budget: string; // Budget or role type
  timeline: string; // Timeline or urgency
  fullName: string;
  email: string;
  companyName: string;
  phone?: string;
  createdAt: string;
  status: 'Received' | 'Reviewing' | 'Accepted' | 'Archived';
  notes?: string;
}

export interface ProjectChallenge {
  challenge: string;
  solution: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: 'Full Stack' | 'Backend Systems' | 'Cloud & Ops';
  desc: string;
  detailedDesc: string;
  tags: string[];
  gradient: string;
  metrics: string;
  demoUrl?: string;
  repoUrl?: string;
  images: string[];
  features: string[];
  challenges: ProjectChallenge[];
  architecture: string;
}


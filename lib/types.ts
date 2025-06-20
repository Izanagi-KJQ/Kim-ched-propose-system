export interface Scholarship {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  applicants: number;
  status: string;
  type?: 'Full' | 'Half';
}

export interface Application {
  id: string;
  name: string;
  region: string;
  email: string;
  scholarship: string;
  amount: string;
  gpa: number | null;
  status: string;
  submittedDate: string;
  avatar: string;
  review?: string;
  requirements?: Record<string, { valid: boolean; falseDoc: boolean }>;
  score?: number | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastActive: string;
  status: string;
} 
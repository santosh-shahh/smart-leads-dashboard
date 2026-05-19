export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales User';
}

export interface FetchLeadsParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  source: string;
  sort: string;
}

export interface LeadsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchLeadsResponse {
  leads: Lead[];
  pagination: LeadsPagination;
}

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  conversionRate: number;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

interface FetchLeadsParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  source: string;
  sort: string;
}

interface FetchLeadsResponse {
  leads: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useLeads = (params: FetchLeadsParams) => {
  return useQuery<FetchLeadsResponse>({
    queryKey: ['leads', params],
    queryFn: async () => {
      const { data } = await api.get('/leads', { params });
      return data;
    },
    keepPreviousData: true,
  } as any); // using any for keepPreviousData to bypass TS version conflict
};

export const useLead = (id: string) => {
  return useQuery<Lead>({
    queryKey: ['leads', id],
    queryFn: async () => {
      const { data } = await api.get(`/leads/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLead: Partial<Lead>) => {
      const { data } = await api.post('/leads', newLead);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Lead> & { id: string }) => {
      const { data } = await api.put(`/leads/${id}`, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/leads/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

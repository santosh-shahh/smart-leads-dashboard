import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../api/client';
import type { Lead, FetchLeadsParams, FetchLeadsResponse, LeadStats } from '../types';

export const useLeads = (params: FetchLeadsParams) => {
  return useQuery<FetchLeadsResponse>({
    queryKey: ['leads', params],
    queryFn: async () => {
      const { data } = await api.get('/leads', { params });
      return data;
    },
    placeholderData: keepPreviousData,
  });
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

export const useLeadStats = () => {
  return useQuery<LeadStats>({
    queryKey: ['leadStats'],
    queryFn: async () => {
      const { data } = await api.get('/leads/stats');
      return data;
    },
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
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
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
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
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
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
    },
  });
};

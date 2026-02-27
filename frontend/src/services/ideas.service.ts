import { api } from './api';
import { IIdea, IIdeaListResponse } from '../types';

export interface CreateIdeaDto {
  title: string;
  description: string;
  presentationUrl?: string;
  attachments?: string[];
  tags?: string[];
  category?: string;
  status?: string;
}

export interface UpdateIdeaDto {
  title?: string;
  description?: string;
  presentationUrl?: string;
  attachments?: string[];
  tags?: string[];
  category?: string;
  status?: string;
}

export interface IdeasQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const ideasService = {
  getAll: async (params: IdeasQueryParams = {}): Promise<IIdeaListResponse> => {
    const response = await api.get<IIdeaListResponse>('/ideas', { params });
    return response.data;
  },

  getById: async (id: string): Promise<IIdea> => {
    const response = await api.get<IIdea>(`/ideas/${id}`);
    return response.data;
  },

  getMyIdeas: async (page = 1, limit = 10): Promise<IIdeaListResponse> => {
    const response = await api.get<IIdeaListResponse>('/ideas/my', {
      params: { page, limit },
    });
    return response.data;
  },

  create: async (data: CreateIdeaDto): Promise<IIdea> => {
    const response = await api.post<IIdea>('/ideas', data);
    return response.data;
  },

  update: async (id: string, data: UpdateIdeaDto): Promise<IIdea> => {
    const response = await api.patch<IIdea>(`/ideas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/ideas/${id}`);
  },
};

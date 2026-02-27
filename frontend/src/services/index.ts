import { api } from './api';
import { IRating, IComment } from '../types';

export interface CreateRatingDto {
  interest: number;
  benefit: number;
  profitability: number;
}

export interface UpdateRatingDto {
  interest?: number;
  benefit?: number;
  profitability?: number;
}

export interface CreateCommentDto {
  content: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content?: string;
}

export const ratingsService = {
  create: async (ideaId: string, data: CreateRatingDto): Promise<IRating> => {
    const response = await api.post<IRating>(`/ideas/${ideaId}/ratings`, data);
    return response.data;
  },

  getMyRating: async (ideaId: string): Promise<IRating | null> => {
    const response = await api.get<IRating | null>(`/ideas/${ideaId}/ratings/my`);
    return response.data;
  },

  update: async (ideaId: string, data: UpdateRatingDto): Promise<IRating> => {
    const response = await api.patch<IRating>(`/ideas/${ideaId}/ratings`, data);
    return response.data;
  },

  getAll: async (ideaId: string): Promise<IRating[]> => {
    const response = await api.get<IRating[]>(`/ideas/${ideaId}/ratings`);
    return response.data;
  },
};

export const commentsService = {
  getByIdea: async (ideaId: string): Promise<IComment[]> => {
    const response = await api.get<IComment[]>(`/ideas/${ideaId}/comments`);
    return response.data;
  },

  create: async (ideaId: string, data: CreateCommentDto): Promise<IComment> => {
    const response = await api.post<IComment>(`/ideas/${ideaId}/comments`, data);
    return response.data;
  },

  update: async (ideaId: string, commentId: string, data: UpdateCommentDto): Promise<IComment> => {
    const response = await api.patch<IComment>(`/ideas/${ideaId}/comments/${commentId}`, data);
    return response.data;
  },

  delete: async (ideaId: string, commentId: string): Promise<void> => {
    await api.delete(`/ideas/${ideaId}/comments/${commentId}`);
  },

  vote: async (ideaId: string, commentId: string, value: number): Promise<void> => {
    await api.post(`/ideas/${ideaId}/comments/${commentId}/vote`, { value });
  },
};

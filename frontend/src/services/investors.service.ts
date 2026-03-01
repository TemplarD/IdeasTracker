import { api } from './api';
import { IInvestorProfile, IInvestment, ICreateInvestmentDto, ICreateInvestorProfileDto } from '../types/investors';

export const investorsService = {
  // Investor Profile
  createProfile: async (data: ICreateInvestorProfileDto): Promise<IInvestorProfile> => {
    const response = await api.post<IInvestorProfile>('/investors', data);
    return response.data;
  },

  getMyProfile: async (): Promise<IInvestorProfile | null> => {
    const response = await api.get<IInvestorProfile | null>('/investors/me');
    return response.data;
  },

  updateProfile: async (data: ICreateInvestorProfileDto): Promise<IInvestorProfile> => {
    const response = await api.patch<IInvestorProfile>('/investors/me', data);
    return response.data;
  },

  // Investments
  createInvestment: async (data: ICreateInvestmentDto): Promise<IInvestment> => {
    const response = await api.post<IInvestment>('/investments', data);
    return response.data;
  },

  getMyInvestments: async (): Promise<IInvestment[]> => {
    const response = await api.get<IInvestment[]>('/investments/my');
    return response.data;
  },

  getByIdea: async (ideaId: string): Promise<IInvestment[]> => {
    const response = await api.get<IInvestment[]>(`/investments/idea/${ideaId}`);
    return response.data;
  },

  getByTeam: async (teamId: string): Promise<IInvestment[]> => {
    const response = await api.get<IInvestment[]>(`/investments/team/${teamId}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<IInvestment> => {
    const response = await api.patch<IInvestment>(`/investments/${id}/status?status=${status}`);
    return response.data;
  },

  updateInvestment: async (id: string, data: Partial<ICreateInvestmentDto>): Promise<IInvestment> => {
    const response = await api.patch<IInvestment>(`/investments/${id}`, data);
    return response.data;
  },

  deleteInvestment: async (id: string): Promise<void> => {
    await api.delete(`/investments/${id}`);
  },
};

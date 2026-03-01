import { api } from './api';
import { ITeam, ITeamMember, IProgress, ICreateTeamDto, IJoinTeamDto, ICreateProgressDto } from '../types/teams';

export const teamsService = {
  create: async (data: ICreateTeamDto): Promise<ITeam> => {
    const response = await api.post<ITeam>('/teams', data);
    return response.data;
  },

  findByIdea: async (ideaId: string): Promise<ITeam[]> => {
    const response = await api.get<ITeam[]>(`/teams/idea/${ideaId}`);
    return response.data;
  },

  findMyTeams: async (): Promise<ITeam[]> => {
    const response = await api.get<ITeam[]>('/teams/my');
    return response.data;
  },

  findOne: async (id: string): Promise<ITeam> => {
    const response = await api.get<ITeam>(`/teams/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<ICreateTeamDto>): Promise<ITeam> => {
    const response = await api.patch<ITeam>(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },

  // Members
  joinTeam: async (teamId: string, data: IJoinTeamDto): Promise<ITeamMember> => {
    const response = await api.post<ITeamMember>(`/teams/${teamId}/members`, data);
    return response.data;
  },

  getMembers: async (teamId: string): Promise<ITeamMember[]> => {
    const response = await api.get<ITeamMember[]>(`/teams/${teamId}/members`);
    return response.data;
  },

  getActiveMembers: async (teamId: string): Promise<ITeamMember[]> => {
    const response = await api.get<ITeamMember[]>(`/teams/${teamId}/members/active`);
    return response.data;
  },

  updateMemberStatus: async (
    teamId: string,
    memberId: string,
    status: 'pending' | 'active' | 'rejected' | 'left'
  ): Promise<ITeamMember> => {
    const response = await api.patch<ITeamMember>(
      `/teams/${teamId}/members/${memberId}/status`,
      { status }
    );
    return response.data;
  },

  leaveTeam: async (teamId: string): Promise<void> => {
    await api.delete(`/teams/${teamId}/members/leave`);
  },

  // Progress
  addProgress: async (teamId: string, data: ICreateProgressDto): Promise<IProgress> => {
    const response = await api.post<IProgress>(`/teams/${teamId}/progress`, data);
    return response.data;
  },

  getProgress: async (teamId: string): Promise<IProgress[]> => {
    const response = await api.get<IProgress[]>(`/teams/${teamId}/progress`);
    return response.data;
  },

  deleteProgress: async (teamId: string, progressId: string): Promise<void> => {
    await api.delete(`/teams/${teamId}/progress/${progressId}`);
  },
};

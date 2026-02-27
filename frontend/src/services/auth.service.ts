import { api } from './api';
import { IAuthResponse, IUser } from '../types';

export interface IRegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ILoginDto {
  email: string;
  password: string;
}

export interface IUpdateUserDto {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
}

export const authService = {
  register: async (data: IRegisterDto): Promise<IAuthResponse> => {
    const response = await api.post<IAuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: ILoginDto): Promise<IAuthResponse> => {
    const response = await api.post<IAuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<IUser> => {
    const response = await api.get<IUser>('/users/me');
    return response.data;
  },

  updateProfile: async (data: IUpdateUserDto): Promise<IUser> => {
    const response = await api.patch<IUser>('/users/me', data);
    return response.data;
  },
};

import { api } from './api';
import { INotification } from '../types/notifications';

export const notificationsService = {
  getNotifications: async (unreadOnly = false): Promise<INotification[]> => {
    const response = await api.get<INotification[]>('/notifications', {
      params: { unreadOnly },
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/read-all');
  },
};

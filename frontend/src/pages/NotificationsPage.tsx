import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';
import { INotification, NotificationType } from '../types/notifications';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function NotificationsPage() {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', showUnreadOnly],
    queryFn: () => notificationsService.getNotifications(showUnreadOnly),
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: notificationsService.getUnreadCount,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INVESTMENT_PROPOSED:
        return '💰';
      case NotificationType.INVESTMENT_ACCEPTED:
        return '✅';
      case NotificationType.INVESTMENT_REJECTED:
        return '❌';
      case NotificationType.TEAM_JOIN_REQUEST:
        return '👥';
      case NotificationType.TEAM_JOIN_ACCEPTED:
        return '✓';
      case NotificationType.PROGRESS_UPDATE:
        return '📈';
      default:
        return '📬';
    }
  };

  const getNotificationLink = (notification: INotification) => {
    switch (notification.type) {
      case NotificationType.INVESTMENT_PROPOSED:
      case NotificationType.INVESTMENT_ACCEPTED:
      case NotificationType.INVESTMENT_REJECTED:
        return `/investor-profile`;
      default:
        return '/notifications';
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            Уведомления
            {unreadCount && unreadCount > 0 && (
              <span className="badge bg-danger ms-2">{unreadCount}</span>
            )}
          </h1>
          <div className="d-flex gap-2">
            <button
              className={`btn ${showUnreadOnly ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              {showUnreadOnly ? 'Все' : 'Непрочитанные'}
            </button>
            {unreadCount && unreadCount > 0 && (
              <button
                className="btn btn-outline-secondary"
                onClick={handleMarkAllAsRead}
              >
                Прочитать все
              </button>
            )}
          </div>
        </div>

        {notifications && notifications.length > 0 ? (
          <div className="list-group">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`list-group-item list-group-item-action ${
                  !notification.isRead ? 'bg-light' : ''
                }`}
              >
                <div className="d-flex w-100 justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <span className="me-2 fs-4">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <h6 className="mb-0">{notification.title}</h6>
                      {!notification.isRead && (
                        <span className="badge bg-primary ms-2">Новое</span>
                      )}
                    </div>
                    <p className="mb-1">{notification.message}</p>
                    <small className="text-muted">
                      {formatDistanceToNow(notification.createdAt)}
                    </small>
                  </div>
                  {!notification.isRead && (
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center">
            {showUnreadOnly ? 'Нет непрочитанных уведомлений' : 'Уведомлений нет'}
          </div>
        )}
      </div>
    </div>
  );
}

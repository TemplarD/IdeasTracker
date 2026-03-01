export enum NotificationType {
  INVESTMENT_PROPOSED = 'investment_proposed',
  INVESTMENT_ACCEPTED = 'investment_accepted',
  INVESTMENT_REJECTED = 'investment_rejected',
  TEAM_JOIN_REQUEST = 'team_join_request',
  TEAM_JOIN_ACCEPTED = 'team_join_accepted',
  PROGRESS_UPDATE = 'progress_update',
}

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

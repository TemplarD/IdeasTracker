export function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'только что';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин. назад`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ч. назад`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} дн. назад`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} нед. назад`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} мес. назад`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} г. назад`;
}

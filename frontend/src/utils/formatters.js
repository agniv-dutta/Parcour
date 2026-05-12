import { formatDistanceToNow, format } from 'date-fns';

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (e) {
    return dateString;
  }
};

export const formatScore = (score) => {
  if (score === undefined || score === null) return '0%';
  return `${Math.round(score * 100)}%`;
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

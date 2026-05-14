import { formatDistanceToNow } from 'date-fns';

export const timeAgo = (timestamp) => {
  if (!timestamp) return '';
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true }).replace('about ', '');
};

export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const getAvatarColor = (name) => {
  const colors = [
    '#5BA3D9', // Blue
    '#4CAF82', // Green
    '#E8A838', // Amber
    '#E05555', // Red
    '#9B7FD4', // Purple
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const getScoreColor = (score) => {
  if (score >= 0.85) return '#4CAF82'; // Green
  if (score >= 0.60) return '#E8A838'; // Amber
  return '#E05555'; // Red
};

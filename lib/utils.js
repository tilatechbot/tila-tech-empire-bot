import moment from 'moment-timezone';

export const formatTime = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const getDate = () => {
  return moment().tz('UTC').format('YYYY-MM-DD HH:mm:ss');
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const mention = (jid) => `@${jid.split('@')[0]}`;

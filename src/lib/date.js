// All dates are LOCAL calendar days, keyed as 'YYYY-MM-DD'.
export const pad = (n) => String(n).padStart(2, '0');

export const toKey = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (key, n) => {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
};

export const daysBetween = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 86400000);

export const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

export const formatMinutes = (m) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h % 12 || 12}:${pad(mm)} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const minutesToInput = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

export const inputToMinutes = (s) => {
  const [h, m] = (s || '00:00').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

export const taskTime = (t) => t.label?.trim() || formatMinutes(t.minutes);

export const greeting = (d = new Date()) => {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
};

export const formatLong = (key) =>
  fromKey(key).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export const formatShort = (key) =>
  fromKey(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const weekdayShort = (key) =>
  fromKey(key).toLocaleDateString('en-US', { weekday: 'short' });

export const weekdayLong = (key) =>
  fromKey(key).toLocaleDateString('en-US', { weekday: 'long' });

export const lastNDays = (n, endKey) =>
  Array.from({ length: n }, (_, i) => addDays(endKey, i - (n - 1)));

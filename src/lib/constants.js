// ─── LocalStorage keys (versioned so the schema can evolve safely) ───
export const STORAGE_KEYS = {
  tasks: 'resurface.v1.tasks', // routine definition (array of tasks)
  days: 'resurface.v1.dailyTasks', // { 'YYYY-MM-DD': DayRecord }
  journal: 'resurface.v1.journal', // { 'YYYY-MM-DD': JournalEntry }
  meta: 'resurface.v1.meta', // { name, mission, startDate, version }
};

// A day counts toward your streak when completion reaches this percentage.
export const STREAK_THRESHOLD = 60;

// Categories a task can belong to
export const CATEGORIES = [
  'Faith',
  'Communication',
  'Health',
  'Planning',
  'Work',
  'Break',
  'Relaxation',
  'Learning',
  'Life',
];

// How task categories roll up into the analytics groups
export const CATEGORY_GROUP = {
  Faith: 'Faith',
  Health: 'Health',
  Work: 'Work',
  Learning: 'Learning',
  Communication: 'Personal Growth',
  Planning: 'Personal Growth',
  Break: 'Personal Growth',
  Relaxation: 'Personal Growth',
  Life: 'Personal Growth',
};

export const PROGRESS_GROUPS = ['Faith', 'Health', 'Work', 'Learning', 'Personal Growth'];

export const PROFILE_GROUPS = [
  { label: 'Faith', group: 'Faith' },
  { label: 'Health', group: 'Health' },
  { label: 'Business', group: 'Work' },
  { label: 'Learning', group: 'Learning' },
];

export const MOODS = [
  { id: 'great', emoji: '😊', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'normal', emoji: '😐', label: 'Normal' },
  { id: 'low', emoji: '😔', label: 'Low' },
];

export const DEFAULT_META = {
  version: 1,
  name: 'Sadik',
  mission: 'Become a better Muslim, entrepreneur, designer, and human being.',
};

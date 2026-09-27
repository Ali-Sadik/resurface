import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_META, STORAGE_KEYS as K } from './constants';
import { DEFAULT_TASKS } from './defaults';
import { load, remove, save, uid } from './storage';
import { toKey } from './date';
import { buildDayRecord } from './stats';

const StoreContext = createContext(null);

const initialMeta = () => {
  const stored = load(K.meta, null);
  return { ...DEFAULT_META, startDate: toKey(), ...stored };
};

const emptyEntry = (date) => ({
  date,
  mood: null,
  morningReflection: '',
  nightReflection: { learned: '', improve: '', grateful: '' },
  updatedAt: null,
});

export function StoreProvider({ children }) {
  const [tasks, setTasks] = useState(() => load(K.tasks, DEFAULT_TASKS));
  const [days, setDays] = useState(() => load(K.days, {}));
  const [journal, setJournal] = useState(() => load(K.journal, {}));
  const [meta, setMeta] = useState(initialMeta);
  const [todayKey, setTodayKey] = useState(() => toKey());

  // Persist every slice whenever it changes.
  useEffect(() => void save(K.tasks, tasks), [tasks]);
  useEffect(() => void save(K.days, days), [days]);
  useEffect(() => void save(K.journal, journal), [journal]);
  useEffect(() => void save(K.meta, meta), [meta]);

  // Roll over to a new day when the app returns to the foreground or at midnight.
  useEffect(() => {
    const refresh = () => setTodayKey(toKey());
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    const id = setInterval(refresh, 60_000);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
      clearInterval(id);
    };
  }, []);

  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => a.minutes - b.minutes), [tasks]);

  // Keep today's snapshot in sync when the routine itself changes.
  const syncToday = useCallback(
    (nextTasks) =>
      setDays((prev) =>
        prev[todayKey]
          ? { ...prev, [todayKey]: buildDayRecord(todayKey, prev[todayKey].completedTasks, nextTasks) }
          : prev
      ),
    [todayKey]
  );

  const toggleTask = useCallback(
    (id) =>
      setDays((prev) => {
        const current = prev[todayKey]?.completedTasks ?? [];
        const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
        return { ...prev, [todayKey]: buildDayRecord(todayKey, next, tasks) };
      }),
    [tasks, todayKey]
  );

  const addTask = useCallback(
    (task) => {
      const next = [...tasks, { ...task, id: uid() }];
      setTasks(next);
      syncToday(next);
    },
    [tasks, syncToday]
  );

  const updateTask = useCallback(
    (id, patch) => {
      const next = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
      setTasks(next);
      syncToday(next);
    },
    [tasks, syncToday]
  );

  const deleteTask = useCallback(
    (id) => {
      const next = tasks.filter((t) => t.id !== id);
      setTasks(next);
      syncToday(next);
    },
    [tasks, syncToday]
  );

  const restoreDefaultRoutine = useCallback(() => {
    setTasks(DEFAULT_TASKS);
    syncToday(DEFAULT_TASKS);
  }, [syncToday]);

  const getEntry = useCallback((date) => ({ ...emptyEntry(date), ...journal[date] }), [journal]);

  const updateEntry = useCallback(
    (date, updater) =>
      setJournal((prev) => {
        const base = { ...emptyEntry(date), ...prev[date] };
        return { ...prev, [date]: { ...updater(base), date, updatedAt: Date.now() } };
      }),
    []
  );

  const updateMeta = useCallback((patch) => setMeta((m) => ({ ...m, ...patch })), []);

  const exportData = useCallback(
    () => ({
      app: 'resurface',
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks,
      dailyTasks: days,
      journal,
      meta,
    }),
    [tasks, days, journal, meta]
  );

  const importData = useCallback((data) => {
    if (!data || data.app !== 'resurface') throw new Error('This file is not a Resurface backup.');
    if (Array.isArray(data.tasks)) setTasks(data.tasks);
    if (data.dailyTasks && typeof data.dailyTasks === 'object') setDays(data.dailyTasks);
    if (data.journal && typeof data.journal === 'object') setJournal(data.journal);
    if (data.meta && typeof data.meta === 'object') setMeta((m) => ({ ...m, ...data.meta }));
  }, []);

  const resetAll = useCallback(() => {
    Object.values(K).forEach(remove);
    setTasks(DEFAULT_TASKS);
    setDays({});
    setJournal({});
    setMeta({ ...DEFAULT_META, startDate: toKey() });
  }, []);

  const value = {
    tasks,
    sortedTasks,
    days,
    journal,
    meta,
    todayKey,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    restoreDefaultRoutine,
    getEntry,
    updateEntry,
    updateMeta,
    exportData,
    importData,
    resetAll,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

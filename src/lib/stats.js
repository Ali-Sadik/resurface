import { CATEGORY_GROUP, STREAK_THRESHOLD } from './constants';
import { addDays, lastNDays } from './date';

export const groupOf = (category) => CATEGORY_GROUP[category] || 'Personal Growth';

/**
 * DayRecord — what gets stored per date under `resurface.v1.dailyTasks`:
 * { date, completedTasks: [taskId], totalTasks, percentage,
 *   categories: { Faith: { done, total }, ... }, updatedAt }
 * The category snapshot keeps history accurate even after the routine changes.
 */
export function buildDayRecord(date, completedIds, tasks) {
  const valid = new Set(tasks.map((t) => t.id));
  const completedTasks = [...new Set(completedIds)].filter((id) => valid.has(id));
  const done = new Set(completedTasks);
  const categories = {};
  for (const t of tasks) {
    const g = groupOf(t.category);
    categories[g] ??= { done: 0, total: 0 };
    categories[g].total += 1;
    if (done.has(t.id)) categories[g].done += 1;
  }
  const totalTasks = tasks.length;
  return {
    date,
    completedTasks,
    totalTasks,
    percentage: totalTasks ? Math.round((completedTasks.length / totalTasks) * 100) : 0,
    categories,
    updatedAt: Date.now(),
  };
}

// null = before you started using the app (not counted); 0 = tracked day with nothing done
export function percentOn(key, days, startKey, todayKey) {
  if (days[key]) return days[key].percentage;
  if (key >= startKey && key <= todayKey) return 0;
  return null;
}

export function series(n, days, startKey, todayKey) {
  return lastNDays(n, todayKey).map((key) => ({ key, pct: percentOn(key, days, startKey, todayKey) }));
}

export function summarize(list) {
  const tracked = list.filter((s) => s.pct !== null);
  const avg = tracked.length ? Math.round(tracked.reduce((a, s) => a + s.pct, 0) / tracked.length) : 0;
  const best = tracked.reduce((b, s) => (!b || s.pct > b.pct ? s : b), null);
  const hit = tracked.filter((s) => s.pct >= STREAK_THRESHOLD).length;
  const consistency = tracked.length ? Math.round((hit / tracked.length) * 100) : 0;
  return { tracked: tracked.length, avg, best, hit, consistency };
}

export function streaks(days, startKey, todayKey) {
  const ok = (k) => (percentOn(k, days, startKey, todayKey) ?? -1) >= STREAK_THRESHOLD;

  // Today still counts as "in progress": if it isn't met yet, start counting from yesterday.
  let current = 0;
  let k = ok(todayKey) ? todayKey : addDays(todayKey, -1);
  while (k >= startKey && ok(k)) {
    current += 1;
    k = addDays(k, -1);
  }

  let longest = 0;
  let run = 0;
  for (let d = startKey; d <= todayKey; d = addDays(d, 1)) {
    run = ok(d) ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  return { current, longest };
}

export function categoryPerformance(days, keys) {
  const agg = {};
  for (const key of keys) {
    const rec = days[key];
    if (!rec?.categories) continue;
    for (const [g, v] of Object.entries(rec.categories)) {
      agg[g] ??= { done: 0, total: 0 };
      agg[g].done += v.done;
      agg[g].total += v.total;
    }
  }
  const out = {};
  for (const [g, v] of Object.entries(agg)) out[g] = v.total ? Math.round((v.done / v.total) * 100) : 0;
  return out;
}

export const totalCompleted = (days) =>
  Object.values(days).reduce((a, r) => a + (r.completedTasks?.length || 0), 0);

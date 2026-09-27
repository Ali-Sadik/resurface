import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Header from '../components/Header';
import SegmentedControl from '../components/SegmentedControl';
import ProgressRing from '../components/ProgressRing';
import AnimatedNumber from '../components/AnimatedNumber';
import BarChart from '../components/BarChart';
import CategoryBars from '../components/CategoryBars';
import CategoryChip from '../components/CategoryChip';
import { useStore } from '../lib/store';
import { PROGRESS_GROUPS, STREAK_THRESHOLD } from '../lib/constants';
import { formatShort, lastNDays, nowMinutes, taskTime, weekdayLong, weekdayShort } from '../lib/date';
import { categoryPerformance, series, summarize } from '../lib/stats';

const Card = ({ title, children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 240, damping: 26 }}
    className={`rounded-[24px] bg-white p-5 shadow-card ${className}`}
  >
    {title && <h2 className="mb-4 text-[17px] font-bold tracking-tight">{title}</h2>}
    {children}
  </motion.section>
);

const Tile = ({ value, suffix = '', label, sub }) => (
  <div className="rounded-[20px] bg-white p-3.5 shadow-card">
    <AnimatedNumber value={value} suffix={suffix} className="font-rounded text-[26px] font-bold text-ink" />
    <p className="text-[12.5px] font-semibold text-muted">{label}</p>
    {sub && <p className="mt-0.5 text-[12px] text-brand-dark">{sub}</p>}
  </div>
);

export default function Progress() {
  const [range, setRange] = useState('day');
  const { sortedTasks, days, todayKey, meta } = useStore();
  const start = meta.startDate;

  // ── Daily
  const doneSet = new Set(days[todayKey]?.completedTasks ?? []);
  const now = nowMinutes();
  const completed = sortedTasks.filter((t) => doneSet.has(t.id));
  const missed = sortedTasks.filter((t) => !doneSet.has(t.id) && t.minutes + 60 < now);
  const upcoming = sortedTasks.length - completed.length - missed.length;
  const todayPct = sortedTasks.length ? Math.round((completed.length / sortedTasks.length) * 100) : 0;

  // ── Weekly / Monthly
  const week = useMemo(() => series(7, days, start, todayKey), [days, start, todayKey]);
  const month = useMemo(() => series(30, days, start, todayKey), [days, start, todayKey]);
  const weekStats = summarize(week);
  const monthStats = summarize(month);
  const monthCats = useMemo(() => categoryPerformance(days, lastNDays(30, todayKey)), [days, todayKey]);
  const weekCats = useMemo(() => categoryPerformance(days, lastNDays(7, todayKey)), [days, todayKey]);

  return (
    <>
      <Header title="Progress" subtitle="Calculated from what you complete, day by day." />
      <div className="space-y-4 px-5">
        <SegmentedControl
          id="progress-range"
          value={range}
          onChange={setRange}
          options={[
            { value: 'day', label: 'Daily' },
            { value: 'week', label: 'Weekly' },
            { value: 'month', label: 'Monthly' },
          ]}
        />

        {range === 'day' && (
          <>
            <Card>
              <div className="flex items-center gap-5">
                <ProgressRing value={todayPct} size={120} stroke={13}>
                  <AnimatedNumber value={todayPct} suffix="%" className="font-rounded text-[28px] font-bold" />
                </ProgressRing>
                <div className="flex-1 space-y-2.5">
                  <Row label="Completed" value={completed.length} tone="text-brand" />
                  <Row label="Missed" value={missed.length} tone="text-amber-600" />
                  <Row label="Still ahead" value={upcoming} tone="text-muted" />
                </div>
              </div>
            </Card>
            <Card title="Missed so far">
              {missed.length === 0 ? (
                <p className="text-[15px] text-muted">Nothing missed. Every task so far is done or still ahead.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {missed.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold">{t.name}</p>
                        <p className="text-[12.5px] text-muted">{taskTime(t)}</p>
                      </div>
                      <CategoryChip category={t.category} muted />
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-[12.5px] text-muted">
                A task counts as missed one hour after its time. You can still check it off on Today.
              </p>
            </Card>
          </>
        )}

        {range === 'week' && (
          <>
            <Card title="Last 7 days">
              <BarChart
                data={week.map((d) => ({ key: d.key, label: weekdayShort(d.key).slice(0, 3), value: d.pct }))}
                highlightKey={todayKey}
              />
              <p className="mt-2 text-[12.5px] text-muted">
                Dashed line marks {STREAK_THRESHOLD}%, the level that keeps your streak alive.
              </p>
            </Card>
            <div className="grid grid-cols-3 gap-3">
              <Tile value={weekStats.avg} suffix="%" label="Average" />
              <Tile
                value={weekStats.best?.pct ?? 0}
                suffix="%"
                label="Best day"
                sub={weekStats.best ? weekdayLong(weekStats.best.key) : 'No data'}
              />
              <Tile value={weekStats.consistency} suffix="%" label="Consistency" sub={`${weekStats.hit} of ${weekStats.tracked} ${weekStats.tracked === 1 ? 'day' : 'days'}`} />
            </div>
            <Card title="Categories this week">
              <CategoryBars groups={PROGRESS_GROUPS} values={weekCats} />
            </Card>
          </>
        )}

        {range === 'month' && (
          <>
            <Card title="Habit completion, 30 days">
              <BarChart
                data={month.map((d) => ({ key: d.key, label: d.key === todayKey ? 'Today' : formatShort(d.key), value: d.pct }))}
                labelEvery={7}
                highlightKey={todayKey}
              />
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Tile value={monthStats.avg} suffix="%" label="Monthly average" />
              <Tile value={monthStats.hit} label="Strong days" sub={`${STREAK_THRESHOLD}% or more`} />
            </div>
            <Card title="Category performance">
              <CategoryBars groups={PROGRESS_GROUPS} values={monthCats} />
            </Card>
          </>
        )}
      </div>
    </>
  );
}

function Row({ label, value, tone }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[14.5px] text-muted">{label}</span>
      <AnimatedNumber value={value} className={`font-rounded text-[20px] font-bold ${tone}`} />
    </div>
  );
}

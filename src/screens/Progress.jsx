import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Header from '../components/Header';
import SegmentedControl from '../components/SegmentedControl';
import ProgressRing from '../components/ProgressRing';
import AnimatedNumber from '../components/AnimatedNumber';
import BarChart from '../components/BarChart';
import CategoryBars from '../components/CategoryBars';
import { useStore } from '../lib/store';
import { PROGRESS_GROUPS } from '../lib/constants';
import { formatShort, lastNDays, nowMinutes, taskTime, weekdayShort } from '../lib/date';
import { categoryPerformance, dayStatuses, series, summarize } from '../lib/stats';

const Card = ({ children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    className={`rounded-[24px] bg-surface p-5 ${className}`}
  >
    {children}
  </motion.section>
);

const Metric = ({ value, suffix = '', label, color = 'text-ink' }) => (
  <div className="text-center">
    <AnimatedNumber value={value} suffix={suffix} className={`block font-rounded text-[24px] font-bold ${color}`} />
    <span className="text-[12px] text-muted">{label}</span>
  </div>
);

export default function Progress() {
  const [range, setRange] = useState('day');
  const { sortedTasks, days, todayKey, meta } = useStore();
  const start = meta.startDate;

  const doneSet = new Set(days[todayKey]?.completedTasks ?? []);
  const now = nowMinutes();
  const map = dayStatuses(sortedTasks, doneSet, now);
  const status = sortedTasks.map((t) => map[t.id]);
  const done = status.filter((s) => s === 'done').length;
  const missedTasks = sortedTasks.filter((_, i) => status[i] === 'missed');
  const left = sortedTasks.length - done - missedTasks.length;
  const pct = sortedTasks.length ? Math.round((done / sortedTasks.length) * 100) : 0;

  const week = useMemo(() => series(7, days, start, todayKey), [days, start, todayKey]);
  const month = useMemo(() => series(30, days, start, todayKey), [days, start, todayKey]);
  const w = summarize(week);
  const m = summarize(month);
  const weekCats = useMemo(() => categoryPerformance(days, lastNDays(7, todayKey)), [days, todayKey]);
  const monthCats = useMemo(() => categoryPerformance(days, lastNDays(30, todayKey)), [days, todayKey]);

  return (
    <>
      <Header title="Progress" />
      <div className="space-y-3 px-5">
        <SegmentedControl
          id="progress-range"
          value={range}
          onChange={setRange}
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />

        {range === 'day' && (
          <>
            <Card className="flex flex-col items-center py-7">
              <ProgressRing value={pct} size={168} stroke={14}>
                <AnimatedNumber value={pct} suffix="%" className="font-rounded text-[40px] font-bold" />
              </ProgressRing>
              <div className="mt-6 grid w-full grid-cols-3">
                <Metric value={done} label="Done" color="text-brand" />
                <Metric value={left} label="Left" />
                <Metric value={missedTasks.length} label="Missed" color="text-miss" />
              </div>
            </Card>
            {missedTasks.length > 0 && (
              <Card className="py-2">
                <ul className="divide-y divide-line">
                  {missedTasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-3 py-3">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-miss" />
                      <span className="w-[84px] shrink-0 truncate text-[13px] text-miss">{taskTime(t)}</span>
                      <span className="truncate text-[15px]">{t.name}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </>
        )}

        {range === 'week' && (
          <>
            <Card>
              <BarChart
                data={week.map((d) => ({ key: d.key, label: weekdayShort(d.key).slice(0, 1), value: d.pct }))}
                highlightKey={todayKey}
              />
              <div className="mt-5 grid grid-cols-3">
                <Metric value={w.avg} suffix="%" label="Average" color="text-gold" />
                <Metric value={w.best?.pct ?? 0} suffix="%" label={w.best ? weekdayShort(w.best.key) : 'Best'} />
                <Metric value={w.consistency} suffix="%" label="Consistent" color="text-brand" />
              </div>
            </Card>
            <Card>
              <CategoryBars groups={PROGRESS_GROUPS} values={weekCats} />
            </Card>
          </>
        )}

        {range === 'month' && (
          <>
            <Card>
              <BarChart
                data={month.map((d) => ({
                  key: d.key,
                  label: d.key === todayKey ? 'Today' : formatShort(d.key),
                  value: d.pct,
                }))}
                labelEvery={7}
                highlightKey={todayKey}
              />
              <div className="mt-5 grid grid-cols-2">
                <Metric value={m.avg} suffix="%" label="Average" color="text-gold" />
                <Metric value={m.hit} label="Strong days" color="text-brand" />
              </div>
            </Card>
            <Card>
              <CategoryBars groups={PROGRESS_GROUPS} values={monthCats} />
            </Card>
          </>
        )}
      </div>
    </>
  );
}

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Flame } from 'lucide-react';
import Header from '../components/Header';
import ProgressRing from '../components/ProgressRing';
import AnimatedNumber from '../components/AnimatedNumber';
import TaskItem, { listVariants } from '../components/TaskItem';
import Celebration from '../components/Celebration';
import { useStore } from '../lib/store';
import { formatLong, greeting, nowMinutes } from '../lib/date';
import { streaks } from '../lib/stats';

function answerFor(pct) {
  if (pct === 100) return 'Yes. You resurfaced today.';
  if (pct >= 60) return 'You are building it. Finish strong.';
  if (pct > 0) return 'You have started. Keep going.';
  return 'The day is still yours to shape.';
}

export default function Today() {
  const { sortedTasks, days, todayKey, toggleTask, meta } = useStore();
  const doneSet = useMemo(() => new Set(days[todayKey]?.completedTasks ?? []), [days, todayKey]);
  const total = sortedTasks.length;
  const doneCount = sortedTasks.filter((t) => doneSet.has(t.id)).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const { current } = streaks(days, meta.startDate, todayKey);

  const now = nowMinutes();
  const nextId = sortedTasks.find((t) => !doneSet.has(t.id) && t.minutes >= now - 60)?.id;

  // Celebrate only on the transition to 100%.
  const [celebrate, setCelebrate] = useState(false);
  const prevPct = useRef(pct);
  useEffect(() => {
    if (prevPct.current < 100 && pct === 100 && total > 0) {
      setCelebrate(true);
      const id = setTimeout(() => setCelebrate(false), 2400);
      prevPct.current = pct;
      return () => clearTimeout(id);
    }
    prevPct.current = pct;
    return undefined;
  }, [pct, total]);

  return (
    <>
      <Header
        eyebrow={formatLong(todayKey)}
        title={`${greeting()}, ${meta.name}`}
        subtitle="Build the life you want, one day at a time."
      />

      <section className="px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="rounded-[28px] bg-white px-5 pb-5 pt-6 shadow-hero"
        >
          <div className="flex justify-center">
            <ProgressRing value={pct} size={208} stroke={20}>
              <div className="text-center">
                <AnimatedNumber
                  value={pct}
                  suffix="%"
                  className="font-rounded text-[52px] font-bold leading-none tracking-tight text-ink"
                />
                <p className="mt-1.5 text-[13.5px] font-semibold text-muted">Today&rsquo;s progress</p>
              </div>
            </ProgressRing>
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x divide-gray-100 rounded-2xl bg-canvas/70 py-3">
            <Stat value={doneCount} label="Done" />
            <Stat value={total - doneCount} label="Left" />
            <Stat value={current} label="Day streak" icon />
          </div>
        </motion.div>

        <div className="mt-5 rounded-2.5xl border border-brand/15 bg-brand-light px-4 py-3.5">
          <p className="text-[14px] font-semibold text-brand-dark">Did I build the life I want today?</p>
          <motion.p
            key={answerFor(pct)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-0.5 text-[15px] text-ink"
          >
            {answerFor(pct)}
          </motion.p>
        </div>
      </section>

      <section className="mt-6 pr-5">
        <h2 className="mb-3 pl-5 text-[20px] font-bold tracking-tight">Your day</h2>
        {total === 0 ? (
          <p className="pl-5 text-[15px] text-muted">Add tasks in Routine to start tracking your day.</p>
        ) : (
          <motion.ol variants={listVariants} initial="hidden" animate="show">
            {sortedTasks.map((t, i) => (
              <TaskItem
                key={t.id}
                task={t}
                done={doneSet.has(t.id)}
                isNext={t.id === nextId}
                isLast={i === sortedTasks.length - 1}
                onToggle={toggleTask}
              />
            ))}
          </motion.ol>
        )}
      </section>

      <Celebration show={celebrate} title="Day complete" message="You built the life you want today." />
    </>
  );
}

function Stat({ value, label, icon }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex items-center gap-1 font-rounded text-[22px] font-bold text-ink">
        {icon && <Flame className="h-[18px] w-[18px] text-brand" strokeWidth={2.4} aria-hidden />}
        <AnimatedNumber value={value} />
      </span>
      <span className="text-[12px] font-medium text-muted">{label}</span>
    </div>
  );
}

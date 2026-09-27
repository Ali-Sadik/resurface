import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import NowCard from '../components/NowCard';
import TaskRow from '../components/TaskRow';
import ProgressRing from '../components/ProgressRing';
import AnimatedNumber from '../components/AnimatedNumber';
import Celebration from '../components/Celebration';
import { useStore } from '../lib/store';
import { greeting, nowMinutes } from '../lib/date';
import { dayStatuses } from '../lib/stats';

export default function Today() {
  const { sortedTasks, days, todayKey, toggleTask, meta } = useStore();
  const doneSet = useMemo(() => new Set(days[todayKey]?.completedTasks ?? []), [days, todayKey]);

  // Re-evaluate "missed" every minute while the screen is open.
  const [now, setNow] = useState(nowMinutes);
  useEffect(() => {
    const id = setInterval(() => setNow(nowMinutes()), 30_000);
    return () => clearInterval(id);
  }, []);

  const statuses = useMemo(() => dayStatuses(sortedTasks, doneSet, now), [sortedTasks, doneSet, now]);
  const count = (s) => sortedTasks.filter((t) => statuses[t.id] === s).length;
  const done = count('done');
  const missed = count('missed');
  const left = count('upcoming');
  const total = sortedTasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  // Queue: what's due now first, then anything missed earlier.
  const [skipped, setSkipped] = useState(() => new Set());
  const queue = useMemo(() => {
    const upcoming = sortedTasks.filter((t) => statuses[t.id] === 'upcoming');
    const late = sortedTasks.filter((t) => statuses[t.id] === 'missed');
    const all = [...upcoming, ...late];
    const open = all.filter((t) => !skipped.has(t.id));
    return open.length ? open : all;
  }, [sortedTasks, statuses, skipped]);
  const current = queue[0];

  const skip = () =>
    setSkipped((prev) => {
      const next = new Set(prev);
      next.add(current.id);
      return next.size >= missed + left ? new Set() : next;
    });

  // Undo for the last completion.
  const [lastDone, setLastDone] = useState(null);
  const undoTimer = useRef();
  const complete = (id) => {
    toggleTask(id);
    setLastDone(id);
    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setLastDone(null), 4000);
  };
  const undo = () => {
    if (lastDone && doneSet.has(lastDone)) toggleTask(lastDone);
    setLastDone(null);
  };
  useEffect(() => () => clearTimeout(undoTimer.current), []);

  // Celebrate only on the transition to 100%.
  const [celebrate, setCelebrate] = useState(false);
  const prevPct = useRef(pct);
  useEffect(() => {
    if (prevPct.current < 100 && pct === 100 && total > 0) {
      setCelebrate(true);
      const id = setTimeout(() => setCelebrate(false), 1400);
      prevPct.current = pct;
      return () => clearTimeout(id);
    }
    prevPct.current = pct;
    return undefined;
  }, [pct, total]);

  return (
    <>
      <header className="pt-safe px-5 pb-4">
        <p className="text-[15px] text-muted">
          {greeting()}, {meta.name}
        </p>
      </header>

      <div className="space-y-4 px-5">
        {total === 0 ? (
          <p className="rounded-[28px] bg-surface p-6 text-[15px] text-muted">Add tasks in Routine to begin.</p>
        ) : (
          <NowCard
            task={current}
            missed={current && statuses[current.id] === 'missed'}
            onDone={complete}
            onSkip={skip}
            canSkip={queue.length > 1 || skipped.size > 0}
          />
        )}

        {/* Progress */}
        <section className="flex items-center gap-5 rounded-[24px] bg-surface p-5">
          <ProgressRing value={pct} size={76} stroke={8}>
            <AnimatedNumber value={pct} suffix="%" className="font-rounded text-[18px] font-bold" />
          </ProgressRing>
          <div className="grid flex-1 grid-cols-3">
            <Stat value={done} label="Done" color="text-brand" />
            <Stat value={left} label="Left" color="text-ink" />
            <Stat value={missed} label="Missed" color="text-miss" />
          </div>
        </section>

        {/* Full day */}
        <section className="divide-y divide-line rounded-[24px] bg-surface px-4">
          {sortedTasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              status={statuses[t.id]}
              current={t.id === current?.id}
              onToggle={toggleTask}
            />
          ))}
        </section>
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 z-40 flex justify-center"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
        <AnimatePresence>
          {lastDone && (
            <motion.button
              type="button"
              onClick={undo}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-raised px-4 py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.8)] text-[14px] font-semibold"
            >
              <RotateCcw className="h-4 w-4 text-brand" />
              Undo
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <Celebration show={celebrate} />
    </>
  );
}

function Stat({ value, label, color }) {
  return (
    <div className="text-center">
      <AnimatedNumber value={value} className={`block font-rounded text-[22px] font-bold ${color}`} />
      <span className="text-[12px] text-muted">{label}</span>
    </div>
  );
}

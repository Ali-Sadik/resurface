import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import Header from '../components/Header';
import AutoTextarea from '../components/AutoTextarea';
import { useStore } from '../lib/store';
import { MOODS } from '../lib/constants';
import { addDays, formatShort } from '../lib/date';

const NIGHT = [
  ['learned', 'What did I learn today?'],
  ['improve', 'Where can I improve?'],
  ['grateful', 'What am I grateful for?'],
];

export default function Journal() {
  const { todayKey, getEntry, updateEntry } = useStore();
  const [date, setDate] = useState(todayKey);
  const entry = getEntry(date);
  const isToday = date === todayKey;

  const [saved, setSaved] = useState(false);
  const timer = useRef();
  const flash = () => {
    setSaved(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 1000);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const edit = (fn) => {
    updateEntry(date, fn);
    flash();
  };

  return (
    <>
      <Header
        title="Journal"
        action={
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft"
                aria-label="Saved"
              >
                <Check className="h-4 w-4 text-brand" strokeWidth={3} />
              </motion.span>
            )}
          </AnimatePresence>
        }
      />

      <div className="space-y-6 px-5">
        {/* Day */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setDate((d) => addDays(d, -1))}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-[15px] font-semibold">{isToday ? 'Today' : formatShort(date)}</p>
          <button
            type="button"
            disabled={isToday}
            onClick={() => setDate((d) => addDays(d, 1))}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface disabled:opacity-20"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Mood */}
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Mood">
          {MOODS.map((m) => {
            const active = entry.mood === m.id;
            return (
              <motion.button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={m.label}
                whileTap={{ scale: 0.88 }}
                onClick={() => edit((e) => ({ ...e, mood: e.mood === m.id ? null : m.id }))}
                className={`grid h-16 place-items-center rounded-2xl border transition-colors ${
                  active ? 'border-brand bg-brand-soft' : 'border-transparent bg-surface'
                }`}
              >
                <motion.span
                  animate={{ scale: active ? 1.2 : 1, opacity: entry.mood && !active ? 0.4 : 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="text-[28px] leading-none"
                >
                  {m.emoji}
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* Morning */}
        <section>
          <p className="mb-2 flex items-center gap-2 text-[14px] text-muted">
            <Sun className="h-4 w-4 text-gold" /> What kind of person do I want to become today?
          </p>
          <AutoTextarea
            label="Morning intention"
            value={entry.morningReflection}
            onChange={(v) => edit((e) => ({ ...e, morningReflection: v }))}
          />
        </section>

        {/* Night */}
        <section className="space-y-4">
          {NIGHT.map(([k, q], i) => (
            <div key={k}>
              <p className="mb-2 flex items-center gap-2 text-[14px] text-muted">
                {i === 0 ? <Moon className="h-4 w-4 text-brand" /> : <span className="w-4" />}
                {q}
              </p>
              <AutoTextarea
                label={q}
                value={entry.nightReflection?.[k] ?? ''}
                onChange={(v) => edit((e) => ({ ...e, nightReflection: { ...e.nightReflection, [k]: v } }))}
              />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

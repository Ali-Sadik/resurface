import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Moon, Sunrise } from 'lucide-react';
import Header from '../components/Header';
import AutoTextarea from '../components/AutoTextarea';
import { useStore } from '../lib/store';
import { MOODS } from '../lib/constants';
import { addDays, formatLong, lastNDays, weekdayShort } from '../lib/date';

export default function Journal() {
  const { todayKey, getEntry, updateEntry, journal } = useStore();
  const [date, setDate] = useState(todayKey);
  const entry = getEntry(date);
  const isToday = date === todayKey;

  // Brief "Saved" confirmation after each change.
  const [saved, setSaved] = useState(false);
  const timer = useRef();
  const flashSaved = () => {
    setSaved(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 1200);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const setMorning = (v) => {
    updateEntry(date, (e) => ({ ...e, morningReflection: v }));
    flashSaved();
  };
  const setNight = (k) => (v) => {
    updateEntry(date, (e) => ({ ...e, nightReflection: { ...e.nightReflection, [k]: v } }));
    flashSaved();
  };
  const setMood = (id) => {
    updateEntry(date, (e) => ({ ...e, mood: e.mood === id ? null : id }));
    flashSaved();
  };

  const recent = lastNDays(7, todayKey);

  return (
    <>
      <Header
        title="Journal"
        subtitle="Reflect with honesty. Grow with intention."
        action={
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-2 inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-[12.5px] font-semibold text-brand-dark"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} /> Saved
              </motion.span>
            )}
          </AnimatePresence>
        }
      />

      <div className="space-y-4 px-5">
        {/* Date switcher */}
        <div className="flex items-center justify-between rounded-2xl bg-white px-2 py-2 shadow-card">
          <button
            type="button"
            onClick={() => setDate((d) => addDays(d, -1))}
            className="grid h-9 w-9 place-items-center rounded-full active:bg-gray-100"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-[15px] font-semibold">{isToday ? 'Today' : formatLong(date)}</p>
            {isToday && <p className="text-[12.5px] text-muted">{formatLong(date)}</p>}
          </div>
          <button
            type="button"
            disabled={isToday}
            onClick={() => setDate((d) => addDays(d, 1))}
            className="grid h-9 w-9 place-items-center rounded-full active:bg-gray-100 disabled:opacity-25"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Mood */}
        <section className="rounded-[24px] bg-white p-5 shadow-card">
          <h2 className="text-[17px] font-bold tracking-tight">How do you feel?</h2>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {MOODS.map((m) => {
              const active = entry.mood === m.id;
              return (
                <motion.button
                  key={m.id}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMood(m.id)}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-1 rounded-2xl border py-3 transition-colors ${
                    active ? 'border-brand bg-brand-light' : 'border-gray-100 bg-canvas/60'
                  }`}
                >
                  <motion.span
                    animate={{ scale: active ? 1.18 : 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="text-[28px] leading-none"
                  >
                    {m.emoji}
                  </motion.span>
                  <span className={`text-[12.5px] font-semibold ${active ? 'text-brand-dark' : 'text-muted'}`}>
                    {m.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Morning */}
        <section className="rounded-[24px] bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <Sunrise className="h-5 w-5 text-brand" />
            <h2 className="text-[17px] font-bold tracking-tight">Morning intention</h2>
          </div>
          <label htmlFor="morning" className="mb-2 block text-[15px] text-muted">
            What kind of person do I want to become today?
          </label>
          <AutoTextarea
            id="morning"
            value={entry.morningReflection}
            onChange={setMorning}
            placeholder="Today I want to be…"
          />
        </section>

        {/* Night */}
        <section className="rounded-[24px] bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <Moon className="h-5 w-5 text-brand" />
            <h2 className="text-[17px] font-bold tracking-tight">Night reflection</h2>
          </div>
          <div className="space-y-4">
            {[
              ['learned', 'What did I learn today?', 'One lesson from today…'],
              ['improve', 'Where can I improve?', 'Tomorrow I will…'],
              ['grateful', 'What am I grateful for?', 'Alhamdulillah for…'],
            ].map(([k, q, ph]) => (
              <div key={k}>
                <label htmlFor={`night-${k}`} className="mb-2 block text-[15px] text-muted">
                  {q}
                </label>
                <AutoTextarea
                  id={`night-${k}`}
                  value={entry.nightReflection?.[k] ?? ''}
                  onChange={setNight(k)}
                  placeholder={ph}
                  minRows={2}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Mood history */}
        <section className="rounded-[24px] bg-white p-5 shadow-card">
          <h2 className="mb-3 text-[17px] font-bold tracking-tight">Mood this week</h2>
          <div className="grid grid-cols-7 gap-1 text-center">
            {recent.map((k) => {
              const mood = MOODS.find((m) => m.id === journal[k]?.mood);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDate(k)}
                  className={`rounded-xl py-2 ${k === date ? 'bg-brand-light' : ''}`}
                >
                  <span className="block text-[22px] leading-none">{mood ? mood.emoji : '·'}</span>
                  <span className="mt-1 block text-[11px] font-semibold text-muted">{weekdayShort(k).slice(0, 2)}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Award, CalendarDays, CheckCircle2, Download, Flame, Pencil, Trash2, Upload } from 'lucide-react';
import Header from '../components/Header';
import ProgressRing from '../components/ProgressRing';
import AnimatedNumber from '../components/AnimatedNumber';
import { useStore } from '../lib/store';
import { PROFILE_GROUPS } from '../lib/constants';
import { daysBetween, toKey } from '../lib/date';
import { categoryPerformance, streaks, totalCompleted } from '../lib/stats';

export default function Profile() {
  const { days, meta, todayKey, updateMeta, exportData, importData, resetAll } = useStore();
  const { current, longest } = streaks(days, meta.startDate, todayKey);
  const total = totalCompleted(days);
  const journeyDay = daysBetween(meta.startDate, todayKey) + 1;
  const cats = categoryPerformance(days, Object.keys(days));

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: meta.name, mission: meta.mission });
  const [notice, setNotice] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef(null);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2600);
  };

  const onExport = async () => {
    const json = JSON.stringify(exportData(), null, 2);
    const name = `resurface-backup-${toKey()}.json`;
    const file = new File([json], name, { type: 'application/json' });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Resurface backup' });
        return;
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('Backup exported.');
  };

  const onImport = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      importData(JSON.parse(await f.text()));
      flash('Backup restored.');
    } catch (err) {
      flash(err.message || 'That file could not be read.');
    }
  };

  return (
    <>
      <Header title="Profile" />
      <div className="space-y-4 px-5">
        {/* Identity */}
        <section className="rounded-[24px] bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#22C55E] to-brand-dark font-rounded text-[26px] font-bold text-white">
              {(meta.name || 'R').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[22px] font-bold tracking-tight">{meta.name}</p>
              <p className="text-[14px] text-muted">Day {journeyDay} of your journey</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDraft({ name: meta.name, mission: meta.mission });
                setEditing((v) => !v);
              }}
              className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-muted"
              aria-label="Edit profile"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          {editing ? (
            <div className="mt-4 space-y-3">
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-brand focus:outline-none"
                placeholder="Your name"
              />
              <textarea
                rows={3}
                value={draft.mission}
                onChange={(e) => setDraft((d) => ({ ...d, mission: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 leading-relaxed focus:border-brand focus:outline-none"
                placeholder="Your mission"
              />
              <button
                type="button"
                onClick={() => {
                  updateMeta({ name: draft.name.trim() || 'Friend', mission: draft.mission.trim() });
                  setEditing(false);
                }}
                className="w-full rounded-2xl bg-brand py-3 font-semibold text-white"
              >
                Save profile
              </button>
            </div>
          ) : (
            <blockquote className="mt-4 border-l-[3px] border-brand pl-3.5 text-[16px] leading-relaxed text-ink">
              {meta.mission}
            </blockquote>
          )}
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Flame} value={current} label="Current streak" unit={current === 1 ? 'day' : 'days'} highlight />
          <StatCard icon={Award} value={longest} label="Longest streak" unit={longest === 1 ? 'day' : 'days'} />
          <StatCard icon={CheckCircle2} value={total} label="Tasks completed" />
          <StatCard icon={CalendarDays} value={Object.keys(days).length} label="Days tracked" />
        </div>

        {/* Category progress */}
        <section className="rounded-[24px] bg-white p-5 shadow-card">
          <h2 className="mb-4 text-[17px] font-bold tracking-tight">Growth by area</h2>
          <div className="grid grid-cols-4 gap-2">
            {PROFILE_GROUPS.map(({ label, group }) => (
              <div key={label} className="flex flex-col items-center">
                <ProgressRing value={cats[group] ?? 0} size={68} stroke={8}>
                  <span className="font-rounded text-[15px] font-bold tabular-nums">{cats[group] ?? 0}%</span>
                </ProgressRing>
                <span className="mt-1.5 text-[12.5px] font-semibold text-muted">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12.5px] text-muted">All-time completion rate for each area.</p>
        </section>

        {/* Data */}
        <section className="overflow-hidden rounded-[24px] bg-white shadow-card">
          <h2 className="px-5 pb-1 pt-5 text-[17px] font-bold tracking-tight">Your data</h2>
          <p className="px-5 text-[13px] leading-snug text-muted">
            Everything lives only on this iPhone. Export a backup now and then to keep it safe.
          </p>
          <div className="mt-3 divide-y divide-gray-100">
            <ActionRow icon={Download} label="Export backup" onClick={onExport} />
            <ActionRow icon={Upload} label="Import backup" onClick={() => fileRef.current?.click()} />
            <ActionRow
              icon={Trash2}
              danger
              label={confirmReset ? 'Tap again to erase everything' : 'Reset all data'}
              onClick={() => {
                if (confirmReset) {
                  resetAll();
                  setConfirmReset(false);
                  flash('All data erased.');
                } else setConfirmReset(true);
              }}
            />
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} />
        </section>

        {notice && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-[14px] font-semibold text-brand-dark"
          >
            {notice}
          </motion.p>
        )}

        <p className="pb-2 text-center text-[12.5px] text-gray-400">Resurface. Stored privately on this device.</p>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, value, label, unit, highlight }) {
  return (
    <div className={`rounded-[22px] p-4 ${highlight ? 'bg-brand text-white shadow-hero' : 'bg-white shadow-card'}`}>
      <Icon className={`h-5 w-5 ${highlight ? 'text-white' : 'text-brand'}`} strokeWidth={2.3} />
      <p className="mt-2 flex items-baseline gap-1">
        <AnimatedNumber value={value} className="font-rounded text-[30px] font-bold leading-none" />
        {unit && <span className={`text-[13px] font-semibold ${highlight ? 'text-white/80' : 'text-muted'}`}>{unit}</span>}
      </p>
      <p className={`mt-1 text-[13px] font-semibold ${highlight ? 'text-white/85' : 'text-muted'}`}>{label}</p>
    </div>
  );
}

function ActionRow({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-5 py-3.5 text-left text-[15.5px] font-semibold active:bg-gray-50 ${
        danger ? 'text-red-600' : 'text-ink'
      }`}
    >
      <Icon className={`h-[18px] w-[18px] ${danger ? 'text-red-500' : 'text-brand'}`} />
      {label}
    </button>
  );
}

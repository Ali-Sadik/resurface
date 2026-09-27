import { useRef, useState } from 'react';
import { Download, Pencil, Trash2, Upload } from 'lucide-react';
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
    setTimeout(() => setNotice(''), 2400);
  };

  const onExport = async () => {
    const name = `resurface-backup-${toKey()}.json`;
    const file = new File([JSON.stringify(exportData(), null, 2)], name, { type: 'application/json' });
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
    flash('Backup exported');
  };

  const onImport = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      importData(JSON.parse(await f.text()));
      flash('Backup restored');
    } catch (err) {
      flash(err.message || 'That file could not be read');
    }
  };

  const field =
    'w-full rounded-2xl bg-raised px-4 py-3 text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-brand/60';

  return (
    <>
      <Header
        title={meta.name}
        action={
          <button
            type="button"
            onClick={() => {
              setDraft({ name: meta.name, mission: meta.mission });
              setEditing((v) => !v);
            }}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface text-muted"
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4" />
          </button>
        }
      />

      <div className="space-y-3 px-5">
        {editing ? (
          <section className="space-y-3 rounded-[24px] bg-surface p-4">
            <input
              aria-label="Name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className={field}
            />
            <textarea
              aria-label="Mission"
              rows={3}
              value={draft.mission}
              onChange={(e) => setDraft((d) => ({ ...d, mission: e.target.value }))}
              className={`${field} leading-relaxed`}
            />
            <button
              type="button"
              onClick={() => {
                updateMeta({ name: draft.name.trim() || 'Friend', mission: draft.mission.trim() });
                setEditing(false);
              }}
              className="w-full rounded-2xl bg-brand py-3 font-semibold text-black"
            >
              Save
            </button>
          </section>
        ) : (
          <p className="px-1 pb-2 text-[17px] leading-relaxed text-muted">{meta.mission}</p>
        )}

        <section className="grid grid-cols-2 gap-3">
          <Stat value={current} label="Streak" color="text-brand" />
          <Stat value={longest} label="Best streak" />
          <Stat value={total} label="Tasks done" />
          <Stat value={journeyDay} label="Days" />
        </section>

        <section className="grid grid-cols-4 gap-2 rounded-[24px] bg-surface px-3 py-5">
          {PROFILE_GROUPS.map(({ label, group }) => (
            <div key={label} className="flex flex-col items-center">
              <ProgressRing value={cats[group] ?? 0} size={62} stroke={6}>
                <span className="font-rounded text-[14px] font-bold tabular-nums">{cats[group] ?? 0}</span>
              </ProgressRing>
              <span className="mt-2 text-[12px] text-muted">{label}</span>
            </div>
          ))}
        </section>

        <section className="divide-y divide-line rounded-[24px] bg-surface px-4">
          <Action icon={Download} label="Export backup" onClick={onExport} />
          <Action icon={Upload} label="Import backup" onClick={() => fileRef.current?.click()} />
          <Action
            icon={Trash2}
            danger
            label={confirmReset ? 'Tap again to erase everything' : 'Reset all data'}
            onClick={() => {
              if (confirmReset) {
                resetAll();
                setConfirmReset(false);
                flash('All data erased');
              } else setConfirmReset(true);
            }}
          />
        </section>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} />

        {notice && <p className="text-center text-[14px] font-semibold text-brand">{notice}</p>}
      </div>
    </>
  );
}

function Stat({ value, label, color = 'text-ink' }) {
  return (
    <div className="rounded-[22px] bg-surface p-4">
      <AnimatedNumber value={value} className={`block font-rounded text-[30px] font-bold leading-none ${color}`} />
      <span className="mt-1.5 block text-[13px] text-muted">{label}</span>
    </div>
  );
}

function Action({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 py-3.5 text-left text-[15px] ${danger ? 'text-miss' : 'text-ink'}`}
    >
      <Icon className={`h-[18px] w-[18px] ${danger ? 'text-miss' : 'text-muted'}`} />
      {label}
    </button>
  );
}

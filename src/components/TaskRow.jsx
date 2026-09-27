import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { taskTime } from '../lib/date';

const tone = {
  done: { time: 'text-faint', name: 'text-muted' },
  missed: { time: 'text-miss', name: 'text-ink' },
  upcoming: { time: 'text-muted', name: 'text-ink' },
};

export default function TaskRow({ task, status, current, onToggle }) {
  const t = tone[status];
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={status === 'done'}
      onClick={() => onToggle(task.id)}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <motion.span
        initial={false}
        animate={{
          backgroundColor: status === 'done' ? '#22C55E' : 'rgba(0,0,0,0)',
          borderColor: status === 'done' ? '#22C55E' : status === 'missed' ? '#EF4444' : current ? '#22C55E' : '#48484A',
          scale: status === 'done' ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.35 }}
        className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2"
      >
        {status === 'done' && <Check className="h-3 w-3 text-black" strokeWidth={4} />}
      </motion.span>
      <span className={`w-[84px] shrink-0 truncate whitespace-nowrap text-[13px] font-medium tabular-nums ${t.time}`}>{taskTime(task)}</span>
      <span className={`min-w-0 flex-1 truncate text-[15px] ${t.name}`}>{task.name}</span>
    </button>
  );
}

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Check from './Check';
import CategoryChip from './CategoryChip';
import { taskTime } from '../lib/date';

export const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 26 } },
};

export default function TaskItem({ task, done, isNext, isLast, onToggle }) {
  const [burst, setBurst] = useState(0);

  const handle = () => {
    if (!done) setBurst((b) => b + 1);
    onToggle(task.id);
  };

  return (
    <motion.li variants={itemVariants} className="flex gap-3">
      {/* Time column */}
      <div className="w-[74px] shrink-0 pt-[18px] text-right">
        <span
          className={`text-[12px] font-semibold leading-tight ${done ? 'text-brand-dark' : 'text-muted'}`}
        >
          {taskTime(task)}
        </span>
      </div>

      {/* Timeline rail */}
      <div className="flex w-3 shrink-0 flex-col items-center pt-[22px]">
        <motion.span
          initial={false}
          animate={{ backgroundColor: done ? '#16A34A' : isNext ? '#FFFFFF' : '#E5E7EB', scale: isNext ? 1.15 : 1 }}
          className={`h-2.5 w-2.5 rounded-full ${isNext && !done ? 'ring-2 ring-brand' : ''}`}
        />
        {!isLast && (
          <span className={`mt-1 w-[2px] flex-1 rounded-full ${done ? 'bg-brand/30' : 'bg-gray-200'}`} />
        )}
      </div>

      {/* Card */}
      <motion.button
        type="button"
        onClick={handle}
        whileTap={{ scale: 0.975 }}
        role="checkbox"
        aria-checked={done}
        className={`mb-3 flex min-w-0 flex-1 items-start gap-3 rounded-2.5xl border p-4 text-left transition-colors duration-300 ${
          done ? 'border-brand/15 bg-brand-light' : 'border-transparent bg-white shadow-card'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryChip category={task.category} muted={done} />
            {isNext && !done && (
              <span className="rounded-full bg-brand px-2 py-[3px] text-[11.5px] font-semibold text-white">
                Up next
              </span>
            )}
          </div>
          <p
            className={`mt-2 text-[16.5px] font-semibold leading-snug transition-colors ${
              done ? 'text-brand-dark' : 'text-ink'
            }`}
          >
            {task.name}
          </p>
          {task.description && (
            <p className="mt-1 text-[14px] leading-snug text-muted">{task.description}</p>
          )}
          {task.rule && (
            <p className="mt-2 flex items-start gap-1.5 text-[13px] font-medium leading-snug text-brand-dark">
              <ShieldCheck className="mt-[1px] h-3.5 w-3.5 shrink-0" strokeWidth={2.4} aria-hidden />
              {task.rule}
            </p>
          )}
        </div>
        <Check checked={done} burstKey={burst} />
      </motion.button>
    </motion.li>
  );
}

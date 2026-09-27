import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { taskTime } from '../lib/date';

// One task at a time. Finishing it sends the card up and brings the next one in from below.
export default function NowCard({ task, missed, onDone, onSkip, canSkip }) {
  return (
    <div className="relative min-h-[236px]">
      <AnimatePresence mode="wait" initial={false}>
        {task ? (
          <motion.article
            key={task.id}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -36, opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className={`rounded-[28px] border bg-surface p-6 ${missed ? 'border-miss/40' : 'border-line'}`}
          >
            <div className={`flex items-center gap-2 text-[14px] font-semibold ${missed ? 'text-miss' : 'text-brand'}`}>
              <CategoryIcon category={task.category} />
              <span>{taskTime(task)}</span>
            </div>

            <h2 className="mt-3 text-[27px] font-bold leading-[1.15] tracking-[-0.015em]">{task.name}</h2>
            {(task.rule || task.description) && (
              <p className="mt-2 text-[15px] leading-snug text-muted">{task.rule || task.description}</p>
            )}

            <div className="mt-6 flex gap-2.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => onDone(task.id)}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand text-[17px] font-semibold text-black"
              >
                <Check className="h-5 w-5" strokeWidth={3} />
                Done
              </motion.button>
              {canSkip && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={onSkip}
                  aria-label="Show next task"
                  className="grid h-14 w-14 place-items-center rounded-2xl bg-raised text-muted"
                >
                  <ChevronRight className="h-6 w-6" />
                </motion.button>
              )}
            </div>
          </motion.article>
        ) : (
          <motion.article
            key="complete"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="flex min-h-[236px] flex-col items-center justify-center rounded-[28px] border border-brand/30 bg-brand-soft p-6 text-center"
          >
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.1 }}
              className="grid h-14 w-14 place-items-center rounded-full bg-brand text-black"
            >
              <Check className="h-7 w-7" strokeWidth={3} />
            </motion.span>
            <p className="mt-4 text-[22px] font-bold">Day complete</p>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}

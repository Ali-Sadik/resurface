import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { taskTime } from '../lib/date';

const spring = { type: 'spring', stiffness: 260, damping: 28 };

// Done flies the card up; missed slides it away to the left.
const cardVariants = {
  initial: { y: 90, opacity: 0 },
  enter: { y: 0, x: 0, opacity: 1, rotate: 0, transition: spring },
  exit: (dir) =>
    dir === 'missed'
      ? { x: -140, opacity: 0, rotate: -5, transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } }
      : { y: -48, opacity: 0, scale: 0.96, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
};

const GLOW_OFF = '0 10px 30px -10px rgba(34,197,94,0.25)';
const GLOW_ON = '0 14px 40px -6px rgba(34,197,94,0.65)';

// One task at a time. The next card rises in from below.
export default function NowCard({ task, late, onDone, onMiss }) {
  const [dir, setDir] = useState('done');

  return (
    <div className="relative min-h-[236px]">
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        {task ? (
          <TaskCard
            key={task.id}
            task={task}
            late={late}
            onDone={() => {
              setDir('done');
              onDone(task.id);
            }}
            onMiss={() => {
              setDir('missed');
              onMiss(task.id);
            }}
          />
        ) : (
          <motion.article
            key="complete"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
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

function TaskCard({ task, late, onDone, onMiss }) {
  // Brief confirmation state before the card leaves.
  const [action, setAction] = useState(null);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const act = (type, cb, delay) => {
    if (action) return;
    setAction(type);
    timer.current = setTimeout(cb, delay);
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`rounded-[28px] border bg-surface p-6 ${late ? 'border-miss/40' : 'border-line'}`}
    >
      <div className={`flex items-center gap-2 text-[14px] font-semibold ${late ? 'text-miss' : 'text-brand'}`}>
        <CategoryIcon category={task.category} />
        <span>{taskTime(task)}</span>
      </div>

      <h2 className="mt-3 text-[27px] font-bold leading-[1.15] tracking-[-0.015em]">{task.name}</h2>
      {(task.rule || task.description) && (
        <p className="mt-2 text-[15px] leading-snug text-muted">{task.rule || task.description}</p>
      )}

      <div className="mt-6 flex gap-2.5">
        {/* Primary: breathing glow + light sweep invite the tap */}
        <motion.button
          type="button"
          onClick={() => act('done', onDone, 380)}
          whileTap={{ scale: 0.95 }}
          initial={false}
          animate={
            action === 'done'
              ? { scale: [1, 1.04, 1], boxShadow: GLOW_ON }
              : { boxShadow: [GLOW_OFF, GLOW_ON, GLOW_OFF] }
          }
          transition={
            action === 'done'
              ? { duration: 0.35 }
              : { boxShadow: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } }
          }
          className="relative h-14 flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-[#34D66C] to-brand-dark text-[17px] font-semibold text-black"
        >
          {!action && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              initial={{ x: '-120%' }}
              animate={{ x: '360%' }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut', delay: 0.6 }}
            />
          )}
          <span className="relative flex h-full items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {action === 'done' ? (
                <motion.span
                  key="ok"
                  initial={{ scale: 0, rotate: -60 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 18 }}
                >
                  <Check className="h-7 w-7" strokeWidth={3.2} />
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.12 } }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    className="grid h-6 w-6 place-items-center rounded-full border-2 border-black/80"
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3.4} />
                  </motion.span>
                  Mark as done
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </motion.button>

        {/* Secondary: mark as missed */}
        <motion.button
          type="button"
          onClick={() => act('missed', onMiss, 260)}
          aria-label="Mark as missed"
          whileTap={{ scale: 0.88 }}
          initial={false}
          animate={{
            backgroundColor: action === 'missed' ? '#2A1010' : '#1C1C1E',
            rotate: action === 'missed' ? 90 : 0,
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
        >
          <X
            className={`h-6 w-6 transition-colors ${action === 'missed' ? 'text-miss' : 'text-muted'}`}
            strokeWidth={2.6}
          />
        </motion.button>
      </div>
    </motion.article>
  );
}

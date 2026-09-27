import { AnimatePresence, motion } from 'framer-motion';

// Spring checkbox with a drawn tick and a soft success ripple.
export default function Check({ checked, burstKey }) {
  return (
    <span className="relative grid h-8 w-8 shrink-0 place-items-center">
      <AnimatePresence>
        {checked && burstKey > 0 && (
          <motion.span
            key={burstKey}
            className="pointer-events-none absolute inset-0 rounded-full bg-brand"
            initial={{ scale: 0.7, opacity: 0.4 }}
            animate={{ scale: 2.3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <motion.span
        className="relative grid h-8 w-8 place-items-center rounded-full border-2"
        initial={false}
        animate={{
          scale: checked ? [1, 1.2, 0.94, 1] : 1,
          backgroundColor: checked ? '#16A34A' : '#FFFFFF',
          borderColor: checked ? '#16A34A' : '#D1D5DB',
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, delay: checked ? 0.06 : 0 }}
          />
        </svg>
      </motion.span>
    </span>
  );
}

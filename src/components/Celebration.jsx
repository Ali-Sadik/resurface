import { AnimatePresence, motion } from 'framer-motion';

const DOTS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  return { x: Math.cos(angle) * 120, y: Math.sin(angle) * 120, size: 6 + (i % 3) * 3 };
});

export default function Celebration({ show, title, message }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 grid place-items-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative">
            {DOTS.map((d, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full bg-brand"
                style={{ width: d.size, height: d.size, marginLeft: -d.size / 2, marginTop: -d.size / 2 }}
                initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.4 }}
                animate={{ x: d.x, y: d.y, opacity: 0, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              />
            ))}
            <motion.div
              className="relative rounded-[26px] bg-white px-7 py-6 text-center shadow-hero"
              initial={{ scale: 0.85, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <p className="font-rounded text-[22px] font-bold text-brand-dark">{title}</p>
              <p className="mt-1 text-[15px] text-muted">{message}</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

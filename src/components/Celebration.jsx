import { AnimatePresence, motion } from 'framer-motion';

const DOTS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return { x: Math.cos(a) * 130, y: Math.sin(a) * 130, size: 5 + (i % 3) * 3, gold: i % 2 === 0 };
});

// Brief burst when the day reaches 100%.
export default function Celebration({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative">
            {DOTS.map((d, i) => (
              <motion.span
                key={i}
                className={`absolute left-1/2 top-1/2 rounded-full ${d.gold ? 'bg-gold' : 'bg-brand'}`}
                style={{ width: d.size, height: d.size, marginLeft: -d.size / 2, marginTop: -d.size / 2 }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                animate={{ x: d.x, y: d.y, opacity: 0, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

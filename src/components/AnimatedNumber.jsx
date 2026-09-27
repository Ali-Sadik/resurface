import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

// Counts smoothly from the previous value (0 on first render) to `value`.
export default function AnimatedNumber({ value, suffix = '', className = '' }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [mv, value]);

  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>;
}

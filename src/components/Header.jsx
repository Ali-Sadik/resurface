import { motion } from 'framer-motion';

export default function Header({ eyebrow, title, subtitle, action }) {
  return (
    <header className="pt-safe px-5 pb-4">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="text-[13px] font-semibold text-muted">{eyebrow}</p>}
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-0.5 text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ink"
          >
            {title}
          </motion.h1>
        </div>
        {action}
      </div>
      {subtitle && <p className="mt-2 text-[15px] leading-snug text-muted">{subtitle}</p>}
    </header>
  );
}

import { motion } from 'framer-motion';

export default function CategoryBars({ groups, values }) {
  return (
    <ul className="space-y-3.5">
      {groups.map((g, i) => {
        const v = values[g];
        return (
          <li key={g}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-[14.5px] font-semibold text-ink">{g}</span>
              <span className="text-[13px] font-semibold tabular-nums text-muted">
                {v === undefined ? 'No data' : `${v}%`}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-brand-light">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-brand-dark"
                initial={{ width: 0 }}
                animate={{ width: `${v ?? 0}%` }}
                transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.05 * i }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

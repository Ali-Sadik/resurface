import { motion } from 'framer-motion';

export default function CategoryBars({ groups, values }) {
  return (
    <ul className="space-y-4">
      {groups.map((g, i) => {
        const v = values[g];
        return (
          <li key={g}>
            <div className="mb-1.5 flex justify-between text-[14px]">
              <span>{g}</span>
              <span className="tabular-nums text-muted">{v === undefined ? '–' : `${v}%`}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-raised">
              <motion.div
                className="h-full rounded-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${v ?? 0}%` }}
                transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.04 * i }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

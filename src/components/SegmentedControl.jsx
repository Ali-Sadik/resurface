import { motion } from 'framer-motion';

export default function SegmentedControl({ options, value, onChange, id = 'seg' }) {
  return (
    <div className="flex rounded-[12px] bg-gray-200/70 p-[3px]" role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className="relative flex-1 py-[7px] text-[13.5px] font-semibold"
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-[9px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className={`relative ${active ? 'text-ink' : 'text-muted'}`}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

import { motion } from 'framer-motion';

// Icon-only tab bar. Labels stay available to VoiceOver.
export default function BottomNav({ tabs, active, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-md justify-around px-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className="flex h-14 w-full flex-col items-center justify-center gap-1"
              >
                <motion.span whileTap={{ scale: 0.85 }}>
                  <Icon
                    className={`h-6 w-6 transition-colors ${isActive ? 'text-brand' : 'text-faint'}`}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                </motion.span>
                <span className="h-1 w-1">
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="block h-1 w-1 rounded-full bg-brand"
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

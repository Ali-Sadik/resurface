import { motion } from 'framer-motion';

export default function BottomNav({ tabs, active, onChange }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 bg-white shadow-nav"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-1.5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex w-full flex-col items-center gap-0.5 pb-2 pt-1.5"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute top-0.5 h-8 w-14 rounded-full bg-brand-light"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <motion.span whileTap={{ scale: 0.86 }} className="relative grid h-8 place-items-center">
                  <Icon
                    className={`h-[22px] w-[22px] transition-colors ${isActive ? 'text-brand' : 'text-gray-400'}`}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                </motion.span>
                <span
                  className={`relative text-[10.5px] font-semibold transition-colors ${
                    isActive ? 'text-brand-dark' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { useEffect } from 'react';

// iOS-style bottom sheet. Drag the handle down to dismiss.
export default function Sheet({ open, onClose, title, children, footer }) {
  const controls = useDragControls();

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[90dvh] max-w-md flex-col rounded-t-[28px] bg-raised"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragListener={false}
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <div
              className="flex cursor-grab touch-none flex-col items-center px-5 pb-2 pt-2.5"
              onPointerDown={(e) => controls.start(e)}
            >
              <span className="h-1.5 w-10 rounded-full bg-faint" />
              <div className="mt-3 flex w-full items-center justify-between">
                <button type="button" onClick={onClose} className="text-[16px] font-medium text-muted">
                  Cancel
                </button>
                <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
                <span className="w-[52px]" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>
            {footer && <div className="pb-safe border-t border-line px-5 pt-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

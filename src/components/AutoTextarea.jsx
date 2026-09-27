import { useLayoutEffect, useRef } from 'react';

// Textarea that grows with its content (Safari lacks field-sizing).
export default function AutoTextarea({ value, onChange, placeholder, minRows = 3, id }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      id={id}
      ref={ref}
      rows={minRows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-gray-200 bg-canvas/60 px-4 py-3 text-[16px] leading-relaxed text-ink placeholder:text-gray-400 focus:border-brand focus:bg-white focus:outline-none"
    />
  );
}

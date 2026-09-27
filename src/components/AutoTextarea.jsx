import { useLayoutEffect, useRef } from 'react';

export default function AutoTextarea({ value, onChange, placeholder, minRows = 2, id, label }) {
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
      aria-label={label}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl bg-surface px-4 py-3.5 text-[16px] leading-relaxed text-ink placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-brand/60"
    />
  );
}

import { motion } from 'framer-motion';
import { COLORS, STREAK_THRESHOLD } from '../lib/constants';

// data: [{ key, label, value }] — value 0–100, or null before you started
export default function BarChart({ data, height = 140, labelEvery = 1, highlightKey }) {
  const W = 320;
  const n = data.length;
  const gap = n > 14 ? 3 : 10;
  const bw = (W - gap * (n - 1)) / n;
  const rx = Math.min(5, bw / 2);

  return (
    <svg viewBox={`0 0 ${W} ${height + 22}`} className="w-full" role="img" aria-label="Completion chart">
      {data.map((d, i) => {
        const x = i * (bw + gap);
        const v = d.value ?? 0;
        const tracked = d.value !== null;
        const isToday = d.key === highlightKey;
        // Zero on a finished day = missed (red). Today at zero is still in progress.
        const missedDay = tracked && v === 0 && !isToday;
        const h = !tracked ? 0 : missedDay ? 4 : Math.max(v > 0 ? 5 : 0, (v / 100) * height);
        const fill = missedDay ? COLORS.missed : v >= STREAK_THRESHOLD ? COLORS.progress : '#7A6A1C';
        const edgeStart = labelEvery > 1 && x < 24;
        const edgeEnd = labelEvery > 1 && i === n - 1;
        return (
          <g key={d.key}>
            <rect x={x} y={0} width={bw} height={height} rx={rx} fill={COLORS.track} />
            <motion.rect
              x={x}
              width={bw}
              rx={rx}
              fill={fill}
              initial={{ height: 0, y: height }}
              animate={{ height: h, y: height - h }}
              transition={{ type: 'spring', stiffness: 140, damping: 20, delay: i * 0.015 }}
            />
            {(n - 1 - i) % labelEvery === 0 && (
              <text
                x={edgeEnd ? x + bw : edgeStart ? x : x + bw / 2}
                y={height + 16}
                textAnchor={edgeEnd ? 'end' : edgeStart ? 'start' : 'middle'}
                fontSize="10.5"
                fontWeight={isToday ? 700 : 500}
                fill={isToday ? '#FFFFFF' : '#636366'}
              >
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

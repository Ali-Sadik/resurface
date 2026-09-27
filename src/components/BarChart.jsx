import { motion } from 'framer-motion';
import { STREAK_THRESHOLD } from '../lib/constants';

/**
 * data: [{ key, label, value }] where value is 0–100 or null (not tracked yet)
 */
export default function BarChart({ data, height = 150, labelEvery = 1, highlightKey }) {
  const W = 320;
  const n = data.length;
  const gap = n > 14 ? 3 : 10;
  const bw = (W - gap * (n - 1)) / n;
  const rx = Math.min(6, bw / 2);
  const thresholdY = height - (STREAK_THRESHOLD / 100) * height;

  return (
    <svg viewBox={`0 0 ${W} ${height + 24}`} className="w-full" role="img" aria-label="Completion chart">
      {data.map((d, i) => {
        const x = i * (bw + gap);
        const v = d.value ?? 0;
        const h = d.value === null ? 0 : Math.max(v > 0 ? 6 : 3, (v / 100) * height);
        const isHi = d.key === highlightKey;
        const fill = d.value === null ? '#E5E7EB' : v >= STREAK_THRESHOLD ? '#16A34A' : v > 0 ? '#86EFAC' : '#D1FAE5';
        return (
          <g key={d.key}>
            <rect x={x} y={0} width={bw} height={height} rx={rx} fill="#F0FDF4" />
            <motion.rect
              x={x}
              width={bw}
              rx={rx}
              fill={isHi ? '#15803D' : fill}
              initial={{ height: 0, y: height }}
              animate={{ height: h, y: height - h }}
              transition={{ type: 'spring', stiffness: 140, damping: 20, delay: i * 0.018 }}
            />
            {(n - 1 - i) % labelEvery === 0 && (
              <text
                x={labelEvery > 1 && i === n - 1 ? x + bw : labelEvery > 1 && x < 24 ? x : x + bw / 2}
                y={height + 17}
                textAnchor={labelEvery > 1 && i === n - 1 ? 'end' : labelEvery > 1 && x < 24 ? 'start' : 'middle'}
                fontSize="10.5"
                fontWeight={isHi ? 700 : 500}
                fill={isHi ? '#15803D' : '#9CA3AF'}
              >
                {d.label}
              </text>
            )}
          </g>
        );
      })}
      <line x1="0" x2={W} y1={thresholdY} y2={thresholdY} stroke="#4ADE80" strokeOpacity="0.7" strokeDasharray="4 4" />
    </svg>
  );
}

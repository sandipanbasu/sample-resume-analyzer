import { useEffect, useRef, useState } from 'react';

type Props = {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
};

function scoreColor(score: number) {
  if (score >= 85) return { ring: '#10b981', glow: '#10b981' };
  if (score >= 70) return { ring: '#3b82f6', glow: '#3b82f6' };
  if (score >= 55) return { ring: '#f59e0b', glow: '#f59e0b' };
  return { ring: '#ef4444', glow: '#ef4444' };
}

export default function ScoreRing({ score, size = 220, stroke = 16, label }: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { ring, glow } = scoreColor(score);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const duration = 1100;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(eased * score));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [score]);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (display / 100) * circumference;

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e9ecf5"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.1s linear',
            filter: `drop-shadow(0 0 6px ${glow}55)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-5xl font-extrabold tabular-nums"
          style={{ color: ring }}
        >
          {display}
        </span>
        <span className="text-sm font-medium text-slate-400">/ 100</span>
        {label && (
          <span className="mt-1 max-w-[70%] text-center text-xs font-semibold text-slate-500">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

type Props = {
  label: string;
  score: number;
  description: string;
  delay?: number;
};

function barColor(score: number) {
  if (score >= 85) return 'from-emerald-400 to-emerald-500';
  if (score >= 70) return 'from-blue-400 to-blue-500';
  if (score >= 55) return 'from-amber-400 to-amber-500';
  return 'from-rose-400 to-rose-500';
}

export default function CategoryBar({ label, score, description, delay = 0 }: Props) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm font-bold text-slate-800">{label}</h4>
        <span className="font-display text-lg font-extrabold tabular-nums text-slate-800">
          {score}
          <span className="text-sm font-medium text-slate-400">/100</span>
        </span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor(score)}`}
          style={{ width: `${score}%`, transition: 'width 1s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

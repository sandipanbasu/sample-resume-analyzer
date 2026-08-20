import { Check, X, Briefcase, Lightbulb, ArrowRight } from 'lucide-react';
import type { JobMatchResult } from '@/lib/analysis';

type Props = {
  jobMatch: JobMatchResult;
  targetRole: string;
};

function impactStyles(impact: 'high' | 'medium' | 'low') {
  if (impact === 'high') return { chip: 'bg-rose-100 text-rose-600', label: 'High impact' };
  if (impact === 'medium') return { chip: 'bg-amber-100 text-amber-600', label: 'Medium impact' };
  return { chip: 'bg-slate-100 text-slate-500', label: 'Low impact' };
}

function matchColor(score: number) {
  if (score >= 85) return { stroke: '#10b981', text: 'text-emerald-600' };
  if (score >= 70) return { stroke: '#3b82f6', text: 'text-blue-600' };
  if (score >= 55) return { stroke: '#f59e0b', text: 'text-amber-600' };
  return { stroke: '#ef4444', text: 'text-rose-600' };
}

export default function JobMatchSection({ jobMatch, targetRole }: Props) {
  const { matchScore, matchLabel, skillsMatched, skillsMissing, keywordsMissing, recommendations } = jobMatch;
  const { stroke, text } = matchColor(matchScore);

  // Mini animated ring for the match score
  const size = 140;
  const strokeW = 12;
  const radius = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (matchScore / 100) * circumference;

  return (
    <section className="mb-6 animate-fade-in-up">
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
            <Briefcase className="h-4 w-4" />
          </div>
          <h3 className="font-display text-lg font-extrabold text-slate-900">Job Match</h3>
        </div>
        <span className="hidden text-xs font-medium text-slate-400 sm:block">
          Tailored for your {targetRole.toLowerCase()} application
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Top: score + summary */}
        <div className="grid grid-cols-1 gap-6 border-b border-slate-100 p-6 sm:p-8 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e9ecf5" strokeWidth={strokeW} />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 5px ${stroke}55)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-display text-3xl font-extrabold tabular-nums ${text}`}>
                  {matchScore}
                  <span className="text-lg">%</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400">Match Score</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-fuchsia-500">
              Resume vs. Job Description
            </p>
            <h4 className={`mt-1 font-display text-2xl font-extrabold ${text}`}>
              {matchScore}% — {matchLabel}
            </h4>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
              We compared your resume against the job description you pasted.{' '}
              {skillsMatched.length} of {skillsMatched.length + skillsMissing.length} required
              skills are present, and {keywordsMissing.length} high-signal keywords are missing.
            </p>
          </div>
        </div>

        {/* Skills matched + missing */}
        <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2">
          <div className="bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Check className="h-4 w-4" />
              </div>
              <h5 className="font-display text-sm font-bold text-slate-800">
                Skills Matched <span className="text-slate-400">({skillsMatched.length})</span>
              </h5>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsMatched.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                <X className="h-4 w-4" />
              </div>
              <h5 className="font-display text-sm font-bold text-slate-800">
                Skills Missing <span className="text-slate-400">({skillsMissing.length})</span>
              </h5>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsMissing.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Keywords missing */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h5 className="font-display text-sm font-bold text-slate-800">
              Keywords Missing from Resume
            </h5>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywordsMissing.map((k) => (
              <span
                key={k}
                className="rounded-lg border border-dashed border-amber-300 bg-amber-50/60 px-3 py-1.5 text-sm font-medium text-amber-700"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="border-t border-slate-100 p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-fuchsia-500" />
            <h5 className="font-display text-sm font-bold text-slate-800">
              How to improve your resume for this job
            </h5>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const styles = impactStyles(rec.impact);
              return (
                <div
                  key={i}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-fuchsia-200 hover:bg-fuchsia-50/30"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-display text-sm font-extrabold text-white">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h6 className="font-display text-sm font-bold text-slate-900">{rec.title}</h6>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${styles.chip}`}>
                        {styles.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{rec.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

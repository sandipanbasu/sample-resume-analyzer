import {
  ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp,
  Sparkles, FileText, Target, RefreshCw, Download, ThumbsUp, Wand2,
} from 'lucide-react';
import ScoreRing from './ScoreRing';
import CategoryBar from './CategoryBar';
import JobMatchSection from './JobMatchSection';
import ImproveWithAI from './ImproveWithAI';
import type { AnalysisResult } from '@/lib/analysis';

type Props = {
  result: AnalysisResult;
  onReset: () => void;
  onImprove: () => void;
};

function impactStyles(impact: 'high' | 'medium' | 'low') {
  if (impact === 'high') return { chip: 'bg-rose-100 text-rose-600', label: 'High impact' };
  if (impact === 'medium') return { chip: 'bg-amber-100 text-amber-600', label: 'Medium impact' };
  return { chip: 'bg-slate-100 text-slate-500', label: 'Low impact' };
}

export default function ResultsDashboard({ result, onReset, onImprove }: Props) {
  const { overallScore, scoreLabel } = result;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          New Analysis
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Analyze Another
          </button>
        </div>
      </div>

      {/* File context */}
      <div className="animate-fade-in-up mb-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-semibold text-slate-600 shadow-sm">
          <FileText className="h-3.5 w-3.5 text-blue-500" />
          {result.fileName}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-semibold text-slate-600 shadow-sm">
          <Target className="h-3.5 w-3.5 text-indigo-500" />
          {result.targetRole}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-600">
          <Sparkles className="h-3.5 w-3.5" />
          Analysis complete
        </span>
      </div>

      {/* Hero score */}
      <div className="animate-score-reveal mb-6 grid grid-cols-1 gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center">
          <ScoreRing score={overallScore} size={220} stroke={16} />
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-display text-sm font-bold uppercase tracking-wider text-blue-500">
            Overall Resume Score
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
            {overallScore}/100 — {scoreLabel}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
            We analyzed your resume across six dimensions that matter most to recruiters
            hiring for {result.targetRole.toLowerCase()}s. Here's the full breakdown.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {result.breakdown.slice(0, 3).map((c) => (
              <span
                key={c.key}
                className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                {c.label} · {c.score}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <section className="mb-6">
        <SectionHeader icon={<TrendingUp className="h-4 w-4" />} title="Score Breakdown" />
        <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.breakdown.map((c, i) => (
            <CategoryBar
              key={c.key}
              label={c.label}
              score={c.score}
              description={c.description}
              delay={i * 60}
            />
          ))}
        </div>
      </section>

      {/* Strengths + Improvements */}
      <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ThumbsUp className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-extrabold text-slate-900">
              What You're Doing Well
            </h3>
          </div>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-in-up rounded-3xl border border-amber-200 bg-amber-50/40 p-6" style={{ animationDelay: '0.1s' }}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-extrabold text-slate-900">
              What You Should Improve
            </h3>
          </div>
          <ul className="space-y-3">
            {result.improvements.map((s, i) => (
              <li key={i} className="rounded-2xl bg-white/60 p-3">
                <div className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200/70 text-xs font-bold text-amber-700">
                    {i + 1}
                  </span>
                  <span className="flex-1">{s.text}</span>
                </div>
                <div className="pl-8">
                  <ImproveWithAI example={s.example} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Missing skills */}
      <section className="mb-6 animate-fade-in-up">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-extrabold text-slate-900">
                Missing Skills
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Suggested for {result.targetRole}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.map((skill) => (
              <span
                key={skill}
                className="cursor-default rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Job Match */}
      {result.jobMatch && (
        <JobMatchSection jobMatch={result.jobMatch} targetRole={result.targetRole} />
      )}

      {/* Top 3 recommendations */}
      <section className="mb-6 animate-fade-in-up">
        <SectionHeader
          icon={<Lightbulb className="h-4 w-4" />}
          title="Top 3 Recommendations"
          subtitle="The changes that would have the biggest impact on your score"
        />
        <div className="space-y-4">
          {result.topRecommendations.map((rec, i) => {
            const styles = impactStyles(rec.impact);
            return (
              <div
                key={i}
                className="flex gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 font-display text-lg font-extrabold text-white shadow-md shadow-blue-500/30">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-base font-extrabold text-slate-900">
                      {rec.title}
                    </h4>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${styles.chip}`}>
                      {styles.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{rec.detail}</p>
                  {rec.example && <ImproveWithAI example={rec.example} />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Improve with AI CTA */}
      <div className="animate-fade-in-up overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-purple-600 p-8 text-center shadow-lg shadow-fuchsia-500/25">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <Wand2 className="h-7 w-7 text-white" />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-white">
          Improve Resume with AI
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fuchsia-100">
          Turn the recommendations into a stronger, more polished resume.
          {result.jobMatch
            ? ' Your resume will be tailored to match the job description.'
            : ' Your resume will be refined for clarity, impact, and ATS readability.'}
        </p>
        <button
          onClick={onImprove}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 font-display text-base font-bold text-violet-600 shadow-md transition hover:bg-fuchsia-50"
        >
          <Sparkles className="h-5 w-5" />
          Improve Resume with AI
        </button>
        <button
          onClick={onReset}
          className="mt-3 block w-full text-xs font-semibold text-fuchsia-200 hover:text-white"
        >
          Or analyze a different resume
        </button>
      </div>
    </div>
  );
}

function SectionHeader({
  icon, title, subtitle,
}: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
          {icon}
        </div>
        <h3 className="font-display text-lg font-extrabold text-slate-900">{title}</h3>
      </div>
      {subtitle && <p className="hidden text-xs font-medium text-slate-400 sm:block">{subtitle}</p>}
    </div>
  );
}

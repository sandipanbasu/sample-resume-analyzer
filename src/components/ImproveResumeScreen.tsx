import { useState, useEffect } from 'react';
import {
  ArrowLeft, Sparkles, Check, Pencil, FileText,
  TrendingUp, AlertCircle, Wand2, RefreshCw, CheckCircle2, FileDown,
} from 'lucide-react';
import ResumePreview from './ResumePreview';
import EditableResume from './EditableResume';
import { refineResume, type RefinementResult, type ResumeData } from '@/lib/resume';
import { generateResumePDF } from '@/lib/pdf';
import { generateResumeDoc } from '@/lib/word';
import type { AnalysisResult, JobMatchResult } from '@/lib/analysis';

type Props = {
  result: AnalysisResult;
  onBack: () => void;
  onReset: () => void;
};

type Phase = 'loading' | 'result' | 'edit';
type Tab = 'original' | 'refined';

export default function ImproveResumeScreen({ result, onBack, onReset }: Props) {
  const mode: 'general' | 'jd' = result.jobMatch ? 'jd' : 'general';
  const [phase, setPhase] = useState<Phase>('loading');
  const [refinement, setRefinement] = useState<RefinementResult | null>(null);
  const [tab, setTab] = useState<Tab>('refined');
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const originalResume: ResumeData = result.resume;
  const sourceResume = result.resume;

  // Simulate the AI refinement call once on mount.
  useEffect(() => {
    if (phase !== 'loading' || refinement) return;
    const timer = setTimeout(() => {
      const jobMatch: JobMatchResult | undefined = result.jobMatch ?? undefined;
      const refined = refineResume(sourceResume, mode, jobMatch);
      setRefinement(refined);
      setPhase('result');
    }, 2200);
    return () => clearTimeout(timer);
  }, [phase, refinement, mode, result.jobMatch, result.resumeName, sourceResume]);

  const handleSaveEdit = (edited: ResumeData) => {
    if (refinement) {
      setRefinement({ ...refinement, resume: edited });
    }
    setApplied(false);
    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApply = () => {
    setApplied(true);
    setJustApplied(true);
    setTab('refined');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setJustApplied(false), 4000);
  };

  const handleDownload = (format: 'pdf' | 'word') => {
    setPdfError(null);
    try {
      if (!refinement) return;
      if (format === 'pdf') {
        generateResumePDF(refinement.resume);
      } else {
        generateResumeDoc(refinement.resume);
      }
    } catch {
      setPdfError('Could not generate the file. Please try again.');
    }
  };

  // --- Loading state ---
  if (phase === 'loading') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
            <Wand2 className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -inset-3 animate-ping rounded-3xl bg-fuchsia-400/20" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900">
          AI is refining your resume...
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {mode === 'jd'
            ? 'Tailoring your resume to match the job description — improving wording, aligning keywords, and strengthening your bullet points.'
            : 'Improving clarity, grammar, and professional tone — strengthening your summary, experience, and project descriptions.'}
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
          <LoadingStep label="Analyzing current resume structure" delay={0} />
          <LoadingStep label={mode === 'jd' ? 'Aligning with job description' : 'Improving wording and tone'} delay={0.5} />
          <LoadingStep label="Strengthening bullet points" delay={1.0} />
          <LoadingStep label="Optimizing for ATS" delay={1.5} />
        </div>
      </div>
    );
  }

  if (!refinement) return null;

  // --- Edit mode ---
  if (phase === 'edit') {
    return (
      <div className="pt-6">
        <div className="mx-auto mb-4 max-w-3xl px-4">
          <button
            onClick={() => setPhase('result')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to preview
          </button>
        </div>
        <EditableResume
          resume={refinement.resume}
          onSave={handleSaveEdit}
          onCancel={() => setPhase('result')}
        />
      </div>
    );
  }

  // --- Result view ---
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Analysis
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setPhase('edit')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" /> Edit Resume
          </button>
        </div>
      </div>

      {justApplied && (
        <div className="mb-5 flex animate-fade-in-up items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
          <div>
            <p className="text-sm font-bold text-emerald-700">Changes applied to your resume</p>
            <p className="text-xs text-emerald-600">Your refined resume is ready to download as PDF or Word.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-semibold text-slate-600 shadow-sm">
          <FileText className="h-3.5 w-3.5 text-blue-500" /> {result.fileName}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-3 py-1.5 font-semibold text-fuchsia-600">
          <Sparkles className="h-3.5 w-3.5" /> {mode === 'jd' ? 'JD-Tailored Refinement' : 'General Refinement'}
        </span>
      </div>

      {pdfError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
          <AlertCircle className="h-4 w-4" /> {pdfError}
        </div>
      )}

      {/* What AI Improved */}
      <div className="mb-6 animate-fade-in-up rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-extrabold text-slate-900">What AI Improved</h3>
            <p className="text-xs text-slate-500">A summary of every change made to your resume</p>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {refinement.changesMade.map((change, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-500" />
              <span>{change}</span>
            </li>
          ))}
        </ul>

        {/* JD Alignment */}
        {refinement.jdAlignment.length > 0 && (
          <div className="mt-5 border-t border-violet-200/60 pt-4">
            <h4 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-slate-800">
              <TrendingUp className="h-4 w-4 text-fuchsia-500" /> JD Alignment Improvements
            </h4>
            <div className="space-y-2">
              {refinement.jdAlignment.map((item, i) => (
                <div key={i} className="rounded-xl bg-white/70 p-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 line-through">
                      {item.before}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="rounded-md bg-fuchsia-100 px-2 py-1 text-xs font-bold text-fuchsia-700">
                      {item.after}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings — missing skills NOT fabricated */}
        {refinement.warnings.length > 0 && (
          <div className="mt-5 border-t border-amber-200/60 pt-4">
            <h4 className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-slate-800">
              <AlertCircle className="h-4 w-4 text-amber-500" /> Skills to Consider Adding
            </h4>
            <ul className="space-y-2">
              {refinement.warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl bg-amber-50/60 p-3 text-sm text-amber-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-medium text-slate-400">
              These were not added to your resume because your current resume doesn't demonstrate them.
            </p>
          </div>
        )}
      </div>

      {/* Before / After tabs */}
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setTab('original')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === 'original' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setTab('refined')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === 'refined' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" /> AI-Refined
          </button>
        </div>
      </div>

      {/* Resume preview */}
      <div className="rounded-3xl border border-slate-200 bg-slate-100/50 p-4 sm:p-6">
        <div className="animate-fade-in">
          <ResumePreview resume={tab === 'original' ? originalResume : refinement.resume} />
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <StepDot active={!applied} done={applied} label="1" />
          <span className={`text-xs font-bold ${applied ? 'text-slate-400' : 'text-slate-700'}`}>Review & Apply</span>
          <div className={`mx-2 h-px flex-1 ${applied ? 'bg-emerald-300' : 'bg-slate-200'}`} />
          <StepDot active={applied} done={false} label="2" />
          <span className={`text-xs font-bold ${applied ? 'text-slate-700' : 'text-slate-400'}`}>Export</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          {!applied ? (
            <>
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100">
                  <Sparkles className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Apply AI Changes to Resume</p>
                  <p className="text-xs text-slate-500">Accept the refined version to unlock export.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPhase('edit')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" /> Edit First
                </button>
                <button
                  onClick={handleApply}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-fuchsia-500/25 transition hover:from-violet-700 hover:to-fuchsia-700"
                >
                  <CheckCircle2 className="h-4 w-4" /> Apply AI Changes
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Changes Applied - Ready to Export</p>
                  <p className="text-xs text-slate-500">Download your refined resume as PDF or Word.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setApplied(false);
                    setPhase('edit');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" /> Edit Again
                </button>
                <button
                  onClick={() => handleDownload('pdf')}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:from-emerald-600 hover:to-teal-700"
                >
                  <FileDown className="h-5 w-5" /> Export as PDF
                </button>
                <button
                  onClick={() => handleDownload('word')}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-200 bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                >
                  <FileText className="h-5 w-5" /> Export as Word
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Start over */}
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-600"
        >
          <RefreshCw className="h-4 w-4" /> Analyze a new resume
        </button>
      </div>
    </div>
  );
}

function LoadingStep({ label, delay }: { label: string; delay: number }) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-slate-500 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200 border-t-violet-500" />
      {label}
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition ${
        done
          ? 'bg-emerald-500 text-white'
          : active
            ? 'bg-violet-600 text-white shadow-sm'
            : 'bg-slate-200 text-slate-400'
      }`}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : label}
    </span>
  );
}

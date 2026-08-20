import { useState } from 'react';
import { Wand2, Copy, Check, ArrowRight, X } from 'lucide-react';
import type { BulletExample } from '@/lib/analysis';

type Props = {
  example: BulletExample;
};

export default function ImproveWithAI({ example }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImprove = () => {
    if (shown) {
      setOpen((v) => !v);
      return;
    }
    setLoading(true);
    setOpen(true);
    // Simulate the AI generating an improved bullet.
    setTimeout(() => {
      setLoading(false);
      setShown(true);
    }, 1100);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example.improved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleImprove}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Improving…
          </>
        ) : (
          <>
            <Wand2 className="h-3.5 w-3.5" />
            {shown ? (open ? 'Hide' : 'Show') : 'Improve with AI'}
          </>
        )}
      </button>

      {open && (
        <div className="mt-3 animate-fade-in-up overflow-hidden rounded-xl border border-slate-200">
          {/* Original */}
          <div className="border-b border-slate-100 bg-slate-50/70 p-4">
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Original
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 line-through decoration-slate-300">
              {example.original}
            </p>
          </div>

          {/* Improved */}
          <div className="bg-gradient-to-br from-violet-50/60 to-fuchsia-50/40 p-4">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  <Wand2 className="h-3 w-3" />
                  AI Improved
                </span>
              </div>
              {shown && (
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition ${
                    copied
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-violet-200/50" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-violet-200/40" />
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-fuchsia-400" />
                <p className="text-sm font-medium leading-relaxed text-slate-800">
                  {example.improved}
                </p>
              </div>
            )}
          </div>

          {shown && (
            <button
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-1 bg-slate-50 py-2 text-[11px] font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
              Collapse
            </button>
          )}
        </div>
      )}
    </div>
  );
}

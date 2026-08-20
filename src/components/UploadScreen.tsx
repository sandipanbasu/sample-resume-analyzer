import { useCallback, useRef, useState } from 'react';
import { FileText, Upload, Sparkles, Target, Check, Briefcase } from 'lucide-react';
import { TARGET_ROLES, SAMPLE_JOB_DESCRIPTION } from '@/lib/analysis';

type Props = {
  onAnalyze: (file: File | null, targetRole: string, jobDescription: string | null) => void;
  isAnalyzing: boolean;
};

export default function UploadScreen({ onAnalyze, isAnalyzing }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState<string>('Software Engineer Intern');
  const [customRole, setCustomRole] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showJob, setShowJob] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (files && files[0]) setFile(files[0]);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const role = useCustom ? customRole.trim() || 'Not specified' : targetRole;
  const job = jobDescription.trim().length > 0 ? jobDescription.trim() : null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-20 pt-10">
      {/* Hero */}
      <div className="animate-fade-in-up text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Resume Analysis
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Make your resume
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            internship-ready.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
          Upload your resume and get an instant, detailed breakdown of what's working,
          what's missing, and the three changes that will land you more interviews.
        </p>
      </div>

      {/* Upload card */}
      <div className="animate-fade-in-up mt-10 w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" style={{ animationDelay: '0.1s' }}>
        {/* Dropzone */}
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragging
              ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
              : file
              ? 'border-emerald-300 bg-emerald-50/50'
              : 'border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {file ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Check className="h-7 w-7" />
              </div>
              <p className="mt-3 font-display text-sm font-bold text-slate-800">{file.name}</p>
              <p className="mt-1 text-xs text-slate-400">
                {(file.size / 1024).toFixed(0)} KB · Click to replace
              </p>
            </>
          ) : (
            <>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm transition ${dragging ? 'scale-110' : 'group-hover:scale-105'}`}>
                <Upload className="h-7 w-7" />
              </div>
              <p className="mt-3 font-display text-sm font-bold text-slate-700">
                Drag & drop your resume here
              </p>
              <p className="mt-1 text-xs text-slate-400">PDF up to 10MB · or click to browse</p>
            </>
          )}
        </label>

        {/* Target role */}
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-400" />
            <label className="font-display text-sm font-bold text-slate-700">
              Target Role <span className="font-normal text-slate-400">(optional)</span>
            </label>
          </div>
          {!useCustom ? (
            <div className="flex flex-wrap gap-2">
              {TARGET_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setTargetRole(r)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    targetRole === r
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
              <button
                onClick={() => setUseCustom(true)}
                className="rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                + Custom
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. Machine Learning Intern"
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={() => setUseCustom(false)}
                className="rounded-xl bg-slate-100 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                Use presets
              </button>
            </div>
          )}
        </div>

        {/* Job description (optional) */}
        <div className="mt-6">
          <button
            onClick={() => setShowJob((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-left transition hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-fuchsia-500" />
              <span className="font-display text-sm font-bold text-slate-700">
                Job Match <span className="font-normal text-slate-400">— paste a job description</span>
              </span>
            </div>
            <span className={`text-xs font-semibold transition ${showJob ? 'text-fuchsia-500' : 'text-slate-400'}`}>
              {showJob ? 'Hide' : 'Open'}
            </span>
          </button>
          {showJob && (
            <div className="mt-3 animate-fade-in">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here to see how well your resume matches…"
                rows={6}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  We'll compare your resume against this and show a match score with skill gaps.
                </p>
                <button
                  onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
                  className="text-xs font-semibold text-fuchsia-500 hover:text-fuchsia-600"
                >
                  Use sample
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analyze button */}
        <button
          onClick={() => onAnalyze(file, role, job)}
          disabled={isAnalyzing}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-display text-base font-bold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isAnalyzing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Analyzing your resume…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Analyze My Resume
            </>
          )}
        </button>

        {!file && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            No resume? We'll analyze a realistic sample so you can see how it works.
          </p>
        )}
      </div>

      {/* Trust strip */}
      <div className="animate-fade-in mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400" style={{ animationDelay: '0.2s' }}>
        <span>Private & secure</span>
        <span className="text-slate-300">•</span>
        <span>Results in seconds</span>
        <span className="text-slate-300">•</span>
        <span>Built for students & new grads</span>
      </div>
    </div>
  );
}

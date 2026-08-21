import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import UploadScreen from '@/components/UploadScreen';
import ResultsDashboard from '@/components/ResultsDashboard';
import ImproveResumeScreen from '@/components/ImproveResumeScreen';
import { analyzeResume, type AnalysisResult } from '@/lib/analysis';
import { SAMPLE_RESUME, type ResumeData } from '@/lib/resume';
import { parseResumePdf, ResumeParseError } from '@/lib/parseResumePdf';
import ExtractedResumeScreen from '@/components/ExtractedResumeScreen';

type View = 'landing' | 'parsing' | 'extracted' | 'analyzing' | 'results' | 'improve' | 'error';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedFile, setParsedFile] = useState<{ fileName: string; resume: ResumeData; pageCount: number; targetRole: string; jobDescription: string | null } | null>(null);

  const handleAnalyze = async (file: File | null, targetRole: string, jobDescription: string | null) => {
    setError(null);
    const fileName = file?.name ?? 'Jane_Doe_Resume.pdf';
    try {
      setView(file ? 'parsing' : 'analyzing');
      const parsed = file ? await parseResumePdf(file) : null;
      const resume: ResumeData = parsed?.resume ?? SAMPLE_RESUME;
      if (parsed && file) {
        setParsedFile({ fileName: file.name, resume: parsed.resume, pageCount: parsed.pageCount, targetRole, jobDescription });
        setView('extracted');
        return;
      }
      setView('analyzing');
      await new Promise((resolve) => setTimeout(resolve, 700));
      setResult(analyzeResume(fileName, targetRole, jobDescription, resume));
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (cause) {
      setError(cause instanceof ResumeParseError ? cause.message : 'We could not process this PDF. Please try another file.');
      setView('error');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setParsedFile(null);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImprove = () => {
    setView('improve');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToResults = () => {
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl animate-float-glow" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl animate-float-glow" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-200/20 blur-3xl animate-float-glow" style={{ animationDelay: '8s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <button onClick={handleReset} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/30">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
              Resume<span className="text-blue-600">AI</span>
            </span>
          </button>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            Beta
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10">
         {view === 'error' ? (
           <UploadScreen onAnalyze={handleAnalyze} isAnalyzing={false} error={error} />
         ) : view === 'extracted' && parsedFile ? (
           <ExtractedResumeScreen
             fileName={parsedFile.fileName}
             resume={parsedFile.resume}
             pageCount={parsedFile.pageCount}
             onReset={handleReset}
             onContinue={() => {
               setView('analyzing');
               setTimeout(() => {
                 setResult(analyzeResume(parsedFile.fileName, parsedFile.targetRole, parsedFile.jobDescription, parsedFile.resume));
                 setView('results');
               }, 700);
             }}
           />
         ) : view === 'improve' && result ? (
          <ImproveResumeScreen result={result} onBack={handleBackToResults} onReset={handleReset} />
        ) : view === 'results' && result ? (
          <ResultsDashboard result={result} onReset={handleReset} onImprove={handleImprove} />
        ) : (
           <UploadScreen onAnalyze={handleAnalyze} isAnalyzing={view === 'analyzing' || view === 'parsing'} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/70 bg-white/50 py-6 text-center text-xs text-slate-400">
        <p>ResumeAI — Built for students & fresh graduates. Analysis is simulated for this demo.</p>
      </footer>
    </div>
  );
}

import { ArrowRight, CheckCircle2, FileText, RefreshCw } from 'lucide-react';
import type { ResumeData } from '@/lib/resume';

type Props = {
  fileName: string;
  resume: ResumeData;
  pageCount: number;
  onContinue: () => void;
  onReset: () => void;
};

export default function ExtractedResumeScreen({ fileName, resume, pageCount, onContinue, onReset }: Props) {
  const sections = [
    { label: 'Summary', value: resume.summary },
    { label: 'Skills', value: resume.skills.join(', ') },
    { label: 'Experience', value: resume.experience.map((entry) => `${entry.role}${entry.organization ? ` at ${entry.organization}` : ''}`).join(' | ') },
    { label: 'Projects', value: resume.projects.map((project) => project.name).join(', ') },
    { label: 'Education', value: resume.education.map((entry) => `${entry.degree}${entry.institution ? ` - ${entry.institution}` : ''}`).join(' | ') },
    { label: 'Certifications', value: resume.certifications.join(', ') },
    { label: 'Achievements', value: resume.achievements.join(', ') },
  ].filter((section) => section.value);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> PDF extracted successfully
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Review what we extracted</h1>
          <p className="mt-2 text-sm text-slate-500">Check the parsed information before running the analysis.</p>
        </div>
        <button onClick={onReset} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Upload another
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-semibold text-slate-600 shadow-sm">
          <FileText className="h-3.5 w-3.5 text-blue-500" /> {fileName}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-500">{pageCount} page{pageCount === 1 ? '' : 's'}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard label="Name" value={resume.contact.name} />
        <InfoCard label="Contact" value={[resume.contact.email, resume.contact.phone].filter(Boolean).join(' | ') || 'Not detected'} />
        {sections.map((section) => <InfoCard key={section.label} label={section.label} value={section.value} />)}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={onContinue} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700">
          Continue to Analysis <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{value || 'Not detected'}</p>
    </div>
  );
}

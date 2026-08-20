import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import type { ResumeData, ResumeExperience, ResumeProject, ResumeEducation } from '@/lib/resume';

type Props = {
  resume: ResumeData;
  onSave: (resume: ResumeData) => void;
  onCancel: () => void;
};

function uid(prefix: string) {
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
}

export default function EditableResume({ resume, onSave, onCancel }: Props) {
  const [data, setData] = useState<ResumeData>(() => JSON.parse(JSON.stringify(resume)));

  const update = (patch: Partial<ResumeData>) => setData((d) => ({ ...d, ...patch }));

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl font-extrabold text-slate-900">Edit Refined Resume</h3>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button
            onClick={() => onSave(data)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contact */}
        <Card title="Name & Contact">
          <Field label="Full Name" value={data.contact.name} onChange={(v) => update({ contact: { ...data.contact, name: v } })} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Email" value={data.contact.email} onChange={(v) => update({ contact: { ...data.contact, email: v } })} />
            <Field label="Phone" value={data.contact.phone} onChange={(v) => update({ contact: { ...data.contact, phone: v } })} />
            <Field label="LinkedIn" value={data.contact.linkedin} onChange={(v) => update({ contact: { ...data.contact, linkedin: v } })} />
            <Field label="GitHub" value={data.contact.github} onChange={(v) => update({ contact: { ...data.contact, github: v } })} />
          </div>
        </Card>

        {/* Summary */}
        <Card title="Professional Summary">
          <textarea
            value={data.summary}
            onChange={(e) => update({ summary: e.target.value })}
            rows={4}
            className="w-full resize-y rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </Card>

        {/* Education */}
        <Card title="Education">
          <div className="space-y-4">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Entry {idx + 1}</span>
                  <button onClick={() => update({ education: data.education.filter((e) => e.id !== edu.id) })} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(data, setData, edu.id, { degree: v })} />
                  <Field label="Institution" value={edu.institution} onChange={(v) => updateEducation(data, setData, edu.id, { institution: v })} />
                  <Field label="Year" value={edu.year} onChange={(v) => updateEducation(data, setData, edu.id, { year: v })} />
                </div>
                <Field label="Details" value={edu.details || ''} onChange={(v) => updateEducation(data, setData, edu.id, { details: v })} textarea />
              </div>
            ))}
          </div>
          <AddButton label="Add Education" onClick={() => update({ education: [...data.education, { id: uid('edu'), degree: '', institution: '', year: '' }] })} />
        </Card>

        {/* Skills */}
        <Card title="Skills">
          <textarea
            value={data.skills.join(', ')}
            onChange={(e) => update({ skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            rows={3}
            className="w-full resize-y rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1.5 text-xs text-slate-400">Separate skills with commas.</p>
        </Card>

        {/* Experience */}
        <Card title="Experience">
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{exp.role || 'Untitled Role'}</span>
                  <button onClick={() => update({ experience: data.experience.filter((e) => e.id !== exp.id) })} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="Role" value={exp.role} onChange={(v) => updateExp(data, setData, exp.id, { role: v })} />
                  <Field label="Organization" value={exp.organization} onChange={(v) => updateExp(data, setData, exp.id, { organization: v })} />
                  <Field label="Duration" value={exp.duration} onChange={(v) => updateExp(data, setData, exp.id, { duration: v })} />
                </div>
                <label className="mt-3 block text-xs font-semibold text-slate-500">Bullet Points</label>
                <textarea
                  value={exp.bullets.join('\n')}
                  onChange={(e) => updateExp(data, setData, exp.id, { bullets: e.target.value.split('\n').filter((l) => l.trim()) })}
                  rows={4}
                  className="mt-1 w-full resize-y rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-slate-400">One bullet per line.</p>
              </div>
            ))}
          </div>
          <AddButton
            label="Add Experience"
            onClick={() => update({ experience: [...data.experience, { id: uid('exp'), role: '', organization: '', duration: '', bullets: [] }] })}
          />
        </Card>

        {/* Projects */}
        <Card title="Projects">
          <div className="space-y-4">
            {data.projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{p.name || 'Untitled Project'}</span>
                  <button onClick={() => update({ projects: data.projects.filter((x) => x.id !== p.id) })} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Project Name" value={p.name} onChange={(v) => updateProj(data, setData, p.id, { name: v })} />
                  <Field label="Technologies" value={p.tech} onChange={(v) => updateProj(data, setData, p.id, { tech: v })} />
                  <Field label="Link (optional)" value={p.link || ''} onChange={(v) => updateProj(data, setData, p.id, { link: v })} />
                </div>
                <label className="mt-3 block text-xs font-semibold text-slate-500">Bullet Points</label>
                <textarea
                  value={p.bullets.join('\n')}
                  onChange={(e) => updateProj(data, setData, p.id, { bullets: e.target.value.split('\n').filter((l) => l.trim()) })}
                  rows={3}
                  className="mt-1 w-full resize-y rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
          </div>
          <AddButton
            label="Add Project"
            onClick={() => update({ projects: [...data.projects, { id: uid('proj'), name: '', tech: '', bullets: [] }] })}
          />
        </Card>

        {/* Certifications */}
        <Card title="Certifications">
          <ListEditor items={data.certifications} onChange={(items) => update({ certifications: items })} />
        </Card>

        {/* Achievements */}
        <Card title="Achievements">
          <ListEditor items={data.achievements} onChange={(items) => update({ achievements: items })} />
        </Card>

        <div className="sticky bottom-4 flex justify-end gap-2 rounded-2xl bg-white/90 p-3 shadow-lg backdrop-blur">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(data)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// --- helpers ---

function updateEducation(data: ResumeData, setData: React.Dispatch<React.SetStateAction<ResumeData>>, id: string, patch: Partial<ResumeEducation>) {
  setData((d) => ({ ...d, education: d.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
}
function updateExp(data: ResumeData, setData: React.Dispatch<React.SetStateAction<ResumeData>>, id: string, patch: Partial<ResumeExperience>) {
  setData((d) => ({ ...d, experience: d.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
}
function updateProj(data: ResumeData, setData: React.Dispatch<React.SetStateAction<ResumeData>>, id: string, patch: Partial<ResumeProject>) {
  setData((d) => ({ ...d, projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h4>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, textarea,
}: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full resize-y rounded-xl border border-slate-300 px-3.5 py-2 text-sm leading-relaxed text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      )}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-blue-400 hover:text-blue-500"
    >
      <Plus className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function ListEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-400 hover:text-rose-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <AddButton label="Add Entry" onClick={() => onChange([...items, ''])} />
    </div>
  );
}

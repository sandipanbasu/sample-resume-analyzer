import type { ResumeData } from '@/lib/resume';

type Props = {
  resume: ResumeData;
  className?: string;
};

// Renders a resume visually — looks like an actual professional document.
export default function ResumePreview({ resume, className = '' }: Props) {
  const { contact, summary, skills, experience, projects, education, certifications, achievements } = resume;

  return (
    <div className={`mx-auto max-w-[800px] rounded-lg bg-white px-10 py-8 text-slate-800 shadow-sm ${className}`}>
      {/* Name + contact */}
      <header className="border-b-2 border-slate-800 pb-3">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          {contact.name}
        </h1>
        <p className="mt-1.5 text-xs text-slate-600">
          {[
            contact.email,
            contact.phone,
            contact.linkedin,
            contact.github,
          ].filter(Boolean).join('  |  ')}
        </p>
      </header>

      {summary && (
        <section className="mt-4">
          <h2 className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Professional Summary
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{summary}</p>
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-4">
          <h2 className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Education
          </h2>
          <div className="mt-1.5 space-y-2">
            {education.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-bold text-slate-800">{e.degree}</p>
                  <p className="text-xs text-slate-500">{e.year}</p>
                </div>
                <p className="text-sm text-slate-600">{e.institution}</p>
                {e.details && <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{e.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-4">
          <h2 className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Skills
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
            {skills.join('  ·  ')}
          </p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mt-4">
          <h2 className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Experience
          </h2>
          <div className="mt-1.5 space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-bold text-slate-800">{exp.role}</p>
                  <p className="text-xs text-slate-500">{exp.duration}</p>
                </div>
                <p className="text-sm text-slate-600">{exp.organization}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-slate-700">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-4">
          <h2 className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Projects
          </h2>
          <div className="mt-1.5 space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-bold text-slate-800">{p.name}</p>
                  {p.link && <p className="text-xs text-blue-600">{p.link}</p>}
                </div>
                <p className="text-xs text-slate-500">{p.tech}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-relaxed text-slate-700">
                  {p.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mt-4">
          <h2 className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Certifications
          </h2>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-slate-700">
            {certifications.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="mt-4">
          <h2 className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Achievements
          </h2>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-slate-700">
            {achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

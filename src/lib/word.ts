import type { ResumeData } from '@/lib/resume';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Generates a Word-compatible .doc file from resume data using an
// HTML wrapper that Microsoft Word can open. No external library needed.
export function generateResumeDoc(resume: ResumeData): void {
  const c = resume.contact;
  const contactParts = [c.email, c.phone, c.linkedin, c.github].filter(Boolean);

  const sectionHeader = (title: string) =>
    `<h2 style="font-size:11pt;text-transform:uppercase;letter-spacing:1pt;border-bottom:1pt solid #999;padding-bottom:2pt;margin-top:14pt;">${escapeHtml(title)}</h2>`;

  const bullets = (items: string[]) =>
    `<ul style="margin:4pt 0 4pt 18pt;padding:0;">${items
      .map((b) => `<li style="margin-bottom:2pt;font-size:10pt;color:#333;">${escapeHtml(b)}</li>`)
      .join('')}</ul>`;

  const parts: string[] = [];

  parts.push(
    `<h1 style="font-size:20pt;font-weight:bold;margin:0 0 2pt 0;color:#111;">${escapeHtml(c.name)}</h1>`
  );
  if (contactParts.length) {
    parts.push(
      `<p style="font-size:9pt;color:#666;margin:0 0 2pt 0;">${contactParts
        .map(escapeHtml)
        .join(' &nbsp;|&nbsp; ')}</p>`
    );
  }
  parts.push('<hr style="border:1pt solid #111;margin:6pt 0 2pt 0;" />');

  if (resume.summary) {
    parts.push(sectionHeader('Professional Summary'));
    parts.push(`<p style="font-size:10pt;color:#333;line-height:1.4;">${escapeHtml(resume.summary)}</p>`);
  }

  if (resume.education.length > 0) {
    parts.push(sectionHeader('Education'));
    for (const edu of resume.education) {
      parts.push(
        `<p style="font-size:10pt;font-weight:bold;margin:4pt 0 0 0;color:#222;">${escapeHtml(edu.degree)}</p>`
      );
      const meta = [edu.institution, edu.year].filter(Boolean).join(' — ');
      if (meta) {
        parts.push(`<p style="font-size:9pt;color:#666;margin:1pt 0;">${escapeHtml(meta)}</p>`);
      }
      if (edu.details) {
        parts.push(`<p style="font-size:9pt;color:#777;margin:1pt 0;">${escapeHtml(edu.details)}</p>`);
      }
    }
  }

  if (resume.skills.length > 0) {
    parts.push(sectionHeader('Skills'));
    parts.push(
      `<p style="font-size:10pt;color:#333;">${resume.skills.map(escapeHtml).join(' &middot; ')}</p>`
    );
  }

  if (resume.experience.length > 0) {
    parts.push(sectionHeader('Experience'));
    for (const exp of resume.experience) {
      parts.push(
        `<p style="font-size:10pt;font-weight:bold;margin:6pt 0 0 0;color:#222;">${escapeHtml(exp.role)}</p>`
      );
      const meta = [exp.organization, exp.duration].filter(Boolean).join(' — ');
      if (meta) {
        parts.push(`<p style="font-size:9pt;color:#666;margin:1pt 0;">${escapeHtml(meta)}</p>`);
      }
      parts.push(bullets(exp.bullets));
    }
  }

  if (resume.projects.length > 0) {
    parts.push(sectionHeader('Projects'));
    for (const p of resume.projects) {
      parts.push(
        `<p style="font-size:10pt;font-weight:bold;margin:6pt 0 0 0;color:#222;">${escapeHtml(p.name)}</p>`
      );
      const metaParts = [p.tech, p.link].filter(Boolean);
      if (metaParts.length) {
        parts.push(`<p style="font-size:9pt;color:#666;margin:1pt 0;">${metaParts.filter(Boolean).map((s) => escapeHtml(s as string)).join(' &middot; ')}</p>`);
      }
      parts.push(bullets(p.bullets));
    }
  }

  if (resume.certifications.length > 0) {
    parts.push(sectionHeader('Certifications'));
    parts.push(bullets(resume.certifications));
  }

  if (resume.achievements.length > 0) {
    parts.push(sectionHeader('Achievements'));
    parts.push(bullets(resume.achievements));
  }

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(c.name)} — Resume</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page { size: A4; margin: 1in; }
body { font-family: Calibri, Arial, sans-serif; color: #222; line-height: 1.35; }
</style>
</head>
<body>
${parts.join('\n')}
</body>
</html>`;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const safeName = resume.contact.name.replace(/[^a-zA-Z0-9]+/g, '_');
  const link = document.createElement('a');
  link.href = url;
  link.download = `AI_Refined_Resume_${safeName}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

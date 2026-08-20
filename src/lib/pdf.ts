import jsPDF from 'jspdf';
import type { ResumeData } from '@/lib/resume';

// Generates an ATS-friendly, A4 PDF resume using text layout.
// No colors, no graphics, no branding — just clean typography.
export function generateResumePDF(resume: ResumeData): void {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const lineHeight = 14;
  const sectionGap = 16;
  const bulletIndent = 16;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  const writeText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [30, 30, 30]) => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines = pdf.splitTextToSize(text, maxWidth) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight);
      pdf.text(line, margin, y);
      y += lineHeight;
    }
  };

  const writeBullets = (bullets: string[]) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(40, 40, 40);
    for (const bullet of bullets) {
      const lines = pdf.splitTextToSize(bullet, maxWidth - bulletIndent) as string[];
      for (let i = 0; i < lines.length; i++) {
        ensureSpace(lineHeight);
        const prefix = i === 0 ? '•  ' : '   ';
        pdf.text(prefix + lines[i], margin + 4, y);
        y += lineHeight;
      }
    }
  };

  const sectionHeader = (title: string) => {
    y += 6;
    ensureSpace(lineHeight + 8);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(20, 20, 20);
    pdf.text(title.toUpperCase(), margin, y);
    y += lineHeight;
    // Underline
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y - 4, pageWidth - margin, y - 4);
    y += 4;
  };

  // --- Name ---
  writeText(resume.contact.name, 20, 'bold', [10, 10, 10]);
  y -= 4;

  // --- Contact line ---
  const contactParts = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.linkedin,
    resume.contact.github,
  ].filter(Boolean);
  writeText(contactParts.join('  |  '), 9, 'normal', [80, 80, 80]);

  // Divider under header
  pdf.setDrawColor(10, 10, 10);
  pdf.setLineWidth(1.2);
  pdf.line(margin, y - 2, pageWidth - margin, y - 2);
  y += sectionGap - 4;

  // --- Summary ---
  if (resume.summary) {
    sectionHeader('Professional Summary');
    writeText(resume.summary, 10, 'normal', [50, 50, 50]);
  }

  // --- Education ---
  if (resume.education.length > 0) {
    sectionHeader('Education');
    for (const edu of resume.education) {
      if (edu.degree) writeText(edu.degree, 10, 'bold');
      const meta = [edu.institution, edu.year].filter(Boolean).join(' — ');
      if (meta) writeText(meta, 9, 'normal', [80, 80, 80]);
      if (edu.details) writeText(edu.details, 9, 'normal', [90, 90, 90]);
      y += 4;
    }
  }

  // --- Skills ---
  if (resume.skills.length > 0) {
    sectionHeader('Skills');
    writeText(resume.skills.join('  ·  '), 10, 'normal', [50, 50, 50]);
  }

  // --- Experience ---
  if (resume.experience.length > 0) {
    sectionHeader('Experience');
    for (const exp of resume.experience) {
      if (exp.role) writeText(exp.role, 10, 'bold');
      const meta = [exp.organization, exp.duration].filter(Boolean).join(' — ');
      if (meta) writeText(meta, 9, 'normal', [80, 80, 80]);
      y += 2;
      writeBullets(exp.bullets);
      y += 4;
    }
  }

  // --- Projects ---
  if (resume.projects.length > 0) {
    sectionHeader('Projects');
    for (const p of resume.projects) {
      if (p.name) writeText(p.name, 10, 'bold');
      const metaParts = [p.tech, p.link].filter(Boolean);
      if (metaParts.length) writeText(metaParts.join('  ·  '), 9, 'normal', [80, 80, 80]);
      y += 2;
      writeBullets(p.bullets);
      y += 4;
    }
  }

  // --- Certifications ---
  if (resume.certifications.length > 0) {
    sectionHeader('Certifications');
    writeBullets(resume.certifications);
  }

  // --- Achievements ---
  if (resume.achievements.length > 0) {
    sectionHeader('Achievements');
    writeBullets(resume.achievements);
  }

  // Save with a meaningful filename.
  const safeName = resume.contact.name.replace(/[^a-zA-Z0-9]+/g, '_');
  pdf.save(`AI_Refined_Resume_${safeName}.pdf`);
}

import jsPDF from 'jspdf';
import type { JobMatchResult, Recommendation } from '@/lib/analysis';

export type JobMatchReportInput = {
  jobMatch: JobMatchResult;
  targetRole: string;
  resumeName: string;
  generatedAt?: Date;
};

export type ReportRecommendation = {
  title: string;
  detail: string;
  impact: Recommendation['impact'];
  impactLabel: string;
};

export type JobMatchReport = {
  title: string;
  resumeName: string;
  targetRole: string;
  generatedOn: string;
  matchScore: number;
  matchLabel: string;
  summary: string;
  skillsMatched: string[];
  skillsMissing: string[];
  keywordsMissing: string[];
  recommendations: ReportRecommendation[];
};

const IMPACT_ORDER: Record<Recommendation['impact'], number> = { high: 0, medium: 1, low: 2 };
const IMPACT_LABEL: Record<Recommendation['impact'], string> = {
  high: 'High impact',
  medium: 'Medium impact',
  low: 'Low impact',
};

// Pure: turns a job-match result into the content shown in the report.
export function buildJobMatchReport(input: JobMatchReportInput): JobMatchReport {
  const { jobMatch, targetRole, resumeName } = input;
  const generatedAt = input.generatedAt ?? new Date();
  const required = jobMatch.skillsMatched.length + jobMatch.skillsMissing.length;

  const recommendations = jobMatch.recommendations
    .map((rec, index) => ({ rec, index }))
    // Stable sort by impact, keeping the original order within each tier.
    .sort((a, b) => IMPACT_ORDER[a.rec.impact] - IMPACT_ORDER[b.rec.impact] || a.index - b.index)
    .map(({ rec }) => ({
      title: rec.title,
      detail: rec.detail,
      impact: rec.impact,
      impactLabel: IMPACT_LABEL[rec.impact],
    }));

  return {
    title: 'Job Match Report',
    resumeName,
    targetRole,
    generatedOn: generatedAt.toISOString().slice(0, 10),
    matchScore: Math.round(jobMatch.matchScore),
    matchLabel: jobMatch.matchLabel,
    summary: `${jobMatch.skillsMatched.length} of ${required} required skills present; ${jobMatch.keywordsMissing.length} high-signal keywords missing.`,
    skillsMatched: [...jobMatch.skillsMatched],
    skillsMissing: [...jobMatch.skillsMissing],
    keywordsMissing: [...jobMatch.keywordsMissing],
    recommendations,
  };
}

export function jobMatchReportFileName(resumeName: string): string {
  const safe = resumeName.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return `Job_Match_Report_${safe || 'Resume'}.pdf`;
}

// Lays the report out on A4 pages, in the same text-first style as pdf.ts.
export function renderJobMatchReportPDF(report: JobMatchReport): jsPDF {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 14;
  const indent = 16;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  const writeText = (
    text: string,
    fontSize: number,
    style: 'normal' | 'bold' = 'normal',
    color: [number, number, number] = [30, 30, 30],
    x = margin,
  ) => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines = pdf.splitTextToSize(text, maxWidth - (x - margin)) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight);
      pdf.text(line, x, y);
      y += lineHeight;
    }
  };

  const sectionHeader = (title: string) => {
    y += 8;
    ensureSpace(lineHeight + 8);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(20, 20, 20);
    pdf.text(title.toUpperCase(), margin, y);
    y += lineHeight;
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y - 4, pageWidth - margin, y - 4);
    y += 4;
  };

  const writeList = (items: string[]) => {
    writeText(items.length ? items.join('  ·  ') : 'None', 10, 'normal', [50, 50, 50]);
  };

  // --- Header ---
  writeText(report.title, 20, 'bold', [10, 10, 10]);
  writeText(
    `Resume: ${report.resumeName}  |  Target role: ${report.targetRole}  |  Generated: ${report.generatedOn}`,
    9,
    'normal',
    [80, 80, 80],
  );
  pdf.setDrawColor(10, 10, 10);
  pdf.setLineWidth(1.2);
  pdf.line(margin, y - 2, pageWidth - margin, y - 2);
  y += 8;

  // --- Score ---
  sectionHeader('Match Score');
  writeText(`${report.matchScore}% - ${report.matchLabel}`, 16, 'bold', [10, 10, 10]);
  writeText(report.summary, 10, 'normal', [50, 50, 50]);

  sectionHeader('Skills Missing');
  writeList(report.skillsMissing);

  sectionHeader('Keywords Missing');
  writeList(report.keywordsMissing);

  sectionHeader('Skills Matched');
  writeList(report.skillsMatched);

  // --- Recommendations ---
  sectionHeader('Recommendations');
  if (report.recommendations.length === 0) {
    writeText('None', 10, 'normal', [50, 50, 50]);
  }
  report.recommendations.forEach((rec, i) => {
    writeText(`${i + 1}. ${rec.title}  [${rec.impactLabel}]`, 10, 'bold');
    writeText(rec.detail, 9, 'normal', [70, 70, 70], margin + indent);
    y += 4;
  });

  return pdf;
}

export function downloadJobMatchReportPDF(input: JobMatchReportInput): void {
  const report = buildJobMatchReport(input);
  saveJobMatchReportPDF(renderJobMatchReportPDF(report), report.resumeName);
}

export function saveJobMatchReportPDF(pdf: jsPDF, resumeName: string): void {
  pdf.save(jobMatchReportFileName(resumeName));
}

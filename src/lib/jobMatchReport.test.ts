import jsPDF from 'jspdf';
import { describe, expect, it, vi } from 'vitest';
import {
  buildJobMatchReport,
  jobMatchReportFileName,
  renderJobMatchReportPDF,
  saveJobMatchReportPDF,
  type JobMatchReportInput,
} from '@/lib/jobMatchReport';

const input: JobMatchReportInput = {
  resumeName: 'Jordan Lee.docx',
  targetRole: 'Frontend Engineer',
  generatedAt: new Date('2026-11-21T12:00:00Z'),
  jobMatch: {
    matchScore: 78.4,
    matchLabel: 'Good Match',
    skillsMatched: ['React', 'TypeScript'],
    skillsMissing: ['Accessibility'],
    keywordsMissing: ['WCAG', 'Design systems'],
    recommendations: [
      { title: 'Polish formatting', detail: 'Use consistent spacing.', impact: 'low' },
      { title: 'Show accessibility work', detail: 'Describe an accessibility audit.', impact: 'high' },
      { title: 'Add relevant keywords', detail: 'Mention WCAG where applicable.', impact: 'medium' },
      { title: 'Quantify impact', detail: 'Include a measurable result.', impact: 'high' },
    ],
  },
};

describe('buildJobMatchReport', () => {
  it('includes report metadata, the rounded score, and skill and keyword counts', () => {
    expect(buildJobMatchReport(input)).toMatchObject({
      title: 'Job Match Report',
      resumeName: 'Jordan Lee.docx',
      targetRole: 'Frontend Engineer',
      generatedOn: '2026-11-21',
      matchScore: 78,
      matchLabel: 'Good Match',
      summary: '2 of 3 required skills present; 2 high-signal keywords missing.',
      skillsMatched: ['React', 'TypeScript'],
      skillsMissing: ['Accessibility'],
      keywordsMissing: ['WCAG', 'Design systems'],
    });
  });

  it('labels recommendations and sorts by impact without changing input order', () => {
    const [low, high, medium, secondHigh] = input.jobMatch.recommendations;

    expect(buildJobMatchReport(input).recommendations).toEqual([
      { ...high, impactLabel: 'High impact' },
      { ...secondHigh, impactLabel: 'High impact' },
      { ...medium, impactLabel: 'Medium impact' },
      { ...low, impactLabel: 'Low impact' },
    ]);
    expect(input.jobMatch.recommendations).toEqual([low, high, medium, secondHigh]);
  });
});

describe('jobMatchReportFileName', () => {
  it('strips the resume extension and sanitizes the base name', () => {
    expect(jobMatchReportFileName('  Jordan / Lee (2026).DOCX')).toBe('Job_Match_Report_Jordan_Lee_2026.pdf');
  });

  it('falls back to Resume if the sanitized base name is empty', () => {
    expect(jobMatchReportFileName('!!!.pdf')).toBe('Job_Match_Report_Resume.pdf');
  });
});

describe('downloadJobMatchReportPDF', () => {
  it('saves the PDF with the sanitized resume filename', () => {
    const pdf = new jsPDF();
    const save = vi.spyOn(pdf, 'save').mockImplementation(function (this: jsPDF) {
      return this;
    });

    saveJobMatchReportPDF(pdf, input.resumeName);

    expect(save).toHaveBeenCalledWith('Job_Match_Report_Jordan_Lee.pdf');
  });
});

describe('renderJobMatchReportPDF', () => {
  it('produces a PDF page with the match score and missing skill', () => {
    const pdf = renderJobMatchReportPDF(buildJobMatchReport(input));
    const output = pdf.output();

    expect(pdf.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    expect(output).toContain('(78% - Good Match) Tj');
    expect(output).toContain('(Accessibility) Tj');
  });

  it('shows None in each empty list section', () => {
    const report = buildJobMatchReport({
      ...input,
      jobMatch: {
        ...input.jobMatch,
        skillsMatched: [],
        skillsMissing: [],
        keywordsMissing: [],
        recommendations: [],
      },
    });

    expect(report.summary).toBe('0 of 0 required skills present; 0 high-signal keywords missing.');
    const output = renderJobMatchReportPDF(report).output();
    const sections = output.split(/\((?:SKILLS MISSING|KEYWORDS MISSING|SKILLS MATCHED|RECOMMENDATIONS)\) Tj/).slice(1);
    expect(sections).toHaveLength(4);
    for (const section of sections) {
      expect(section).toContain('(None) Tj');
    }
  });

  it('adds pages when report content exceeds the page height', () => {
    const report = buildJobMatchReport({
      ...input,
      jobMatch: {
        ...input.jobMatch,
        recommendations: Array.from({ length: 90 }, (_, index) => ({
          title: `Recommendation ${index + 1}`,
          detail: 'Add a specific, measurable example that shows the relevant experience clearly.',
          impact: 'medium' as const,
        })),
      },
    });

    expect(renderJobMatchReportPDF(report).getNumberOfPages()).toBeGreaterThan(1);
  });
});

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, TextItem } from 'pdfjs-dist/types/src/display/api';
import type { ResumeData } from '@/lib/resume';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export const MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024;

export type ResumeParseErrorCode = 'invalid-file' | 'file-too-large' | 'invalid-pdf' | 'no-text' | 'unrecognized-resume';

export class ResumeParseError extends Error {
  constructor(public readonly code: ResumeParseErrorCode, message: string) {
    super(message);
    this.name = 'ResumeParseError';
  }
}

export type ParseResumeResult = {
  text: string;
  resume: ResumeData;
  pageCount: number;
};

export async function parseResumePdf(file: File): Promise<ParseResumeResult> {
  validateFile(file);

  let document: PDFDocumentProxy | undefined;
  let loadingTask: PDFDocumentLoadingTask | undefined;
  try {
    loadingTask = getDocument({ data: await file.arrayBuffer() });
    document = await loadingTask.promise;
  } catch {
    throw new ResumeParseError('invalid-pdf', 'This PDF could not be opened. It may be corrupt or encrypted.');
  }

  try {
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(textFromItems(content.items));
    }

    const text = normalizeText(pages.join('\n'));
    if (!text) {
      throw new ResumeParseError('no-text', 'This PDF has no extractable text. Scanned PDFs are not supported yet.');
    }

    const resume = mapResumeText(text, file.name);
    if (!resume.contact.name && !resume.summary && resume.skills.length === 0 && resume.experience.length === 0 && resume.projects.length === 0 && resume.education.length === 0) {
      throw new ResumeParseError('unrecognized-resume', 'We extracted text, but could not identify usable resume content.');
    }

    return { text, resume, pageCount: document.numPages };
  } finally {
    await loadingTask?.destroy();
  }
}

function validateFile(file: File): void {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) throw new ResumeParseError('invalid-file', 'Please upload a PDF file.');
  if (file.size > MAX_RESUME_FILE_SIZE) throw new ResumeParseError('file-too-large', 'Your PDF must be 10 MB or smaller.');
}

function normalizeText(text: string): string {
  return text.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function textFromItems(items: unknown[]): string {
  const textItems = items.filter((item): item is TextItem => 'str' in (item as object));
  const lines: { y: number; x: number; text: string }[][] = [];

  for (const item of textItems) {
    const x = item.transform[4];
    const y = item.transform[5];
    const line = lines.find((candidate) => Math.abs(candidate[0].y - y) < 2);
    if (line) line.push({ y, x, text: item.str });
    else lines.push([{ y, x, text: item.str }]);
  }

  return lines
    .sort((a, b) => b[0].y - a[0].y)
    .map((line) => line.sort((a, b) => a.x - b.x).map((item) => item.text).join(' ').trim())
    .filter(Boolean)
    .join('\n');
}

const SECTION_ALIASES: Record<string, string> = {
  summary: 'summary', objective: 'summary', profile: 'summary',
  skills: 'skills', 'technical skills': 'skills',
  experience: 'experience', 'work experience': 'experience', employment: 'experience',
  projects: 'projects', 'personal projects': 'projects',
  education: 'education', academics: 'education',
  certifications: 'certifications', certificates: 'certifications',
  achievements: 'achievements', awards: 'achievements',
};

function mapResumeText(text: string, fileName: string): ResumeData {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {};
  let section = 'header';
  sections[section] = [];

  for (const line of lines) {
    const key = SECTION_ALIASES[line.toLowerCase().replace(/[:-]/g, '').trim()];
    if (key) {
      section = key;
      sections[section] ??= [];
    } else {
      sections[section].push(line);
    }
  }

  const email = text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] ?? '';
  const phone = text.match(/(?:\+?\d[\d ()-]{7,}\d)/)?.[0]?.trim() ?? '';
  const links = text.match(/(?:linkedin\.com\/[^\s|]+|github\.com\/[^\s|]+)/gi) ?? [];
  const name = lines.find((line) => line !== email && line !== phone && !/^(resume|cv)$/i.test(line) && !line.includes('@') && !/https?:\/\//i.test(line)) ?? nameFromFile(fileName);

  return {
    contact: { name, email, phone, linkedin: links.find((link) => /linkedin/i.test(link)) ?? '', github: links.find((link) => /github/i.test(link)) ?? '' },
    summary: sections.summary?.join(' ') ?? '',
    skills: splitItems(sections.skills ?? []),
    experience: mapEntries(sections.experience ?? []).map(([title, bullets], index) => ({ id: `exp${index + 1}`, role: title, organization: '', duration: '', bullets })),
    projects: mapEntries(sections.projects ?? []).map(([title, bullets], index) => ({ id: `proj${index + 1}`, name: title, tech: '', bullets })),
    education: mapEntries(sections.education ?? []).map(([title, bullets], index) => ({ id: `edu${index + 1}`, degree: title, institution: bullets[0] ?? '', year: bullets[1] ?? '', details: bullets.slice(2).join(' ') })),
    certifications: splitItems(sections.certifications ?? []),
    achievements: splitItems(sections.achievements ?? []),
  };
}

function splitItems(lines: string[]): string[] {
  return lines.flatMap((line) => line.split(/\s*[•·|,]\s*/)).map((item) => item.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
}

function mapEntries(lines: string[]): [string, string[]][] {
  const entries: [string, string[]][] = [];
  for (const line of lines) {
    if (/^[-*•]/.test(line)) {
      if (entries.length) entries[entries.length - 1][1].push(line.replace(/^[-*•]\s*/, ''));
    } else {
      entries.push([line, []]);
    }
  }
  return entries;
}

function nameFromFile(fileName: string): string {
  return fileName.replace(/\.pdf$/i, '').split(/[_\-.]+/).filter(Boolean).slice(0, 3).join(' ');
}

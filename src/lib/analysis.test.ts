import { describe, expect, it } from 'vitest';
import { analyzeJobMatch, analyzeResume } from './analysis';
import { SAMPLE_RESUME, type ResumeData } from './resume';

function resumeWith(overrides: Partial<ResumeData>): ResumeData {
  return {
    ...SAMPLE_RESUME,
    contact: { ...SAMPLE_RESUME.contact, name: 'Alex Morgan' },
    skills: ['Rust'],
    experience: [],
    projects: [],
    education: [],
    ...overrides,
  };
}

describe('analysis with parsed resume data', () => {
  it('uses the parsed candidate name and resume data', () => {
    const resume = resumeWith({
      skills: ['Rust', 'PostgreSQL'],
      projects: [{ id: 'project-1', name: 'Telemetry Dashboard', tech: 'Rust', bullets: ['Built a dashboard'] }],
    });
    const result = analyzeResume('uploaded.pdf', 'Software Engineer Intern', null, resume);

    expect(result.resumeName).toBe('Alex Morgan');
    expect(result.resume).toBe(resume);
    expect(result.strengths).toContain('2 technical skills detected in the resume');
    expect(result.strengths).toContain('1 project identified');
    expect(result.missingSkills).toContain('Quantified achievements');
  });

  it('matches job requirements against parsed skills instead of the sample skill set', () => {
    const result = analyzeJobMatch('We need Rust and PostgreSQL experience.', 'Backend Intern', ['Rust']);

    expect(result.skillsMatched).toContain('Rust');
    expect(result.skillsMatched).not.toContain('JavaScript');
    expect(result.skillsMissing).toContain('PostgreSQL');
  });
});

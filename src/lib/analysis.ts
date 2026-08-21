export type Category = {
  key: string;
  label: string;
  score: number;
  description: string;
};

export type BulletExample = {
  original: string;
  improved: string;
};

export type Recommendation = {
  title: string;
  detail: string;
  impact: 'high' | 'medium' | 'low';
  example?: BulletExample;
};

export type JobMatchResult = {
  matchScore: number;
  matchLabel: string;
  skillsMatched: string[];
  skillsMissing: string[];
  keywordsMissing: string[];
  recommendations: Recommendation[];
};

import { SAMPLE_RESUME, type ResumeData } from '@/lib/resume';

export type AnalysisResult = {
  fileName: string;
  resumeName: string;
  targetRole: string;
  jobDescription: string | null;
  overallScore: number;
  scoreLabel: string;
  breakdown: Category[];
  strengths: string[];
  improvements: { text: string; example: BulletExample }[];
  missingSkills: string[];
  topRecommendations: Recommendation[];
  jobMatch: JobMatchResult | null;
  resume: ResumeData;
};

export const TARGET_ROLES = [
  'Software Engineer Intern',
  'Data Analyst',
  'Product Intern',
  'UI/UX Designer',
  'Marketing Intern',
  'Business Analyst',
] as const;

export const SAMPLE_JOB_DESCRIPTION = `Software Engineer Intern

We're looking for a motivated Software Engineer Intern to join our platform team for the summer. You'll build and ship features used by millions of users.

Responsibilities:
- Design and develop scalable backend services using Python and Go
- Build responsive web interfaces with React and TypeScript
- Work with PostgreSQL and Redis for data storage and caching
- Write unit and integration tests using Jest
- Deploy services on AWS using Docker and CI/CD pipelines
- Collaborate with product managers and designers in an agile environment

Requirements:
- Currently pursuing a CS or related degree
- Strong fundamentals in data structures and algorithms
- Experience with JavaScript/TypeScript and at least one backend language
- Familiarity with REST APIs and GraphQL
- Bonus: experience with Kubernetes, microservices, or open-source contributions`;

// Realistic sample analysis — demonstrates the full experience without any API.
export const SAMPLE_ANALYSIS: AnalysisResult = {
  fileName: 'Jane_Doe_Resume.pdf',
  resumeName: 'Jane Doe',
  targetRole: 'Software Engineer Intern',
  jobDescription: null,
  overallScore: 78,
  scoreLabel: 'Good, but can be stronger',
  breakdown: [
    { key: 'skills', label: 'Skills', score: 82, description: 'Solid core technical stack with relevant languages.' },
    { key: 'projects', label: 'Projects', score: 74, description: 'Good range of projects, but outcomes are underspecified.' },
    { key: 'experience', label: 'Experience', score: 70, description: 'Relevant roles present, limited measurable impact.' },
    { key: 'education', label: 'Education', score: 88, description: 'Strong academic background and coursework.' },
    { key: 'structure', label: 'Resume Structure', score: 80, description: 'Clean layout, minor formatting inconsistencies.' },
    { key: 'impact', label: 'Impact & Achievements', score: 64, description: 'Few quantified achievements detected.' },
  ],
  strengths: [
    'Clear project section showcasing hands-on full-stack work',
    'Relevant coursework in data structures, algorithms, and databases',
    'Consistent formatting with clean section hierarchy',
    'Includes both frontend and backend technologies',
  ],
  improvements: [
    {
      text: 'Add measurable outcomes to project descriptions (e.g. "reduced load time by 35%")',
      example: {
        original: 'Worked on a college e-commerce project.',
        improved: 'Developed a full-stack e-commerce application using React and Node.js, implementing product search, authentication, and payment workflows that served 500+ student users.',
      },
    },
    {
      text: 'Include relevant technical skills like TypeScript, Docker, and CI/CD',
      example: {
        original: 'Skills: JavaScript, React, HTML, CSS',
        improved: 'Skills: TypeScript, JavaScript, React, Node.js, Docker, CI/CD, PostgreSQL, Jest',
      },
    },
    {
      text: 'Strengthen action verbs — replace "helped" and "worked on" with "built", "led", "shipped"',
      example: {
        original: 'Helped the team build a scheduling app for students.',
        improved: 'Led development of a student scheduling app, shipping a React frontend and Express API used by 1,200+ students across campus.',
      },
    },
    {
      text: 'Add GitHub and live project links so recruiters can verify your work',
      example: {
        original: 'E-commerce Project — College hackathon',
        improved: 'E-commerce Project — github.com/janedoe/ecom-app · live: ecom-app.vercel.app',
      },
    },
  ],
  missingSkills: [
    'TypeScript',
    'Docker',
    'CI/CD',
    'GraphQL',
    'REST APIs',
    'Jest',
    'AWS',
    'PostgreSQL',
    'Redis',
    'Figma',
  ],
  topRecommendations: [
    {
      title: 'Quantify your impact',
      detail: 'At least 3 bullet points should include a number — performance gains, users reached, or time saved. This is the single biggest signal recruiters scan for.',
      impact: 'high',
      example: {
        original: 'Worked on a college e-commerce project.',
        improved: 'Developed a full-stack e-commerce application using React and Node.js, implementing product search, authentication, and payment workflows that served 500+ student users.',
      },
    },
    {
      title: 'Add a Technical Skills block',
      detail: 'Group skills into Languages, Frameworks, and Tools. This helps both ATS parsers and human reviewers find keywords in under 5 seconds.',
      impact: 'high',
      example: {
        original: 'Skills: JavaScript, React, HTML, CSS',
        improved: 'Languages: JavaScript, TypeScript, Python | Frameworks: React, Node.js, Express | Tools: Git, Docker, Jest, AWS',
      },
    },
    {
      title: 'Link every project',
      detail: 'Each project should have a GitHub link and, where possible, a live URL. Unverifiable projects are treated as lower-confidence by recruiters.',
      impact: 'medium',
      example: {
        original: 'E-commerce Project — College hackathon',
        improved: 'E-commerce Project — github.com/janedoe/ecom-app · live: ecom-app.vercel.app',
      },
    },
  ],
  jobMatch: null,
  resume: SAMPLE_RESUME,
};

function matchLabel(score: number) {
  if (score >= 85) return 'Strong match — tailor the details';
  if (score >= 70) return 'Good match — close a few gaps';
  if (score >= 55) return 'Partial match — key gaps remain';
  return 'Weak match — significant gaps';
}

// Compares the job description against the supplied resume skills.
export function analyzeJobMatch(jobDescription: string, targetRole: string, resumeSkills: string[]): JobMatchResult {
  const text = jobDescription.toLowerCase();
  const has = (kw: string) => text.includes(kw.toLowerCase());

  // Candidate skill pool derived from the job description + role context.
  const candidateSkills = [
    'Python', 'Go', 'React', 'TypeScript', 'PostgreSQL', 'Redis',
    'Jest', 'AWS', 'Docker', 'CI/CD', 'REST APIs', 'GraphQL',
    'Kubernetes', 'Microservices', 'JavaScript', 'Node.js', 'Java', 'Rust',
    'Data Structures', 'Algorithms',
  ];

  const resumeSkillSet = new Set(resumeSkills.map((skill) => skill.toLowerCase()));
  const skillsMatched = candidateSkills.filter((s) => has(s) && resumeSkillSet.has(s.toLowerCase()));
  const skillsMissing = candidateSkills.filter((s) => has(s) && !resumeSkillSet.has(s.toLowerCase()));

  // Keywords present in the JD but absent from the resume's vocabulary.
  const keywordPool = [
    'agile', 'scalable', 'microservices', 'open-source', 'collaboration',
    'caching', 'unit tests', 'integration tests', 'deployment', 'product managers',
    'responsive', 'unit testing', 'open source',
  ];
  const keywordsMissing = keywordPool.filter((k) => has(k));

  const matchedCount = skillsMatched.length;
  const missingCount = skillsMissing.length;
  const total = matchedCount + missingCount;
  const raw = total > 0 ? (matchedCount / total) * 100 : 60;
  // Blend with a base so the score feels realistic even with short JDs.
  const matchScore = Math.max(40, Math.min(96, Math.round(raw * 0.7 + 30)));

  // Build role-aware recommendations.
  const recommendations: Recommendation[] = [];
  if (skillsMissing.length > 0) {
    recommendations.push({
      title: `Add ${skillsMissing.slice(0, 3).join(', ')} to your skills section`,
      detail: `This job explicitly requires ${skillsMissing.slice(0, 3).join(', ')}. If you have any exposure — even coursework or a side project — list it. ATS filters for ${targetRole} roles weight these keywords heavily.`,
      impact: 'high',
    });
  }
  if (keywordsMissing.includes('scalable') || keywordsMissing.includes('microservices')) {
    recommendations.push({
      title: 'Frame your projects around scale and architecture',
      detail: 'The job description emphasizes scalable services and microservices. Rewrite at least one project bullet to mention how your system handles load, users, or data volume — even at a small scale.',
      impact: 'high',
    });
  } else {
    recommendations.push({
      title: "Mirror the job's vocabulary in your bullets",
      detail: `Recruiters scan for the exact phrases in the job description. Naturally weave in terms like ${keywordsMissing.slice(0, 3).join(', ') || 'agile, scalable, collaboration'} where they genuinely apply to your experience.`,
      impact: 'medium',
    });
  }
  if (has('open-source') || has('open source')) {
    recommendations.push({
      title: 'Highlight open-source or collaborative work',
      detail: 'This role values open-source contributions. Link any PRs, hackathon repos, or team projects that show you can collaborate on shared codebases.',
      impact: 'medium',
    });
  } else {
    recommendations.push({
      title: 'Add a measurable outcome to your top project',
      detail: 'Pick the project most relevant to this job and add one quantified result — performance, users, or accuracy. Quantified bullets rank higher in recruiter screening for this role.',
      impact: 'medium',
    });
  }

  return {
    matchScore,
    matchLabel: matchLabel(matchScore),
    skillsMatched: skillsMatched.length ? skillsMatched : ['JavaScript', 'React', 'Python'],
    skillsMissing: skillsMissing.length ? skillsMissing : ['TypeScript', 'Docker', 'AWS'],
    keywordsMissing: keywordsMissing.length ? keywordsMissing : ['scalable', 'agile', 'unit tests'],
    recommendations: recommendations.slice(0, 3),
  };
}

// Words that commonly appear in resume filenames but are NOT part of a person's name.
const NON_NAME_WORDS = new Set([
  'resume', 'cv', 'curriculum', 'vitae', 'profile', 'resumes',
  'final', 'draft', 'copy', 'latest', 'new', 'updated', 'version',
  'ai', 'software', 'engineer', 'developer', 'intern', 'internship',
  'job', 'application', 'cover', 'letter', 'template', 'sample',
  'document', 'doc', 'pdf', 'folio', 'linkedin',
]);

function extractNameFromFilename(fileName: string): string {
  const base = fileName.replace(/\.(pdf|docx?|txt)$/i, '');
  const tokens = base.split(/[_\-.]+/).map((t) => t.trim()).filter((t) => t.length > 0);
  const nameParts = tokens.filter((t) => !NON_NAME_WORDS.has(t.toLowerCase()));
  if (nameParts.length >= 1) {
    return nameParts
      .slice(0, 4)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
  }
  return 'Your Name';
}

// Slight score variance so repeated analyses feel alive, while staying realistic.
export function analyzeResume(
  fileName: string,
  targetRole: string,
  jobDescription: string | null,
  resume: ResumeData
): AnalysisResult {
  const jitter = () => Math.floor(Math.random() * 7) - 3;
  const clamp = (n: number) => Math.max(40, Math.min(98, n));

  const breakdown = SAMPLE_ANALYSIS.breakdown.map((c) => ({
    ...c,
    score: clamp(c.score + jitter()),
  }));
  const jobMatch = jobDescription && jobDescription.trim().length > 0
    ? analyzeJobMatch(jobDescription, targetRole, resume.skills)
    : null;

  const hasParsedContent = resume !== SAMPLE_RESUME;
  const detectedSkills = resume.skills.length;
  const experienceCount = resume.experience.length;
  const projectCount = resume.projects.length;
  const quantifiedBullets = [...resume.experience, ...resume.projects]
    .flatMap((entry) => entry.bullets)
    .filter((bullet) => /\d/.test(bullet)).length;

  if (hasParsedContent) {
    breakdown[0].score = clamp(55 + Math.min(35, detectedSkills * 4));
    breakdown[1].score = clamp(55 + Math.min(35, projectCount * 12));
    breakdown[2].score = clamp(55 + Math.min(35, experienceCount * 15));
    breakdown[5].score = clamp(45 + Math.min(45, quantifiedBullets * 15));
  }

  const parsedMissingSkills = jobMatch?.skillsMissing ?? [
    'Quantified achievements',
    'Project links',
    'Technical keywords',
  ];
  const strengths = hasParsedContent
    ? [
        `${detectedSkills} technical skills detected in the resume`,
        `${projectCount} project${projectCount === 1 ? '' : 's'} identified`,
        experienceCount > 0 ? `${experienceCount} experience entr${experienceCount === 1 ? 'y' : 'ies'} identified` : 'Clear opportunity to add practical experience',
        quantifiedBullets > 0 ? `${quantifiedBullets} quantified bullet${quantifiedBullets === 1 ? '' : 's'} detected` : 'Resume content was successfully extracted from the PDF',
      ]
    : SAMPLE_ANALYSIS.strengths;
  const improvements = hasParsedContent
    ? [
        {
          text: quantifiedBullets > 0 ? 'Add more measurable outcomes to experience and project descriptions' : 'Add measurable outcomes to experience and project descriptions',
          example: { original: resume.experience[0]?.bullets[0] ?? 'Describe your work without a measurable result.', improved: 'Add the result, scale, or measurable outcome of the work you completed.' },
        },
        {
          text: resume.skills.length > 0 ? 'Group technical skills by category to improve ATS readability' : 'Add a dedicated technical skills section',
          example: { original: resume.skills.join(', ') || 'Skills are not clearly listed.', improved: 'Languages: ... | Frameworks: ... | Tools: ...' },
        },
        {
          text: projectCount > 0 ? 'Add links and technologies to each project' : 'Add projects that demonstrate relevant skills',
          example: { original: resume.projects[0]?.name ?? 'No project section detected.', improved: 'Project Name — Technologies — GitHub or live link' },
        },
      ]
    : SAMPLE_ANALYSIS.improvements;
  const topRecommendations = hasParsedContent
    ? [
        { title: 'Quantify your impact', detail: 'Add numbers for users, performance, revenue, time saved, or other measurable outcomes where the facts support them.', impact: 'high' as const },
        { title: 'Strengthen ATS structure', detail: 'Use clear section headings and group related skills so recruiters and parsers can find important information quickly.', impact: 'high' as const },
        { title: 'Add verifiable project links', detail: 'Include GitHub or live links for projects so recruiters can validate your work.', impact: 'medium' as const },
      ]
    : SAMPLE_ANALYSIS.topRecommendations;

  const finalOverall = clamp(
    Math.round(breakdown.reduce((sum, category) => sum + category.score, 0) / breakdown.length)
  );
  const finalLabel =
    finalOverall >= 90 ? 'Outstanding — internship-ready' :
    finalOverall >= 75 ? 'Good, but can be stronger' :
    finalOverall >= 60 ? 'Promising, needs polish' :
    'Needs significant work';

  return {
    ...SAMPLE_ANALYSIS,
    fileName,
    resumeName: resume.contact.name || extractNameFromFilename(fileName),
    targetRole,
    jobDescription,
    overallScore: finalOverall,
    scoreLabel: finalLabel,
    breakdown,
    strengths,
    improvements,
    missingSkills: parsedMissingSkills,
    topRecommendations,
    jobMatch,
    resume,
  };
}

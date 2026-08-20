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

export type AnalysisResult = {
  fileName: string;
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
};

// The skills the sample resume already claims to have (for job-match simulation).
const RESUME_SKILLS = new Set([
  'JavaScript', 'React', 'Node.js', 'Python', 'HTML', 'CSS',
  'MongoDB', 'Git', 'Firebase', 'Java', 'C++',
]);

function matchLabel(score: number) {
  if (score >= 85) return 'Strong match — tailor the details';
  if (score >= 70) return 'Good match — close a few gaps';
  if (score >= 55) return 'Partial match — key gaps remain';
  return 'Weak match — significant gaps';
}

// Simulated job-match analysis. Compares the job description against the
// (simulated) resume content and returns realistic, varied results.
export function analyzeJobMatch(jobDescription: string, targetRole: string): JobMatchResult {
  const text = jobDescription.toLowerCase();
  const has = (kw: string) => text.includes(kw.toLowerCase());

  // Candidate skill pool derived from the job description + role context.
  const candidateSkills = [
    'Python', 'Go', 'React', 'TypeScript', 'PostgreSQL', 'Redis',
    'Jest', 'AWS', 'Docker', 'CI/CD', 'REST APIs', 'GraphQL',
    'Kubernetes', 'Microservices', 'JavaScript', 'Node.js', 'Java',
    'Data Structures', 'Algorithms',
  ];

  const skillsMatched = candidateSkills.filter((s) => has(s) && RESUME_SKILLS.has(s));
  const skillsMissing = candidateSkills.filter((s) => has(s) && !RESUME_SKILLS.has(s));

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

// Slight score variance so repeated analyses feel alive, while staying realistic.
export function analyzeResume(
  fileName: string,
  targetRole: string,
  jobDescription: string | null
): AnalysisResult {
  const jitter = () => Math.floor(Math.random() * 7) - 3;
  const clamp = (n: number) => Math.max(40, Math.min(98, n));

  const breakdown = SAMPLE_ANALYSIS.breakdown.map((c) => ({
    ...c,
    score: clamp(c.score + jitter()),
  }));
  const overall = clamp(
    Math.round(breakdown.reduce((sum, c) => sum + c.score, 0) / breakdown.length)
  );

  const label =
    overall >= 90 ? 'Outstanding — internship-ready' :
    overall >= 75 ? 'Good, but can be stronger' :
    overall >= 60 ? 'Promising, needs polish' :
    'Needs significant work';

  const jobMatch = jobDescription && jobDescription.trim().length > 0
    ? analyzeJobMatch(jobDescription, targetRole)
    : null;

  return {
    ...SAMPLE_ANALYSIS,
    fileName,
    targetRole,
    jobDescription,
    overallScore: overall,
    scoreLabel: label,
    breakdown,
    jobMatch,
  };
}

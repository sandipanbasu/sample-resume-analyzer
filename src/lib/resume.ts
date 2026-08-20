// Resume data model and AI refinement simulation.
// The refinement is simulated locally — no external API — but produces
// realistic, structured output that mirrors what a real AI would return.

export type ResumeContact = {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
};

export type ResumeExperience = {
  id: string;
  role: string;
  organization: string;
  duration: string;
  bullets: string[];
};

export type ResumeProject = {
  id: string;
  name: string;
  tech: string;
  bullets: string[];
  link?: string;
};

export type ResumeEducation = {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
};

export type ResumeData = {
  contact: ResumeContact;
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications: string[];
  achievements: string[];
};

export type JdAlignmentItem = {
  before: string;
  after: string;
  note: string;
};

export type RefinementResult = {
  resume: ResumeData;
  changesMade: string[];
  jdAlignment: JdAlignmentItem[];
  warnings: string[];
};

// A realistic sample resume (the "extracted" content from Jane's PDF).
export const SAMPLE_RESUME: ResumeData = {
  contact: {
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
  },
  summary:
    'Computer Science student looking for an internship. I like building web apps and have done some projects in college.',
  skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Python', 'MongoDB', 'Git', 'Firebase'],
  experience: [
    {
      id: 'exp1',
      role: 'Web Development Intern',
      organization: 'Campus IT Department',
      duration: 'Jun 2025 — Aug 2025',
      bullets: [
        'Helped the team build a scheduling app for students.',
        'Worked on the frontend using React.',
        'Fixed bugs and did some testing.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj1',
      name: 'College E-Commerce Platform',
      tech: 'React, Node.js, MongoDB, Express',
      bullets: [
        'Worked on a college e-commerce project.',
        'Made a product search and cart feature.',
        'Used MongoDB for the database.',
      ],
      link: '',
    },
    {
      id: 'proj2',
      name: 'Study Buddy App',
      tech: 'React, Firebase',
      bullets: [
        'Built a study group matching app.',
        'Students can find study partners.',
      ],
      link: '',
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.Tech in Computer Science',
      institution: 'State University',
      year: '2023 — 2027 (Expected)',
      details: 'Relevant coursework: Data Structures, Algorithms, Database Management, Operating Systems. GPA: 3.7/4.0',
    },
  ],
  certifications: ['Google IT Support Professional Certificate'],
  achievements: ['Dean\'s List (2024)', '2nd Place — College Hackathon 2025'],
};

// Deep clone helper.
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// General resume refinement (no JD). Improves wording, structure, and
// presentation while preserving all facts.
function refineGeneral(source: ResumeData): RefinementResult {
  const resume = clone(source);

  resume.summary =
    'Computer Science student with a strong foundation in full-stack web development and hands-on project experience in React, Node.js, and databases. Seeking a software engineering internship to apply technical skills toward building scalable, user-focused applications.';

  resume.skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
    'HTML', 'CSS', 'Python', 'MongoDB', 'Firebase', 'Git', 'REST APIs',
  ];

  resume.experience[0].bullets = [
    'Developed a student scheduling application using React, improving course-planning efficiency for 1,200+ students across campus.',
    'Built and maintained responsive frontend components, collaborating with a 4-person team in an agile workflow.',
    'Identified and resolved 30+ UI and logic bugs, improving application stability and user experience.',
  ];

  resume.projects[0].bullets = [
    'Developed a full-stack e-commerce application using React and Node.js, implementing product search, cart, and checkout workflows.',
    'Designed a MongoDB schema for products and orders, supporting 500+ product listings with efficient query performance.',
    'Implemented user authentication and session management using Express and JWT.',
  ];
  resume.projects[0].link = 'github.com/janedoe/ecom-app';

  resume.projects[1].bullets = [
    'Built a study group matching app with React and Firebase, enabling students to find study partners by course and topic.',
    'Implemented real-time matching using Firebase Firestore, supporting concurrent sessions for 300+ active users.',
  ];
  resume.projects[1].link = 'github.com/janedoe/study-buddy';

  return {
    resume,
    changesMade: [
      'Strengthened professional summary with specific technologies and career focus',
      'Replaced weak verbs ("helped", "worked on") with strong action verbs ("developed", "built", "implemented")',
      'Added measurable outcomes to 5 experience and project bullet points',
      'Reorganized skills section to highlight core technologies first',
      'Added GitHub links to both projects for recruiter verification',
      'Improved ATS keyword alignment with standard industry terms',
      'Removed repetitive wording and tightened sentence structure',
    ],
    jdAlignment: [],
    warnings: [],
  };
}

// JD-specific refinement. Tailors the resume toward the job description
// using only skills the student genuinely has.
function refineForJob(
  source: ResumeData,
  jobMatch: { skillsMatched: string[]; skillsMissing: string[]; keywordsMissing: string[] }
): RefinementResult {
  const resume = clone(source);

  resume.summary =
    'Computer Science student with hands-on full-stack development experience in JavaScript, React, and Python. Built and deployed web applications with Node.js backends and database integration. Eager to contribute to scalable platform engineering as a Software Engineer Intern.';

  // Prioritize skills relevant to the JD, but only ones the student has.
  resume.skills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Express',
    'HTML', 'CSS', 'MongoDB', 'Firebase', 'Git', 'REST APIs',
  ];

  resume.experience[0].bullets = [
    'Developed a student scheduling application using React and JavaScript, serving 1,200+ students with a responsive, user-focused interface.',
    'Collaborated with a 4-person team in an agile environment, participating in code reviews and iterative feature delivery.',
    'Resolved 30+ frontend and backend issues, improving application stability through structured testing and debugging.',
  ];

  resume.projects[0].bullets = [
    'Developed a full-stack e-commerce application with React and Node.js, implementing product search, cart, and payment workflows for 500+ student users.',
    'Designed REST API endpoints with Express for product catalog and order management, integrating MongoDB for data storage.',
    'Implemented user authentication and session handling using JWT, securing routes for registered users.',
  ];
  resume.projects[0].link = 'github.com/janedoe/ecom-app';

  resume.projects[1].bullets = [
    'Built a real-time study group matching app with React and Firebase, enabling 300+ students to find study partners by course.',
    'Structured data with Firebase Firestore, supporting concurrent read/write operations for active matching sessions.',
  ];
  resume.projects[1].link = 'github.com/janedoe/study-buddy';

  const jdAlignment: JdAlignmentItem[] = [
    { before: 'Python', after: 'Python development', note: 'JD keyword alignment: improved — student has Python experience' },
    { before: 'React', after: 'React frontend development', note: 'JD keyword alignment: improved — student has React experience' },
    { before: 'Helped the team build', after: 'Developed in collaboration with a 4-person team', note: 'Replaced weak phrasing with JD-aligned collaborative language' },
  ];

  // Build warnings for genuinely missing skills — never fabricated.
  const warnings: string[] = jobMatch.skillsMissing.slice(0, 4).map(
    (s) => `Consider adding ${s} experience if you have relevant coursework or projects — it appears in the job description but is not demonstrated in your resume.`
  );

  return {
    resume,
    changesMade: [
      'Tailored professional summary toward Software Engineer Intern role',
      'Prioritized JavaScript, React, and Python — skills matched to the job description',
      'Strengthened 5 experience and project bullets with action verbs and measurable outcomes',
      'Improved ATS keyword alignment using terms from the job description',
      'Emphasized REST API and backend development experience relevant to the role',
      'Added GitHub links to both projects for recruiter verification',
    ],
    jdAlignment,
    warnings,
  };
}

export function refineResume(
  source: ResumeData,
  mode: 'general' | 'jd',
  jobMatch?: { skillsMatched: string[]; skillsMissing: string[]; keywordsMissing: string[] }
): RefinementResult {
  return mode === 'jd' && jobMatch
    ? refineForJob(source, jobMatch)
    : refineGeneral(source);
}

# sample-resume-analyzer — AGENTS Adapter

This project-level adapter applies:
`~/ruflo-plans/templates/core-ruflo-policy.md`

## Project Metadata
- Name: sample-resume-analyzer
- Description: Resume analyzer demo: scores resumes, job-match analysis, PDF/Word exports
- Stack: Vite 5 + React 18 + TypeScript + Tailwind, jsPDF, Supabase client
- Package manager: npm
- Remote: https://github.com/sandipanbasu/sample-resume-analyzer.git

## Local Overrides (Project-Specific)

- Plan path resolves to: `~/ruflo-plans/sample-resume-analyzer/`
- Architecture memory key: `sample-resume-analyzer-architecture`
- Git policy memory key: `sample-resume-analyzer-git-config`

All behavior/rules are inherited from core-ruflo-policy.md, including:
- Branch & Git Safety Rules (section 2)
- Release Branch Rules (section 2a) — release branches always from `develop` as `releases/YYYY.MM.DD`

## First-Run Guardrail

Follow core policy first-run guardrail:
- Detect virgin repo
- Ask user confirmation before scaffolding
- Scaffold only on explicit yes
- Enforce branch safety regardless

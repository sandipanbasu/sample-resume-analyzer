# sample-resume-analyzer — CLAUDE Adapter

This project-level adapter applies:
`~/ruflo-plans/templates/core-ruflo-policy.md`

## Tool Mapping (Claude Code)

- Hooks may auto-fire memory/routing, but policy is still mandatory
- Enforce protected branch stops
- Enforce repo-specific external plan directory
- Enforce explicit approval gate before implementation

All behavior/rules are inherited from core-ruflo-policy.md, including:
- Branch & Git Safety Rules (section 2)
- Release Branch Rules (section 2a) — release branches always from `develop` as `releases/YYYY.MM.DD`

## First-Run Guardrail

Follow core policy first-run guardrail:
- Detect virgin repo
- Ask user confirmation before scaffolding
- Scaffold only on explicit yes
- Enforce branch safety regardless

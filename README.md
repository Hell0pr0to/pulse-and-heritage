# Pulse & Heritage

Health equity content for veterans and people of color. Clinically grounded, written by an AANP board-certified Family Nurse Practitioner and U.S. combat veteran.

> Because everyone deserves to be seen, heard, and treated appropriately.

## Stack

- **Framework**: [Astro](https://astro.build/) 5
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Hosting**: DigitalOcean App Platform (static site)
- **Domain**: [pulseandheritage.com](https://pulseandheritage.com) (registered at Internet.bs)

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # Production build → dist/
npm run preview  # Preview the production build
```

## Project structure

```
src/
├── components/      # Header, Footer, Hero, Card, CTA, PillarGrid
├── content/         # Articles, conditions, tools, stories (markdown)
├── content.config.ts  # Content collection schemas
├── layouts/         # BaseLayout
├── pages/           # File-based routes
└── styles/          # global.css with design tokens
```

## Content collections

| Collection | Purpose |
|------------|---------|
| `articles` | Long-form pieces — mapped to one of 6 content pillars |
| `conditions` | Clinical reference pages for specific conditions |
| `tools` | Printable checklists, guides, templates, trackers |
| `stories` | First-person community narratives |

## Deployment

```bash
./scripts/deploy.sh
```

Dual-remote pattern:
- **Gitea** (`origin`) → full repo (source of truth)
- **GitHub** (`github`) → deploy-only mirror that triggers DigitalOcean

## Editorial voice

**Clinically precise, universally clear.** See `CLAUDE.md` for the full voice guide.

## Author

**Allison Smith, MSN, FNP-C** — Registered Nurse, Family Nurse Practitioner (AANP board-certified), U.S. Armed Forces veteran (8 years, 2 tours Iraq).

# Pulse & Heritage — Administrator Guide

Everything you need to know to operate, maintain, and extend the Pulse & Heritage website.

**Audience**: site administrator, developer, or content operator. Assumes basic familiarity with git, the command line, and Markdown.

---

## Table of contents

1. [What this site is](#what-this-site-is)
2. [Architecture overview](#architecture-overview)
3. [Local development](#local-development)
4. [Repository structure](#repository-structure)
5. [Content management](#content-management)
6. [Editorial voice](#editorial-voice)
7. [Design system](#design-system)
8. [Image handling](#image-handling)
9. [Deployment](#deployment)
10. [DNS and domains](#dns-and-domains)
11. [Source control: dual-remote pattern](#source-control-dual-remote-pattern)
12. [Monitoring and observability](#monitoring-and-observability)
13. [Common operations](#common-operations)
14. [Troubleshooting](#troubleshooting)
15. [Security](#security)
16. [Future work](#future-work)

---

## What this site is

Pulse & Heritage is a content/advocacy site at **https://pulseandheritage.com** focused on health equity for veterans and people of color (Black diaspora — African American, Caribbean, African, Afro-Latino).

Authored by **Allison Smith, MSN, FNP-C** — board-certified Family Nurse Practitioner with ICU/cardiac/oncology clinical experience and an 8-year U.S. Armed Forces veteran with two tours in Iraq.

The site exists to provide clinical clarity, name systemic failures (misdiagnosis, bias, underdiagnosis), and put practical tools in the hands of patients.

Tagline: *Because everyone deserves to be seen, heard, and treated appropriately.*

### Six content pillars

1. **Conditions & Disparities** — diabetes, kidney, heart, sickle cell, mental health, maternal
2. **Misdiagnosis & Underdiagnosis** — bias in pain assessment, dermatology, eGFR, algorithms
3. **Veteran Health Equity** — VA navigation, disability claims, toxic exposure
4. **Self-Advocacy Tools** — checklists, guides, templates, trackers
5. **Financial Health & Empowerment** — costs, benefits, insurance literacy
6. **Community & Stories** — first-person narratives

---

## Architecture overview

```
                     ┌──────────────────────────┐
                     │    pulseandheritage.com  │
                     │   (Internet.bs registry) │
                     └──────────┬───────────────┘
                                │ A / AAAA / CNAME
                                ▼
                     ┌──────────────────────────┐
                     │   Cloudflare edge        │
                     │   (DO App Platform CDN)  │
                     └──────────┬───────────────┘
                                │
                                ▼
                     ┌──────────────────────────┐
                     │  DigitalOcean App        │
                     │  Platform — static site  │
                     │  Region: NYC             │
                     │  App ID: 7a007de3-...    │
                     └──────────┬───────────────┘
                                │ git clone (public)
                                ▼
       ┌────────────────────────┴───────────────────────┐
       │                                                 │
       ▼                                                 ▼
┌────────────────────┐                      ┌─────────────────────────┐
│  GitHub mirror     │  ◄── deploy.sh ──    │  Gitea (source truth)   │
│  Hell0pr0to/       │                      │  novuselite/            │
│  pulse-and-heritage│                      │  pulse-and-heritage     │
│  (public)          │                      │  (private)              │
└────────────────────┘                      └─────────────────────────┘
                                                       ▲
                                                       │ git push
                                                       │
                                              ┌────────┴────────┐
                                              │  Local dev      │
                                              │  /Users/gabe/   │
                                              │  projects/      │
                                              │  pulse-and-     │
                                              │  heritage/      │
                                              └─────────────────┘
```

### Key facts
- **Hosting**: DigitalOcean App Platform (static site, free tier)
- **Build**: `npm install && npm run build` produces `dist/`, served as static HTML/CSS/JS/images
- **CDN/TLS**: Cloudflare (managed by DO), Let's Encrypt cert auto-renewed
- **Framework**: Astro 5 (SSG mode, no server runtime)
- **Styling**: Tailwind CSS 4 (utility-first + custom design tokens)
- **Source of truth**: Gitea at `git.novuselite.com`
- **Deploy mirror**: GitHub (public, used by DO to clone)

---

## Local development

### Prerequisites
- Node.js ≥ 20 (current dev: v25.2.1)
- npm ≥ 10
- macOS, Linux, or WSL2

### Initial setup

```bash
git clone https://git.novuselite.com/novuselite/pulse-and-heritage.git
cd pulse-and-heritage
npm install
```

### Daily commands

```bash
npm run dev      # Dev server with HMR → http://localhost:4321
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

### TypeScript / type checking
The project uses TypeScript in strict mode. Astro generates types into `.astro/` on build.

```bash
npx astro check  # Run TypeScript + Astro diagnostics
```

---

## Repository structure

```
pulse-and-heritage/
├── .do/
│   └── app.yaml                  # DigitalOcean App Platform spec
├── docs/
│   ├── HANDOFF.md                # Bootstrap session record
│   └── ADMIN.md                  # This file
├── public/                       # Static assets served as-is at /
│   └── favicon.svg
├── scripts/
│   └── deploy.sh                 # Dual-remote push (Gitea + GitHub)
├── src/
│   ├── assets/
│   │   └── images/               # Images optimized by Astro at build
│   ├── components/               # Reusable .astro components
│   ├── content/                  # Markdown content (per collection)
│   │   ├── articles/
│   │   ├── conditions/
│   │   ├── stories/
│   │   └── tools/
│   ├── content.config.ts         # Content collection schemas (Zod)
│   ├── layouts/
│   │   └── BaseLayout.astro      # Page shell with <head>, header, footer
│   ├── pages/                    # File-based routes (each .astro = route)
│   └── styles/
│       └── global.css            # Design tokens + Tailwind import
├── astro.config.mjs              # Astro + Tailwind + sitemap config
├── CLAUDE.md                     # Project notes for Claude Code
├── package.json
├── README.md
└── tsconfig.json                 # Strict + path aliases
```

### Path aliases
Configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@content/*` → `src/content/*`

---

## Content management

All content lives as Markdown files in `src/content/<collection>/`. Astro reads them at build time, validates against the Zod schemas in `src/content.config.ts`, and renders them via templates.

### Collections

#### `articles` — long-form pieces
Path: `src/content/articles/*.md`

```yaml
---
title: "eGFR and kidney disease: what changed and why it matters"
subtitle: "The formula changed. The damage didn't."
pubDate: 2026-04-20
updatedDate: 2026-04-22         # optional
author: "Allison Smith, MSN, FNP-C"  # default; can override
pillar: misdiagnosis            # one of: conditions | misdiagnosis |
                                #   veteran-health | self-advocacy |
                                #   financial-health | community
tags: [kidney, egfr, racial-bias, ckd]
summary: "Until 2021, the formula your doctor used..."
heroImage: "/images/articles/egfr-hero.jpg"  # optional
heroImageAlt: "..."                          # required if heroImage is set
sources:
  - label: "NEJM 2021 — Removing Race From Estimates of Kidney Function"
    url: "https://www.nejm.org/doi/full/10.1056/NEJMms2029562"
  - label: "NKF/ASN Task Force Statement"
    url: "https://www.kidney.org/news/..."
readingTime: 8                  # optional, in minutes
draft: false                    # set true to hide from build
---

# Article body in Markdown

Lead with the systemic problem. Cite the source. End with what to do.
```

#### `conditions` — clinical reference pages
Path: `src/content/conditions/*.md`

```yaml
---
name: "Type 2 Diabetes"
slug: "diabetes"               # optional; defaults to filename
summary: "Twice the prevalence in Black communities..."
affectedPopulations:
  - "Black diaspora"
  - "Veterans (especially post-deployment)"
  - "Indigenous communities"
keyDisparities:
  - "2x prevalence vs white populations"
  - "Later diagnosis on average"
  - "A1C accuracy issues with sickle cell trait"
relatedTools:
  - "doctor-visit-checklist"
  - "know-your-numbers"
relatedArticles:
  - "diabetes-in-the-black-diaspora"
updatedDate: 2026-04-15
draft: false
---

# Body — clinical overview, what to watch for, when to push back
```

#### `tools` — printable checklists, guides, templates
Path: `src/content/tools/*.md`

```yaml
---
title: "Doctor Visit Question Checklist — Type 2 Diabetes"
summary: "Bring this to your next appointment."
type: checklist                # checklist | guide | template | tracker | reference
relatedConditions: ["diabetes"]
printable: true                # adds print stylesheet hooks
pubDate: 2026-04-20
draft: false
---

# Body — the actual tool
```

#### `stories` — first-person community narratives
Path: `src/content/stories/*.md`

```yaml
---
title: "It took eight years to get diagnosed"
contributor: "Marcus J."
contributorRole: "Army veteran, Iraq 2007–2010"
pubDate: 2026-04-20
summary: "Six providers. Eight years. One correct diagnosis."
tags: [misdiagnosis, veteran, mental-health]
triggerWarning: "Discusses suicidal ideation."  # optional
draft: false
---

# Story body
```

### Adding a new article (workflow)

1. Create the file: `src/content/articles/your-slug.md`
2. Fill in frontmatter — Zod will reject invalid keys at build time
3. Write the body in Markdown
4. Set `draft: true` while writing; `false` to publish
5. `npm run build` to verify it renders without errors
6. Commit and deploy (see [Deployment](#deployment))

### Editing existing pages
Pillar landing pages (`src/pages/conditions/index.astro` etc.) and the homepage are hand-written Astro components, NOT generated from collections. Edit them directly. Article/condition/tool/story DETAIL pages will be generated from collections once detail page templates are added (see [Future work](#future-work)).

---

## Editorial voice

**Voice rule: "Clinically precise, universally clear."**

The Stephen Hawking model — accessible is not the same as simplified.

### The author's three identities (every piece must hold all three)
1. **The Clinician** — board-certified NP, ICU/cardiac/oncology
2. **The Veteran** — 8 years, 2 tours Iraq, direct
3. **The Advocate** — person of color who has seen the system fail people who look like her

### Do
- Use the clinical term, then make it real (*"Your A1C — a 3-month average of your blood sugar — was 7.2"*)
- Build bridges with analogies
- Name systemic problems directly — race, bias, service-related inequity
- Speak *to* the reader (*your, our*), not *about* them
- Cite the study, name the guideline, link the source
- Show controlled anger at broken systems
- End every piece with what the reader can *do*

### Don't
- Hide behind jargon
- Strip clinical terms entirely
- Dance around race or bias
- Talk about "those communities" from outside
- Make vague claims about "disparities" without specifics
- Lecture, moralize, hedge
- Be hopeless or fatalistic
- Leave the reader feeling powerless
- Condescend or oversimplify

### Tone guardrails
- **Never preachy** — the reader doesn't need a lecture on why disparities are bad
- **Never hopeless** — every piece points to agency
- **Never academic** — cite the journal, then translate it
- **Never performative** — no virtue signaling, the work is the point
- **Never generic** — if it could appear word-for-word on WebMD, it's not Pulse & Heritage

The full voice guide is also in [`CLAUDE.md`](../CLAUDE.md) — Claude Code reads this when working in the repo.

---

## Design system

All design tokens are in [`src/styles/global.css`](../src/styles/global.css) using Tailwind v4's `@theme` directive.

### Color palettes

| Palette | Use | Example shades |
|---------|-----|----------------|
| **Heritage** | Primary brand color (deep earth tones) | `bg-heritage-800`, `text-heritage-900` |
| **Pulse** | Accent (vitality, urgency) | `bg-pulse-600`, `text-pulse-500` |
| **Service** | Veteran-themed gold | `bg-service-400`, `text-service-300` |
| **Ink** | Warm grays (neutrals — never blue-gray) | `bg-ink-50`, `text-ink-700` |

Avoid: stock medical-white sterility, corporate blue, pure black.

### Typography
- **Sans (UI / nav / body)**: Inter (loaded from `rsms.me/inter/inter.css`)
- **Serif (long-form / hero)**: Source Serif 4 (system fallback if not installed)
- **Mono (code)**: JetBrains Mono / system mono fallback

### Type scale
Custom scale in `@theme`:
- `text-display` — 4rem hero
- `text-headline` — 2.5rem section headlines
- `text-title` — 1.75rem
- `text-body` — 1.0625rem (slightly larger than default for readability)

### Editorial prose class
Use `prose-editorial` for long-form article body. Defined in `global.css`:
- Source Serif 4, 1.1875rem, line-height 1.75
- Max-width 68 characters
- Styled `h2`, `h3`, `a`, `blockquote`

### Print stylesheet
Tools and checklists should be printable. The `@media print` block in `global.css` hides nav and footer and forces white background + black text.

### Accessibility primitives
- Skip link (`.skip-link`) — present on every page via `BaseLayout.astro`
- `:focus-visible` outline using `--color-pulse-500`
- WCAG 2.1 AA minimum contrast on all token combinations

---

## Image handling

### Where images live
- **Optimized images** (heroes, figures, in-content): `src/assets/images/` — Astro processes these into responsive WebP variants at build
- **Static assets** (favicon, OG image, robots.txt): `public/` — served as-is

### Adding a new image
1. Drop the file in `src/assets/images/your-image.jpg` (JPG or PNG)
2. Optimize for size — large PNGs (>1MB) should be converted to JPG first:
   ```bash
   sips -s format jpeg -s formatOptions 85 input.png --out output.jpg
   ```
3. Import and use:
   ```astro
   ---
   import { Image } from 'astro:assets';
   import myImage from '@/assets/images/your-image.jpg';
   ---
   <Image src={myImage} alt="..." widths={[640, 960, 1280]} />
   ```
4. Or use the project's `Figure` / `HeroWithImage` components for consistent treatment.

### Image components
- **`<Figure>`** — inline editorial figure with caption + credit
- **`<HeroWithImage>`** — split-layout hero (image + content side-by-side)

Both accept a `treatment` prop:
- `standard` — full color
- `duotone` — warm sepia tint (good for clinical/serious)
- `mono` — B&W with contrast bump (good for editorial gravitas)

### Sourcing rules
- **NEVER** use generic stock photography (smiling diverse hands, white-coat doctors with stethoscopes, abstract DNA helices)
- **PREFER** documentary-style photography by Black creators
- Free sources: [Nappy.co](https://nappy.co) (CC0), [WOC in Tech Chat](https://www.wocintechchat.com/blog/wocintechphotos), [Disability:IN image bank](https://disabilityin.org)
- Always include attribution in `imageCredit` and `imageCreditUrl` props
- Better NO image than a wrong one. Pages can stand on typography alone.

### Performance
Astro Image automatically:
- Generates WebP variants at multiple widths (640, 960, 1280, 1920)
- Adds `srcset` and `sizes` attributes
- Lazy-loads non-priority images
- Outputs `<picture>` elements with proper fallbacks

You'll see ~17 image variants generated on `npm run build`. This is expected.

---

## Deployment

### Standard deploy

```bash
cd /Users/gabe/projects/pulse-and-heritage
./scripts/deploy.sh
```

This script:
1. Pushes the full repo (including `plans/`, `CLAUDE.md`, `.claude/`) to **Gitea** (`origin`)
2. Creates a temporary branch with project-only files removed
3. Force-pushes the website-only branch to **GitHub** (`github`) as `main`
4. Cleans up the temp branch

### Triggering a DO deploy

Because the DO app uses `git:` source (not `github:`), pushing to GitHub does **NOT** auto-deploy. Trigger manually:

```bash
doctl apps create-deployment 7a007de3-c4ec-4f01-a426-1fc829d3b10b
```

Or use the DO console: Apps → pulse-and-heritage → "Deploy" button.

### Watching a deployment

```bash
# Get the deployment ID, then watch its phase:
doctl apps list-deployments 7a007de3-c4ec-4f01-a426-1fc829d3b10b --format ID,Phase,Cause | head -3

# Wait for active:
until [ "$(doctl apps get-deployment 7a007de3-c4ec-4f01-a426-1fc829d3b10b <DEPLOYMENT_ID> --format Phase --no-header)" = "ACTIVE" ]; do sleep 20; done
```

Typical deploy time: **2–4 minutes** (npm install + build + propagation).

### Verifying live

```bash
curl -sIL https://pulseandheritage.com | grep '^HTTP'
# Expected: HTTP/2 200
```

### Switching to auto-deploy on push (future)

1. Authorize DO's GitHub App for `Hell0pr0to/pulse-and-heritage` via [GitHub Settings → Applications](https://github.com/settings/installations)
2. Update `.do/app.yaml`:
   ```yaml
   static_sites:
   - name: web
     github:                  # was: git
       repo: Hell0pr0to/pulse-and-heritage
       branch: main
       deploy_on_push: true
     build_command: npm install && npm run build
     output_dir: dist
   ```
3. Apply: `doctl apps update 7a007de3-c4ec-4f01-a426-1fc829d3b10b --spec .do/app.yaml`

After this, every push to GitHub `main` triggers a deploy.

---

## DNS and domains

### Registrar: Internet.bs
The domain `pulseandheritage.com` is registered at Internet.bs. The Internet.bs API key is **IP-whitelisted** — meaning API calls only work from approved source IPs. Currently whitelisted: `infra-services` (192.168.1.3 / Tailscale 100.x.x.x).

### Current DNS records

| Record | Type | Value | TTL |
|--------|------|-------|-----|
| `pulseandheritage.com` | A | `162.159.140.98` | 3600 |
| `pulseandheritage.com` | A | `172.66.0.96` | 3600 |
| `pulseandheritage.com` | AAAA | `2a06:98c1:58::60` | 3600 |
| `pulseandheritage.com` | AAAA | `2606:4700:7::60` | 3600 |
| `www.pulseandheritage.com` | CNAME | `pulse-and-heritage-8pnid.ondigitalocean.app` | 3600 |

The A/AAAA records point to Cloudflare anycast IPs that DO uses for App Platform's edge.

### Listing current DNS records

```bash
ssh infra-services 'API_KEY="<from /etc/traefik/environment.env>"; PASS="<password>"; \
  curl -s "https://api.internet.bs/Domain/DnsRecord/List?ApiKey=${API_KEY}&Password=${PASS}&Domain=pulseandheritage.com&ResponseFormat=JSON"'
```

### Adding/changing DNS records

Use the Internet.bs API from `infra-services`:

```bash
ssh infra-services 'API_KEY="..."; PASS="..."; \
  curl -s "https://api.internet.bs/Domain/DnsRecord/Add?ApiKey=${API_KEY}&Password=${PASS}\
&FullRecordName=NEW.pulseandheritage.com\
&Type=CNAME\
&Value=target.example.com\
&Ttl=3600\
&ResponseFormat=JSON"'
```

API doc: https://www.internet.bs/api-doc.html

### Future: delegate to DO nameservers
Cleanest long-term option. Move the NS records at Internet.bs to point to DO's nameservers (`ns1.digitalocean.com`, `ns2.digitalocean.com`, `ns3.digitalocean.com`), then DO manages all records including ALIAS-style apex. Use `doctl compute domain` commands.

### TLS / certificates
Managed by DO App Platform — Let's Encrypt cert auto-renewed. No action needed unless you change the apex DNS, in which case run a deployment to trigger re-validation.

---

## Source control: dual-remote pattern

### Why two remotes?

| Remote | Repo | Visibility | Contains | Purpose |
|--------|------|-----------|----------|---------|
| `origin` | `git.novuselite.com/novuselite/pulse-and-heritage` | Private | Full repo (CLAUDE.md, plans, docs) | Source of truth |
| `github` | `github.com/Hell0pr0to/pulse-and-heritage` | **Public** | Website code only | DO clone target |

The GitHub mirror is public so DO can clone it without OAuth. The Gitea repo stays private so internal docs and plans aren't exposed.

### `scripts/deploy.sh` flow

```bash
git push origin main                    # Gitea: full repo
git checkout -b github-deploy-<ts>      # temp branch
git rm -r --cached plans/ CLAUDE.md .claude/  # strip private files
git commit -m "Deploy: website code only"
git push github github-deploy-<ts>:main --force
git checkout main && git branch -D github-deploy-<ts>
```

### What's stripped from the GitHub mirror
- `plans/` directory
- `CLAUDE.md`
- `.claude/` directory

If you add new private content, update `scripts/deploy.sh` to strip it.

### Manually fetching latest

```bash
git fetch origin && git pull origin main
```

---

## Monitoring and observability

### Uptime
DO App Platform provides built-in monitoring at:
https://cloud.digitalocean.com/apps/7a007de3-c4ec-4f01-a426-1fc829d3b10b

### Logs

```bash
# Build logs for a specific deployment:
doctl apps logs 7a007de3-c4ec-4f01-a426-1fc829d3b10b --type build

# Runtime logs (limited for static sites — mostly request logs):
doctl apps logs 7a007de3-c4ec-4f01-a426-1fc829d3b10b --type run --follow
```

### Health check

```bash
curl -sIL https://pulseandheritage.com 2>&1 | grep -E '^HTTP|^content-type'
```

### Analytics
Not yet configured. Plan: self-hosted Plausible or Umami (privacy-first, no cookie banners). See [Future work](#future-work).

---

## Common operations

### Add a new page

1. Create `src/pages/your-route.astro`
2. Use `BaseLayout`:
   ```astro
   ---
   import BaseLayout from '@layouts/BaseLayout.astro';
   ---
   <BaseLayout title="Your Page Title" description="...">
     <!-- content -->
   </BaseLayout>
   ```
3. The route auto-registers from the file path: `src/pages/foo/bar.astro` → `/foo/bar/`

### Update navigation
Edit `navItems` array in `src/components/Header.astro`. Mirror in footer if relevant — `src/components/Footer.astro`.

### Change the tagline / brand voice
- Tagline appears in `Footer.astro` and `BaseLayout.astro` (default description meta tag)
- Voice guide is in `CLAUDE.md` (read by Claude Code) and `docs/ADMIN.md` (this file)

### Update an image
1. Replace the file in `src/assets/images/` (keep the same filename to avoid editing imports)
2. `npm run build` to regenerate variants
3. Deploy

### Add a new color or design token
Edit `src/styles/global.css` `@theme` block. Tailwind v4 picks up new tokens automatically — `bg-yourcolor-500` will Just Work.

### Take the site temporarily offline
There's no built-in maintenance mode. Options:
- Push a "maintenance" branch and trigger a deploy from it
- Or put the DO app into "paused" state via the console

---

## Troubleshooting

### "Build fails on `npm install`"
- Delete `node_modules` and `package-lock.json`, run `npm install` again
- Verify Node version ≥ 20 (`node --version`)

### "Build fails with content collection errors"
- Most likely a Zod schema violation in a Markdown frontmatter
- Run `npx astro check` for detailed type errors
- Check the file referenced in the error — frontmatter must match `src/content.config.ts`

### "Deploy succeeds but site shows old content"
- DO `git:` source clones fresh on every deploy, so this shouldn't happen
- If it does: `doctl apps create-deployment <APP_ID> --force-rebuild`
- Cloudflare edge can cache for ~1 minute — try a hard refresh

### "Domain shows 'not configured' or cert error"
- Check DO domain phase: `doctl apps get <APP_ID> --output json | jq '.[0].domains'`
- Verify DNS resolves: `dig +short pulseandheritage.com @1.1.1.1`
- DO cert provisioning can take up to 10 minutes after DNS first resolves

### "Image not loading"
- Confirm path: `import myImg from '@/assets/images/...'` (NOT a string URL)
- Check file is under `src/assets/`, not `public/`
- Run `npm run build` and grep `dist/` for the image — should appear as `_astro/<name>.<hash>.webp`

### "Can't push to Gitea — auth required"
- Get/use a Gitea token: `ssh -i ~/.ssh/id_rsa_ansible root@192.168.1.150 'docker exec gitea su git -c "gitea admin user generate-access-token --username git --scopes write:repository --token-name <name>"'`
- Use as: `https://git:<TOKEN>@git.novuselite.com/novuselite/pulse-and-heritage.git`
- Don't commit tokens — strip them from the remote URL after first push

### "DO build runs out of memory or times out"
- Static site builds are usually fine on DO's smallest instance
- If npm install is slow, prune dev dependencies in production builds (not currently necessary)

---

## Security

### Secrets and credentials
- **None** are stored in this repo
- DO build environment variables (if added later for forms, analytics) go in `.do/app.yaml` `envs:` block with `type: SECRET`
- Internet.bs API credentials live on `infra-services` only

### Public vs private
- The **Gitea repo is private** — internal docs, plans, voice guide
- The **GitHub mirror is public** — but contains only website code (CLAUDE.md and plans are stripped by `deploy.sh`)
- Never commit `.env` files
- Never expose admin endpoints (this is a static site, so there are none — but if a future feature adds an API, gate it behind oauth2-proxy + Keycloak per command-center patterns)

### Content disclaimers
The footer carries a medical disclaimer:
> Educational content. Not a substitute for medical advice, diagnosis, or treatment from a qualified clinician.

This must remain on every page. It's in `Footer.astro` — only edit with explicit approval.

### License
Site code: UNLICENSED (proprietary). All Markdown content: © Allison Smith / Pulse & Heritage. Photography: per individual credit (Nappy.co photos are CC0).

---

## Future work

Tracked in epic [`EPIC-HLTQ-001`](../../command-center/product_management/epics/EPIC-HLTQ-001-health-equity-website.md). Highlights:

### Content
- Seed articles (HLTQ-001-D): "Diabetes in the Black diaspora," "eGFR and kidney disease," "A veteran's guide to challenging an underdiagnosis"
- Detail page templates for each content collection
- Article index page (`/articles/`) with filtering by pillar
- Tag pages for cross-cutting topics

### Engagement
- Newsletter signup (HLTQ-001-G) — Brevo or Astro endpoint
- "Submit your story" form (HLTQ-001-G) — moderation workflow
- Search (HLTQ-001-H) — Pagefind plugin
- Privacy policy page

### Imagery
- Source documentary photos for misdiagnosis, veteran-health, self-advocacy pillars
- Commission editorial illustration for distinctive visual identity
- Replace placeholder favicon with a real wordmark
- Add OG image (`/public/og-default.png`) for social sharing

### Operations
- Switch to GitHub `github:` source for auto-deploy on push (requires GitHub App authorization)
- Add analytics (Plausible self-hosted or Umami)
- Set up uptime monitoring (e.g., UptimeRobot or self-hosted)
- Add a CMS (Directus) when content team scales beyond one person

### Provider directory (HLTQ-001-J, far future)
Searchable directory of culturally competent providers. Major differentiator but requires significant data sourcing strategy.

---

## Appendix: quick reference

### File paths
| Need | Path |
|------|------|
| Add a page | `src/pages/foo.astro` |
| Edit nav | `src/components/Header.astro` |
| Change colors | `src/styles/global.css` (@theme block) |
| Add an image | `src/assets/images/foo.jpg` |
| Add an article | `src/content/articles/foo.md` |
| Edit DO config | `.do/app.yaml` |
| Edit deploy script | `scripts/deploy.sh` |

### Commands
| Need | Command |
|------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Type check | `npx astro check` |
| Deploy | `./scripts/deploy.sh` then `doctl apps create-deployment 7a007de3-c4ec-4f01-a426-1fc829d3b10b` |
| Watch deploy | `doctl apps list-deployments 7a007de3-c4ec-4f01-a426-1fc829d3b10b` |
| Health check | `curl -sIL https://pulseandheritage.com` |

### IDs and URLs
| Resource | Value |
|----------|-------|
| Live URL | https://pulseandheritage.com |
| DO App ID | `7a007de3-c4ec-4f01-a426-1fc829d3b10b` |
| DO default URL | https://pulse-and-heritage-8pnid.ondigitalocean.app |
| Gitea repo | https://git.novuselite.com/novuselite/pulse-and-heritage |
| GitHub mirror | https://github.com/Hell0pr0to/pulse-and-heritage |
| Domain registrar | Internet.bs |

---

**Maintained by**: site administrator
**Source epic**: `command-center/product_management/epics/EPIC-HLTQ-001-health-equity-website.md`
**Last updated**: 2026-04-15

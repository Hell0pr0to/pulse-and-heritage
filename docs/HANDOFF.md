# Pulse & Heritage — Bootstrap Handoff

**Date**: 2026-04-15
**Bootstrap session**: end-to-end project setup from epic through live deployment
**Source epic**: [`EPIC-HLTQ-001`](../../command-center/product_management/epics/EPIC-HLTQ-001-health-equity-website.md) (in `command-center` repo)
**Status**: Live in production

---

## TL;DR

Built and shipped a brand-new health equity content site for **Allison Smith, MSN, FNP-C** (board-certified Family Nurse Practitioner, U.S. combat veteran with two tours in Iraq). The site lives at **https://pulseandheritage.com** on DigitalOcean App Platform, with documentary photography from Nappy.co, an editorial design system, content collections wired up, and dual-remote source control (Gitea source of truth, GitHub deploy mirror).

Audience: veterans and the Black diaspora — covering chronic conditions, misdiagnosis, VA health equity, and self-advocacy.

Tagline: *Because everyone deserves to be seen, heard, and treated appropriately.*

---

## What was decided (and why)

### Project name: Pulse & Heritage
Rejected alternatives included "The Equity Pulse," "Seen & Heard Health," "Under the Skin," "Off-Label," "The Care Gap." **Pulse & Heritage** won because:
- *Pulse* is clinical (vitals, ICU — Allison's world)
- *Heritage* connects to the Black diaspora and generational health
- Together: *your health and where you come from are inseparable*

"Seen & Heard" was strong enough to stay — but as the **brand promise / tagline**, not the name.

### Editorial voice: "Clinically precise, universally clear"
Stephen Hawking model — accessible is not the same as simplified. The author sits at the intersection of three identities (clinician / veteran / advocate) and writing must hold all three. Full voice guide is in [`CLAUDE.md`](../CLAUDE.md).

### Stack
- **Astro 5** + **Tailwind CSS 4** (matches SJD pattern)
- **DigitalOcean App Platform** (static site, free tier)
- **Domain**: `pulseandheritage.com` (registered at Internet.bs)
- **Source control**: Gitea (`origin`) + GitHub (`github`, public deploy mirror)

### Differentiator
The author IS the intersection. No other health equity site has a board-certified NP who is also a combat veteran and person of color as its editorial voice. That clinical authority + lived experience is the moat.

---

## What was built

### 1. Project scaffolding
- Created `/Users/gabe/projects/pulse-and-heritage/`
- `npm init` with Astro 5.18, Tailwind CSS 4.2, `@astrojs/sitemap`, TypeScript strict
- Path aliases configured (`@/*`, `@components/*`, `@layouts/*`, `@content/*`)

### 2. Brand identity & design system
File: [`src/styles/global.css`](../src/styles/global.css)

Custom design tokens:
- **Heritage** palette (deep earth tones — primary)
- **Pulse** palette (warm reds — accent, vitality, urgency)
- **Service** palette (gold — veteran ribbon)
- **Ink** palette (warm grays — never cold blue-gray)
- Editorial typography: Inter (sans) + Source Serif 4 (serif)
- `prose-editorial` class for long-form articles
- Print stylesheet for tools/checklists
- WCAG accessibility primitives (skip link, focus-visible, high contrast)

### 3. Content collections
File: [`src/content.config.ts`](../src/content.config.ts)

Four collections defined with full Zod schemas:
| Collection | Purpose |
|------------|---------|
| `articles` | Long-form pieces tagged to one of 6 pillars |
| `conditions` | Clinical reference pages |
| `tools` | Printable checklists, guides, templates, trackers |
| `stories` | First-person community narratives |

All accept frontmatter with author defaulted to "Allison Smith, MSN, FNP-C", reading time, source citations, draft mode, etc.

### 4. Components
Located in [`src/components/`](../src/components/):
- **`BaseLayout.astro`** — full HTML scaffold with OG tags, JSON-LD-ready, skip link
- **`Header.astro`** — primary navigation with mobile disclosure menu
- **`Footer.astro`** — three-column footer with brand restatement
- **`Hero.astro`** — text-only hero (used on text-strong pages)
- **`HeroWithImage.astro`** — split layout hero (image + content)
- **`Figure.astro`** — inline editorial figure with caption + credit
- **`Card.astro`** — pillar/article card with eyebrow, title, summary
- **`CTA.astro`** — banded call-to-action (pulse or heritage variant)
- **`PillarGrid.astro`** — six-pillar overview component for homepage

### 5. Pages
Located in [`src/pages/`](../src/pages/):
- **`index.astro`** — homepage (hero, mission quote, pillar grid, CTA)
- **`about.astro`** — Allison's full bio with editorial figure
- **`conditions/index.astro`** — pillar landing with 6 condition cards
- **`misdiagnosis/index.astro`** — pillar landing with 6 topic cards
- **`veteran-health/index.astro`** — pillar landing with 6 topic cards
- **`self-advocacy/index.astro`** — pillar landing with 6 tool cards
- **`stories/index.astro`** — pillar landing with submission CTA

### 6. Documentary photography (CC0, Nappy.co)
Located in [`src/assets/images/`](../src/assets/images/):
- `hero-clinical.jpg` — homepage (duotone treatment) — BP check
- `about-generations.jpg` — about page (B&W mono) — older couple
- `conditions-elder.jpg` — conditions pillar (duotone) — elder at home
- `stories-family.jpg` — stories pillar (standard) — multigenerational

Astro auto-generates 17 responsive WebP variants on build. All photos by Black creators via Nappy.co (CC0). Three image treatments available: `standard`, `duotone`, `mono`.

**Pages intentionally text-only**: misdiagnosis, veteran-health, self-advocacy — pending commissioned/curated imagery. Better empty than wrong.

### 7. Deployment infrastructure
- [`.do/app.yaml`](../.do/app.yaml) — DO App Platform spec (uses `git:` source for public clone, sidesteps GitHub OAuth gate)
- [`scripts/deploy.sh`](../scripts/deploy.sh) — dual-remote push (Gitea full repo, GitHub website-only mirror)

### 8. Source control
- **Gitea**: `https://git.novuselite.com/novuselite/pulse-and-heritage` (private, full repo)
- **GitHub**: `https://github.com/Hell0pr0to/pulse-and-heritage` (public, deploy mirror — does NOT contain `plans/`, `CLAUDE.md`, or `.claude/`)

---

## DigitalOcean App Platform

**App ID**: `7a007de3-c4ec-4f01-a426-1fc829d3b10b`
**Region**: NYC
**Default URL**: `https://pulse-and-heritage-8pnid.ondigitalocean.app`
**Source**: Plain `git:` clone of public GitHub repo (`https://github.com/Hell0pr0to/pulse-and-heritage.git`, branch `main`)
**Build**: `npm install && npm run build` → `dist/`
**TLS**: DO managed cert via Cloudflare edge

### Why `git:` source instead of `github:`
DO's `github:` source requires the DigitalOcean GitHub App to be granted explicit access to each repo via the GitHub web UI. To avoid that interactive step, I made the GitHub mirror **public** and used `git:` source which works for any reachable Git URL. The Gitea repo remains private and is the source of truth.

**Tradeoff**: `git:` source does NOT auto-deploy on push. New deploys require:
```bash
doctl apps create-deployment 7a007de3-c4ec-4f01-a426-1fc829d3b10b
```
Or click "Deploy" in the DO console.

To enable auto-deploy later: grant DO GitHub App access to `Hell0pr0to/pulse-and-heritage` and update [`.do/app.yaml`](../.do/app.yaml) to use `github:` source.

---

## DNS at Internet.bs

The domain `pulseandheritage.com` is registered at Internet.bs. DNS records were added via the Internet.bs API (called from `infra-services` since the API key is IP-whitelisted there).

| Record | Type | Value | TTL |
|--------|------|-------|-----|
| `pulseandheritage.com` | A | `162.159.140.98` | 3600 |
| `pulseandheritage.com` | A | `172.66.0.96` | 3600 |
| `pulseandheritage.com` | AAAA | `2a06:98c1:58::60` | 3600 |
| `pulseandheritage.com` | AAAA | `2606:4700:7::60` | 3600 |
| `www.pulseandheritage.com` | CNAME | `pulse-and-heritage-8pnid.ondigitalocean.app` | 3600 |

The IPs are Cloudflare anycast addresses that DO uses for App Platform edge — they're stable enough for production but if DO ever changes them, the apex would need updating. The cleaner long-term option is to delegate the domain to DO's nameservers, which lets DO manage all records (including ALIAS-style apex).

API endpoint reference: `https://api.internet.bs/Domain/DnsRecord/Add`. Credentials are in `/etc/traefik/environment.env` on infra-services as `INTERNETBS_API_KEY` / `INTERNETBS_PASSWORD`. See [`docs/project/lessons-learned/internetbs-api-ip-whitelisting-2026-03-26.md`](../../command-center/docs/project/lessons-learned/internetbs-api-ip-whitelisting-2026-03-26.md) in command-center for the IP whitelisting gotcha.

---

## Gitea repo creation

The Gitea token used for repo creation was issued via:
```bash
ssh -i ~/.ssh/id_rsa_ansible root@192.168.1.150 \
  'docker exec gitea su git -c "gitea admin user generate-access-token \
    --username git \
    --scopes write:organization,write:repository,write:user \
    --token-name ph-bootstrap-2"'
```

Gitea runs in Docker on **192.168.1.150** (MS-S1 Max), not infra-services as the older inventory suggests. The container is `gitea` with `gitea-postgres` for storage.

The token from this session was used once and is no longer needed. **Revoke it** in the Gitea UI under Settings → Applications, or generate a new one when needed for future automation.

---

## Files added to command-center

1. **`product_management/epics/EPIC-HLTQ-001-health-equity-website.md`** — full epic with goal, author bio, differentiator, voice guide, content pillars, story breakdown, dependencies, risks
2. **`CLAUDE.md`** — added `pulse-and-heritage` row to satellite projects table

These changes are uncommitted in the command-center repo at the time of writing.

---

## Verification

| Check | Result |
|-------|--------|
| `npm run build` exits clean | ✅ 7 pages, 17 image variants, sitemap |
| `npm run dev` boots | ✅ http://localhost:4321 |
| `git push origin main` (Gitea) | ✅ |
| `git push github` (deploy mirror) | ✅ |
| `doctl apps create` → ACTIVE | ✅ |
| `https://pulseandheritage.com` returns 200 | ✅ via Cloudflare edge |
| `https://www.pulseandheritage.com` returns 200 | ✅ |
| HTTPS cert valid | ✅ DO managed |
| Images load on homepage | ✅ confirmed `_astro/hero-clinical.*.webp` in HTML |

---

## Known follow-ups (not blockers)

### High value
1. **Source more imagery** for the three text-only pillar pages (misdiagnosis, veteran-health, self-advocacy). Options: WOC in Tech Chat, Disability:IN, commissioned editorial illustration.
2. **First seed articles** — pillar pages are landing-page-only right now. Story `HLTQ-001-D` calls for 2–3 seed articles to validate the content templates. Suggested first three:
   - "Diabetes in the Black diaspora"
   - "eGFR and kidney disease: what changed and why it matters"
   - "A veteran's guide to challenging an underdiagnosis"
3. **Newsletter signup** — homepage CTA currently links to `/subscribe/` which doesn't exist yet. Brevo integration planned in `HLTQ-001-G`.

### Operational
4. **Logo/wordmark** — current site uses typographic treatment (Pulse `&` Heritage) — fine for MVP but a real wordmark would strengthen identity.
5. **Favicon** — currently a generic SVG with a heartbeat line; replace with a proper mark.
6. **OG image** (`/og-default.png`) — referenced in `BaseLayout.astro` but file doesn't exist. Will 404 silently in social shares until added.
7. **Privacy policy** — `/privacy/` linked in footer but page doesn't exist.
8. **Auto-deploy on push** — currently manual via `doctl`. Authorize DO's GitHub App for `Hell0pr0to/pulse-and-heritage` and switch `.do/app.yaml` back to `github:` source.

### Process
9. **Commit the command-center changes** — epic doc and CLAUDE.md update are uncommitted.
10. **Revoke the bootstrap Gitea token** (`ph-bootstrap-2`) once no longer needed.

---

## Quick links

| Resource | URL |
|----------|-----|
| Live site | https://pulseandheritage.com |
| DO default URL | https://pulse-and-heritage-8pnid.ondigitalocean.app |
| Gitea repo (source of truth) | https://git.novuselite.com/novuselite/pulse-and-heritage |
| GitHub deploy mirror | https://github.com/Hell0pr0to/pulse-and-heritage |
| DO App ID | `7a007de3-c4ec-4f01-a426-1fc829d3b10b` |
| Epic | `command-center/product_management/epics/EPIC-HLTQ-001-health-equity-website.md` |
| Admin guide | [`docs/ADMIN.md`](./ADMIN.md) |

---

## How to operate this site going forward

For day-to-day operations, content publishing, deployments, troubleshooting, and architectural reference, see [`docs/ADMIN.md`](./ADMIN.md).

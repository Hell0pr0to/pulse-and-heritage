# Pulse & Heritage — Claude Code Project Notes

## What this is

Pulse & Heritage is a health equity content site for veterans and people of color (Black diaspora — African American, Caribbean, African, Afro-Latino). Authored by **Allison Smith, MSN, FNP-C** — board-certified Family Nurse Practitioner, ICU/cardiac/oncology clinical experience, VA clinic rotation, and an 8-year U.S. Armed Forces veteran with two tours in Iraq.

Tagline: *Because everyone deserves to be seen, heard, and treated appropriately.*

Bootstrapped under EPIC-HLTQ-001 in `command-center`.

## Stack

- Astro 5 + Tailwind CSS 4
- DigitalOcean App Platform (static site)
- Domain: `pulseandheritage.com` (Internet.bs)
- Dual-remote: Gitea (full repo) + GitHub (deploy mirror)

## Editorial voice

**"Clinically precise, universally clear."** The Stephen Hawking model — accessible is not the same as simplified. Use the clinical term, then make it real.

The author sits at the intersection of three identities — and writing must hold all three:
1. **The Clinician** — board-certified NP, ICU/cardiac/oncology
2. **The Veteran** — 8 years, 2 tours Iraq, direct
3. **The Advocate** — person of color, has seen the system fail people who look like her

### Do
- Use the clinical term, then make it real *("Your A1C — a 3-month average of your blood sugar — was 7.2")*
- Build bridges with analogies
- Name systemic problems directly — race, bias, service-related inequity
- Speak *to* the reader (your, our), not *about* them
- Cite the study, name the guideline, link the source
- Show controlled anger at broken systems
- End every piece with what the reader can *do*
- Trust the reader's intelligence at every reading level

### Don't
- Hide behind jargon
- Strip clinical terms entirely
- Dance around race or bias
- Talk about "those communities" from outside
- Make vague claims about "disparities" without specifics
- Lecture or moralize
- Be hopeless or fatalistic
- Leave the reader feeling powerless
- Condescend or oversimplify

### Tone guardrails

- **Never preachy.** The reader doesn't need a lecture on why disparities are bad.
- **Never hopeless.** Honest about systemic failure, but every piece points to agency.
- **Never academic.** Cite the journal, then translate it.
- **Never performative.** No virtue signaling. The work is the point.
- **Never generic.** If it could appear word-for-word on WebMD, it's not Pulse & Heritage.

## Content pillars

1. Conditions & Disparities — diabetes, kidney, heart, sickle cell, mental health, maternal
2. Misdiagnosis & Underdiagnosis — pain bias, dermatology, eGFR, algorithm bias
3. Veteran Health Equity — VA navigation, disability claims, toxic exposure
4. Self-Advocacy Tools — checklists, guides, templates
5. Financial Health & Empowerment — costs, benefits, insurance literacy
6. Community & Stories — first-person narratives

## Design tokens

- **Heritage** (deep earth tones — primary brand color)
- **Pulse** (warm red — accent, vitality, urgency)
- **Service** (gold — veteran ribbon palette)
- **Ink** (warm grays for neutrals — never cold blue-gray)

Design philosophy: avoid medical-white sterility. Editorial, grounded, warm.

## Accessibility

WCAG 2.1 AA minimum. Skip link, focus-visible styles, semantic landmarks, high contrast, no color-only signals.

## Deployment

```bash
./scripts/deploy.sh   # Pushes to both Gitea (full) and GitHub (deploy mirror)
```

DO auto-deploys on push to GitHub `main`.

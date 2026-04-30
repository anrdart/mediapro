# Media Pro v2 — Astro 6 + Bun Implementation Design

**Date**: 2026-04-30  
**Status**: Approved  
**Source**: `mediapro-v2-astro-bun-superprompt.md` + handoff `MEDIA PRO V1-handoff.zip`

---

## 1. Overview

Port the Media Pro Creative Limited marketing site from a React+Babel CDN prototype (`media-pro-v1/`) to a production-grade **Astro 6 + Bun** static site. The final output must be pixel-perfect against `Media Pro Redesign v2.html`, achieve Lighthouse ≥95 across all categories, and pass the 12-point GEO checklist for AI citation.

**Output folder**: `/home/ekalliptus/dev/mediapro/` (project root, not a subfolder)  
**Pages**: `/` (homepage), `/contact`, `/faq`, `/terms`, `/disclaimer`, `404`

---

## 2. Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Astro | `^6.1.0` |
| Runtime/PM | Bun | `>=1.1.0` |
| Language | TypeScript strict | — |
| Styling | Tailwind CSS v4 + custom CSS | `^4.0.0` |
| Icons | Inline SVG `.astro` components | — |
| Fonts | Astro Fonts API (experimental) | built-in v6 |
| Sitemap | `@astrojs/sitemap` | latest |
| Output | `static` | — |

**Zero React in production.** All JSX components port to `.astro`. JS budget: ≤15 KB gzipped total.

Client-side scripts (vanilla TS, no framework):
- `reveal.ts` — IntersectionObserver scroll animations
- `stat-counter.ts` — animated counters from 0 to target
- `header-scroll.ts` — sticky header `.scrolled` class
- `faq-filter.ts` + `faq-accordion.ts` — category pills + accordion
- `contact-form.ts` — multi-select pills + WhatsApp deep link

---

## 3. Implementation Strategy — Parallel Agents

Three agents run **concurrently**, followed by a sequential integration pass.

### Agent 1 — Foundation
**Owns**: everything except content data and subpage content stubs.

```
astro.config.mjs
package.json / bun.lock / tsconfig.json / .env.example
src/styles/           (tokens.css, components.css, animations.css, subpage.css, global.css)
src/layouts/          (BaseLayout.astro, SubpageLayout.astro)
src/components/layout/ (Header.astro, Footer.astro, MobileMenu.astro)
src/components/ui/    (Button, Eyebrow, DisplayHeading, SectionHeading, Lede, Reveal,
                       DefinitionBlock, FactCard)
src/components/icons/ (9 SVG icon .astro files)
src/components/seo/   (BaseSEO.astro, JsonLd.astro, Breadcrumbs.astro)
src/lib/              (all .ts scripts)
src/data/site.ts
public/robots.txt
```

Sources: `styles-light.css`, `styles-subpage.css`, all `components/*.jsx`

### Agent 2 — Content + Schema + GEO
**Owns**: content data and GEO endpoints.

```
src/content/config.ts
src/content/services.json
src/content/reasons.json
src/content/testimonials.json
src/content/stats.json
src/content/trusted-logos.json
src/content/faqs.json
src/data/schemas/     (organization.ts, professional-service.ts, service-catalog.ts,
                       website.ts, breadcrumb.ts, faq-page.ts, product-review.ts)
src/pages/llms.txt.ts
src/pages/llms-full.txt.ts
```

Sources: `Services.jsx`, `Stats.jsx`, `Why.jsx`, `Testimonials.jsx`, `Marquee.jsx`, `faq.html`

### Agent 3 — Subpage Content Extraction
**Owns**: structured content extracted from HTML subpages, ready for integration.  
**Does NOT own** `faqs.json` — that belongs to Agent 2. Agent 3 only extracts terms and disclaimer sections, and the contact form structure.

```
src/_extracted/contact-content.ts     (form fields, service pills, budget options, timeline options)
src/_extracted/terms-sections.ts      (13 section objects: {id, title, content: string})
src/_extracted/disclaimer-sections.ts (9 section objects: {id, title, content: string})
```

Sources: `contact.html`, `terms.html`, `disclaimer.html`

### Integration Pass (sequential, after all agents complete)

1. Download images from `mediapro.work` → `public/images/`
2. Build `src/components/sections/` (11 components) — compose Agent 1 components + Agent 2 data
3. Build `src/pages/index.astro` — compose all sections
4. Build `src/pages/contact.astro`, `faq.astro`, `terms.astro`, `disclaimer.astro`, `404.astro`
5. `bun run build` — verify zero errors
6. Verify Lighthouse targets met

**No file is owned by more than one agent** — zero merge conflicts guaranteed.

---

## 4. Architecture

### Component Hierarchy

```
BaseLayout.astro
├── BaseSEO.astro          (meta, OG, canonical, hreflang, theme-color)
├── JsonLd.astro           (renders JSON-LD <script> tags)
├── Header.astro           (sticky, scroll-aware)
│   └── MobileMenu.astro   (focus trap + ESC close)
├── <slot />
└── Footer.astro

SubpageLayout.astro (extends BaseLayout)
├── Breadcrumbs.astro
├── subpage-hero slot
└── <slot />

index.astro
├── Hero.astro
├── Marquee.astro          (CSS-only, trusted logos)
├── About.astro
├── ServicesIntro.astro
├── Services.astro         ← content/services.json
├── Cta.astro
├── Stats.astro            ← content/stats.json
├── Why.astro              ← content/reasons.json
├── Testimonials.astro     ← content/testimonials.json
└── FooterCta.astro
```

### Data Flow

```
content/*.json  →  getCollection()  →  section components
data/site.ts    →  imported everywhere (SITE constants)
data/schemas/   →  BaseLayout.astro  →  JsonLd.astro  →  <script type="ld+json">
lib/*.ts        →  <script> in BaseLayout (bundled by Astro, deduped)
```

---

## 5. Design System

**Colors** (CSS `@theme` block, Tailwind v4):
- Surfaces: `--color-bg #FFFFFF`, `--color-bg-soft #FAFAFA`, `--color-bg-warm #FFFBF3`
- Ink: `--color-ink #1A1A1A`, `--color-ink-soft #4A4A4A`, `--color-ink-mute #7A7A7A`
- Brand Red: `--color-red #C3282F`, dark `#A11F25`, soft `#FCEAEB`
- Brand Gold: `--color-gold #D2A418`, dark `#A88313`, soft `#FFF6D9`
- CTA Yellow: `--color-yellow #FFB804`, dark `#E6A300`, soft `#FFF4D1`

**Typography**:
- Display: Space Grotesk 400/500/600/700
- Body: Inter 300/400/500/600/700
- Via Astro Fonts API (`experimental.fonts`)

**Mood**: BOLD + COMPACT + SMOOTH (locked, no variants in production)
- `section { padding: clamp(48px, 6vw, 80px) 0 }`
- `.h-display { font-size: clamp(32px, 5vw, 72px) }`
- `.reveal` transitions: `opacity .6s ease, transform .6s ease`
- All mood/density/motion variant CSS from `Media Pro Redesign v2.html` → **dropped**

---

## 6. SEO + GEO Requirements

**JSON-LD schemas** (all pages): Organization, WebSite, BreadcrumbList  
**Homepage additional**: ProfessionalService (AggregateRating 4.7/84000), Service+OfferCatalog, Product+Review×3, FAQPage×4  
**FAQ page**: FAQPage with all 17 Q&A  
**Contact page**: ContactPage + nested Organization

**GEO** (12-point checklist per page):
- Static HTML (no client-side only rendering) ✓ Astro static
- AI crawlers allowed in `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, etc.)
- Definition block (40-60 words) in Hero + main sections
- Answer-first H2/H3 format in FAQ
- Fact density: min 1 stat with source per 500 words
- `llms.txt` at root with key pages summary
- `llms-full.txt` with all FAQ + service descriptions
- Named entities: "Media Pro" mentioned ≥1× per section
- `<time datetime>` in hero, footer, stats section

**Lighthouse targets**: Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO =100

---

## 7. Pages

| Page | Route | Layout | Key Features |
|---|---|---|---|
| Homepage | `/` | BaseLayout | 11 sections, animated stats, marquee, reveal |
| Contact | `/contact` | SubpageLayout | Multi-select pills, budget pills, WA deep link |
| FAQ | `/faq` | SubpageLayout | 5-cat filter, 17-item accordion, FAQPage schema |
| Terms | `/terms` | SubpageLayout | Sticky TOC, 13 sections, IntersectionObserver |
| Disclaimer | `/disclaimer` | SubpageLayout | Sticky TOC, 9 sections |
| 404 | `/404` | BaseLayout | Simple hero + back CTA |

---

## 8. Images

Downloaded from `mediapro.work` → self-hosted in `public/images/`:
- `hero-phone.png` (from `/wp-content/uploads/2025/11/02.png`)
- `og-default.png` (1200×630, same source)
- Logo PNG (from elementor thumbs URL)

Hero phone: `loading="eager"`, `fetchpriority="high"`, `<link rel="preload">` in `<head>`.  
All images: explicit `width`/`height` attributes to prevent CLS.

---

## 9. Acceptance Criteria

- `bun install && bun run build` zero error/warning
- `bun run astro check` zero TypeScript errors
- All 6 pages navigable at `bun run preview`
- Visual match to `Media Pro Redesign v2.html` at 1440px + 375px
- Lighthouse ≥95 Performance, Accessibility, Best Practices; =100 SEO
- Total JS ≤15 KB gzipped
- JSON-LD valid (schema.org validator)
- `robots.txt` allows all AI crawlers
- `llms.txt` accessible at `/llms.txt`
- Stats counter animates on scroll
- FAQ filter + accordion functional
- Contact form WhatsApp deep link generates correctly
- Sticky TOC highlights current section (terms/disclaimer)
- Mobile menu: focus trap + ESC close
- `prefers-reduced-motion`: all animations disabled
- All `target="_blank"` have `rel="noopener noreferrer"`
- Brand name "Media Pro" ≥1× per section
- `<time datetime>` present in hero, footer, stats

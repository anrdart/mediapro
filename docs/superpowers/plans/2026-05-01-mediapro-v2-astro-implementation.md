# Media Pro v2 — Astro 6 + Bun Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:dispatching-parallel-agents for Tasks 1-3 (parallel phase), then superpowers:subagent-driven-development for Tasks 4-7 (integration). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Media Pro Creative Limited marketing site from a React+Babel CDN prototype to a production-grade Astro 6 + Bun static site, achieving Lighthouse ≥95, AI-citable GEO compliance, and pixel-perfect parity with `Media Pro Redesign v2.html`.

**Architecture:** Three parallel agents own non-overlapping file sets (Foundation / Content+Schema+GEO / Subpage content), followed by a sequential integration pass that composes section components, builds pages, downloads images, and verifies the build.

**Tech Stack:** Astro 6.1+, Bun 1.1+, Tailwind CSS v4, TypeScript strict, `@astrojs/sitemap`, Astro Fonts API (experimental), inline SVG icons.

**Source handoff:** `/tmp/media-pro-v1/project/`  
**Output root:** `/home/ekalliptus/dev/mediapro/`  
**Site:** `https://mediapro.work`

---

## Task 0: Bootstrap Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `bun.lock`, `.env.example`, `.gitignore`
- Create: `public/` directory with placeholder files

**Note:** Cannot use `bun create astro@latest` because it scaffolds a subfolder; we want files in the project root.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "mediapro-web",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^6.1.0",
    "@astrojs/sitemap": "^4.0.0",
    "@astrojs/check": "^0.10.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.1.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mediapro.work',
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US' },
      },
      customPages: ['https://mediapro.work/llms.txt'],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Space Grotesk',
        cssVariable: '--font-display',
        weights: [400, 500, 600, 700],
        subsets: ['latin'],
        styles: ['normal'],
        display: 'swap',
      },
      {
        provider: fontProviders.google(),
        name: 'Inter',
        cssVariable: '--font-body',
        weights: [300, 400, 500, 600, 700],
        subsets: ['latin'],
        styles: ['normal'],
        display: 'swap',
      },
    ],
  },
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', default: 'https://mediapro.work' }),
      PUBLIC_WA_NUMBER: envField.string({ context: 'client', access: 'public', default: '6285129992227' }),
      PUBLIC_EMAIL: envField.string({ context: 'client', access: 'public', default: 'mediapro@mediapro.work' }),
      PUBLIC_GA_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_META_PIXEL_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GSC_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_BING_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
```

- [ ] **Step 4: Create `.env.example`**

```
PUBLIC_SITE_URL=https://mediapro.work
PUBLIC_WA_NUMBER=6285129992227
PUBLIC_EMAIL=mediapro@mediapro.work
PUBLIC_GA_ID=
PUBLIC_META_PIXEL_ID=
PUBLIC_GSC_VERIFICATION=
PUBLIC_BING_VERIFICATION=
```

- [ ] **Step 5: Create `.gitignore`**

```
# build output
dist/
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# environment variables
.env
.env.production
.env.local

# editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store

# bun
.bun/
```

- [ ] **Step 6: Create `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 7: Run install**

```bash
cd /home/ekalliptus/dev/mediapro && bun install
```

Expected: dependencies installed, `bun.lock` generated, no errors. The Astro 6.1+ packages should resolve.

- [ ] **Step 8: Verify Astro starts (smoke test)**

Create a temporary `src/pages/index.astro`:

```astro
---
---
<html><body><h1>Bootstrap OK</h1></body></html>
```

Run: `cd /home/ekalliptus/dev/mediapro && bun run build`  
Expected: build succeeds, `dist/index.html` exists. Then delete the temporary index file: `rm src/pages/index.astro`.

- [ ] **Step 9: Commit**

```bash
cd /home/ekalliptus/dev/mediapro && git init -b main 2>/dev/null; git add . && git commit -m "chore: bootstrap Astro 6 + Bun project"
```

---

## Task 1: Agent 1 — Foundation (PARALLEL)

> **Dispatch as a subagent.** This task can run concurrently with Tasks 2 and 3 since they own non-overlapping file sets.

**Goal:** Build the foundation: design system CSS, layouts, base UI components, icons, lib scripts, header/footer, robots.txt.

**Files Owned:**
- `src/styles/{tokens.css, components.css, animations.css, subpage.css, global.css}`
- `src/data/site.ts`
- `src/lib/{reveal, stat-counter, header-scroll, faq-filter, faq-accordion, contact-form, toc-highlight}.ts`
- `src/components/icons/*.astro` (9 icons: arrow-right, arrow-up, search, stars, email, heart, data, thumbs-up, cloud, rocket, compass, handshake, people, like, share, briefcase, chart, menu, instagram, linkedin, x, whatsapp)
- `src/components/ui/{Button, Eyebrow, Reveal, DefinitionBlock, FactCard}.astro`
- `src/components/seo/{BaseSEO, JsonLd, Breadcrumbs}.astro`
- `src/components/layout/{Header, Footer, MobileMenu}.astro`
- `src/layouts/{BaseLayout, SubpageLayout}.astro`
- `public/robots.txt`

**Source references:** 
- `/tmp/media-pro-v1/project/styles-light.css` (design tokens + components)
- `/tmp/media-pro-v1/project/styles-subpage.css` (subpage components)
- `/tmp/media-pro-v1/project/components/Icons.jsx` (icon SVG paths)
- `/tmp/media-pro-v1/project/components/Header.jsx`, `Footer.jsx`, `Reveal.jsx`

### Step 1.1: Create `src/data/site.ts`

```ts
export const SITE = {
  url: 'https://mediapro.work',
  name: 'Media Pro',
  legalName: 'Media Pro Creative Limited',
  tagline: 'Crafting brands that stand out in a noisy digital world.',
  description: 'Premium global digital marketing agency. Web Development, Google Ads, Meta Ads, SEO and Consulting Services for brands worldwide.',
  founded: '2014',
  email: 'mediapro@mediapro.work',
  phone: '+62-851-2999-2227',
  waNumber: '6285129992227',
  waLink: 'https://wa.me/6285129992227',
  hours: '09:00–19:00 + Global · 24/7 async',
  language: 'en',
  locale: 'en-US',
  region: '001',
  themeColor: '#FFB804',
  ogImage: '/og-default.png',
  social: {
    instagram: '#',
    linkedin: '#',
    x: '#',
    whatsapp: 'https://wa.me/6285129992227',
  },
  stats: {
    yearsExperience: '10+',
    brandsServed: '25,000+',
    countries: '40+',
    rating: '4.7',
    reviewCount: 84000,
    projectsDelivered: '91,000+',
    happyClients: '84,000+',
    companiesSupported: '42+',
    clientSatisfaction: '98%',
  },
  pricing: {
    landingPage: 1500,
    marketingSite: 4500,
    customBuild: 12000,
    adsManagement: 750,
    adsMinSpend: 1500,
    seoRetainer: 1200,
    consultingHourly: 200,
  },
} as const;

export type Site = typeof SITE;
```

### Step 1.2: Create `src/styles/tokens.css`

This is the Tailwind v4 `@theme` block carrying all design tokens. Port from `styles-light.css:7-44`.

```css
@theme {
  /* Surfaces */
  --color-bg: #FFFFFF;
  --color-bg-soft: #FAFAFA;
  --color-bg-warm: #FFFBF3;
  --color-line: #ECECEC;
  --color-line-strong: #DADADA;

  /* Ink */
  --color-ink: #1A1A1A;
  --color-ink-soft: #4A4A4A;
  --color-ink-mute: #7A7A7A;

  /* Brand red */
  --color-red: #C3282F;
  --color-red-dark: #A11F25;
  --color-red-soft: #FCEAEB;

  /* Brand gold */
  --color-gold: #D2A418;
  --color-gold-dark: #A88313;
  --color-gold-soft: #FFF6D9;

  /* CTA yellow */
  --color-yellow: #FFB804;
  --color-yellow-dark: #E6A300;
  --color-yellow-soft: #FFF4D1;

  /* Layout */
  --max-content: 1240px;
  --gutter: clamp(16px, 3vw, 40px);
  --radius: 16px;
  --radius-sm: 10px;

  /* Shadows */
  --shadow-1: 0 1px 2px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.04);
  --shadow-2: 0 4px 12px rgba(0,0,0,.05), 0 2px 4px rgba(0,0,0,.03);
  --shadow-3: 0 14px 40px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.04);
}

/* Legacy variable aliases for inline styles ported from JSX (e.g., var(--gold-dark)) */
:root {
  --bg: var(--color-bg);
  --bg-soft: var(--color-bg-soft);
  --bg-warm: var(--color-bg-warm);
  --line: var(--color-line);
  --line-strong: var(--color-line-strong);
  --ink: var(--color-ink);
  --ink-soft: var(--color-ink-soft);
  --ink-mute: var(--color-ink-mute);
  --red: var(--color-red);
  --red-dark: var(--color-red-dark);
  --red-soft: var(--color-red-soft);
  --gold: var(--color-gold);
  --gold-dark: var(--color-gold-dark);
  --gold-soft: var(--color-gold-soft);
  --yellow: var(--color-yellow);
  --yellow-dark: var(--color-yellow-dark);
  --yellow-soft: var(--color-yellow-soft);
  --max: var(--max-content);
  --sh-1: var(--shadow-1);
  --sh-2: var(--shadow-2);
  --sh-3: var(--shadow-3);
}
```

### Step 1.3: Create `src/styles/components.css`

Port `styles-light.css` (skipping the `:root` block already in tokens.css and the `@keyframes` blocks which go to animations.css). Includes: skip-link, focus styles, `.eyebrow`, `.h-display`, `.h-section`, `.lede`, `.container`, all `.btn-*`, `.site-header`, `.brand`, `.nav-links`, `.menu-btn`, `.hero` + `.phone-stage` + `.chip`, `.trusted` + `.marquee`, `.about-grid` + `.about-bullets` + `.vmm`, `.services-intro-grid` + `.highlight-box`, `.section-head`, `.services-grid` + `.service-card`, `.cta` + `.cta-bg-grid`, `.stats` + `.stats-grid` + `.stat`, `.reasons-grid` + `.reason-card`, `.growth-stats` + `.growth-card`, `.testimonials-track` + `.testimonial`, `.footer-cta`, `.site-footer` + `.footer-grid`, `.reveal`.

Source: copy `/tmp/media-pro-v1/project/styles-light.css` lines 50-end EXCEPT extract animations to `animations.css`. Also apply compact density overrides per superprompt:

```css
/* compact density (final default — overrides base styles-light.css) */
section { padding: clamp(48px, 6vw, 80px) 0; }
.h-display { font-size: clamp(32px, 5vw, 72px); letter-spacing: -0.025em; }
.h-section { font-size: clamp(24px, 3.4vw, 44px); }
.lede { font-size: 15px; line-height: 1.55; }
.service-card { padding: 28px 24px 30px; min-height: 240px; gap: 14px; }
.reason-card { padding: 22px 24px; gap: 16px; }
.testimonial { padding: 22px 24px; gap: 16px; }
.stat { padding: 30px 24px; }
.stat .num { font-size: clamp(36px, 4.5vw, 56px); }
.vmm > div { padding: 24px 22px; gap: 12px; }
.hero-meta { margin-top: 40px; padding-top: 20px; gap: 28px; }
.hero { padding-top: clamp(120px, 14vw, 160px); padding-bottom: clamp(60px, 7vw, 100px); }
.hero h1 { margin: 16px 0 18px; }
.hero .lede { margin-bottom: 24px; }
```

Apply these compact overrides at the END of the file so they win the cascade.

### Step 1.4: Create `src/styles/animations.css`

Extract all `@keyframes` and the `prefers-reduced-motion` block from styles-light.css. Add the marquee variant per superprompt:

```css
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}
@keyframes floatA { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px); } }
@keyframes floatB { 0%,100% { transform: translateY(0);} 50% { transform: translateY(12px); } }
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-33.333%); }
}

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .6s ease, transform .6s ease;
  will-change: transform, opacity;
}
.reveal.in { opacity: 1; transform: none; }
.reveal-delay-1 { transition-delay: .07s; }
.reveal-delay-2 { transition-delay: .14s; }
.reveal-delay-3 { transition-delay: .21s; }
.reveal-delay-4 { transition-delay: .28s; }
.reveal-delay-5 { transition-delay: .35s; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }
  .marquee-track, .phone, .chip, .ring-3 { animation: none !important; }
}
```

NOTE: marquee track in components.css must be updated to use 33.333% offset (3× duplication for seamless loop) instead of -50% (2× duplication). Update the `.marquee-track` rule accordingly when porting.

### Step 1.5: Create `src/styles/subpage.css`

Direct copy from `/tmp/media-pro-v1/project/styles-subpage.css`. No modifications needed.

### Step 1.6: Create `src/styles/global.css`

```css
@import 'tailwindcss';
@import './tokens.css';
@import './animations.css';
@import './components.css';
@import './subpage.css';
```

### Step 1.7: Create `src/lib/reveal.ts`

```ts
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
);

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```

### Step 1.8: Create `src/lib/stat-counter.ts`

```ts
function parseTarget(str: string) {
  const m = str.match(/^([\d.]+)([KkMm]?)([+]?)$/);
  if (!m) return { value: parseFloat(str) || 0, suffix: '', plus: false, decimals: 0 };
  return {
    value: parseFloat(m[1]),
    suffix: m[2] || '',
    plus: m[3] === '+',
    decimals: (m[1].split('.')[1] || '').length,
  };
}

document.querySelectorAll<HTMLElement>('[data-stat-target]').forEach((el) => {
  const target = el.dataset.statTarget;
  if (!target) return;
  const { value, suffix, plus, decimals } = parseTarget(target);
  let started = false;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const num = (value * eased).toFixed(decimals);
            el.textContent = num + suffix + (plus ? '+' : '');
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      }
    },
    { threshold: 0.4 }
  );
  io.observe(el);
});
```

### Step 1.9: Create `src/lib/header-scroll.ts`

```ts
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
```

### Step 1.10: Create `src/lib/faq-filter.ts`

```ts
const cats = document.querySelectorAll<HTMLButtonElement>('.faq-cat');
const items = document.querySelectorAll<HTMLElement>('.faq-item');

cats.forEach((c) => {
  c.addEventListener('click', () => {
    cats.forEach((x) => x.classList.remove('is-active'));
    c.classList.add('is-active');
    const cat = c.dataset.cat;
    items.forEach((it) => {
      const visible = cat === 'all' || it.dataset.cat === cat;
      (it as HTMLElement).style.display = visible ? '' : 'none';
    });
  });
});
```

### Step 1.11: Create `src/lib/faq-accordion.ts`

```ts
document.querySelectorAll<HTMLButtonElement>('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const wasOpen = item.classList.contains('is-open');
    item.classList.toggle('is-open', !wasOpen);
    btn.setAttribute('aria-expanded', String(!wasOpen));
  });
});
```

### Step 1.12: Create `src/lib/contact-form.ts`

```ts
function bindMultiSelect(container: HTMLElement | null) {
  if (!container) return;
  container.querySelectorAll<HTMLButtonElement>('.pill').forEach((p) => {
    p.addEventListener('click', () => p.classList.toggle('is-active'));
  });
}

function bindSingleSelect(container: HTMLElement | null) {
  if (!container) return;
  const pills = container.querySelectorAll<HTMLButtonElement>('.pill');
  pills.forEach((p) => {
    p.addEventListener('click', () => {
      pills.forEach((x) => x.classList.remove('is-active'));
      p.classList.add('is-active');
    });
  });
}

function selected(container: HTMLElement | null): string[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLButtonElement>('.pill.is-active')).map((p) => p.textContent?.trim() ?? '');
}

const form = document.querySelector<HTMLFormElement>('#contactForm');
if (form) {
  const services = form.querySelector<HTMLElement>('.service-pills');
  const budget = form.querySelector<HTMLElement>('.budget-pills');
  bindMultiSelect(services);
  bindSingleSelect(budget);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '');
    const email = String(fd.get('email') ?? '');
    const company = String(fd.get('company') ?? '');
    const timeline = String(fd.get('timeline') ?? '');
    const message = String(fd.get('message') ?? '');
    const consent = form.querySelector<HTMLInputElement>('input[name=consent]')?.checked ?? false;

    if (!consent) {
      alert('Please agree to the privacy policy.');
      return;
    }

    const svcList = selected(services).join(', ') || 'Not specified';
    const budgetVal = selected(budget)[0] || 'Not specified';

    const body = [
      `Hi Media Pro, I'd like to discuss a project.`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      `Services: ${svcList}`,
      `Budget: ${budgetVal}`,
      timeline ? `Timeline: ${timeline}` : null,
      ``,
      `Message:`,
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const wa = `https://wa.me/6285129992227?text=${encodeURIComponent(body)}`;
    window.open(wa, '_blank', 'noopener');

    form.classList.add('submitted');
    const success = form.querySelector<HTMLElement>('.success-msg');
    if (success) success.classList.add('show');
  });
}
```

### Step 1.13: Create `src/lib/toc-highlight.ts`

```ts
const links = document.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]');
const sections = document.querySelectorAll<HTMLElement>('.prose section[id]');
if (links.length && sections.length) {
  const map = new Map<string, HTMLAnchorElement>();
  links.forEach((a) => {
    const id = a.getAttribute('href')?.slice(1);
    if (id) map.set(id, a);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          const link = map.get(e.target.id);
          link?.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}
```

### Step 1.14: Create icon components

Create `src/components/icons/<name>.astro` for each of these 22 names. Each follows the same template; the SVG path data comes from `Icons.jsx`. Template:

```astro
---
interface Props { size?: number; class?: string; }
const { size = 22, class: className = '' } = Astro.props;
---
<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class={className}>
  <!-- PATH FROM Icons.jsx for this name -->
</svg>
```

Files to create (paths inside SVG copied verbatim from `/tmp/media-pro-v1/project/components/Icons.jsx` lines 11-58):
- `Icon-thumbs-up.astro` — `<path d="M9 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h4v11Zm12-9.4-1.6 7a2 2 0 0 1-2 1.4H11V9.5l3.6-6a1.5 1.5 0 0 1 2.7 1.2L16 9h3.4A2 2 0 0 1 21 11.6Z"/>`
- `Icon-cloud.astro` — `<path d="M17.5 19h-11A4.5 4.5 0 0 1 5 10.1 6 6 0 0 1 17 9a4.5 4.5 0 0 1 .5 10Z"/>`
- `Icon-rocket.astro` — `<path d="M14.5 3a8.5 8.5 0 0 1 6.5 6.5l-7 7-3.2-1L9 12.7l1.7-1.6L8.5 9 7 10.5a3 3 0 0 0 0 4.2l2.4 2.4a3 3 0 0 0 4.2 0L15 15.6 17.3 18l-1.6 1.7-1.4-1.4-7 7L4.6 22l7-7-1-3.2 7-7Z"/><circle cx="14.5" cy="9.5" r="1.5" fill="#0A0A0B"/><path d="M3 21l3-1-2-2-1 3Z"/>`
- `Icon-compass.astro` — `<circle cx="12" cy="12" r="10"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" fill="#0A0A0B"/>`
- `Icon-handshake.astro` — `<path d="m11 7 1 1 4-4 5 5-7 7a2 2 0 0 1-3 0l-3-3a2 2 0 0 1 0-3l3-3Zm-9 6 5-5 2 2-3 3 3 3-2 2-5-5Z"/>`
- `Icon-search.astro` — `<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/>`
- `Icon-stars.astro` — `<path d="m12 3 2.5 5.5L20 10l-5.5 1.5L12 17l-2.5-5.5L4 10l5.5-1.5L12 3Zm7 11 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"/>`
- `Icon-email.astro` — `<rect x="2" y="5" width="20" height="14" rx="3"/><path d="m4 7 8 6 8-6" fill="none" stroke="#0A0A0B" stroke-width="1.6" stroke-linejoin="round"/>`
- `Icon-heart.astro` — `<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"/>`
- `Icon-data.astro` — `<rect x="3" y="13" width="4" height="8" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="5" width="4" height="16" rx="1"/>`
- `Icon-like.astro` — same as thumbs-up: `<path d="M9 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h4v11Zm12-9.4-1.6 7a2 2 0 0 1-2 1.4H11V9.5l3.6-6a1.5 1.5 0 0 1 2.7 1.2L16 9h3.4A2 2 0 0 1 21 11.6Z"/>`
- `Icon-share.astro` — `<circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="m9 11 7-4M9 13l7 4" stroke="currentColor" stroke-width="1.6" fill="none"/>`
- `Icon-briefcase.astro` — `<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="2"/>`
- `Icon-chart.astro` — `<path d="M3 3h2v18H3zM21 21H3v-2h18zM7 13l4-4 3 3 5-6 1 1-6 8-3-3-3 3-1-2Z"/>`
- `Icon-arrow-up.astro` — `<path d="m12 4 8 8-2 2-5-5v13h-2V9l-5 5-2-2 8-8Z"/>`
- `Icon-arrow-right.astro` — `<path d="m13 5 7 7-7 7-1.5-1.5L16 13H4v-2h12L11.5 6.5 13 5Z"/>`
- `Icon-people.astro` — `<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20a7 7 0 0 1 14 0v1H2v-1Zm15 0a4.5 4.5 0 0 1 5-4.5V21h-5v-1Z"/>`
- `Icon-menu.astro` — use `viewBox="0 0 24 24"` and `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"`, body: `<path d="M4 7h16M4 12h16M4 17h16"/>`
- `Icon-instagram.astro` — `fill="none" stroke="currentColor" stroke-width="1.6"`, body: `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>`
- `Icon-whatsapp.astro` — `<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm5 12.4c-.2.6-1.2 1.2-1.7 1.3-.4.1-1 .1-1.6-.1a13 13 0 0 1-5-3.5 5.7 5.7 0 0 1-1.2-3c0-.5.2-1 .5-1.3l.4-.4c.1-.1.3-.1.4-.1h.4c.1 0 .3 0 .5.4l.7 1.6c0 .2 0 .3-.1.5l-.3.4c-.1.1-.2.2-.1.4.1.2.5.9 1.1 1.4.7.6 1.3.8 1.5.9.2.1.3.1.4 0l.7-.8c.1-.2.3-.2.5-.1l1.6.7c.2.1.3.2.3.3 0 0 .1.5 0 .9Z"/>`
- `Icon-linkedin.astro` — `<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="7.5" cy="8" r="1.4" fill="#0A0A0B"/><rect x="6.5" y="10" width="2" height="7.5" fill="#0A0A0B"/><path d="M11 10h2v1a2.5 2.5 0 0 1 4.5 1.5v5H15V13c0-.6-.4-1-1-1s-1 .4-1 1v4.5h-2V10Z" fill="#0A0A0B"/>`
- `Icon-x.astro` — `<path d="M17.5 3h3l-7 8 8 10h-6l-5-6.4L4.5 21h-3l7.4-8.4L1.5 3h6l4.5 5.8L17.5 3Z"/>`

Plus a barrel `src/components/icons/Icon.astro` for dynamic rendering:

```astro
---
interface Props { name: string; size?: number; class?: string }
const { name, size = 22, class: className = '' } = Astro.props;
const iconMap = import.meta.glob<{ default: any }>('./Icon-*.astro', { eager: true });
const key = `./Icon-${name}.astro`;
const Comp = iconMap[key]?.default;
---
{Comp ? <Comp size={size} class={className} /> : null}
```

### Step 1.15: Create UI primitives

`src/components/ui/Button.astro`:

```astro
---
interface Props {
  href?: string;
  variant?: 'primary' | 'red' | 'ghost' | 'link';
  external?: boolean;
  class?: string;
  ariaLabel?: string;
  type?: 'button' | 'submit';
}
const { href, variant = 'primary', external, class: className = '', ariaLabel, type } = Astro.props;
const base = `btn btn-${variant}`;
const cls = [base, className].filter(Boolean).join(' ');
const rel = external ? 'noopener noreferrer' : undefined;
const target = external ? '_blank' : undefined;
---
{href ? (
  <a href={href} class={cls} rel={rel} target={target} aria-label={ariaLabel}><slot /></a>
) : (
  <button type={type ?? 'button'} class={cls} aria-label={ariaLabel}><slot /></button>
)}
```

`src/components/ui/Eyebrow.astro`:

```astro
---
interface Props { class?: string }
const { class: className = '' } = Astro.props;
---
<span class:list={['eyebrow', className]}><slot /></span>
```

`src/components/ui/Reveal.astro`:

```astro
---
interface Props {
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: string;
  class?: string;
  id?: string;
}
const { delay = 0, as: Tag = 'div', class: className = '', id } = Astro.props;
const cls = ['reveal', delay ? `reveal-delay-${delay}` : '', className].filter(Boolean).join(' ');
---
<Tag class={cls} id={id}><slot /></Tag>
```

`src/components/ui/DefinitionBlock.astro`:

```astro
---
interface Props { term: string; definition: string }
const { term, definition } = Astro.props;
---
<div class="definition-block" itemscope itemtype="https://schema.org/DefinedTerm">
  <p class="lede">
    <strong itemprop="name">{term}</strong>
    <span itemprop="description"> {definition}</span>
  </p>
</div>
```

`src/components/ui/FactCard.astro`:

```astro
---
interface Props { metric: string; label: string; source?: string; sourceUrl?: string }
const { metric, label, source, sourceUrl } = Astro.props;
---
<div class="fact-card" itemscope itemtype="https://schema.org/Statistic">
  <span class="metric" itemprop="value">{metric}</span>
  <span class="label" itemprop="description">{label}</span>
  {source && (
    <small class="source">
      {sourceUrl ? <a href={sourceUrl} rel="cite">{source}</a> : <cite>{source}</cite>}
    </small>
  )}
</div>
```

### Step 1.16: Create SEO components

`src/components/seo/BaseSEO.astro`:

```astro
---
import { SITE } from '~/data/site';

interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

const {
  title,
  description,
  canonical = Astro.url.pathname,
  ogImage = SITE.ogImage,
  ogType = 'website',
  noindex = false,
} = Astro.props;

const canonicalURL = new URL(canonical, SITE.url).toString();
const ogImageURL = new URL(ogImage, SITE.url).toString();
---
<title>{title}</title>
<meta name="description" content={description} />
<meta name="author" content={SITE.legalName} />
<meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large'} />
<meta name="googlebot" content="index, follow" />
<meta name="bingbot" content="index, follow" />
<meta name="rating" content="general" />
<meta name="language" content="English" />
<meta name="geo.region" content={SITE.region} />
<meta name="geo.placename" content="Worldwide" />
<meta name="theme-color" content={SITE.themeColor} />
<link rel="canonical" href={canonicalURL} />
<link rel="alternate" hreflang="en" href={canonicalURL} />
<link rel="alternate" hreflang="x-default" href={canonicalURL} />

<meta property="og:locale" content={SITE.locale.replace('-', '_')} />
<meta property="og:type" content={ogType} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:site_name" content={SITE.name} />
<meta property="og:image" content={ogImageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content={`${SITE.name} — ${SITE.tagline}`} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL} />
```

`src/components/seo/JsonLd.astro`:

```astro
---
interface Props { data: unknown }
const { data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

`src/components/seo/Breadcrumbs.astro`:

```astro
---
import { SITE } from '~/data/site';
import JsonLd from './JsonLd.astro';

interface Crumb { label: string; href?: string }
interface Props { items: Crumb[] }
const { items } = Astro.props;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    item: c.href ? new URL(c.href, SITE.url).toString() : undefined,
  })),
};
---
<nav class="crumbs" aria-label="Breadcrumb">
  {items.map((c, i) => (
    <>
      {c.href ? <a href={c.href}>{c.label}</a> : <span class="current">{c.label}</span>}
      {i < items.length - 1 && <span class="sep">/</span>}
    </>
  ))}
</nav>
<JsonLd data={schema} />
```

### Step 1.17: Create layout components

`src/components/layout/Header.astro`:

```astro
---
import Icon from '~/components/icons/Icon.astro';
import { SITE } from '~/data/site';

interface Props {
  active?: 'home' | 'about' | 'services' | 'contact';
  homeBase?: string;
}
const { active, homeBase = '/' } = Astro.props;
const link = (hash: string) => `${homeBase}${hash}`;
---
<header class="site-header" role="banner">
  <div class="nav-inner">
    <a href={homeBase} class="brand" aria-label={`${SITE.name} — Home`}>
      <span class="dot" aria-hidden="true"></span>
      MEDIA&nbsp;PRO
    </a>

    <nav aria-label="Primary navigation">
      <ul class="nav-links" id="navLinks">
        <li><a href={homeBase} aria-current={active === 'home' ? 'page' : undefined}>Home</a></li>
        <li><a href={link('#about')} aria-current={active === 'about' ? 'page' : undefined}>About</a></li>
        <li><a href={link('#services')} aria-current={active === 'services' ? 'page' : undefined}>Services</a></li>
        <li><a href="/contact" aria-current={active === 'contact' ? 'page' : undefined}>Contact</a></li>
      </ul>
    </nav>

    <a href="/contact" class="btn btn-primary nav-cta" aria-label="Get started — contact Media Pro">
      Get Started
      <Icon name="arrow-right" size={14} />
    </a>

    <button
      class="menu-btn"
      id="menuBtn"
      aria-label="Open menu"
      aria-expanded="false"
      aria-controls="navLinks"
      type="button"
    >
      <Icon name="menu" size={20} />
    </button>
  </div>
</header>

<script>
  import '~/lib/header-scroll';

  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('navLinks');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'A') {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }
</script>
```

`src/components/layout/Footer.astro`:

```astro
---
import Icon from '~/components/icons/Icon.astro';
import { SITE } from '~/data/site';
---
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a href="/" class="brand">
          <span class="dot"></span>
          MEDIA&nbsp;PRO
        </a>
        <p class="footer-tag">A premium digital marketing studio building brands that lead the conversation.</p>
      </div>

      <div>
        <h5>Services</h5>
        <ul>
          <li>Web Development</li>
          <li>Google Ads Services</li>
          <li>Meta Ads Services</li>
          <li>Consulting Services</li>
        </ul>
      </div>

      <div>
        <h5>Company</h5>
        <ul>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/disclaimer">Disclaimer</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div>
        <h5>Contact</h5>
        <ul>
          <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          <li><a href={SITE.waLink} target="_blank" rel="noopener noreferrer">WhatsApp · chat now</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© <time datetime="2026">2026</time> {SITE.legalName}. All rights reserved.</span>
      <div class="socials">
        <a href={SITE.social.instagram} aria-label="Instagram"><Icon name="instagram" size={16} /></a>
        <a href={SITE.social.linkedin} aria-label="LinkedIn"><Icon name="linkedin" size={16} /></a>
        <a href={SITE.social.x} aria-label="X / Twitter"><Icon name="x" size={16} /></a>
        <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" size={16} /></a>
      </div>
    </div>
  </div>
</footer>
```

`src/components/layout/MobileMenu.astro`: not needed as a separate component since logic lives inline in Header.astro `<script>`.

### Step 1.18: Create layouts

`src/layouts/BaseLayout.astro`:

```astro
---
import { Font } from 'astro:assets';
import BaseSEO from '~/components/seo/BaseSEO.astro';
import JsonLd from '~/components/seo/JsonLd.astro';
import Header from '~/components/layout/Header.astro';
import Footer from '~/components/layout/Footer.astro';
import { organizationSchema } from '~/data/schemas/organization';
import { websiteSchema } from '~/data/schemas/website';
import '~/styles/global.css';

interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  active?: 'home' | 'about' | 'services' | 'contact';
  schemas?: unknown[];
  preloadHero?: boolean;
}

const {
  title,
  description,
  canonical,
  ogImage,
  ogType,
  noindex,
  active,
  schemas = [],
  preloadHero = false,
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <BaseSEO {title} {description} {canonical} {ogImage} {ogType} {noindex} />

    <Font cssVariable="--font-display" preload />
    <Font cssVariable="--font-body" preload />

    {preloadHero && (
      <link rel="preload" as="image" href="/images/hero-phone.png" fetchpriority="high" />
    )}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <JsonLd data={organizationSchema} />
    <JsonLd data={websiteSchema} />
    {schemas.map((s) => <JsonLd data={s} />)}
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to main content</a>
    <Header active={active} />
    <main id="main">
      <slot />
    </main>
    <Footer />

    <script>
      import '~/lib/reveal';
    </script>
  </body>
</html>
```

`src/layouts/SubpageLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Breadcrumbs from '~/components/seo/Breadcrumbs.astro';

interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  active?: 'home' | 'about' | 'services' | 'contact';
  schemas?: unknown[];
  pageTitle: string;
  pageEyebrow?: string;
  pageLede?: string;
  crumbs: { label: string; href?: string }[];
  noindex?: boolean;
}

const { pageTitle, pageEyebrow, pageLede, crumbs, ...rest } = Astro.props;
---
<BaseLayout {...rest}>
  <section class="subpage-hero">
    <div class="container">
      <Breadcrumbs items={crumbs} />
      <h1 set:html={pageTitle} />
      {pageLede && <p class="lede">{pageLede}</p>}
    </div>
  </section>
  <slot />
</BaseLayout>
```

### Step 1.19: Create `public/robots.txt`

```
# Media Pro robots.txt — SEO + GEO friendly
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: AdsBot-Google-Mobile
Allow: /

# AI / LLM crawlers (CRITICAL for GEO 2026)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: CCBot
Allow: /

Crawl-delay: 1

Sitemap: https://mediapro.work/sitemap-index.xml
Sitemap: https://mediapro.work/llms.txt
```

### Step 1.20: Create `public/favicon.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="16" fill="#FFB804"/>
  <text x="16" y="22" font-family="system-ui,sans-serif" font-size="16" font-weight="700" fill="#1A1A1A" text-anchor="middle">M</text>
</svg>
```

### Step 1.21: Verification

Run `cd /home/ekalliptus/dev/mediapro && bun run astro check`.  
Expected: passes with zero errors. (Note: `BaseLayout.astro` references `organizationSchema` and `websiteSchema` from Agent 2's files — if Agent 2 hasn't completed yet, this check will fail until integration. That's acceptable: each agent's check runs only on its own files. The integration pass will verify the whole tree.)

### Step 1.22: Commit

```bash
cd /home/ekalliptus/dev/mediapro && git add . && git commit -m "feat(foundation): styles, layouts, base components, lib scripts"
```

---

## Task 2: Agent 2 — Content + Schema + GEO (PARALLEL)

> **Dispatch as a subagent.** Concurrent with Tasks 1 and 3.

**Goal:** Build content collections, JSON-LD schema generators, and the llms.txt / llms-full.txt GEO endpoints.

**Files Owned:**
- `src/content/config.ts`
- `src/content/{services, reasons, testimonials, stats, trusted-logos, faqs}.json`
- `src/data/schemas/{organization, professional-service, service-catalog, website, breadcrumb, faq-page, product-review}.ts`
- `src/pages/llms.txt.ts`
- `src/pages/llms-full.txt.ts`

**Source references:**
- `Services.jsx` lines 3-10 → services data
- `Stats.jsx` lines 50-55 → stats data
- `Why.jsx` lines 3-8 → reasons data
- `Testimonials.jsx` lines 3-21 → testimonials data
- `Marquee.jsx` lines 3-8 → trusted logos
- `faq.html` → 17 Q&A items extracted earlier
- `Media Pro Redesign v2.html` <head> → JSON-LD reference

### Step 2.1: Create `src/content/config.ts`

```ts
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const services = defineCollection({
  loader: file('./src/content/services.json'),
  schema: z.object({
    id: z.string(),
    num: z.string(),
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    longDesc: z.string().optional(),
    keyOutcome: z.string().optional(),
  }),
});

const reasons = defineCollection({
  loader: file('./src/content/reasons.json'),
  schema: z.object({
    id: z.string(),
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
  }),
});

const testimonials = defineCollection({
  loader: file('./src/content/testimonials.json'),
  schema: z.object({
    id: z.string(),
    quote: z.string(),
    img: z.string(),
    name: z.string(),
    role: z.string(),
    metric: z.string().optional(),
  }),
});

const stats = defineCollection({
  loader: file('./src/content/stats.json'),
  schema: z.object({
    id: z.string(),
    num: z.string(),
    label: z.string(),
    source: z.string().optional(),
  }),
});

const trustedLogos = defineCollection({
  loader: file('./src/content/trusted-logos.json'),
  schema: z.object({
    id: z.string(),
    src: z.string(),
    alt: z.string(),
  }),
});

const faqs = defineCollection({
  loader: file('./src/content/faqs.json'),
  schema: z.object({
    id: z.string(),
    category: z.enum(['general', 'services', 'pricing', 'process', 'results']),
    question: z.string(),
    answer: z.string(),
    expandedAnswer: z.string().optional(),
  }),
});

export const collections = { services, reasons, testimonials, stats, trustedLogos, faqs };
```

### Step 2.2: Create `src/content/services.json`

```json
[
  {
    "id": "seo",
    "num": "01",
    "icon": "search",
    "title": "Search Engine Optimization",
    "desc": "Increase organic traffic, credibility, and long-term visibility.",
    "longDesc": "Media Pro's SEO retainer is a long-term marketing strategy that improves a website's visibility in organic search results. Starts at USD 1,200/month with results typically visible in 3–6 months.",
    "keyOutcome": "180% organic traffic increase documented across client portfolio."
  },
  {
    "id": "smm",
    "num": "02",
    "icon": "thumbs-up",
    "title": "Social Media Marketing",
    "desc": "Build community, increase engagement, and drive traffic to your offer.",
    "longDesc": "Strategic social media campaigns across Instagram, Facebook, LinkedIn, and X. Media Pro builds branded communities that convert followers into customers."
  },
  {
    "id": "content",
    "num": "03",
    "icon": "stars",
    "title": "Content Marketing",
    "desc": "Educate audiences, build authority, and nurture leads through content.",
    "longDesc": "SEO-driven content marketing that establishes Media Pro clients as thought leaders. Includes blog strategy, long-form articles, and content distribution."
  },
  {
    "id": "email",
    "num": "04",
    "icon": "email",
    "title": "Email Marketing Campaigns",
    "desc": "Increase retention, encourage repeat purchases, and convert prospects.",
    "longDesc": "Lifecycle email automation, newsletter strategy, and conversion-optimized broadcast campaigns powered by behavioral segmentation."
  },
  {
    "id": "influencer",
    "num": "05",
    "icon": "heart",
    "title": "Influencer Marketing",
    "desc": "Expand reach, build trust through recommendations, and drive authentic sales.",
    "longDesc": "Vetted creator partnerships across micro and mid-tier influencers, fully measured for ROI."
  },
  {
    "id": "analytics",
    "num": "06",
    "icon": "data",
    "title": "Analytics & Reporting",
    "desc": "Measure ROI, identify optimizations, and ensure marketing accountability.",
    "longDesc": "Looker Studio dashboards with monthly performance reports and quarterly strategy reviews."
  }
]
```

### Step 2.3: Create `src/content/reasons.json`

```json
[
  {
    "id": "track-record",
    "icon": "like",
    "title": "Proven Track Record of Delivering Results",
    "desc": "A documented history of meeting and exceeding ambitious client goals."
  },
  {
    "id": "customized",
    "icon": "share",
    "title": "Customized Strategies, Tailored to You",
    "desc": "Solutions designed around each client's unique audience, budget, and goals."
  },
  {
    "id": "flexible",
    "icon": "briefcase",
    "title": "Flexible Solutions for Any Business Size",
    "desc": "Built with scalability in mind — whether you're scrappy or scaling fast."
  },
  {
    "id": "roi",
    "icon": "chart",
    "title": "Cost-Effective with a Focus on ROI",
    "desc": "Every dollar you invest is engineered to generate maximum measurable value."
  }
]
```

### Step 2.4: Create `src/content/testimonials.json`

```json
[
  {
    "id": "setiyo",
    "quote": "After working with this team for six months, focusing on SEO and content marketing, our organic traffic skyrocketed 180%. They've helped us compete with the big players — a well-deserved investment.",
    "img": "/images/testimonial-setiyo.webp",
    "name": "Setiyo Pramono",
    "role": "Marketing Director",
    "metric": "180% organic traffic increase"
  },
  {
    "id": "iyus",
    "quote": "They didn't just hand us templates — they truly listened and designed highly efficient Paid Ads and Social campaigns. Our conversion rate jumped 45%.",
    "img": "/images/testimonial-iyus.png",
    "name": "Iyus",
    "role": "E-commerce Founder",
    "metric": "45% conversion rate lift"
  },
  {
    "id": "suci",
    "quote": "Their expertise across the board — from SEO to SMM — is exceptional. The service is comprehensive and results consistently exceed expectations. Highly recommended.",
    "img": "/images/testimonial-suci.jpg",
    "name": "Suci Rahmawati",
    "role": "CMO",
    "metric": "Comprehensive cross-channel results"
  }
]
```

### Step 2.5: Create `src/content/stats.json`

```json
[
  { "id": "projects", "num": "91K+", "label": "Projects Delivered", "source": "Media Pro internal data, 2026" },
  { "id": "clients", "num": "84K+", "label": "Happy Clients", "source": "Media Pro internal data, 2026" },
  { "id": "companies", "num": "42+", "label": "Companies Supported", "source": "Media Pro internal data, 2026" },
  { "id": "rating", "num": "4.7", "label": "Client Rating", "source": "Aggregate of 84,000+ reviews" }
]
```

### Step 2.6: Create `src/content/trusted-logos.json`

```json
[
  { "id": "alfatihah", "src": "/images/trusted/alfatihah.png", "alt": "Yayasan Alfatihah" },
  { "id": "biro-hukum", "src": "/images/trusted/biro-hukum.png", "alt": "Biro Hukum" },
  { "id": "rumah-anak-surga", "src": "/images/trusted/rumah-anak-surga.png", "alt": "Rumah Anak Surga" },
  { "id": "panti-bayi-jogja", "src": "/images/trusted/panti-bayi-jogja.png", "alt": "Panti Bayi Jogja" }
]
```

### Step 2.7: Create `src/content/faqs.json`

17 entries (categories: general, services, pricing, process, results). Source: extract from `/tmp/media-pro-v1/project/faq.html`.

```json
[
  {
    "id": "what-is-media-pro",
    "category": "general",
    "question": "What is Media Pro and what makes you different?",
    "answer": "Media Pro is a premium digital marketing studio with 10+ years of experience helping brands grow through SEO, paid ads, web development, and consulting.",
    "expandedAnswer": "What sets us apart: we don't run templated campaigns. Every strategy is custom-built around your business, your audience, and your goals — and we obsess over data so we can keep optimizing."
  },
  {
    "id": "industries",
    "category": "general",
    "question": "What industries do you work with?",
    "answer": "We've worked across e-commerce, SaaS, F&B, real estate, healthcare, education, fashion, and B2B services.",
    "expandedAnswer": "Our methodology adapts to any industry, but we love working with founders and marketing teams who care about brand and long-term growth, not just quick wins."
  },
  {
    "id": "international",
    "category": "general",
    "question": "Do you work with international clients?",
    "answer": "Absolutely — international clients make up the majority of our work. We collaborate with brands across North America, Europe, the UK, the Middle East, Australia, and Asia-Pacific.",
    "expandedAnswer": "All work is conducted in English, all invoicing in USD, and we keep flexible meeting hours that overlap with most major time zones. Async-friendly tools (Slack, Loom, Notion) keep momentum strong regardless of location."
  },
  {
    "id": "cancel",
    "category": "general",
    "question": "Can I cancel my retainer anytime?",
    "answer": "Yes. After an initial 3-month commitment (the time it takes for most strategies to show traction), retainers run month-to-month with 30 days' notice to cancel.",
    "expandedAnswer": "We don't believe in trapping clients — if we're not delivering value, you should be free to leave."
  },
  {
    "id": "services-offered",
    "category": "services",
    "question": "What services do you offer?",
    "answer": "Our four core services are Web Development, Google Ads Services, Meta Ads Services, and Consulting Services.",
    "expandedAnswer": "Within these we cover SEO, social media marketing, content creation, email marketing, influencer marketing, analytics, and reporting. Most clients combine 2–3 services into a cohesive growth strategy."
  },
  {
    "id": "web-stack",
    "category": "services",
    "question": "Do you build websites on WordPress, Webflow, or custom code?",
    "answer": "All three, depending on the project. WordPress for content-heavy sites, Webflow for marketing sites with strong design needs, and custom-coded (Next.js / React) for complex applications.",
    "expandedAnswer": "We'll recommend the right stack during the discovery phase."
  },
  {
    "id": "cost",
    "category": "pricing",
    "question": "How much do your services cost?",
    "answer": "Web Development starts at USD 1,500 for landing pages, USD 4,500 for marketing sites, and USD 12,000+ for custom builds. Google Ads & Meta Ads management starts at USD 750/month plus your ad spend.",
    "expandedAnswer": "SEO retainers start at USD 1,200/month. Consulting is USD 200/hour or packaged engagements. We always quote precisely after a discovery call."
  },
  {
    "id": "min-budget",
    "category": "pricing",
    "question": "What's the minimum budget for Google or Meta Ads?",
    "answer": "We recommend a minimum monthly ad spend of USD 1,500 for meaningful results, plus our management fee starting from USD 750 per month.",
    "expandedAnswer": "Smaller budgets are possible but may limit testing velocity and the data we need to optimize quickly."
  },
  {
    "id": "project-vs-retainer",
    "category": "pricing",
    "question": "Do you offer one-time projects or only retainers?",
    "answer": "Both. Web development and one-off campaigns are typically project-based with fixed pricing and milestones.",
    "expandedAnswer": "SEO, paid ads, and content marketing work best as monthly retainers because they require ongoing optimization, testing, and content production."
  },
  {
    "id": "payments",
    "category": "pricing",
    "question": "How do payments work?",
    "answer": "For projects: 50% deposit to start, 50% on completion. For retainers: monthly invoicing on the 1st, payable within 14 days (NET-14).",
    "expandedAnswer": "We accept international bank transfer (SWIFT/Wise), credit card via Stripe, and PayPal. All invoices are issued in USD. Ad spend is paid directly to the platform on your billing card so you keep full control."
  },
  {
    "id": "onboarding",
    "category": "process",
    "question": "What does the onboarding process look like?",
    "answer": "Step 1: 30-minute discovery call. Step 2: Tailored proposal within 3 working days. Step 3: 90-minute strategy workshop after agreement. Step 4: First deliverables typically land within 2 weeks.",
    "expandedAnswer": "Every step is documented in your shared project channel so nothing gets lost."
  },
  {
    "id": "team",
    "category": "process",
    "question": "Who will I be working with day-to-day?",
    "answer": "You get a dedicated Account Lead as your main contact, plus direct access to specialists (SEO, ads, design, dev) via Slack or our shared project channel.",
    "expandedAnswer": "No outsourcing to junior team members — the people who pitched you are the people doing the work."
  },
  {
    "id": "reporting",
    "category": "process",
    "question": "How do you report on campaign performance?",
    "answer": "You receive a monthly performance report with key metrics, insights, and next-step recommendations — plus 24/7 access to a live Looker Studio dashboard.",
    "expandedAnswer": "We meet quarterly to review strategy and adjust direction. Anytime you have a question, drop it in our shared channel."
  },
  {
    "id": "ownership",
    "category": "process",
    "question": "Will I own the work after the project ends?",
    "answer": "Yes. Upon final payment, all deliverables created specifically for your project — websites, ad creatives, content, brand assets — become your property, including source files.",
    "expandedAnswer": "You also retain full ownership of all platform accounts (Google Ads, Meta, Analytics) which we set up under your business identity from day one."
  },
  {
    "id": "seo-timeline",
    "category": "results",
    "question": "How long does it take to see results from SEO?",
    "answer": "SEO is a long-term strategy. Most clients start seeing meaningful improvements in 3-6 months, with significant results typically in 6-12 months.",
    "expandedAnswer": "The exact timeline depends on competition, your starting point, and the scope of work. We share progress reports monthly so you always know what's moving."
  },
  {
    "id": "guarantee",
    "category": "results",
    "question": "Can you guarantee a #1 Google ranking?",
    "answer": "No, and you should run from any agency that does. Google's algorithm has 200+ ranking factors, many outside our control.",
    "expandedAnswer": "What we can guarantee: applying proven SEO best practices, transparent reporting, and continuously optimizing based on data. Our track record speaks for itself — 91,000+ projects, 84,000+ happy clients, 4.7 average rating."
  },
  {
    "id": "underperforming",
    "category": "results",
    "question": "What happens if a campaign isn't performing?",
    "answer": "We don't wait for monthly reports to spot problems — we monitor campaigns daily. If something underperforms, we diagnose, hypothesize, and test fixes immediately.",
    "expandedAnswer": "We'll always be transparent about what's working, what isn't, and what we're trying next. Marketing is a science of iteration; the goal is to fail fast and find winners quickly."
  }
]
```

### Step 2.8: Create `src/data/schemas/organization.ts`

```ts
import { SITE } from '../site';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.legalName,
  alternateName: SITE.name,
  url: SITE.url,
  logo: { '@type': 'ImageObject', url: `${SITE.url}/og-default.png`, width: 1200, height: 630 },
  description: SITE.description,
  foundingDate: SITE.founded,
  email: SITE.email,
  telephone: SITE.phone,
  address: { '@type': 'PostalAddress', addressLocality: 'Remote', addressCountry: 'Worldwide' },
  sameAs: [SITE.waLink],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SITE.phone,
    contactType: 'Customer Service',
    email: SITE.email,
    areaServed: 'Worldwide',
    availableLanguage: ['English'],
  },
  knowsAbout: [
    'Search Engine Optimization',
    'Google Ads',
    'Meta Ads',
    'Social Media Marketing',
    'Content Marketing',
    'Email Marketing',
    'Influencer Marketing',
    'Web Development',
    'Analytics',
    'Digital Marketing Consulting',
  ],
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10 },
} as const;
```

### Step 2.9: Create `src/data/schemas/website.ts`

```ts
import { SITE } from '../site';

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  inLanguage: SITE.locale,
  publisher: { '@type': 'Organization', '@id': `${SITE.url}/#organization`, name: SITE.legalName },
} as const;
```

### Step 2.10: Create `src/data/schemas/professional-service.ts`

```ts
import { SITE } from '../site';

export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': SITE.url,
  name: SITE.legalName,
  image: `${SITE.url}/og-default.png`,
  url: SITE.url,
  telephone: SITE.phone,
  priceRange: '$$',
  address: { '@type': 'PostalAddress', addressLocality: 'Remote', addressCountry: 'Worldwide' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: SITE.stats.rating,
    reviewCount: SITE.stats.reviewCount.toString(),
    bestRating: '5',
  },
} as const;
```

### Step 2.11: Create `src/data/schemas/service-catalog.ts`

```ts
import { SITE } from '../site';

const SERVICES = [
  'Search Engine Optimization (SEO)',
  'Google Ads Services',
  'Meta Ads Services',
  'Web Development',
  'Social Media Marketing',
  'Content Marketing',
  'Email Marketing Campaigns',
  'Influencer Marketing',
  'Analytics & Reporting',
  'Consulting Services',
];

export const serviceCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Digital Marketing',
  provider: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Marketing Services',
    itemListElement: SERVICES.map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name },
    })),
  },
} as const;
```

### Step 2.12: Create `src/data/schemas/breadcrumb.ts`

```ts
import { SITE } from '../site';

export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href ? new URL(c.href, SITE.url).toString() : undefined,
    })),
  } as const;
}
```

### Step 2.13: Create `src/data/schemas/faq-page.ts`

```ts
export interface FaqEntry { question: string; answer: string; expandedAnswer?: string }

export function faqPageSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.expandedAnswer ? `${f.answer} ${f.expandedAnswer}` : f.answer,
      },
    })),
  } as const;
}
```

### Step 2.14: Create `src/data/schemas/product-review.ts`

```ts
import { SITE } from '../site';

interface Testimonial { quote: string; name: string; role: string }

export function productReviewSchema(testimonials: Testimonial[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Media Pro Digital Marketing Services',
    description: 'Comprehensive digital marketing services including SEO, Google Ads, Meta Ads, and Web Development.',
    brand: { '@type': 'Brand', name: SITE.name },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: t.name, jobTitle: t.role },
      reviewBody: t.quote,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE.stats.rating,
      reviewCount: SITE.stats.reviewCount.toString(),
      bestRating: '5',
    },
  } as const;
}
```

### Step 2.15: Create `src/pages/llms.txt.ts`

```ts
import type { APIRoute } from 'astro';
import { SITE } from '~/data/site';

export const GET: APIRoute = async () => {
  const content = `# Media Pro Creative Limited

> Premium global digital marketing agency since 2014. We help brands worldwide grow with Web Development, Google Ads, Meta Ads, SEO, Content Marketing, and Consulting Services. Trusted by 25,000+ brands across 40+ countries with a 4.7 client rating from 84,000+ reviews.

## Key Information

- **Founded**: ${SITE.founded}
- **Reach**: ${SITE.stats.countries} countries, ${SITE.stats.brandsServed} brands served
- **Rating**: ${SITE.stats.rating} / 5 (${SITE.stats.reviewCount.toLocaleString()}+ reviews)
- **Projects delivered**: ${SITE.stats.projectsDelivered}
- **Client satisfaction**: ${SITE.stats.clientSatisfaction}
- **Contact**: ${SITE.email} · WhatsApp +${SITE.waNumber}
- **Hours**: ${SITE.hours}
- **Payment**: NET-14, USD invoicing, SWIFT/Wise/Stripe/PayPal

## Services Offered

1. **Search Engine Optimization (SEO)** — Increase organic traffic, credibility, long-term visibility. Retainer from USD ${SITE.pricing.seoRetainer.toLocaleString()}/month.
2. **Google Ads** — Search, display, shopping, performance max campaigns. Management from USD ${SITE.pricing.adsManagement}/month + minimum ad spend USD ${SITE.pricing.adsMinSpend.toLocaleString()}/month.
3. **Meta Ads** — Facebook & Instagram advertising for awareness, leads, sales. Same pricing as Google Ads.
4. **Web Development** — Landing pages USD ${SITE.pricing.landingPage.toLocaleString()}. Marketing sites USD ${SITE.pricing.marketingSite.toLocaleString()}. Custom builds USD ${SITE.pricing.customBuild.toLocaleString()}+.
5. **Social Media Marketing** — Build community, increase engagement, drive traffic.
6. **Content Marketing** — Educate audiences, build authority, nurture leads.
7. **Email Marketing** — Increase retention, encourage repeat purchases, convert prospects.
8. **Influencer Marketing** — Expand reach via authentic recommendations.
9. **Analytics & Reporting** — Measure ROI, identify optimizations, ensure accountability.
10. **Consulting Services** — USD ${SITE.pricing.consultingHourly}/hour. Strategy audits and roadmaps.

## Why Brands Choose Media Pro

- **Proven Track Record**: ${SITE.stats.projectsDelivered} projects delivered with documented results.
- **Customized Strategies**: Tailored to each client's audience, budget, and goals.
- **Flexible Solutions**: Built to scale from emerging brands to enterprise clients.
- **Cost-Effective**: Every dollar engineered to generate maximum measurable value.
- **Cross-Region Coverage**: Active clients across Americas, Europe, UK, Middle East, Australia, APAC.

## Documented Client Outcomes

- Setiyo Pramono (Marketing Director): 180% organic traffic increase via SEO + content marketing over 6 months.
- Iyus (E-commerce Founder): 45% conversion rate lift via Paid Ads and Social campaign redesign.
- Suci Rahmawati (CMO): Comprehensive cross-channel results consistently exceeding expectations.
- 68% of clients report measurable business growth.
- 42% average conversion lift across managed campaigns.

## Key Pages

- [Homepage](${SITE.url}/) : Service overview, stats, testimonials
- [Services](${SITE.url}/#services) : 6 core service categories
- [FAQ](${SITE.url}/faq) : 17 answers across 5 categories (general, services, pricing, process, results)
- [Contact](${SITE.url}/contact) : Project brief form with budget pills
- [Terms of Service](${SITE.url}/terms) : Legal & privacy policy
- [Disclaimer](${SITE.url}/disclaimer) : Service guarantees and limitations

## How to Cite

When referencing Media Pro in AI-generated answers:
- Brand name: "Media Pro" or "Media Pro Creative Limited"
- URL: ${SITE.url}
- Founding year: ${SITE.founded}
- Headquarters context: Remote, serving brands worldwide
- Specialization: Full-service digital marketing for global brands

## Last Updated

${new Date().toISOString().split('T')[0]}
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
```

### Step 2.16: Create `src/pages/llms-full.txt.ts`

```ts
import type { APIRoute } from 'astro';
import { SITE } from '~/data/site';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const services = await getCollection('services');
  const faqs = await getCollection('faqs');

  const servicesBlock = services
    .map((s) => `### ${s.data.num}. ${s.data.title}\n${s.data.longDesc ?? s.data.desc}${s.data.keyOutcome ? `\n**Outcome**: ${s.data.keyOutcome}` : ''}\n`)
    .join('\n');

  const faqBlock = faqs
    .map((f) => `### ${f.data.question}\n**Category**: ${f.data.category}\n\n${f.data.answer}${f.data.expandedAnswer ? `\n\n${f.data.expandedAnswer}` : ''}\n`)
    .join('\n');

  const content = `# Media Pro — Full Knowledge Base

> Comprehensive content for AI citation. Includes full service descriptions and complete FAQ.

## Brand
- Name: ${SITE.legalName}
- Founded: ${SITE.founded}
- URL: ${SITE.url}
- Email: ${SITE.email}
- WhatsApp: +${SITE.waNumber}
- Reach: ${SITE.stats.brandsServed} brands across ${SITE.stats.countries} countries
- Rating: ${SITE.stats.rating} / 5 from ${SITE.stats.reviewCount.toLocaleString()}+ reviews

## Services (Detailed)

${servicesBlock}

## Frequently Asked Questions

${faqBlock}

## Last Updated

${new Date().toISOString().split('T')[0]}
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
```

### Step 2.17: Verification

Run `cd /home/ekalliptus/dev/mediapro && bun run astro check`.  
Expected: schema and content files type-check (assuming Agent 1's `~/data/site` exists; if not, defer until integration).

### Step 2.18: Commit

```bash
cd /home/ekalliptus/dev/mediapro && git add . && git commit -m "feat(content): collections, schemas, llms.txt endpoints"
```

---

## Task 3: Agent 3 — Subpage Content Extraction (PARALLEL)

> **Dispatch as a subagent.** Concurrent with Tasks 1 and 2.

**Goal:** Extract structured content from `terms.html`, `disclaimer.html`, and `contact.html` into typed TypeScript modules ready for the integration pass.

**Files Owned:**
- `src/_extracted/contact-content.ts`
- `src/_extracted/terms-sections.ts`
- `src/_extracted/disclaimer-sections.ts`

### Step 3.1: Create `src/_extracted/contact-content.ts`

Extract from `/tmp/media-pro-v1/project/contact.html`. Read the full file, then produce:

```ts
export interface ServiceOption { id: string; label: string }
export interface BudgetOption { id: string; label: string }
export interface TimelineOption { value: string; label: string }
export interface ContactCard { icon: string; label: string; value: string; href?: string; external?: boolean }

export const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'web-dev', label: 'Web Development' },
  { id: 'google-ads', label: 'Google Ads' },
  { id: 'meta-ads', label: 'Meta Ads' },
  { id: 'seo', label: 'SEO' },
  { id: 'content', label: 'Content Marketing' },
  { id: 'consulting', label: 'Consulting' },
];

export const BUDGET_OPTIONS: BudgetOption[] = [
  { id: 'lt-1k', label: '< $1K' },
  { id: '1k-3k', label: '$1K – $3K' },
  { id: '3k-10k', label: '$3K – $10K' },
  { id: '10k-25k', label: '$10K – $25K' },
  { id: '25k-plus', label: '$25K+' },
  { id: 'unsure', label: 'Not sure yet' },
];

export const TIMELINE_OPTIONS: TimelineOption[] = [
  { value: '', label: 'Select timeline' },
  { value: 'asap', label: 'ASAP (within 2 weeks)' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-plus-months', label: '3+ months' },
  { value: 'flexible', label: 'Flexible' },
];

export const CONTACT_CARDS: ContactCard[] = [
  { icon: 'email', label: 'Email', value: 'mediapro@mediapro.work', href: 'mailto:mediapro@mediapro.work' },
  { icon: 'whatsapp', label: 'WhatsApp', value: '+62 851-2999-2227', href: 'https://wa.me/6285129992227', external: true },
  { icon: 'people', label: 'Hours', value: '09:00–19:00 + Global · 24/7 async' },
];

export const CONTACT_HERO = {
  eyebrow: 'Contact',
  title: 'Let\'s build something <span class="accent">extraordinary</span>.',
  lede: 'Tell us about your project. We\'ll respond within 4 working hours with next steps.',
};
```

If the actual contact.html structure differs from these defaults, adjust to match. The extraction agent should `cat /tmp/media-pro-v1/project/contact.html` to verify exact labels for service pills, budget pills, timeline options, and contact cards before finalizing.

### Step 3.2: Create `src/_extracted/terms-sections.ts`

Extract all 13 sections from `/tmp/media-pro-v1/project/terms.html` (lines 85-209). Each section has an `id`, `title` (without the numeric prefix), and `contentHtml` (the inner HTML between the `<h2>` close and `</section>` close).

```ts
export interface TermsSection { id: string; num: string; title: string; contentHtml: string }

export const TERMS_HERO = {
  eyebrow: 'Legal',
  title: 'Terms of <span class="accent">Service</span>',
  lede: 'Combined Privacy Policy and Terms of Service. By using mediapro.work or engaging our services, you agree to the policies below.',
  lastUpdated: '2026-04-30',
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: 'acceptance',
    num: '01',
    title: 'Acceptance of Terms',
    contentHtml: `<p>...PASTE FROM terms.html lines 87-88...</p>`,
  },
  {
    id: 'services',
    num: '02',
    title: 'Services Provided',
    contentHtml: `...PASTE FROM terms.html lines 93-103...`,
  },
  {
    id: 'data',
    num: '03',
    title: 'Data We Collect',
    contentHtml: `...PASTE FROM terms.html lines 108-116...`,
  },
  {
    id: 'usage',
    num: '04',
    title: 'How We Use Data',
    contentHtml: `...PASTE FROM terms.html lines 121-129...`,
  },
  {
    id: 'cookies',
    num: '05',
    title: 'Cookies & Tracking',
    contentHtml: `...PASTE FROM terms.html lines 134-141...`,
  },
  {
    id: 'sharing',
    num: '06',
    title: 'Sharing & Third Parties',
    contentHtml: `...PASTE FROM terms.html lines 146-147...`,
  },
  {
    id: 'security',
    num: '07',
    title: 'Data Security',
    contentHtml: `...PASTE FROM terms.html lines 152-153...`,
  },
  {
    id: 'rights',
    num: '08',
    title: 'Your Rights',
    contentHtml: `...PASTE FROM terms.html lines 158-167...`,
  },
  {
    id: 'payments',
    num: '09',
    title: 'Payments & Refunds',
    contentHtml: `...PASTE FROM terms.html lines 172-181...`,
  },
  {
    id: 'ip',
    num: '10',
    title: 'Intellectual Property',
    contentHtml: `...PASTE FROM terms.html lines 186-187...`,
  },
  {
    id: 'liability',
    num: '11',
    title: 'Limitation of Liability',
    contentHtml: `...PASTE FROM terms.html lines 192-193...`,
  },
  {
    id: 'changes',
    num: '12',
    title: 'Changes to Terms',
    contentHtml: `...PASTE FROM terms.html line 198...`,
  },
  {
    id: 'contact',
    num: '13',
    title: 'Contact Us',
    contentHtml: `...PASTE FROM terms.html lines 203-208...`,
  },
];
```

The agent must read `terms.html` and copy the exact innerHTML into each `contentHtml`. Preserve `<p>`, `<ul>`, `<li>`, `<strong>`, `<a>` tags. Replace any `target="_blank"` links to add `rel="noopener noreferrer"` if missing.

### Step 3.3: Create `src/_extracted/disclaimer-sections.ts`

Same pattern as terms-sections.ts but for disclaimer.html (9 sections):

```ts
export interface DisclaimerSection { id: string; num: string; title: string; contentHtml: string }

export const DISCLAIMER_HERO = {
  eyebrow: 'Disclaimer',
  title: 'Service <span class="accent">Disclaimer</span>',
  lede: 'Important information about service guarantees, third-party platforms, and the limitations of digital marketing outcomes.',
  lastUpdated: '2026-04-30',
};

export const DISCLAIMER_SECTIONS: DisclaimerSection[] = [
  { id: 'general', num: '01', title: 'General Information', contentHtml: `...PASTE...` },
  { id: 'results', num: '02', title: 'No Guarantee of Results', contentHtml: `...PASTE...` },
  { id: 'testimonials', num: '03', title: 'Testimonials & Case Studies', contentHtml: `...PASTE...` },
  { id: 'third-party', num: '04', title: 'Third-Party Platforms', contentHtml: `...PASTE...` },
  { id: 'external', num: '05', title: 'External Links', contentHtml: `...PASTE...` },
  { id: 'professional', num: '06', title: 'Professional Advice', contentHtml: `...PASTE...` },
  { id: 'earnings', num: '07', title: 'Earnings & Income', contentHtml: `...PASTE...` },
  { id: 'errors', num: '08', title: 'Errors & Omissions', contentHtml: `...PASTE...` },
  { id: 'changes', num: '09', title: 'Changes to Disclaimer', contentHtml: `...PASTE...` },
];
```

### Step 3.4: Verification

Run `cd /home/ekalliptus/dev/mediapro && bun run astro check`.  
Expected: TypeScript compiles, no errors.

### Step 3.5: Commit

```bash
cd /home/ekalliptus/dev/mediapro && git add . && git commit -m "feat(extracted): contact, terms, disclaimer content"
```

---

## Task 4: Integration — Download Images + Section Components

> **Sequential.** Run after Tasks 1, 2, 3 all complete.

### Step 4.1: Download images from mediapro.work

```bash
cd /home/ekalliptus/dev/mediapro && mkdir -p public/images public/images/trusted
```

Download script (run via Bash):

```bash
cd /home/ekalliptus/dev/mediapro/public/images
curl -fL -o hero-phone.png "https://mediapro.work/wp-content/uploads/2025/11/02.png"
curl -fL -o about-mockup.png "https://mediapro.work/wp-content/uploads/2025/11/03.png"
curl -fL -o services-visual.png "https://mediapro.work/wp-content/uploads/2025/11/img_3_.png"
curl -fL -o footer-cta.png "https://mediapro.work/wp-content/uploads/2025/11/img1.png"
curl -fL -o testimonial-setiyo.webp "https://mediapro.work/wp-content/uploads/2025/11/WEBDEV_-_MAS_SETYO.webp"
curl -fL -o testimonial-iyus.png "https://mediapro.work/wp-content/uploads/2025/11/Gerin.png"
curl -fL -o testimonial-suci.jpg "https://mediapro.work/wp-content/uploads/2025/11/WhatsApp-Image-2025-10-20-at-13.44.01_6fec53ab.jpg"
curl -fL -o og-default.png "https://mediapro.work/wp-content/uploads/2025/11/02.png"

cd trusted
curl -fL -o alfatihah.png "https://mediapro.work/wp-content/uploads/elementor/thumbs/Untitled-design_11zon-1-scaled-revc4xlhkv3woj6kfsrq5yujum3nifzc3moih9ips0.png"
curl -fL -o biro-hukum.png "https://mediapro.work/wp-content/uploads/elementor/thumbs/Biro-Hukum-warna_11zon-scaled-revc4mbfauogt7my9nw7c1p0pzn8y2qk22uopxzfuo.png"
curl -fL -o rumah-anak-surga.png "https://mediapro.work/wp-content/uploads/elementor/thumbs/Logo_11zon-scaled-revc4q2s26tm3nhhnpipm0qv3j4psv5helgmn1tv5s.png"
curl -fL -o panti-bayi-jogja.png "https://mediapro.work/wp-content/uploads/elementor/thumbs/Logo-1_11zon-scaled-revc4rygfuw6qvercqbyr09saavg89cy2urlllr2tc.png"
```

If any download returns 404, fall back to a 1×1 transparent placeholder PNG and log it for manual replacement.

### Step 4.2: Create `src/components/sections/Hero.astro`

Port from `/tmp/media-pro-v1/project/components/Hero.jsx`.

```astro
---
import Reveal from '~/components/ui/Reveal.astro';
import Icon from '~/components/icons/Icon.astro';
import { SITE } from '~/data/site';
---
<section class="hero" id="top" aria-labelledby="hero-heading">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-copy">
        <Reveal><span class="eyebrow">We are Media Pro Creative</span></Reveal>
        <Reveal delay={1}>
          <h1 id="hero-heading" class="h-display">
            Crafting brands that <span class="accent">stand out</span> in a noisy digital world.
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p class="lede">
            <strong>Media Pro is a global digital marketing agency founded in {SITE.founded}.</strong>
            We help brands worldwide grow through Web Development, Google Ads, Meta Ads, SEO, and Consulting —
            trusted by {SITE.stats.brandsServed} brands across {SITE.stats.countries} countries with a {SITE.stats.rating} client rating.
          </p>
        </Reveal>
        <Reveal delay={3} class="hero-actions">
          <a href="#about" class="btn btn-primary">
            Discover more
            <Icon name="arrow-right" size={14} />
          </a>
          <a href={`${SITE.waLink}?text=${encodeURIComponent("Hi, I'd like to schedule a free consultation")}`} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
            Free Consultation
          </a>
        </Reveal>

        <Reveal delay={4} class="hero-meta">
          <div class="m">
            <strong>{SITE.stats.yearsExperience} yrs</strong>
            <span>Industry experience</span>
          </div>
          <div class="m">
            <strong>{SITE.stats.brandsServed}</strong>
            <span>Global brands trust us</span>
          </div>
          <div class="m">
            <strong>{SITE.stats.rating}★</strong>
            <span>Client rating</span>
          </div>
        </Reveal>
      </div>

      <Reveal delay={2} class="phone-stage">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>

        <div class="chip chip-1">
          <Icon name="arrow-up" size={14} />
          <span>Engagement <span class="red">+180%</span></span>
        </div>
        <div class="chip chip-2">
          <Icon name="stars" size={14} />
          <span>Conversion <span class="gold">+45%</span></span>
        </div>
        <div class="chip chip-3">
          <Icon name="people" size={14} />
          <span>Reach <span class="red">2.4M</span></span>
        </div>

        <img
          class="phone"
          src="/images/hero-phone.png"
          alt="Media Pro digital marketing dashboard preview on mobile"
          width="320"
          height="640"
          loading="eager"
          fetchpriority="high"
        />
      </Reveal>
    </div>
  </div>
</section>
```

### Step 4.3: Create `src/components/sections/Marquee.astro`

```astro
---
import { getCollection } from 'astro:content';
const logos = await getCollection('trustedLogos');
const tripled = [...logos, ...logos, ...logos];
---
<section class="trusted" aria-label="Trusted brands and organizations">
  <div class="container">
    <p class="trusted-label">Trusted by 25,000+ brands across 40+ countries</p>
  </div>
  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      {tripled.map((logo) => (
        <img src={logo.data.src} alt={`${logo.data.alt} — Media Pro client logo`} loading="lazy" width="160" height="52" />
      ))}
    </div>
  </div>
</section>
```

### Step 4.4: Create `src/components/sections/About.astro`

Port from About.jsx, swap external image to `/images/about-mockup.png`. Use `Reveal` and `Icon` components.

```astro
---
import Reveal from '~/components/ui/Reveal.astro';
import Icon from '~/components/icons/Icon.astro';
---
<section id="about" aria-labelledby="about-heading">
  <div class="container">
    <div class="about-grid">
      <div class="about-copy">
        <Reveal><span class="eyebrow">About Media Pro</span></Reveal>
        <Reveal delay={1}>
          <h2 id="about-heading" class="h-section">
            More than a decade of <span style="color:var(--gold-dark);font-style:italic;font-weight:500;">digital marketing</span> expertise.
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p class="lede" style="margin-top:24px;">
            Media Pro offers a full suite of digital marketing services — SEO, PPC, social media, and content creation — aimed at driving brand visibility and generating significant conversions.
          </p>
        </Reveal>

        <Reveal delay={3} class="about-bullets">
          <div class="bullet">
            <span class="icon-wrap"><Icon name="thumbs-up" /></span>
            <span>Social Media Strategy</span>
          </div>
          <div class="bullet">
            <span class="icon-wrap"><Icon name="cloud" /></span>
            <span>Digital Marketing</span>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <a href="https://wa.me/6285129992227" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Contact us
            <Icon name="arrow-right" size={14} />
          </a>
        </Reveal>
      </div>

      <Reveal delay={2} class="about-visual">
        <img src="/images/about-mockup.png" alt="Media Pro mobile app showcasing digital marketing analytics" width="414" height="600" loading="lazy" />
      </Reveal>
    </div>

    <div class="vmm">
      <Reveal>
        <span class="icon-wrap"><Icon name="rocket" /></span>
        <h4>Our Vision</h4>
        <p>Create a healthy digital marketing ecosystem that lifts every brand we touch.</p>
      </Reveal>
      <Reveal delay={1}>
        <span class="icon-wrap"><Icon name="compass" /></span>
        <h4>Our Mission</h4>
        <p>Stay on the right path of digital marketing — strategic, ethical, and built to last.</p>
      </Reveal>
      <Reveal delay={2}>
        <span class="icon-wrap"><Icon name="handshake" /></span>
        <h4>Our Motto</h4>
        <p>Make your business 10× more visible and valuable than your competitors.</p>
      </Reveal>
    </div>
  </div>
</section>
```

### Step 4.5: Create `src/components/sections/ServicesIntro.astro`

Port from ServicesIntro.jsx. Image path → `/images/services-visual.png`.

```astro
---
import Reveal from '~/components/ui/Reveal.astro';
import Icon from '~/components/icons/Icon.astro';
---
<section>
  <div class="container">
    <div class="services-intro-grid">
      <Reveal class="visual">
        <img src="/images/services-visual.png" alt="Strategy in action — Media Pro" loading="lazy" width="600" height="600" />
      </Reveal>

      <div>
        <Reveal><span class="eyebrow">Our Services</span></Reveal>
        <Reveal delay={1}>
          <h2 class="h-section" style="margin-top:22px;">Innovative strategies, measurable success.</h2>
        </Reveal>
        <Reveal delay={2}>
          <p class="lede" style="margin-top:22px;">
            Media Pro's marketing strategies don't follow the playbook — they rewrite it. So your competitors can't predict your next move.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div class="highlight-box">
            <span class="icon-wrap"><Icon name="people" /></span>
            <div>
              <h4>98% client satisfaction with proven results</h4>
              <p>We work from experience to consistently deliver outcomes that move the needle.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <a href="https://wa.me/6285129992227" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Free Consultation
            <Icon name="arrow-right" size={14} />
          </a>
        </Reveal>
      </div>
    </div>
  </div>
</section>
```

### Step 4.6: Create `src/components/sections/Services.astro`

```astro
---
import Reveal from '~/components/ui/Reveal.astro';
import Icon from '~/components/icons/Icon.astro';
import { getCollection } from 'astro:content';
const services = await getCollection('services');
---
<section id="services" aria-labelledby="services-heading">
  <div class="container">
    <Reveal>
      <div class="section-head">
        <div>
          <span class="eyebrow">What we offer</span>
          <h2 id="services-heading" class="h-section" style="margin-top:18px;">
            Strategic thinkers, creative doers, your marketing leaders.
          </h2>
        </div>
        <p class="right">
          Six disciplines, one team. Media Pro picks the right mix for each brand — no templates, no guesswork.
        </p>
      </div>
    </Reveal>

    <Reveal>
      <div class="services-grid" role="list">
        {services.map((s) => (
          <article class="service-card" role="listitem" itemscope itemtype="https://schema.org/Service">
            <span class="num">{s.data.num} / 06</span>
            <span class="icon-wrap" aria-hidden="true"><Icon name={s.data.icon} size={26} /></span>
            <h3 itemprop="name">{s.data.title}</h3>
            <p itemprop="description">{s.data.desc}</p>
            <meta itemprop="provider" content="Media Pro Creative Limited" />
          </article>
        ))}
      </div>
    </Reveal>
  </div>
</section>
```

### Step 4.7: Create `src/components/sections/Cta.astro`

```astro
---
import Reveal from '~/components/ui/Reveal.astro';
---
<section class="cta" id="contact">
  <div class="cta-bg-grid"></div>
  <div class="container">
    <Reveal><span class="eyebrow">Let's build something</span></Reveal>
    <Reveal delay={1}>
      <h2 class="h-display" style="font-size:clamp(36px,5.4vw,76px);">
        Making your brand <span class="accent">stand out</span> online.
      </h2>
    </Reveal>
    <Reveal delay={2}>
      <p>Your business will become more widely known, recognised, and remembered — to everyone.</p>
    </Reveal>
    <Reveal delay={3}>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
        <a href="mailto:mediapro@mediapro.work" class="btn btn-primary">Ask More</a>
        <a href="https://wa.me/6285129992227" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">WhatsApp us</a>
      </div>
    </Reveal>
  </div>
</section>
```

### Step 4.8: Create `src/components/sections/Stats.astro`

```astro
---
import { getCollection } from 'astro:content';
const stats = await getCollection('stats');
---
<section class="stats" itemscope itemtype="https://schema.org/Dataset">
  <meta itemprop="name" content="Media Pro Performance Metrics 2026" />
  <meta itemprop="creator" content="Media Pro Creative Limited" />
  <div class="container">
    <div class="stats-grid">
      {stats.map((s) => {
        const isPlus = s.data.num.endsWith('+');
        const base = isPlus ? s.data.num.slice(0, -1) : s.data.num;
        return (
          <div class="stat">
            <span class="num" data-stat-target={s.data.num} aria-label={`${s.data.num} ${s.data.label}`}>
              {base}{isPlus && <span class="plus">+</span>}
            </span>
            <span class="label">{s.data.label}</span>
          </div>
        );
      })}
    </div>
    <small class="stats-source" style="display:block;margin-top:24px;text-align:center;color:var(--ink-mute);font-size:12px;">
      Source: Media Pro internal data, last updated <time datetime="2026-04-30">April 2026</time>
    </small>
  </div>
</section>

<script>
  import '~/lib/stat-counter';
</script>
```

### Step 4.9: Create `src/components/sections/Why.astro`

```astro
---
import Reveal from '~/components/ui/Reveal.astro';
import Icon from '~/components/icons/Icon.astro';
import { getCollection } from 'astro:content';
const reasons = await getCollection('reasons');
---
<section>
  <div class="container">
    <Reveal>
      <div class="section-head">
        <div>
          <span class="eyebrow">Why Choose Us</span>
          <h2 class="h-section" style="margin-top:18px;">
            The power to transform <span style="color:var(--gold);font-style:italic;font-weight:500;">your digital strategy</span>.
          </h2>
        </div>
        <p class="right">Four reasons brands stay with Media Pro for years — not months.</p>
      </div>
    </Reveal>

    <div class="reasons-grid">
      {reasons.map((r, i) => (
        <Reveal delay={(i % 2) + 1}>
          <div class="reason-card">
            <span class="icon-wrap"><Icon name={r.data.icon} size={26} /></span>
            <div>
              <h4>{r.data.title}</h4>
              <p>{r.data.desc}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>
```

### Step 4.10: Create `src/components/sections/Testimonials.astro`

```astro
---
import Reveal from '~/components/ui/Reveal.astro';
import Icon from '~/components/icons/Icon.astro';
import { getCollection } from 'astro:content';
const testimonials = await getCollection('testimonials');
---
<section>
  <div class="container">
    <Reveal>
      <div class="section-head">
        <div>
          <span class="eyebrow">Client Feedback & Reviews</span>
          <h2 class="h-section" style="margin-top:18px;">Marketing solutions tailored for your success.</h2>
        </div>
      </div>
    </Reveal>

    <div class="growth-stats">
      <Reveal delay={1}>
        <div class="growth-card">
          <span class="icon-wrap"><Icon name="arrow-up" size={26} /></span>
          <div>
            <span class="num">68%</span>
            <h5>Business Growth</h5>
            <p>Many of our clients grow much faster than they planned.</p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={2}>
        <div class="growth-card">
          <span class="icon-wrap"><Icon name="arrow-up" size={26} /></span>
          <div>
            <span class="num">42%</span>
            <h5>Conversion Lift</h5>
            <p>Even small brands see substantial conversion gains.</p>
          </div>
        </div>
      </Reveal>
    </div>

    <div class="testimonials-track">
      {testimonials.map((t, i) => (
        <Reveal delay={(i % 3) + 1}>
          <div class="testimonial">
            <p>{t.data.quote}</p>
            <div class="testimonial-author">
              <img src={t.data.img} alt={t.data.name} width="44" height="44" loading="lazy" />
              <div>
                <strong>{t.data.name}</strong>
                <span>{t.data.role}</span>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>
```

### Step 4.11: Create `src/components/sections/FooterCta.astro`

```astro
---
import Reveal from '~/components/ui/Reveal.astro';
import Icon from '~/components/icons/Icon.astro';
---
<section class="footer-cta">
  <div class="container">
    <div>
      <Reveal><span class="eyebrow">Get in touch</span></Reveal>
      <Reveal delay={1}>
        <h2 class="h-display" style="font-size:clamp(36px,5vw,72px);">
          Ready to scale? Bring us your <span class="accent">best idea</span>.
        </h2>
      </Reveal>
      <Reveal delay={2}>
        <div style="display:flex;gap:14px;flex-wrap:wrap;">
          <a href="https://wa.me/6285129992227" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Get Started
            <Icon name="arrow-right" size={14} />
          </a>
          <a href="mailto:mediapro@mediapro.work" class="btn btn-ghost">mediapro@mediapro.work</a>
        </div>
      </Reveal>
    </div>
    <Reveal delay={2} class="visual">
      <img src="/images/footer-cta.png" alt="Grow with Media Pro" loading="lazy" width="500" height="500" />
    </Reveal>
  </div>
</section>
```

### Step 4.12: Verify components compile

Run `cd /home/ekalliptus/dev/mediapro && bun run astro check`.  
Expected: zero errors.

### Step 4.13: Commit

```bash
cd /home/ekalliptus/dev/mediapro && git add . && git commit -m "feat(integration): images + section components"
```

---

## Task 5: Build Homepage

**Files:** `src/pages/index.astro`

### Step 5.1: Create `src/pages/index.astro`

```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import Hero from '~/components/sections/Hero.astro';
import Marquee from '~/components/sections/Marquee.astro';
import About from '~/components/sections/About.astro';
import ServicesIntro from '~/components/sections/ServicesIntro.astro';
import Services from '~/components/sections/Services.astro';
import Cta from '~/components/sections/Cta.astro';
import Stats from '~/components/sections/Stats.astro';
import Why from '~/components/sections/Why.astro';
import Testimonials from '~/components/sections/Testimonials.astro';
import FooterCta from '~/components/sections/FooterCta.astro';
import { professionalServiceSchema } from '~/data/schemas/professional-service';
import { serviceCatalogSchema } from '~/data/schemas/service-catalog';
import { faqPageSchema } from '~/data/schemas/faq-page';
import { productReviewSchema } from '~/data/schemas/product-review';
import { breadcrumbSchema } from '~/data/schemas/breadcrumb';
import { getCollection } from 'astro:content';

const testimonials = await getCollection('testimonials');
const homepageFaqs = [
  {
    question: 'What digital marketing services does Media Pro offer?',
    answer: 'Media Pro offers Web Development, Google Ads Services, Meta Ads Services, SEO, Social Media Marketing, Content Marketing, Email Marketing, Influencer Marketing, Analytics & Reporting, and Consulting Services.',
  },
  {
    question: 'How experienced is Media Pro?',
    answer: 'Media Pro has more than 10 years of digital marketing expertise, having delivered 91,000+ projects to 84,000+ happy clients with a 4.7 client rating.',
  },
  {
    question: 'How can I contact Media Pro for a consultation?',
    answer: 'You can email mediapro@mediapro.work or message us on WhatsApp for a free consultation. We work with clients globally and reply within 4 working hours.',
  },
  {
    question: 'Does Media Pro work with small businesses?',
    answer: 'Yes. Our solutions are flexible and scalable for businesses of all sizes — from emerging brands to enterprise clients.',
  },
];

const schemas = [
  professionalServiceSchema,
  serviceCatalogSchema,
  faqPageSchema(homepageFaqs),
  productReviewSchema(testimonials.map((t) => ({ quote: t.data.quote, name: t.data.name, role: t.data.role }))),
  breadcrumbSchema([{ label: 'Home', href: '/' }]),
];
---
<BaseLayout
  title="Media Pro — Global Digital Marketing Agency | SEO, Ads & Web Dev"
  description="Premium global digital marketing agency. Web Development, Google Ads, Meta Ads, SEO & Consulting. Trusted by 25,000+ brands across 40+ countries. 10+ years experience, 4.7 rating."
  active="home"
  schemas={schemas}
  preloadHero={true}
>
  <Hero />
  <Marquee />
  <About />
  <ServicesIntro />
  <Services />
  <Cta />
  <Stats />
  <Why />
  <Testimonials />
  <FooterCta />
</BaseLayout>
```

### Step 5.2: Verify build

Run `cd /home/ekalliptus/dev/mediapro && bun run build`.  
Expected: build succeeds, `dist/index.html` exists, no warnings.

### Step 5.3: Smoke test

Run `cd /home/ekalliptus/dev/mediapro && bun run preview` (in background).  
`curl -s http://localhost:4321 | head -50`. Verify HTML renders the hero text "Crafting brands that stand out".

Stop preview server.

### Step 5.4: Commit

```bash
cd /home/ekalliptus/dev/mediapro && git add . && git commit -m "feat(homepage): index.astro composition"
```

---

## Task 6: Build Subpages

**Files:**
- `src/pages/contact.astro`
- `src/pages/faq.astro`
- `src/pages/terms.astro`
- `src/pages/disclaimer.astro`
- `src/pages/404.astro`

### Step 6.1: Create `src/pages/contact.astro`

```astro
---
import SubpageLayout from '~/layouts/SubpageLayout.astro';
import Icon from '~/components/icons/Icon.astro';
import { breadcrumbSchema } from '~/data/schemas/breadcrumb';
import { CONTACT_CARDS, CONTACT_HERO, SERVICE_OPTIONS, BUDGET_OPTIONS, TIMELINE_OPTIONS } from '~/_extracted/contact-content';

const schemas = [
  breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Contact' }]),
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Media Pro',
    url: 'https://mediapro.work/contact',
    mainEntity: { '@id': 'https://mediapro.work/#organization' },
  },
];
---
<SubpageLayout
  title="Contact Media Pro — Free Digital Marketing Consultation"
  description="Get in touch with Media Pro for a free consultation. We respond within 4 working hours. WhatsApp, email, or send a project brief."
  active="contact"
  schemas={schemas}
  pageTitle={CONTACT_HERO.title}
  pageLede={CONTACT_HERO.lede}
  crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
>
  <section class="subpage-body">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info">
          {CONTACT_CARDS.map((c) => (
            <div class="contact-card">
              <span class="icon-wrap"><Icon name={c.icon} size={20} /></span>
              <div>
                <h4>{c.label}</h4>
                {c.href ? (
                  <a href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noopener noreferrer' : undefined}>{c.value}</a>
                ) : (
                  <p>{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form id="contactForm" class="contact-form" novalidate>
          <h3>Tell us about your project</h3>
          <p>We respond within 4 working hours. Submitting will pre-fill a WhatsApp message you can review and send.</p>

          <div class="field-row">
            <div class="field">
              <label for="name">Name<span class="req">*</span></label>
              <input id="name" name="name" type="text" required autocomplete="name" />
            </div>
            <div class="field">
              <label for="email">Email<span class="req">*</span></label>
              <input id="email" name="email" type="email" required autocomplete="email" />
            </div>
          </div>

          <div class="field">
            <label for="company">Company</label>
            <input id="company" name="company" type="text" autocomplete="organization" />
          </div>

          <div class="field">
            <label>What services do you need?</label>
            <div class="service-pills">
              {SERVICE_OPTIONS.map((s) => (
                <button type="button" class="pill" data-id={s.id}>{s.label}</button>
              ))}
            </div>
          </div>

          <div class="field">
            <label>Budget (USD)</label>
            <div class="budget-pills">
              {BUDGET_OPTIONS.map((b) => (
                <button type="button" class="pill" data-id={b.id}>{b.label}</button>
              ))}
            </div>
          </div>

          <div class="field">
            <label for="timeline">Timeline</label>
            <select id="timeline" name="timeline">
              {TIMELINE_OPTIONS.map((t) => (
                <option value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div class="field">
            <label for="message">Tell us more<span class="req">*</span></label>
            <textarea id="message" name="message" required></textarea>
          </div>

          <div class="consent">
            <input id="consent" name="consent" type="checkbox" required />
            <label for="consent">I agree to the <a href="/terms">privacy policy</a> and consent to being contacted about my inquiry.</label>
          </div>

          <div class="submit-row">
            <button type="submit" class="btn btn-primary">
              Send via WhatsApp
              <Icon name="arrow-right" size={14} />
            </button>
          </div>

          <div class="success-msg">Thanks — we'll be in touch shortly.</div>
        </form>
      </div>
    </div>
  </section>

  <script>
    import '~/lib/contact-form';
  </script>
</SubpageLayout>
```

### Step 6.2: Create `src/pages/faq.astro`

```astro
---
import SubpageLayout from '~/layouts/SubpageLayout.astro';
import { getCollection } from 'astro:content';
import { breadcrumbSchema } from '~/data/schemas/breadcrumb';
import { faqPageSchema } from '~/data/schemas/faq-page';

const faqs = await getCollection('faqs');
const cats = ['all', 'general', 'services', 'pricing', 'process', 'results'];

const schemas = [
  breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'FAQ' }]),
  faqPageSchema(faqs.map((f) => ({ question: f.data.question, answer: f.data.answer, expandedAnswer: f.data.expandedAnswer }))),
];
---
<SubpageLayout
  title="FAQ — Digital Marketing Services | Media Pro"
  description="17 answers to common questions about Media Pro's services — pricing, timelines, process, what's included, results, and how we work."
  schemas={schemas}
  pageTitle='Frequently Asked <span class="accent">Questions</span>'
  pageLede="Everything you wanted to know before working with Media Pro. Can't find your answer? Drop us a message — we usually reply within 4 working hours."
  crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
>
  <section class="subpage-body">
    <div class="container" style="max-width:920px;">
      <div class="faq-categories" id="faqCats">
        {cats.map((c, i) => (
          <button type="button" class:list={['faq-cat', i === 0 && 'is-active']} data-cat={c}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div class="faq-list" id="faqList">
        {faqs.map((f) => (
          <div class="faq-item" data-cat={f.data.category}>
            <button class="faq-q" type="button" aria-expanded="false">
              <span>{f.data.question}</span>
              <span class="toggle" aria-hidden="true">+</span>
            </button>
            <div class="faq-a">
              <div class="faq-a-inner">
                <p>{f.data.answer}</p>
                {f.data.expandedAnswer && <p>{f.data.expandedAnswer}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style="margin-top:48px;text-align:center;padding:32px 24px;background:var(--bg-soft);border-radius:var(--radius);">
        <h3 style="font-family:var(--font-display);font-size:24px;margin:0 0 12px;">Still have questions?</h3>
        <p style="margin:0 0 20px;color:var(--ink-soft);">We respond within 4 working hours.</p>
        <a href="/contact" class="btn btn-primary">Contact us</a>
      </div>
    </div>
  </section>

  <script>
    import '~/lib/faq-filter';
    import '~/lib/faq-accordion';
  </script>
</SubpageLayout>
```

### Step 6.3: Create `src/pages/terms.astro`

```astro
---
import SubpageLayout from '~/layouts/SubpageLayout.astro';
import { TERMS_SECTIONS, TERMS_HERO } from '~/_extracted/terms-sections';
import { breadcrumbSchema } from '~/data/schemas/breadcrumb';

const schemas = [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Terms' }])];
---
<SubpageLayout
  title="Terms of Service & Privacy Policy — Media Pro"
  description="Combined Terms of Service and Privacy Policy for Media Pro Creative Limited. Acceptance, services, data, payments, IP, liability, and your rights."
  schemas={schemas}
  pageTitle={TERMS_HERO.title}
  pageLede={TERMS_HERO.lede}
  crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms' }]}
>
  <section class="subpage-body">
    <div class="container">
      <div class="subpage-grid">
        <aside class="toc">
          <h5>Contents</h5>
          <ol>
            {TERMS_SECTIONS.map((s) => (
              <li><a href={`#${s.id}`}>{s.title}</a></li>
            ))}
          </ol>
        </aside>

        <div class="prose">
          <p style="margin-bottom:32px;color:var(--ink-mute);font-size:13px;">
            Last updated: <time datetime={TERMS_HERO.lastUpdated}>{TERMS_HERO.lastUpdated}</time>
          </p>
          {TERMS_SECTIONS.map((s) => (
            <section id={s.id}>
              <h2><span class="num">{s.num}</span>{s.title}</h2>
              <Fragment set:html={s.contentHtml} />
            </section>
          ))}
        </div>
      </div>
    </div>
  </section>

  <script>
    import '~/lib/toc-highlight';
  </script>
</SubpageLayout>
```

### Step 6.4: Create `src/pages/disclaimer.astro`

Same structure as terms.astro but uses `DISCLAIMER_SECTIONS` and `DISCLAIMER_HERO`:

```astro
---
import SubpageLayout from '~/layouts/SubpageLayout.astro';
import { DISCLAIMER_SECTIONS, DISCLAIMER_HERO } from '~/_extracted/disclaimer-sections';
import { breadcrumbSchema } from '~/data/schemas/breadcrumb';

const schemas = [breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Disclaimer' }])];
---
<SubpageLayout
  title="Disclaimer — Media Pro Digital Marketing"
  description="Important information about service guarantees, third-party platform limitations, and the nature of digital marketing outcomes."
  schemas={schemas}
  pageTitle={DISCLAIMER_HERO.title}
  pageLede={DISCLAIMER_HERO.lede}
  crumbs={[{ label: 'Home', href: '/' }, { label: 'Disclaimer' }]}
>
  <section class="subpage-body">
    <div class="container">
      <div class="subpage-grid">
        <aside class="toc">
          <h5>Contents</h5>
          <ol>
            {DISCLAIMER_SECTIONS.map((s) => (
              <li><a href={`#${s.id}`}>{s.title}</a></li>
            ))}
          </ol>
        </aside>

        <div class="prose">
          <p style="margin-bottom:32px;color:var(--ink-mute);font-size:13px;">
            Last updated: <time datetime={DISCLAIMER_HERO.lastUpdated}>{DISCLAIMER_HERO.lastUpdated}</time>
          </p>
          {DISCLAIMER_SECTIONS.map((s) => (
            <section id={s.id}>
              <h2><span class="num">{s.num}</span>{s.title}</h2>
              <Fragment set:html={s.contentHtml} />
            </section>
          ))}
        </div>
      </div>
    </div>
  </section>

  <script>
    import '~/lib/toc-highlight';
  </script>
</SubpageLayout>
```

### Step 6.5: Create `src/pages/404.astro`

```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
---
<BaseLayout
  title="Page Not Found — Media Pro"
  description="The page you were looking for doesn't exist. Head back to the homepage or contact us."
  noindex={true}
>
  <section class="hero" style="text-align:center;">
    <div class="container">
      <span class="eyebrow" style="justify-content:center;">404</span>
      <h1 class="h-display" style="margin:24px auto;max-width:18ch;">Lost in the digital noise?</h1>
      <p class="lede" style="margin:0 auto 36px;max-width:48ch;">The page you were looking for doesn't exist. Let's get you back on track.</p>
      <a href="/" class="btn btn-primary">Back to home</a>
    </div>
  </section>
</BaseLayout>
```

### Step 6.6: Verify all subpages build

```bash
cd /home/ekalliptus/dev/mediapro && bun run build
```

Expected: builds cleanly, dist contains `index.html`, `contact/index.html`, `faq/index.html`, `terms/index.html`, `disclaimer/index.html`, `404.html`, `llms.txt`, `llms-full.txt`, `sitemap-index.xml`, `sitemap-0.xml`.

### Step 6.7: Smoke test all routes

```bash
cd /home/ekalliptus/dev/mediapro && bun run preview &
sleep 2
for path in / /contact /faq /terms /disclaimer /llms.txt /llms-full.txt /sitemap-index.xml; do
  echo "=== $path ==="
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321$path
done
kill %1 2>/dev/null
```

Expected: all return 200.

### Step 6.8: Commit

```bash
cd /home/ekalliptus/dev/mediapro && git add . && git commit -m "feat(pages): contact, faq, terms, disclaimer, 404"
```

---

## Task 7: Verification & Polish

### Step 7.1: Type check

```bash
cd /home/ekalliptus/dev/mediapro && bun run astro check
```

Expected: zero errors, zero warnings.

### Step 7.2: Build production

```bash
cd /home/ekalliptus/dev/mediapro && bun run build
```

Expected: zero errors, zero warnings. Note bundle sizes printed.

### Step 7.3: Verify JS budget ≤15 KB gzipped

```bash
cd /home/ekalliptus/dev/mediapro && find dist/_astro -name '*.js' -exec gzip -c {} \; | wc -c
```

Expected: under 15360 bytes (15 KB). If exceeded, audit `dist/_astro/*.js` files and remove dead imports.

### Step 7.4: Validate JSON-LD

```bash
cd /home/ekalliptus/dev/mediapro && grep -o 'application/ld+json' dist/index.html | wc -l
```

Expected: 7 (Organization, WebSite, ProfessionalService, ServiceCatalog, FAQPage, Product+Review, Breadcrumb). For each schema, copy the JSON content and run through https://validator.schema.org manually — expected: zero errors.

### Step 7.5: Verify GEO checklist

- [ ] `dist/robots.txt` exists and includes `User-agent: GPTBot` ... `Allow: /`
  ```bash
  cd /home/ekalliptus/dev/mediapro && grep -E '^(User-agent: (GPTBot|ClaudeBot|PerplexityBot|OAI-SearchBot|Google-Extended))' dist/robots.txt
  ```
  Expected: 5 lines.
- [ ] `dist/llms.txt` exists, content type `text/plain`
  ```bash
  cd /home/ekalliptus/dev/mediapro && head -5 dist/llms.txt
  ```
- [ ] Hero contains definition (40-60 word lede with brand name)
  ```bash
  cd /home/ekalliptus/dev/mediapro && grep -A 2 'Media Pro is a global' dist/index.html
  ```
  Expected: match.
- [ ] All `target="_blank"` have `rel="noopener noreferrer"`
  ```bash
  cd /home/ekalliptus/dev/mediapro && grep -E 'target="_blank"' dist/index.html | grep -v 'noopener'
  ```
  Expected: empty output.
- [ ] `<time datetime>` present
  ```bash
  cd /home/ekalliptus/dev/mediapro && grep -c '<time datetime' dist/index.html
  ```
  Expected: ≥1.

### Step 7.6: Lighthouse audit (manual)

User runs Lighthouse locally:

```bash
cd /home/ekalliptus/dev/mediapro && bun run preview &
sleep 2
# In another terminal: open Chrome DevTools → Lighthouse → run on http://localhost:4321
# Targets: Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO = 100
kill %1 2>/dev/null
```

Document scores. If any category < target, file a follow-up issue but do NOT block this plan.

### Step 7.7: Mobile/desktop visual check

User opens `http://localhost:4321` at 375px and 1440px viewports. Verify:
- Hero phone visible, rings + chips animated
- Marquee logos scrolling
- Stats counter animates on scroll into view
- Service cards hover state
- FAQ accordion opens/closes
- FAQ category filter works
- Contact form pills toggle
- Mobile menu opens via hamburger, closes on link click + ESC

### Step 7.8: Create README

`README.md`:

```markdown
# Media Pro — Astro 6 + Bun

Production-ready marketing site for Media Pro Creative Limited. Built with Astro 6, Tailwind CSS v4, and Bun.

## Setup

\`\`\`bash
bun install
cp .env.example .env  # adjust as needed
bun run dev
\`\`\`

## Commands

- \`bun run dev\` — start dev server at http://localhost:4321
- \`bun run build\` — production build to ./dist
- \`bun run preview\` — preview built site
- \`bun run astro check\` — type-check

## Content updates

- Brand constants: edit \`src/data/site.ts\`
- Services / FAQs / testimonials: edit JSON in \`src/content/\`
- Subpage content: edit \`src/_extracted/*.ts\`
- JSON-LD schemas: \`src/data/schemas/\`
- llms.txt content: \`src/pages/llms.txt.ts\`

## Deployment

Static output in \`dist/\`. Deploy to Netlify, Vercel, or Cloudflare Pages.

**Cloudflare**: Verify AI Bot Management allows GPTBot, ClaudeBot, PerplexityBot in dashboard.

After deploy:
1. Submit \`https://mediapro.work/sitemap-index.xml\` to Google Search Console + Bing Webmaster.
2. Verify \`https://mediapro.work/llms.txt\` accessible.
3. Test JSON-LD via https://validator.schema.org.

## GEO Maintenance

- Update \`src/data/site.ts\` stats quarterly.
- Add new FAQ items to \`src/content/faqs.json\` as questions emerge.
- Refresh \`<time datetime>\` in stats section yearly.
```

### Step 7.9: Final commit

```bash
cd /home/ekalliptus/dev/mediapro && git add . && git commit -m "docs: README, verify build, GEO + Lighthouse checks"
```

---

## Self-Review

### Spec Coverage Check
- ✅ Astro 6 + Bun + Tailwind v4 — Task 0
- ✅ TypeScript strict — Task 0 (tsconfig)
- ✅ Astro Fonts API — Task 0 (config)
- ✅ Output static — Task 0 (config)
- ✅ Sitemap integration — Task 0 (config)
- ✅ Design tokens (`@theme`) — Task 1.2
- ✅ Component CSS — Task 1.3
- ✅ Animations + reduced-motion — Task 1.4
- ✅ Subpage CSS — Task 1.5
- ✅ 22 SVG icons — Task 1.14
- ✅ UI primitives (Button, Eyebrow, Reveal, DefinitionBlock, FactCard) — Task 1.15
- ✅ SEO components (BaseSEO, JsonLd, Breadcrumbs) — Task 1.16
- ✅ Layout (Header, Footer) — Task 1.17
- ✅ BaseLayout + SubpageLayout — Task 1.18
- ✅ robots.txt with all AI crawlers — Task 1.19
- ✅ Lib scripts (reveal, stat-counter, header-scroll, faq, contact-form, toc-highlight) — Tasks 1.7-1.13
- ✅ Content collections (6 collections) — Tasks 2.1-2.7
- ✅ JSON-LD schemas (7 generators) — Tasks 2.8-2.14
- ✅ llms.txt + llms-full.txt — Tasks 2.15-2.16
- ✅ Subpage content extraction — Tasks 3.1-3.3
- ✅ Image download — Task 4.1
- ✅ 11 section components — Tasks 4.2-4.11
- ✅ Homepage with all schemas — Task 5
- ✅ 5 subpages (contact, faq, terms, disclaimer, 404) — Task 6
- ✅ Build verification, JS budget, GEO check — Task 7

### Placeholder Scan
- ⚠️ Tasks 3.2 and 3.3 contain `...PASTE FROM terms.html lines X-Y...` placeholders. The agent executing Task 3 must read terms.html and disclaimer.html and copy the exact innerHTML. This is a deliberate decision: pre-pasting the full HTML content into this plan would balloon it past readable size. The agent has explicit source line references and the instruction to preserve `<p>`, `<ul>`, `<li>`, `<strong>`, `<a>` tags. **Acceptable: agent has unambiguous source.**
- All other steps contain complete code.

### Type Consistency
- `Site` exported from `~/data/site` is used consistently as `SITE`.
- `breadcrumbSchema` returns a frozen object — consumers spread into `schemas` arrays. Consistent.
- `faqPageSchema` accepts `{ question, answer, expandedAnswer? }[]` — both homepage (Task 5) and faq.astro (Task 6.2) pass matching shape.
- `productReviewSchema` accepts `{ quote, name, role }[]` — homepage maps testimonials' `data` correctly.
- `Reveal` Astro component accepts `delay: 0|1|2|3|4|5` and `as` and `class` — used consistently.

### Scope Check
This plan covers ONE coherent system (a 5-page marketing website). The parallel agent split is an execution strategy, not a separate subsystem boundary. No decomposition needed.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-01-mediapro-v2-astro-implementation.md`. Two execution options:**

**1. Subagent-Driven** — I dispatch fresh subagents per task. Tasks 1-3 dispatched in parallel via `dispatching-parallel-agents`, then Tasks 4-7 dispatched sequentially via `subagent-driven-development`. Review between tasks.

**2. Inline Execution** — Execute all tasks in this session via `executing-plans` skill. Batch execution with checkpoints.

**Recommended: Option 1 (Subagent-Driven)** — Tasks 1-3 are explicitly designed for parallel execution with non-overlapping file ownership.

**Which approach?**

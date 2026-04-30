# SUPERPROMPT — Media Pro Redesign v2 (Astro 6 + Bun, SEO + GEO Optimized)

> Paste seluruh prompt ini ke coding agent (Claude Code, Cursor Compose, Copilot Workspace, Aider). Lampirkan handoff bundle `media-pro-v1/`. Jangan dipotong — semua section saling terkait.

---

## 1. ROLE & MISSION

Lo bertindak sebagai **Senior Fullstack Engineer + UI Engineer + GEO Strategist**. Misi:

1. **Implementasi** handoff `media-pro-v1/` (HTML + React+Babel CDN prototype) jadi **website production-grade** pakai **Astro 6 + Bun**
2. **Maximize SEO** — port semua structured data, ditambah technical SEO modern (Core Web Vitals, semantic HTML, sitemap dynamic, hreflang)
3. **Maximize GEO** — Generative Engine Optimization, optimasi konten supaya **dikutip oleh ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews**

Output harus:
- **Pixel-perfect** terhadap `Media Pro Redesign v2.html` (final state, bukan v1)
- **Production-ready**: type-safe, accessible (WCAG AA), Lighthouse ≥95
- **AI-citable**: setiap halaman lulus 12-point GEO checklist (section 11)
- **Tanpa over-engineering**: marketing site, default `output: 'static'`, zero JS kalau memungkinkan

---

## 2. PROJECT CONTEXT — MEDIA PRO (Final State v2)

> **PENTING**: Baca chat transcript di `media-pro-v1/chats/chat1.md` untuk paham evolusi v1 → v2. Final keputusan:
> 1. Light theme (bukan dark luxe)
> 2. Brand colors: Red `#C3282F`, Gold `#D2A418`, CTA Yellow `#FFB804`
> 3. Mood **BOLD + Compact + Smooth** (locked sebagai default, drop variant lain)
> 4. **Global market dengan USD pricing** (bukan Indonesia-spesifik lagi)
> 5. 5 halaman: `/` (homepage), `/contact`, `/faq`, `/terms`, `/disclaimer`
> 6. Tweaks panel di-DROP di production

| Field | Value |
|---|---|
| Brand | Media Pro Creative Limited |
| Domain | `mediapro.work` |
| Tagline | "Crafting brands that stand out in a noisy digital world." |
| Founded | 2014 (10+ tahun pengalaman) |
| Reach | "Trusted by 25,000+ brands across 40+ countries" |
| Stats | 91K+ projects, 84K+ happy clients, 42+ companies, 4.7★ rating |
| Email | mediapro@mediapro.work |
| WhatsApp | +62 851-2999-2227 (`6285129992227`) |
| Hours | 09:00–19:00 + Global · 24/7 async |
| Language | English only (`lang="en"`), `geo.region="001"` (Worldwide ISO) |
| Tone | Premium, profesional, internasional — bukan playful |

**Layanan utama (6, dari `Services.jsx`)**: SEO, Social Media Marketing, Content Marketing, Email Marketing, Influencer Marketing, Analytics & Reporting

**Layanan footer (4, premium)**: Web Development, Google Ads Services, Meta Ads Services, Consulting Services

**Pricing benchmark global (USD)**:
- Web Dev: `$1.5K` landing → `$4.5K` marketing site → `$12K+` custom
- Ads management: `$750/mo` + min ad spend `$1.5K/mo`
- SEO retainer: dari `$1.2K/mo`
- Consulting: `$200/hr`
- Payment: NET-14, USD invoicing, SWIFT/Wise/Stripe/PayPal

---

## 3. TECH STACK (WAJIB)

| Layer | Pilihan | Versi minimum | Alasan |
|---|---|---|---|
| Framework | **Astro** | `^6.1.0` | Static-first, SSR di build-time = AI crawlers happy |
| Runtime/PM | **Bun** | `>=1.1.0` | Fast install, native TS, dev server cepet |
| Language | **TypeScript strict** | — | Type safety |
| Styling | **Tailwind CSS v4** + custom CSS | `^4.0.0` | CSS-first config (`@theme`) |
| Icons | **Inline SVG** (port dari `Icons.jsx`) | — | Zero deps, kontrol penuh |
| Fonts | **Astro Fonts API** (built-in v6) | — | Auto-subset, anti-CLS |
| Sitemap | `@astrojs/sitemap` | latest | Auto-generate, hreflang aware |
| Output | `static` | — | Wajib — AI crawlers butuh static HTML |
| Deployment adapter | tidak ada (default static) atau `@wyattjoh/astro-bun-adapter` `^2.0.0` | — | Adapter Bun **hanya** kalau butuh form endpoint server-side |

**Bun usage**:
```bash
# Init
bun create astro@latest mediapro-web -- --template minimal --typescript strict --git --install

# Dev / build / preview
bun run dev
bun run build    # output ke ./dist/
bun run preview
```

**Hindari (breaking changes Astro 6)**:
- ❌ `Astro.glob()` → pakai `import.meta.glob()` atau Content Collections
- ❌ Legacy content collections → wajib Content Layer API
- ❌ `import.meta.env.SECRET` di server runtime (di v6 di-inline saat build) → pakai `astro:env`
- ❌ React/Vue/Svelte runtime di production (handoff React itu cuma prototyping)
- ❌ Babel CDN, unpkg React → buang semua
- ❌ Tweaks panel (`tweaks-panel.jsx`) → tooling Claude Design, BUKAN production
- ❌ Mood/density/motion runtime variants → pilih final 1 saja (Bold + Compact + Smooth)

---

## 4. DESIGN SYSTEM (Final, BOLD MOOD)

### 4.1 Colors

```css
/* src/styles/tokens.css */
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

  /* CTA yellow (primary action) */
  --color-yellow: #FFB804;
  --color-yellow-dark: #E6A300;
  --color-yellow-soft: #FFF4D1;
}
```

### 4.2 Typography

```ts
// astro.config.mjs (Astro Fonts API v6)
experimental: {
  fonts: [
    { provider: 'google', name: 'Space Grotesk', cssVariable: '--font-display', weights: [400, 500, 600, 700] },
    { provider: 'google', name: 'Inter',         cssVariable: '--font-body',    weights: [300, 400, 500, 600, 700] },
  ],
}
```

### 4.3 Layout & Density (COMPACT default)

```css
@theme {
  --max-content: 1240px;
  --gutter: clamp(16px, 3vw, 40px);  /* compact */

  --radius: 16px;
  --radius-sm: 10px;

  --shadow-1: 0 1px 2px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.04);
  --shadow-2: 0 4px 12px rgba(0,0,0,.05), 0 2px 4px rgba(0,0,0,.03);
  --shadow-3: 0 14px 40px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.04);
}

/* compact density (final default) */
section { padding: clamp(48px, 6vw, 80px) 0; }
.h-display { font-size: clamp(32px, 5vw, 72px); letter-spacing: -0.025em; }
.h-section { font-size: clamp(24px, 3.4vw, 44px); }
.lede      { font-size: 15px; line-height: 1.55; }
```

### 4.4 Component Recipes (port dari `styles-light.css` + `styles-subpage.css`)

Class wajib (port 1:1):

**Global**: `.container`, `.skip-link`, `.eyebrow`, `.h-display`, `.h-section`, `.lede`, `.accent`, `.section-head`

**Buttons**: `.btn`, `.btn-primary` (yellow #FFB804 + dark ink), `.btn-red`, `.btn-ghost`, `.btn-link`

**Header**: `.site-header`, `.scrolled`, `.nav-inner`, `.brand`, `.brand .dot`, `.nav-links`, `.menu-btn`, `.nav-cta`

**Hero**: `.hero`, `.hero-grid`, `.hero-copy`, `.hero-actions`, `.hero-meta`, `.phone-stage`, `.ring-1/2/3`, `.chip-1/2/3`, `.phone`

**Animations**: `.reveal`, `.reveal.in`, `.reveal-delay-1` ... `.reveal-delay-5`, keyframes `floatA/B`, `marquee`, `pulse`

**Marquee**: `.trusted`, `.trusted-label`, `.marquee`, `.marquee-track`

**About**: `.about-grid`, `.about-copy`, `.about-bullets`, `.bullet`, `.about-visual`, `.vmm`, `.icon-wrap`

**Services**: `.services-intro-grid`, `.highlight-box`, `.services-grid`, `.service-card`, `.service-card .num`

**CTA**: `.cta`, `.cta-bg-grid`, `.footer-cta`

**Stats**: `.stats`, `.stats-grid`, `.stat`, `.stat .num`, `.stat .plus`, `.stat .label`

**Why**: `.reasons-grid`, `.reason-card`

**Testimonials**: `.growth-stats`, `.growth-card`, `.testimonials-track`, `.testimonial`, `.testimonial::before`, `.testimonial-author`

**Footer**: `.site-footer`, `.footer-grid`, `.footer-tag`, `.footer-bottom`, `.socials`

**Subpage** (`styles-subpage.css`): `.subpage-hero`, `.crumbs`, `.toc-sticky`, `.toc`, `.subpage-content`, `.faq-grid`, `.faq-item`, `.faq-categories`, `.contact-form`, `.field`, `.service-pills`, `.budget-pills`, `.pill`, `.success-state`

**Strategi**: simpan di `src/styles/components.css` + `src/styles/subpage.css` di-import via Tailwind v4 `@layer components`. Jangan jadi utility classes.

### 4.5 Motion (SMOOTH default)

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .6s ease, transform .6s ease;
}
.reveal.in { opacity: 1; transform: none; }
.reveal-delay-1 { transition-delay: .07s; }
.reveal-delay-2 { transition-delay: .14s; }
.reveal-delay-3 { transition-delay: .21s; }
.reveal-delay-4 { transition-delay: .28s; }
.reveal-delay-5 { transition-delay: .35s; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  .marquee-track, .phone, .chip, .ring-3 { animation: none !important; }
}
```

---

## 5. PROJECT STRUCTURE

```
mediapro-web/
├── public/
│   ├── favicon.svg
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── og-default.png             # 1200x630
│   ├── robots.txt                 # AI crawler whitelist (lihat section 10.2)
│   ├── llms.txt                   # GEO entry point (lihat section 11.2)
│   ├── llms-full.txt              # GEO full content
│   └── images/
│       ├── hero-phone.png
│       ├── about-mockup.png
│       ├── services-visual.png
│       ├── footer-cta.png
│       ├── testimonial-1.webp
│       ├── testimonial-2.png
│       ├── testimonial-3.jpg
│       └── trusted/
│           ├── alfatihah.png
│           ├── biro-hukum.png
│           ├── rumah-anak-surga.png
│           └── panti-bayi-jogja.png
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── MobileMenu.astro
│   │   ├── ui/
│   │   │   ├── Button.astro
│   │   │   ├── Eyebrow.astro
│   │   │   ├── DisplayHeading.astro
│   │   │   ├── SectionHeading.astro
│   │   │   ├── Lede.astro
│   │   │   ├── Reveal.astro
│   │   │   ├── DefinitionBlock.astro      # GEO: 40-60 word definition
│   │   │   └── FactCard.astro             # GEO: citable stat with source
│   │   ├── icons/
│   │   │   └── *.astro                    # 24 icons port dari Icons.jsx
│   │   ├── seo/
│   │   │   ├── BaseSEO.astro              # meta + OG + canonical
│   │   │   ├── JsonLd.astro               # render schema
│   │   │   └── Breadcrumbs.astro          # visible + structured
│   │   └── sections/
│   │       ├── Hero.astro
│   │       ├── Marquee.astro
│   │       ├── About.astro
│   │       ├── ServicesIntro.astro
│   │       ├── Services.astro
│   │       ├── Cta.astro
│   │       ├── Stats.astro
│   │       ├── Why.astro
│   │       ├── Testimonials.astro
│   │       └── FooterCta.astro
│   ├── content/
│   │   ├── config.ts                      # Content Layer API
│   │   ├── services.json
│   │   ├── reasons.json
│   │   ├── testimonials.json
│   │   ├── stats.json
│   │   ├── trusted-logos.json
│   │   └── faqs.json                      # untuk FAQ page (5 kategori)
│   ├── data/
│   │   ├── site.ts                        # site metadata
│   │   └── schemas/                       # JSON-LD schema generators
│   │       ├── organization.ts
│   │       ├── professional-service.ts
│   │       ├── service-catalog.ts
│   │       ├── website.ts
│   │       ├── breadcrumb.ts
│   │       ├── faq-page.ts
│   │       └── product-review.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro               # html shell, meta, JSON-LD
│   │   └── SubpageLayout.astro            # untuk contact, faq, terms, disclaimer
│   ├── lib/
│   │   ├── seo.ts                         # SEO helpers
│   │   ├── geo.ts                         # GEO helpers (llms.txt generator)
│   │   ├── reveal.ts                      # IntersectionObserver vanilla
│   │   ├── stat-counter.ts                # animate counter
│   │   ├── header-scroll.ts               # scroll state
│   │   ├── faq-filter.ts                  # category filter
│   │   ├── faq-accordion.ts               # accordion logic
│   │   └── contact-form.ts                # multi-select pills + submit
│   ├── pages/
│   │   ├── index.astro                    # = Media Pro Redesign v2.html
│   │   ├── contact.astro                  # = contact.html
│   │   ├── faq.astro                      # = faq.html (17 Qs, 5 kategori)
│   │   ├── terms.astro                    # = terms.html (13 sections, sticky TOC)
│   │   ├── disclaimer.astro               # = disclaimer.html (9 sections)
│   │   ├── 404.astro
│   │   ├── llms.txt.ts                    # dynamic llms.txt endpoint (GEO)
│   │   └── llms-full.txt.ts               # dynamic full content endpoint
│   └── styles/
│       ├── global.css                     # entry: tailwind + tokens + components
│       ├── tokens.css                     # @theme blocks
│       ├── components.css                 # all .btn/.card/.section etc
│       ├── subpage.css                    # subpage-specific (TOC, accordion, form)
│       └── animations.css                 # @keyframes
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── bun.lock
├── .env.example
├── .gitignore
└── README.md
```

---

## 6. PAGES TO BUILD

### 6.1 `/` — Homepage (`src/pages/index.astro`)

**Source**: `Media Pro Redesign v2.html` + `app.jsx` + `components/*.jsx`

Section order:
1. **Header** (sticky, scroll-aware) — brand + nav (Home/About/Services/Contact) + "Get Started" CTA → mailto
2. **Hero** (`#top`) — eyebrow "We are Media Pro Creative" + H1 "Crafting brands that **stand out**..." + lede + 2 CTA + 3 hero meta (10+ yrs, 25K+ brands, 4.7★) + phone stage (rings, 3 floating chips, hero phone image)
3. **Marquee** — "Trusted by 25,000+ brands across 40+ countries" + 4 logo loop CSS-only
4. **About** (`#about`) — H2 "More than 10 years of digital marketing expertise" + 2 bullets + CTA + visual + VMM grid (Vision/Mission/Motto)
5. **ServicesIntro** — H2 "Innovative strategies, measurable success" + lede + highlight box "98% client satisfaction" + CTA + visual
6. **Services** (`#services`) — 6 service cards (data dari `services.json`)
7. **Cta** (`#contact`) — H2 display "Making your brand **stand out** online" + 2 CTAs + bg-grid SVG
8. **Stats** — 4 animated counters (91K+, 84K+, 42+, 4.7) + alternating red/yellow/gold plus signs
9. **Why** — H2 "The power to transform *your digital strategy*" + 4 reason cards
10. **Testimonials** — 2 growth stats (68% Business Growth, 42% Conversion Lift) + 3 testimonials (Marketing Director, E-commerce Founder, CMO — bukan kota Indonesia lagi)
11. **FooterCta** — H2 display "Ready to scale? Bring us your **best idea**" + WhatsApp + email CTA + visual
12. **Footer** — 4-col grid + bottom row (copyright + social icons)

### 6.2 `/contact` — Contact (`contact.astro`)

**Source**: `contact.html`

- Subpage hero dengan crumbs "Home / Contact"
- 3 contact cards: Email, WhatsApp, Hours (09:00–19:00, Global · 24/7 async)
- Contact form:
  - Name, email, company (optional)
  - **Service multi-select pills**: Web Development, Google Ads, Meta Ads, SEO, Content, Consulting
  - **Budget pills (USD, single-select)**: `<$1K`, `$1K–$3K`, `$3K–$10K`, `$10K–$25K`, `$25K+`, "Not sure yet"
  - Timeline dropdown
  - Message textarea
  - Consent checkbox (GDPR-aware)
  - Submit button
- Success state setelah submit
- Form behavior: client-side validation; default action = WhatsApp deep link dengan body terisi (zero JS server). Kalau Bun adapter aktif, opsional POST ke `/api/contact`.

### 6.3 `/faq` — FAQ (`faq.astro`)

**Source**: `faq.html`

- Subpage hero dengan crumbs
- **5 category filter pills**: All, General, Services, Pricing, Process, Results
- 17 FAQ items dalam accordion (data dari `faqs.json`)
- Tiap FAQ wajib include `FAQPage` schema yang lengkap
- Filter state: client-side, JS minimal (~2KB)
- "Still have questions?" CTA di bawah → /contact

### 6.4 `/terms` — Terms (`terms.astro`)

**Source**: `terms.html`

- Subpage hero
- 2-col layout: left = sticky TOC, right = content
- 13 sections (Privacy Policy + Terms of Service combined)
- Sticky TOC dengan auto-highlight current section (IntersectionObserver)

### 6.5 `/disclaimer` — Disclaimer (`disclaimer.astro`)

**Source**: `disclaimer.html`

- Same layout sebagai `/terms`, 9 sections (no-guarantee, third-party, professional advice, dll)

### 6.6 404 (`404.astro`)

- Header + 404 hero + back to home CTA + footer

---

## 7. COMPONENT SPECS

### 7.1 `<Reveal />`

```astro
---
// src/components/ui/Reveal.astro
interface Props {
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: keyof HTMLElementTagNameMap;
  class?: string;
}
const { delay = 0, as: Tag = 'div', class: className = '', ...rest } = Astro.props;
---
<Tag class:list={['reveal', delay && `reveal-delay-${delay}`, className]} {...rest}>
  <slot />
</Tag>
```

`src/lib/reveal.ts` (vanilla, **bukan React**):

```ts
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```

Load **sekali** di `BaseLayout.astro`:
```astro
<script>
  import '../lib/reveal';
</script>
```

### 7.2 `<Stats />` Counter

`src/lib/stat-counter.ts`:

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
  const { value, suffix, plus, decimals } = parseTarget(el.dataset.statTarget!);
  let started = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !started) {
        started = true;
        const start = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (value * eased).toFixed(decimals) + suffix + (plus ? '+' : '');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.4 });

  io.observe(el);
});
```

Markup: `<span class="num" data-stat-target="91K+">0</span>`

### 7.3 `<Marquee />` — CSS-only

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-33.333%); }
}
.marquee-track {
  display: flex;
  gap: 64px;
  animation: marquee 40s linear infinite;
  width: max-content;
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}
```

### 7.4 `<DefinitionBlock />` (GEO-critical)

```astro
---
// src/components/ui/DefinitionBlock.astro
// Render 40-60 word definition di awal halaman/section.
// Format yang AI suka: "Topic is X. It does Y. It's used for Z."
interface Props {
  term: string;
  definition: string;  // 40-60 words, satu paragraf, definitif
}
const { term, definition } = Astro.props;
---
<div class="definition-block" itemscope itemtype="https://schema.org/DefinedTerm">
  <p class="lede">
    <strong itemprop="name">{term}</strong>
    <span itemprop="description">{definition}</span>
  </p>
</div>
```

Wajib dipakai di tiap landing section utama (Hero, Services, About) — section 11 detail.

### 7.5 `<FactCard />` (GEO-critical)

```astro
---
// src/components/ui/FactCard.astro
// Citable statistic dengan source. AI 40% lebih sering quote content yang ada source-nya.
interface Props {
  metric: string;       // e.g. "91,000+"
  label: string;        // e.g. "projects delivered"
  source?: string;      // e.g. "Media Pro internal data, 2026"
  sourceUrl?: string;
}
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

### 7.6 `<Header />`, `<Footer />`, `<Button />`, dst

Lihat detail di section 7 prompt sebelumnya — sama persis. Tambahan:
- Active link state via prop `active="home" | "about" | "services" | "contact"`
- All `target="_blank"` wajib `rel="noopener noreferrer"`

---

## 8. CONTENT COLLECTIONS

`src/content/config.ts`:

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
    longDesc: z.string().optional(),       // GEO: deep content untuk AI citation
    keyOutcome: z.string().optional(),     // GEO: quotable outcome
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
    role: z.string(),                       // CMO / Marketing Director / E-commerce Founder
    metric: z.string().optional(),          // GEO: extract number, "180% organic traffic"
  }),
});

const stats = defineCollection({
  loader: file('./src/content/stats.json'),
  schema: z.object({
    id: z.string(),
    num: z.string(),
    label: z.string(),
    source: z.string().optional(),          // GEO: cite source
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
    question: z.string(),                   // GEO: phrase as natural question
    answer: z.string(),                     // GEO: 40-60 word direct answer di awal
    expandedAnswer: z.string().optional(),  // detail tambahan
  }),
});

export const collections = { services, reasons, testimonials, stats, trustedLogos, faqs };
```

Seed dari handoff: ekstrak dari `Services.jsx`, `Why.jsx`, `Testimonials.jsx`, `Stats.jsx`, `Marquee.jsx`, `faq.html`. Jangan ngarang konten.

---

## 9. SOURCE FILE MAPPING

| Handoff file | Astro target | Catatan |
|---|---|---|
| `Media Pro Redesign v2.html` | `src/pages/index.astro` + `BaseLayout.astro` | Final state, drop v1 + tweaks panel |
| `<head>` content (meta, OG, JSON-LD) | `BaseLayout.astro` + `data/schemas/*.ts` | Generate JSON-LD via helpers |
| `<noscript>` fallback | hapus (Astro static = HTML pre-rendered, no fallback needed) | |
| `app.jsx` | `index.astro` (compose section) | |
| `components/Icons.jsx` | `src/components/icons/*.astro` | 1 file per icon |
| `components/Reveal.jsx` | `src/components/ui/Reveal.astro` + `src/lib/reveal.ts` | Vanilla IntersectionObserver |
| `components/Header.jsx` | `src/components/layout/Header.astro` + `src/lib/header-scroll.ts` | |
| `components/Hero.jsx` | `src/components/sections/Hero.astro` | Phone img: `loading="eager"`, `fetchpriority="high"`, preload |
| `components/Marquee.jsx` | `src/components/sections/Marquee.astro` | CSS-only |
| `components/About.jsx` | `src/components/sections/About.astro` | |
| `components/ServicesIntro.jsx` | `src/components/sections/ServicesIntro.astro` | |
| `components/Services.jsx` | `src/components/sections/Services.astro` | Data dari content collection |
| `components/Cta.jsx` | `src/components/sections/Cta.astro` | |
| `components/Stats.jsx` | `src/components/sections/Stats.astro` + `src/lib/stat-counter.ts` | |
| `components/Why.jsx` | `src/components/sections/Why.astro` | |
| `components/Testimonials.jsx` | `src/components/sections/Testimonials.astro` | Roles bukan kota |
| `components/Footer.jsx` | `src/components/sections/FooterCta.astro` + `src/components/layout/Footer.astro` | Split |
| `contact.html` | `src/pages/contact.astro` + `SubpageLayout.astro` | Form pills logic |
| `faq.html` | `src/pages/faq.astro` | Category filter + accordion |
| `terms.html` | `src/pages/terms.astro` | Sticky TOC + content |
| `disclaimer.html` | `src/pages/disclaimer.astro` | Sticky TOC + content |
| `styles-light.css` | `src/styles/{tokens,components,animations}.css` | Split sesuai layer |
| `styles-subpage.css` | `src/styles/subpage.css` | |
| `styles.css` (dark luxe v1) | **SKIP** | Sudah pivot ke light |
| `Media Pro Redesign.html` (v1 dark) | **SKIP** | v1 sudah di-replace v2 |
| `app.jsx` mood/density/motion logic | **SKIP** | Locked default Bold + Compact + Smooth |
| `tweaks-panel.jsx` | **SKIP** | Tooling Claude Design |
| Inline `<style>` mood variants di v2 HTML | **SKIP** | |
| `robots.txt` | `public/robots.txt` (UPGRADE — section 10.2) | Tambah AI crawlers explicit |
| `sitemap.xml` | generate via `@astrojs/sitemap` | Auto |
| External image hotlinks (mediapro.work URLs) | download → `public/images/` | Self-host wajib |

---

## 10. SEO REQUIREMENTS (PROFESSIONAL TIER)

### 10.1 Meta + OG + Twitter (per page)

`BaseLayout.astro` Props: `title`, `description`, `canonical?`, `ogImage?`, `noindex?`, `pageType?` (`'website' | 'article' | 'contact'`)

**Per-page title strategy** (≤60 chars):
| Page | Title |
|---|---|
| `/` | `Media Pro — Global Digital Marketing Agency \| SEO, Ads & Web Dev` |
| `/contact` | `Contact Media Pro — Free Digital Marketing Consultation` |
| `/faq` | `FAQ — Digital Marketing Services \| Media Pro` |
| `/terms` | `Terms of Service & Privacy Policy — Media Pro` |
| `/disclaimer` | `Disclaimer — Media Pro Digital Marketing` |

**Per-page meta description** (≤160 chars):
- Tiap halaman wajib unik, deskriptif, mention brand + value prop + CTA implicit
- Hindari duplikasi homepage description di subpages

### 10.2 robots.txt — **AI Crawler Whitelist (KRITIS untuk GEO)**

`public/robots.txt`:

```
# Media Pro robots.txt — SEO + GEO friendly
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# Search engines
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

# Polite throttle
Crawl-delay: 1

# Sitemaps
Sitemap: https://mediapro.work/sitemap-index.xml
Sitemap: https://mediapro.work/llms.txt
```

> **Penting**: Cek Cloudflare/CDN — sejak 2025 default Cloudflare bisa block AI bots. Pastikan di dashboard Cloudflare, "AI Bot Management" allow GPTBot, ClaudeBot, PerplexityBot.

### 10.3 Sitemap

Pakai `@astrojs/sitemap` di `astro.config.mjs`:

```ts
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mediapro.work',
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
});
```

Output: `dist/sitemap-index.xml` + `dist/sitemap-0.xml`. Submit ke Google Search Console + Bing Webmaster Tools.

### 10.4 JSON-LD (port + upgrade)

Generate via `src/data/schemas/*.ts`. Render di `BaseLayout.astro` via `<JsonLd />` component.

**Wajib di SEMUA halaman**:
1. **`Organization`** — Media Pro Creative Limited (foundingDate 2014, sameAs, contactPoint)
2. **`WebSite`** — name, url, publisher, potentialAction (SearchAction)
3. **`BreadcrumbList`** — sesuai page

**Wajib di homepage `/`**:
4. **`ProfessionalService`** — aggregateRating 4.7 / 84000 reviews
5. **`Service`** + `OfferCatalog` — 10 services dengan deskripsi tiap-tiap
6. **`Product`** + `Review` (3 reviews dari testimonial)
7. **`FAQPage`** (4 Q&A homepage)

**Wajib di `/faq`**:
8. **`FAQPage`** lengkap dengan 17 Q&A (semua kategori)

**Wajib di `/contact`**:
9. **`ContactPage`** + nested `Organization`

**Tambahan GEO** (section 11):
10. **`AboutPage`** di section About dengan `mainEntity: Organization`
11. **`Article`** schema kalau bikin blog post (untuk masa depan)

Contoh `src/data/schemas/organization.ts`:

```ts
import { SITE } from '../site';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: 'Media Pro Creative Limited',
  alternateName: 'Media Pro',
  url: SITE.url,
  logo: { '@type': 'ImageObject', url: `${SITE.url}/og-default.png`, width: 1200, height: 630 },
  description: 'Premium global digital marketing agency. Web Development, Google Ads, Meta Ads, SEO and Consulting Services for brands worldwide.',
  foundingDate: '2014',
  email: SITE.email,
  telephone: SITE.phone,
  address: { '@type': 'PostalAddress', addressLocality: 'Remote', addressCountry: 'Worldwide' },
  sameAs: [`https://wa.me/${SITE.waNumber}`],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SITE.phone,
    contactType: 'Customer Service',
    email: SITE.email,
    areaServed: 'Worldwide',
    availableLanguage: ['English'],
  },
  knowsAbout: [
    'Search Engine Optimization', 'Google Ads', 'Meta Ads', 'Social Media Marketing',
    'Content Marketing', 'Email Marketing', 'Influencer Marketing', 'Web Development',
    'Analytics', 'Digital Marketing Consulting',
  ],
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10 },
} as const;
```

### 10.5 Performance & Core Web Vitals

Target Lighthouse:
- **Performance ≥ 95** (mobile + desktop)
- **Accessibility ≥ 95**
- **Best Practices ≥ 95**
- **SEO = 100**

Specific:
- **LCP** < 1.5s (preload hero phone image, `fetchpriority="high"`)
- **CLS** < 0.05 (set width/height pada SEMUA `<img>`)
- **INP** < 100ms (zero blocking JS di critical path)
- **JS budget**: ≤ 15 KB gzipped total
- Image: AVIF + WebP via Astro `<Image />`
- Font: Astro Fonts API (auto-subset, self-host)
- CSS: critical inline, Tailwind v4 generate hanya class yang dipakai

### 10.6 Accessibility (WCAG 2.1 AA — boost SEO ranking juga)

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section aria-labelledby>`, `<article>`, `<footer>`
- `.skip-link` ke `#main`
- Color contrast: cek `--color-ink-mute` (#7A7A7A) di white = ratio 4.55 (AA pass)
- Focus styles: outline 2px solid `--color-yellow-dark`, offset 3px
- Mobile menu: `aria-expanded`, `aria-controls`, focus trap, ESC close
- Decorative SVG: `aria-hidden="true"`. Informational SVG: `<title>` di dalam
- Marquee: `aria-hidden="true"` (decorative)
- Stat counter: `aria-label` static yang gak berubah
- Form: `<label for="">` wajib, error pakai `aria-describedby` + `aria-invalid`

### 10.7 Security Headers (kalau pakai SSR adapter)

- CSP: `security.csp: true` di `astro.config.mjs`
- All `target="_blank"` → `rel="noopener noreferrer"`
- WhatsApp/email simpan di `data/site.ts`, jangan hardcode

### 10.8 Environment Variables

`.env.example`:
```
PUBLIC_SITE_URL=https://mediapro.work
PUBLIC_WA_NUMBER=6285129992227
PUBLIC_EMAIL=mediapro@mediapro.work
PUBLIC_GA_ID=                       # opsional, GA4
PUBLIC_META_PIXEL_ID=               # opsional
PUBLIC_GSC_VERIFICATION=            # Google Search Console
PUBLIC_BING_VERIFICATION=           # Bing Webmaster
```

`astro.config.mjs`:
```ts
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://mediapro.work',
  // ...
  env: {
    schema: {
      PUBLIC_SITE_URL:         envField.string({ context: 'client', access: 'public' }),
      PUBLIC_WA_NUMBER:        envField.string({ context: 'client', access: 'public' }),
      PUBLIC_EMAIL:            envField.string({ context: 'client', access: 'public' }),
      PUBLIC_GA_ID:            envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_META_PIXEL_ID:    envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GSC_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_BING_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  security: { csp: true },
});
```

---

## 11. GEO REQUIREMENTS (GENERATIVE ENGINE OPTIMIZATION)

> **Tujuan**: Media Pro **dikutip** oleh ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews ketika user tanya soal digital marketing agency.

### 11.1 12-Point GEO Checklist (per page)

Setiap halaman wajib lulus checklist:

- [ ] **1. Static HTML** — content render di server, no client-side rendering only
- [ ] **2. AI crawlers allowed** — robots.txt + Cloudflare config
- [ ] **3. Definition block** — opening 40-60 word definition di awal page utama
- [ ] **4. Answer-first format** — H2/H3 sebagai pertanyaan, jawaban langsung di awal section
- [ ] **5. Fact density** — min 1 statistik dengan source per 500 words
- [ ] **6. Schema.org markup** — Organization, Service, FAQ, Article, Review (sesuai page type)
- [ ] **7. llms.txt** — root file dengan summary + key pages
- [ ] **8. Modular sections** — tiap H2/H3 self-contained, bisa di-quote standalone
- [ ] **9. Named entities** — sebut "Media Pro" + service names eksplisit (jangan "we" doang)
- [ ] **10. Citation-friendly format** — bullet lists, comparison tables, numbered steps
- [ ] **11. Last updated** — timestamp visible (`<time datetime>`)
- [ ] **12. Cross-page consistency** — fact + claim sama di semua halaman (LLM detect inconsistency)

### 11.2 `llms.txt` File (KRITIS)

`src/pages/llms.txt.ts` (dynamic endpoint):

```ts
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

export const GET: APIRoute = async () => {
  const content = `# Media Pro Creative Limited

> Premium global digital marketing agency since 2014. We help brands worldwide grow with Web Development, Google Ads, Meta Ads, SEO, Content Marketing, and Consulting Services. Trusted by 25,000+ brands across 40+ countries with a 4.7 client rating from 84,000+ reviews.

## Key Information

- **Founded**: 2014
- **Reach**: 40+ countries, 25,000+ brands served
- **Rating**: 4.7 / 5 (84,000+ reviews)
- **Projects delivered**: 91,000+
- **Client satisfaction**: 98%
- **Contact**: ${SITE.email} · WhatsApp +${SITE.waNumber}
- **Hours**: 09:00–19:00 + Global · 24/7 async
- **Payment**: NET-14, USD invoicing, SWIFT/Wise/Stripe/PayPal

## Services Offered

1. **Search Engine Optimization (SEO)** — Increase organic traffic, credibility, long-term visibility. Retainer from USD 1,200/month.
2. **Google Ads** — Search, display, shopping, performance max campaigns. Management from USD 750/month + minimum ad spend USD 1,500/month.
3. **Meta Ads** — Facebook & Instagram advertising for awareness, leads, sales. Same pricing as Google Ads.
4. **Web Development** — Landing pages USD 1,500. Marketing sites USD 4,500. Custom builds USD 12,000+.
5. **Social Media Marketing** — Build community, increase engagement, drive traffic.
6. **Content Marketing** — Educate audiences, build authority, nurture leads.
7. **Email Marketing** — Increase retention, encourage repeat purchases, convert prospects.
8. **Influencer Marketing** — Expand reach via authentic recommendations.
9. **Analytics & Reporting** — Measure ROI, identify optimizations, ensure accountability.
10. **Consulting Services** — USD 200/hour. Strategy audits and roadmaps.

## Why Brands Choose Media Pro

- **Proven Track Record**: 91,000+ projects delivered with documented results.
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
- Founding year: 2014
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

`/llms-full.txt` — versi lengkap dengan semua FAQ + service description detail.

### 11.3 Per-Section GEO Patterns

#### Hero — Definition-first

```astro
<!-- BEFORE (generic, AI hard to quote) -->
<h1>Crafting brands that stand out in a noisy digital world.</h1>

<!-- AFTER (with hidden GEO signal) -->
<header itemscope itemtype="https://schema.org/Organization">
  <span class="eyebrow" itemprop="slogan">We are Media Pro Creative</span>
  <h1 id="hero-heading">
    Crafting brands that <span class="accent">stand out</span> in a noisy digital world.
  </h1>
  <p class="lede" itemprop="description">
    <strong>Media Pro is a global digital marketing agency founded in 2014.</strong>
    We help brands worldwide grow through Web Development, Google Ads, Meta Ads, SEO, and Consulting —
    trusted by 25,000+ brands across 40+ countries with a 4.7 client rating.
  </p>
  <!-- ... rest of hero ... -->
</header>
```

#### Services — Self-contained chunks

Tiap service card harus self-contained:

```astro
<article class="service-card" itemscope itemtype="https://schema.org/Service">
  <span class="num">01 / 06</span>
  <h3 itemprop="name">Search Engine Optimization (SEO)</h3>
  <p itemprop="description">
    SEO is a long-term marketing strategy that improves a website's visibility in organic search results.
    Media Pro's SEO retainer starts at USD 1,200/month, with results typically visible in 3–6 months
    and significant gains in 6–12 months.
  </p>
  <meta itemprop="provider" content="Media Pro Creative Limited" />
  <meta itemprop="serviceType" content="Search Engine Optimization" />
</article>
```

#### FAQ — AI's favorite format

`/faq` page: tiap FAQ wajib pattern:
- Question = natural sentence (cara user beneran nanya, bukan keyword stuffing)
- Answer dimulai dengan **definitive opening 40-60 words**, lalu detail
- Wrap dengan FAQPage schema
- Cover questions:
  - "How long does it take to see results from SEO?"
  - "What's the minimum budget for Google or Meta Ads?"
  - "How much does a marketing website cost?"
  - "Do you work with international clients?"
  - "What's included in the management fee?"
  - dll (17 total dari handoff)

#### Stats — Citable Metrics

```astro
<section class="stats" itemscope itemtype="https://schema.org/Dataset">
  <meta itemprop="name" content="Media Pro Performance Metrics 2026" />
  <meta itemprop="creator" content="Media Pro Creative Limited" />
  <div class="stats-grid">
    <div class="stat">
      <span class="num" data-stat-target="91K+" itemprop="value">0</span>
      <span class="label" itemprop="description">projects delivered since 2014</span>
    </div>
    <!-- ... -->
  </div>
  <small class="stats-source">
    Source: Media Pro internal data, last updated <time datetime="2026-04-30">April 2026</time>
  </small>
</section>
```

### 11.4 Content Tone Rules (GEO)

- **Use brand name explicitly** — minimal 1× per section. Bukan "we" terus-terusan.
- **Specific numbers** — "180% organic traffic increase" bukan "significant traffic growth"
- **Named frameworks** — kalau ada methodology, kasih nama (e.g., "Media Pro 4-Step Funnel: Audit → Strategy → Execute → Optimize")
- **Comparison tables** — di FAQ, kalau ada question "X vs Y", bikin table format. AI suka quote tables.
- **Bullet/numbered lists** untuk steps, criteria, features — AI extract ini lebih baik dari paragraf
- **Date stamps** — `<time datetime="2026-04-30">April 2026</time>` di hero, footer, key sections

### 11.5 Cross-Channel Authority (Manual Action Required)

Engineering tidak cover ini, tapi catet di README untuk client:
- Setup Google Business Profile
- Submit ke industry directories (Clutch, GoodFirms, Sortlist)
- LinkedIn company page consistency
- Reddit/Quora answer authentic untuk industry questions
- Earn citations dari third-party (PR, guest posts, podcast appearances)
- Media Pro page di Wikipedia (kalau notable enough)

---

## 12. EXECUTION ORDER

### Phase 1 — Scaffold (~30 menit)
1. `bun create astro@latest mediapro-web -- --template minimal --typescript strict --git --install`
2. `cd mediapro-web && bun add tailwindcss @tailwindcss/vite`
3. `bun add -d @astrojs/sitemap @astrojs/check`
4. Konfigurasi `astro.config.mjs` (Fonts API, sitemap, env, CSP)
5. Bikin folder structure sesuai section 5
6. Setup `data/site.ts` dengan semua brand info

### Phase 2 — Design System (~1 jam)
7. Port `styles-light.css` → split ke `tokens.css` (`@theme`) + `components.css` + `animations.css`
8. Port `styles-subpage.css` → `subpage.css`
9. Bikin `global.css` entry
10. Test render plain page, tokens berfungsi

### Phase 3 — Foundation Components (~2 jam)
11. Port 24 icons → `icons/*.astro`
12. Bikin SEO components: `BaseSEO.astro`, `JsonLd.astro`, `Breadcrumbs.astro`
13. Bikin `BaseLayout.astro` + `SubpageLayout.astro`
14. Bikin `Header.astro` + `Footer.astro` + `MobileMenu.astro`
15. Bikin UI primitives: `Button`, `Eyebrow`, `DisplayHeading`, `SectionHeading`, `Lede`, `Reveal`, **`DefinitionBlock`**, **`FactCard`**
16. Bikin lib scripts: `reveal.ts`, `header-scroll.ts`, `stat-counter.ts`

### Phase 4 — Schema & GEO Setup (~1 jam)
17. Bikin `data/schemas/*.ts` — 7 JSON-LD generators
18. Bikin `pages/llms.txt.ts` + `pages/llms-full.txt.ts`
19. Update `public/robots.txt` dengan AI crawler whitelist
20. Setup sitemap integration di `astro.config.mjs`

### Phase 5 — Content Collections (~30 menit)
21. Setup `content/config.ts`
22. Bikin 6 file JSON content (services, reasons, testimonials, stats, trustedLogos, faqs)
23. Ekstrak konten persis dari handoff JSX + `faq.html`

### Phase 6 — Homepage Sections (~3 jam)
24. Bikin 11 section components (Hero, Marquee, About, ServicesIntro, Services, Cta, Stats, Why, Testimonials, FooterCta + Footer)
25. **Setiap section apply GEO pattern** dari section 11.3 (definition, named entities, schema)
26. Compose di `index.astro`

### Phase 7 — Subpages (~2 jam)
27. Bikin `contact.astro` (form pills + validation)
28. Bikin `faq.astro` (filter + accordion + FAQPage schema lengkap 17 Qs)
29. Bikin `terms.astro` (sticky TOC + 13 sections)
30. Bikin `disclaimer.astro` (sticky TOC + 9 sections)
31. Bikin `404.astro`

### Phase 8 — Polish & Audit (~2 jam)
32. Lighthouse audit: target ≥95 di semua kategori (mobile + desktop)
33. A11y audit: pakai axe-devtools
34. Test `prefers-reduced-motion`
35. Test mobile (375px) + tablet (768px) + desktop (1440px)
36. **GEO audit checklist** (section 11.1) per page
37. Validate JSON-LD: https://validator.schema.org
38. Validate llms.txt: cek manual format match standard
39. Test robots.txt: https://www.google.com/webmasters/tools/robots-testing-tool
40. Cross-browser: Chrome, Safari, Firefox

### Phase 9 — Deploy
41. Tulis `README.md` lengkap
42. Pilih deployment:
    - **Static (recommended)**: Netlify / Vercel / Cloudflare Pages
      - Build: `bun run build`
      - Output: `dist/`
      - **CRITICAL**: Kalau pakai Cloudflare, manually allow AI bots (GPTBot, ClaudeBot, PerplexityBot) di dashboard → Bots → AI Bot Management
    - **VPS dengan Nginx/Caddy**: install Bun, build, serve `dist/`
    - **SSR (kalau form endpoint butuh)**: install `@wyattjoh/astro-bun-adapter`, `output: 'server'`, PM2
43. Submit sitemap ke Google Search Console + Bing Webmaster
44. Submit URL ke IndexNow API (untuk Bing crawl cepet)
45. Verify llms.txt accessible di `https://mediapro.work/llms.txt`

---

## 13. DELIVERABLES

1. **Repo Git** dengan struktur sesuai section 5
2. **`README.md`**: setup, env, build, deploy, content update, GEO maintenance guide
3. **Lighthouse report** (mobile + desktop) untuk `/`, `/contact`, `/faq` — wajib ≥95
4. **GEO audit report**: checklist 11.1 lulus per page
5. **Screenshot** mobile (375px) + desktop (1440px) untuk semua 5 page
6. **Schema validation** screenshot dari validator.schema.org
7. **llms.txt accessible** + format valid

---

## 14. OUT OF SCOPE

❌ Tweaks panel, mood/density/motion variants
❌ Dark mode (`styles.css` v1)
❌ Backend admin / CMS
❌ Database / Supabase / Neon
❌ Authentication / member area
❌ Payment gateway
❌ Indonesian language version (placeholder hreflang OK, content tidak duplicate)
❌ Live chat widget eksternal
❌ Blog (siapkan struktur untuk masa depan, tapi tidak implement)
❌ Hot-link external image dari mediapro.work — wajib download

---

## 15. ACCEPTANCE CRITERIA

Project DONE kalau:
- ✅ `bun install && bun run build` zero error/warning
- ✅ `bun run preview` jalan, semua 5 page (+ 404) navigable
- ✅ Visual match handoff `Media Pro Redesign v2.html` di desktop (1440px) + mobile (375px)
- ✅ Lighthouse ≥95 Performance, Accessibility, Best Practices, =100 SEO (mobile + desktop)
- ✅ `bun run astro check` zero error
- ✅ Bundle size: total JS ≤ 15 KB gzipped
- ✅ JSON-LD valid (schema.org validator)
- ✅ Sitemap.xml auto-generated, valid, submit-ready
- ✅ `llms.txt` accessible di root, format match Anthropic spec
- ✅ robots.txt allow GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended
- ✅ Per-page meta unik (title ≤60 chars, description ≤160 chars)
- ✅ Hero phone preload + LCP < 1.5s
- ✅ Stats counter animate dari 0 ke target saat scroll
- ✅ Marquee CSS-only, tidak loncat saat loop
- ✅ FAQ filter + accordion smooth, FAQPage schema valid
- ✅ Contact form: pills work, WhatsApp deep link generate valid
- ✅ Sticky TOC di terms/disclaimer auto-highlight current section
- ✅ Mobile menu: focus trap, ESC close
- ✅ `prefers-reduced-motion`: semua animasi disable
- ✅ All `target="_blank"` punya `rel="noopener noreferrer"`
- ✅ **GEO checklist 11.1 lulus per page**
- ✅ **Definition block ada di hero homepage**
- ✅ **All stats punya source attribution**
- ✅ **Brand name "Media Pro" muncul minimum 1x per section**
- ✅ Date stamp `<time datetime>` muncul di hero + footer + key sections

---

## 16. REFERENSI DOKUMENTASI

- Astro 6: https://docs.astro.build
- Astro 6 release: https://astro.build/blog/astro-6/
- Astro Fonts API: https://docs.astro.build/en/reference/experimental-flags/fonts/
- Astro Content Layer API: https://docs.astro.build/en/reference/content-loader-reference/
- Astro `astro:env`: https://docs.astro.build/en/guides/environment-variables/
- Astro Sitemap: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Tailwind v4: https://tailwindcss.com/docs
- Bun: https://bun.com/docs
- Bun adapter: https://github.com/wyattjoh/astro-bun-adapter
- Schema.org validator: https://validator.schema.org
- llms.txt spec: https://llmstxt.org
- GEO 2026 guide: https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster: https://www.bing.com/webmasters

---

## 17. CARA PAKAI

### A. One-shot
Paste seluruh prompt + lampirin handoff `media-pro-v1/`, perintah:
> "Kerjain Phase 1–9 secara berurutan. Stop di akhir tiap phase, tunjukin progress, lanjut kalau gue confirm."

### B. Bertahap
Pisah jadi 9 sesi. Tiap sesi paste section 1-4 + section relevan, kerjain 1 phase, review.

### C. Modifikasi scope
- Tambah blog → tambah collection `blog`, page `[...slug].astro`, `Article` schema, update `llms.txt`
- Tambah service detail page → buat `/services/[slug].astro` + content collection
- Tambah multi-language → install `@astrojs/i18n`, duplicate konten ke `/id/`, update hreflang

---

**END OF SUPERPROMPT**

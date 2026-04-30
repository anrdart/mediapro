# Media Pro — Astro 6 + Bun

Production-ready marketing site for Media Pro Creative Limited. Built with Astro 6, Tailwind CSS v4, and Bun.

## Setup

```bash
bun install
cp .env.example .env  # adjust as needed
bun run dev
```

## Commands

- `bun run dev` — start dev server at http://localhost:4321
- `bun run build` — type-check + production build to ./dist
- `bun run preview` — preview built site
- `bun run astro check` — TypeScript check only

## Content updates

- Brand constants & pricing: edit `src/data/site.ts`
- Services / FAQs / testimonials / stats: edit JSON in `src/content/`
- Terms & Disclaimer sections: edit `src/_extracted/terms-sections.ts` / `src/_extracted/disclaimer-sections.ts`
- Contact form options: edit `src/_extracted/contact-content.ts`
- JSON-LD schemas: `src/data/schemas/`
- llms.txt content: `src/pages/llms.txt.ts`

## Pages

| Route | Source |
|---|---|
| `/` | Homepage — 10 sections, animated stats, CSS marquee |
| `/contact` | Contact form with WhatsApp deep link |
| `/faq` | 17 Q&A with category filter + accordion |
| `/terms` | Privacy Policy + Terms — sticky TOC |
| `/disclaimer` | Service disclaimer — sticky TOC |
| `/404` | Custom 404 page |
| `/llms.txt` | GEO entry point for AI crawlers |
| `/llms-full.txt` | Full knowledge base for AI citation |
| `/sitemap-index.xml` | Auto-generated sitemap |

## Deployment

Static output in `dist/`. Deploy to Netlify, Vercel, or Cloudflare Pages.

```bash
bun run build   # output: dist/
```

**Cloudflare**: In the dashboard → Bots → AI Bot Management, verify GPTBot, ClaudeBot, PerplexityBot are allowed.

After deploy:
1. Submit `https://mediapro.work/sitemap-index.xml` to Google Search Console + Bing Webmaster.
2. Verify `https://mediapro.work/llms.txt` is accessible.
3. Validate JSON-LD via https://validator.schema.org.

## GEO Maintenance

- Update `src/data/site.ts` stats quarterly.
- Add new FAQ items to `src/content/faqs.json` as questions emerge.
- Refresh `<time datetime>` in Stats section yearly.

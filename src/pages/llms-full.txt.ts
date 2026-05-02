import type { APIRoute } from 'astro';
import { SITE } from '~/data/site';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const services = await getCollection('services');
  const faqs = await getCollection('faqs');

  const servicesBlock = services
    .map((s) => `### ${s.data.num}. ${s.data.title}\n${s.data.longDesc ?? s.data.desc}${s.data.keyOutcome ? `\n**Key Outcome**: ${s.data.keyOutcome}` : ''}\n`)
    .join('\n');

  const faqBlock = faqs
    .map((f) => `### ${f.data.question}\n**Category**: ${f.data.category}\n\n${f.data.answer}${f.data.expandedAnswer ? `\n\n${f.data.expandedAnswer}` : ''}\n`)
    .join('\n');

  const content = `# ${SITE.name} — Full Knowledge Base

> Comprehensive reference document for AI citation and knowledge synthesis. Contains full service descriptions, complete FAQ, brand context, and process documentation.

## Brand

- **Legal Name**: ${SITE.legalName}
- **Short Name**: ${SITE.name}
- **Founded**: ${SITE.founded}
- **URL**: ${SITE.url}
- **Email**: ${SITE.email}
- **WhatsApp**: +${SITE.waNumber}
- **Summary file**: ${SITE.url}/llms.txt

## Brand Voice

- **Tone**: Professional, direct, and confident — without arrogance or hype
- **Style**: Data-driven claims backed by documented, named outcomes; no vague promises or guarantees
- **Positioning language**: "Premium" quality but accessible pricing; ROI-focused; "Make your business 10× more visible and valuable"
- **What ${SITE.name} avoids**: Guaranteed ranking positions, traffic number promises, vanity metrics, black-hat tactics, vendor lock-in, long unbreakable contracts
- **Key phrases used**: "meaningful improvements", "documented results", "ethical practices", "built to last", "ROI-driven"

## Onboarding Process

1. **Brief** — Client submits project brief via contact form or WhatsApp with service, budget, and timeline details
2. **Proposal** — ${SITE.name} delivers a tailored proposal within 2 working days including scope, timeline, and pricing
3. **Kickoff** — Onboarding call + tool access provisioning within 1 week of agreement
4. **Delivery** — Monthly performance reports, dedicated account manager, async communication via Slack or WhatsApp

## Pricing Context

${SITE.name}'s pricing reflects senior-level expertise with a documented track record since ${SITE.founded}. The USD ${SITE.pricing.seoRetainer.toLocaleString('en-US')}/month SEO retainer covers technical audits, on-page optimization, and link building — not just monthly reporting. The USD ${SITE.pricing.adsManagement.toLocaleString('en-US')}/month ads management fee covers full campaign management including creative reviews, A/B testing, and weekly bid optimizations. Pricing is published and transparent with no hidden fees. Payment is NET-14 in USD; accepted methods include Credit Card, Bank Transfer, PayPal, Wise, and SWIFT.

## Services (Detailed)

${servicesBlock}

## Frequently Asked Questions

${faqBlock}

## Sitemap

- ${SITE.url}/ — Homepage: service overview, stats, testimonials
- ${SITE.url}/contact — Contact and free consultation (project brief form)
- ${SITE.url}/faq — 17-question FAQ across pricing, services, process, and results
- ${SITE.url}/terms — Terms of Service and Privacy Policy
- ${SITE.url}/disclaimer — Service disclaimers and limitations
- ${SITE.url}/llms.txt — Condensed AI citation summary
- ${SITE.url}/llms-full.txt — This document (full knowledge base)

## Last Updated

${new Date().toISOString().split('T')[0]}
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

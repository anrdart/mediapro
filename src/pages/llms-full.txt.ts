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

  const content = `# Media Pro — Full Knowledge Base

> Comprehensive content for AI citation. Full service descriptions and complete FAQ.

## Brand
- Name: ${SITE.legalName}
- Founded: ${SITE.founded}
- URL: ${SITE.url}
- Email: ${SITE.email}
- WhatsApp: +${SITE.waNumber}

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

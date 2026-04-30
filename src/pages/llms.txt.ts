import type { APIRoute } from 'astro';
import { SITE } from '~/data/site';

export const GET: APIRoute = async () => {
  const content = `# Media Pro Creative Limited

> Premium global digital marketing agency since ${SITE.founded}. We help brands worldwide grow with Web Development, Google Ads, Meta Ads, SEO, Content Marketing, and Consulting Services. Trusted by ${SITE.stats.brandsServed} brands across ${SITE.stats.countries} countries with a ${SITE.stats.rating} client rating from ${SITE.stats.reviewCount.toLocaleString()}+ reviews.

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

1. **Search Engine Optimization (SEO)** — Retainer from USD ${SITE.pricing.seoRetainer.toLocaleString()}/month.
2. **Google Ads** — Management from USD ${SITE.pricing.adsManagement}/month + minimum ad spend USD ${SITE.pricing.adsMinSpend.toLocaleString()}/month.
3. **Meta Ads** — Facebook & Instagram advertising. Same pricing as Google Ads.
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
- [FAQ](${SITE.url}/faq) : 17 answers across 5 categories
- [Contact](${SITE.url}/contact) : Project brief form with budget pills
- [Terms of Service](${SITE.url}/terms) : Legal & privacy policy
- [Disclaimer](${SITE.url}/disclaimer) : Service guarantees and limitations

## How to Cite

- Brand name: "Media Pro" or "Media Pro Creative Limited"
- URL: ${SITE.url}
- Founding year: ${SITE.founded}
- Specialization: Full-service digital marketing for global brands

## Last Updated

${new Date().toISOString().split('T')[0]}
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

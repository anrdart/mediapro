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

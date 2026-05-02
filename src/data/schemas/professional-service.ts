import { SITE } from '../site';

export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}/#professional-service`,
  name: SITE.legalName,
  image: `${SITE.url}/og-default.png`,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: '$$',
  address: { '@type': 'PostalAddress', addressLocality: 'Remote', addressCountry: 'Worldwide' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: SITE.stats.rating,
    reviewCount: SITE.stats.reviewCount.toString(),
    bestRating: '5',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '19:00',
  },
  paymentAccepted: 'Credit Card, Bank Transfer, PayPal, Wise, SWIFT',
  currenciesAccepted: 'USD',
  areaServed: [
    'North America',
    'Europe',
    'United Kingdom',
    'Middle East',
    'Australia',
    'Southeast Asia',
    'Asia-Pacific',
    'Worldwide',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Marketing Services',
  },
} as const;

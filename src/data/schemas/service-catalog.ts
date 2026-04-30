import { SITE } from '../site';

const SERVICES = ['Search Engine Optimization (SEO)','Google Ads Services','Meta Ads Services','Web Development','Social Media Marketing','Content Marketing','Email Marketing Campaigns','Influencer Marketing','Analytics & Reporting','Consulting Services'];

export const serviceCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Digital Marketing',
  provider: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Marketing Services',
    itemListElement: SERVICES.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  },
} as const;

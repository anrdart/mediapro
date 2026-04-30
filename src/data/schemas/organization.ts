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
  knowsAbout: ['Search Engine Optimization','Google Ads','Meta Ads','Social Media Marketing','Content Marketing','Email Marketing','Influencer Marketing','Web Development','Analytics','Digital Marketing Consulting'],
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10 },
} as const;

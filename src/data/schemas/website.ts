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

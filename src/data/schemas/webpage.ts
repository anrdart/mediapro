import { SITE } from '../site';

interface WebPageProps {
  type?: 'WebPage' | 'ContactPage' | 'AboutPage';
  url: string;
  title: string;
  description: string;
  speakable?: boolean;
}

export function webPageSchema({ type = 'WebPage', url, title, description, speakable = false }: WebPageProps) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: SITE.locale,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE.url}/#website` },
    ...(speakable && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '.lede'],
      },
    }),
  };
}

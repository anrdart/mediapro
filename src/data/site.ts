export const SITE = {
  url: 'https://mediapro.work',
  name: 'Media Pro',
  legalName: 'Media Pro Creative Limited',
  tagline: 'Crafting brands that stand out in a noisy digital world.',
  description: 'Premium global digital marketing agency. Web Development, Google Ads, Meta Ads, SEO and Consulting Services for brands worldwide.',
  entityAbstract: 'Full-service global digital marketing agency — SEO, Google Ads, Meta Ads, Web Development, and Consulting since 2014.',
  subject: 'Digital Marketing Services',
  classification: 'Business/Digital Marketing',
  category: 'Digital Marketing',
  founded: '2014',
  email: 'admin@mediapro.work',
  phone: '+1 (937) 772-2944',
  phoneDisplay: '+1 (937) 772-2944',
  waNumber: '+1(937)7722944',
  waLink: 'https://wa.me/19377722944',
  hours: '09:00–19:00 + Global · 24/7 async',
  language: 'en',
  locale: 'en-US',
  region: '001',
  themeColor: '#FFB804',
  ogImage: '/og-default.png',
  social: {
    instagram: 'https://www.instagram.com/mediapro.idn/',
    linkedin: 'https://www.linkedin.com/in/pt-media-pro-indonesia-2b85b2333/',
  },
  stats: {
    yearsExperience: '10+',
    brandsServed: '25,000+',
    countries: '40+',
    rating: '4.7',
    reviewCount: 84000,
    projectsDelivered: '91,000+',
    happyClients: '84,000+',
    companiesSupported: '42+',
    clientSatisfaction: '98%',
  },
  pricing: {
    landingPage: 1500,
    marketingSite: 4500,
    customBuild: 12000,
    adsManagement: 750,
    adsMinSpend: 1500,
    seoRetainer: 1200,
    consultingHourly: 200,
  },
  analytics: {
    gaId: 'G-DT7CCBXE4Z',
    gscVerification: 'YKisg7URFTkL0ORHmTk0q9e7N01bbZHMgubkqFdoGI8',
  },
} as const;

export type Site = typeof SITE;

/**
 * Build a WhatsApp deep link with a pre-filled greeting message.
 * Use context-appropriate greetings (e.g., "I'd like to discuss a project").
 */
export function waUrl(greeting?: string): string {
  if (!greeting) return SITE.waLink;
  return `${SITE.waLink}?text=${encodeURIComponent(greeting)}`;
}

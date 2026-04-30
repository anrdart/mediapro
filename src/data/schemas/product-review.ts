import { SITE } from '../site';

interface Testimonial { quote: string; name: string; role: string }

export function productReviewSchema(testimonials: Testimonial[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Media Pro Digital Marketing Services',
    description: 'Comprehensive digital marketing services including SEO, Google Ads, Meta Ads, and Web Development.',
    brand: { '@type': 'Brand', name: SITE.name },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: t.name, jobTitle: t.role },
      reviewBody: t.quote,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE.stats.rating,
      reviewCount: SITE.stats.reviewCount.toString(),
      bestRating: '5',
    },
  } as const;
}

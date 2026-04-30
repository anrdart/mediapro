import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const services = defineCollection({
  loader: file('./src/content/services.json'),
  schema: z.object({
    id: z.string(),
    num: z.string(),
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
    longDesc: z.string().optional(),
    keyOutcome: z.string().optional(),
  }),
});

const reasons = defineCollection({
  loader: file('./src/content/reasons.json'),
  schema: z.object({
    id: z.string(),
    icon: z.string(),
    title: z.string(),
    desc: z.string(),
  }),
});

const testimonials = defineCollection({
  loader: file('./src/content/testimonials.json'),
  schema: z.object({
    id: z.string(),
    quote: z.string(),
    img: z.string(),
    name: z.string(),
    role: z.string(),
    metric: z.string().optional(),
  }),
});

const stats = defineCollection({
  loader: file('./src/content/stats.json'),
  schema: z.object({
    id: z.string(),
    num: z.string(),
    label: z.string(),
    source: z.string().optional(),
  }),
});

const trustedLogos = defineCollection({
  loader: file('./src/content/trusted-logos.json'),
  schema: z.object({
    id: z.string(),
    src: z.string(),
    alt: z.string(),
  }),
});

const faqs = defineCollection({
  loader: file('./src/content/faqs.json'),
  schema: z.object({
    id: z.string(),
    category: z.enum(['general', 'services', 'pricing', 'process', 'results']),
    question: z.string(),
    answer: z.string(),
    expandedAnswer: z.string().optional(),
  }),
});

export const collections = { services, reasons, testimonials, stats, trustedLogos, faqs };

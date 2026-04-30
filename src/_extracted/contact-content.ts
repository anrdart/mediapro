export interface ServiceOption { id: string; label: string }
export interface BudgetOption { id: string; label: string }
export interface TimelineOption { value: string; label: string }
export interface ContactCard { icon: string; label: string; value: string; href?: string; external?: boolean }

export const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'web', label: 'Web Development' },
  { id: 'google', label: 'Google Ads' },
  { id: 'meta', label: 'Meta Ads' },
  { id: 'seo', label: 'SEO' },
  { id: 'content', label: 'Content' },
  { id: 'consulting', label: 'Consulting' },
];

export const BUDGET_OPTIONS: BudgetOption[] = [
  { id: '<1k', label: '< $1K' },
  { id: '1-3k', label: '$1K — $3K' },
  { id: '3-10k', label: '$3K — $10K' },
  { id: '10-25k', label: '$10K — $25K' },
  { id: '25k+', label: '$25K+' },
  { id: 'not-sure', label: 'Not sure yet' },
];

export const TIMELINE_OPTIONS: TimelineOption[] = [
  { value: '', label: 'Select a timeline' },
  { value: 'asap', label: 'As soon as possible' },
  { value: '1m', label: 'Within 1 month' },
  { value: '3m', label: 'Within 3 months' },
  { value: 'exploring', label: 'Just exploring' },
];

export const CONTACT_CARDS: ContactCard[] = [
  { icon: 'email', label: 'Email', value: 'admin@mediapro.work', href: 'mailto:admin@mediapro.work' },
  { icon: 'whatsapp', label: 'WhatsApp', value: 'Send a message', href: 'https://wa.me/6285129992227', external: true },
  { icon: 'location', label: 'Studio', value: 'Remote-first, global' },
];

export const CONTACT_HERO = {
  eyebrow: 'Contact',
  title: 'Let\'s build something <span class="accent">remarkable</span>.',
  lede: 'Tell us about your project, your goals, and what success looks like. A real person from our team will get back to you within 4 working hours — no chatbots, no canned replies.',
};

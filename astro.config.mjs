import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://mediapro.work',
  output: 'static',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id', 'ar', 'zh'],
    routing: { prefixDefaultLocale: false },
  },

  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US' },
      },
      customPages: ['https://mediapro.work/llms.txt'],
      serialize(item) {
        const overrides = {
          'https://mediapro.work/': { priority: 1.0, changefreq: 'daily' },
          'https://mediapro.work/contact': { priority: 0.9, changefreq: 'weekly' },
          'https://mediapro.work/faq': { priority: 0.8, changefreq: 'weekly' },
          'https://mediapro.work/llms.txt': { priority: 0.5, changefreq: 'daily' },
          'https://mediapro.work/terms': { priority: 0.4, changefreq: 'monthly' },
          'https://mediapro.work/disclaimer': { priority: 0.3, changefreq: 'monthly' },
        };
        const o = overrides[item.url];
        return o ? { ...item, ...o } : item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-display',
      weights: [400, 500, 600, 700],
      subsets: ['latin'],
      styles: ['normal'],
      display: 'optional',
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin'],
      styles: ['normal'],
      display: 'optional',
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Sans Arabic',
      cssVariable: '--font-arabic',
      weights: [400, 500, 600, 700],
      subsets: ['arabic'],
      styles: ['normal'],
      display: 'optional',
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Sans SC',
      cssVariable: '--font-cjk',
      weights: [400, 500, 700],
      subsets: ['chinese-simplified'],
      styles: ['normal'],
      display: 'optional',
    },
  ],

  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', default: 'https://mediapro.work' }),
      PUBLIC_WA_NUMBER: envField.string({ context: 'client', access: 'public', default: '19377722944' }),
      PUBLIC_EMAIL: envField.string({ context: 'client', access: 'public', default: 'mediapro@mediapro.work' }),
      PUBLIC_GA_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_META_PIXEL_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GSC_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_BING_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },

  adapter: cloudflare(),
});

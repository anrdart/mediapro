import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mediapro.work',
  output: 'static',
  trailingSlash: 'never',
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
      display: 'swap',
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin'],
      styles: ['normal'],
      display: 'swap',
    },
  ],
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({ context: 'client', access: 'public', default: 'https://mediapro.work' }),
      PUBLIC_WA_NUMBER: envField.string({ context: 'client', access: 'public', default: '6285129992227' }),
      PUBLIC_EMAIL: envField.string({ context: 'client', access: 'public', default: 'mediapro@mediapro.work' }),
      PUBLIC_GA_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_META_PIXEL_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GSC_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_BING_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});

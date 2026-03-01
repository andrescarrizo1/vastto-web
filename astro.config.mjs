import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vastto.com.ar',
  integrations: [sitemap()],
});
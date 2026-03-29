import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vastto.com.ar',
  output: 'static',

  integrations: [sitemap()]
});
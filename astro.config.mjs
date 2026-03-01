import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://vastto.com.ar',
  output: 'static',
  build: {
    format: 'file'
  }
});
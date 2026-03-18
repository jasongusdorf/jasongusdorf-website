import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://llmsfordoctors.com',
  output: 'static',
  integrations: [
    mdx(),
    sitemap(),
    pagefind(),
    preact({ compat: true }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});

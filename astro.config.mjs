import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    adapter: vercel({
        webAnalytics: {
            enabled: true
        }
    }),
    output: 'hybrid',
    integrations: [mdx(), sitemap(), tailwind({ applyBaseStyles: false }), vue()]
});

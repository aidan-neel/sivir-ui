import adapterNode from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const deploymentAdapter = process.env.DOCS_ADAPTER === 'node' ? adapterNode() : adapter();

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit({
            // Consult https://svelte.dev/docs/kit/integrations
            // for more information about preprocessors
            preprocess: vitePreprocess(),
            adapter: deploymentAdapter,
            alias: {
                '@sivir-ui/svelte/brand-mark': '../../packages/sivir/src/brand-mark.svelte',
                '@sivir-ui/svelte': '../../packages/sivir/src',
                '@sivir-ui/svelte/*': '../../packages/sivir/src/*'
            }
        })
    ],

    ssr:
        process.env.DOCS_ADAPTER === 'node'
            ? {
                  // Keep the adapter-node image self-contained. These are the only
                  // production dependencies left external by the default server build.
                  noExternal: ['@floating-ui/dom', 'clsx', 'tailwind-variants']
              }
            : undefined,
    server: {
        host: '0.0.0.0'
    },
    preview: {
        host: '0.0.0.0'
    }
});

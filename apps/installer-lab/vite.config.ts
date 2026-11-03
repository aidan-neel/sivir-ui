import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit({
            preprocess: vitePreprocess(),
            adapter: adapter(),
            alias: {
                '@sivir-ui/svelte/brand-mark': '../../packages/sivir/src/brand-mark.svelte',
                '@sivir-ui/svelte': '../../packages/sivir/src',
                '@sivir-ui/svelte/*': '../../packages/sivir/src/*'
            }
        })
    ],
    server: { host: '127.0.0.1', port: 5174 },
    preview: { host: '127.0.0.1', port: 5174 },
    test: {
        include: ['src/**/*.test.ts'],
        testTimeout: 15_000
    }
});

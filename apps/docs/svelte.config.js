import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'@sivir/ui/brand-mark': '../../packages/sivir/src/brand-mark.svelte',
			'@sivir/ui': '../../packages/sivir/src',
			'@sivir/ui/*': '../../packages/sivir/src/*'
		}
	}
};

export default config;

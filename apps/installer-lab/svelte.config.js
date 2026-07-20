import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
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

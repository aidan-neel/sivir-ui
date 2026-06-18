import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Use the Vercel adapter when building on Vercel (which sets VERCEL=1),
// otherwise fall back to the Node adapter used by the Dockerfile.
const adapter = process.env.VERCEL ? adapterVercel() : adapterNode();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess()],

	kit: {
		adapter,
		alias: {
			'@silk/ui': '../../packages/silk/src',
			'@silk/ui/*': '../../packages/silk/src/*'
		}
	}
};

export default config;

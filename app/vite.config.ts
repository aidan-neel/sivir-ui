import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';

function customHmr(): Plugin {
	return {
		name: 'custom-hmr',
		enforce: 'post' as const,
		handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
			if (file.endsWith('.css') || file.includes('.css?')) {
				server.ws.send({ type: 'full-reload' });
			}
		}
	};
}

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), customHmr()]
});

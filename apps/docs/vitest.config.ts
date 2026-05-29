import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		projects: [
			{
				extends: true,
				resolve: {
					conditions: ['browser']
				},
				test: {
					name: 'unit',
					include: ['tests/unit/**/*.test.ts'],
					exclude: [
						'tests/unit/**/*.browser.test.ts',
						'tests/unit/**/*.ssr.test.ts',
						'tests/unit/silk/ssr.test.ts'
					],
					environment: 'jsdom',
					setupFiles: ['tests/setup.ts']
				}
			},
			{
				extends: true,
				test: {
					name: 'ssr',
					include: ['tests/unit/silk/ssr.test.ts', 'tests/unit/**/*.ssr.test.ts'],
					environment: 'node'
				}
			},
			{
				extends: true,
				resolve: {
					conditions: ['browser']
				},
				test: {
					name: 'browser',
					include: ['tests/unit/**/*.browser.test.ts'],
					browser: {
						enabled: true,
						provider: playwright(),
						headless: true,
						instances: [{ browser: 'chromium' }]
					}
				}
			}
		]
	}
});

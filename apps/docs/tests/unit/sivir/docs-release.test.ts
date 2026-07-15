import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { components } from '$lib/components';
import { GET as getRobots } from '../../../src/routes/robots.txt/+server';
import { GET as getSitemap } from '../../../src/routes/sitemap.xml/+server';

const root = resolve(process.cwd(), '../..');

function directoryNames(path: string): string[] {
	return readdirSync(path, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
		.map((entry) => entry.name)
		.sort((left, right) => left.localeCompare(right));
}

describe('docs release contracts', () => {
	it('keeps package components, explicit routes, and navigation in sync', () => {
		const packageComponents = directoryNames(resolve(root, 'packages/sivir/src/components'));
		const routeComponents = directoryNames(
			resolve(root, 'apps/docs/src/routes/docs/components')
		).filter((name) => !name.startsWith('['));

		expect(components).toEqual(packageComponents);
		expect(routeComponents).toEqual(packageComponents);
	});

	it('uses the live component count in homepage copy', () => {
		const homepage = readFileSync(resolve(root, 'apps/docs/src/routes/+page.svelte'), 'utf8');
		const readme = readFileSync(resolve(root, 'README.md'), 'utf8');
		expect(homepage.match(new RegExp(`${components.length} Svelte`, 'g'))).toHaveLength(2);
		expect(homepage).toContain(`Browse all ${components.length} components`);
		expect(readme).toContain(`badge/Components-${components.length}-`);
	});

	it('serves an origin-aware robots file', async () => {
		const response = (await getRobots({
			url: new URL('https://preview.example/robots.txt')
		} as Parameters<typeof getRobots>[0])) as Response;

		expect(response.headers.get('content-type')).toContain('text/plain');
		expect(await response.text()).toContain('Sitemap: https://preview.example/sitemap.xml');
	});

	it('lists every public component in the origin-aware sitemap', async () => {
		const response = (await getSitemap({
			url: new URL('https://preview.example/sitemap.xml')
		} as Parameters<typeof getSitemap>[0])) as Response;
		const body = await response.text();

		expect(response.headers.get('content-type')).toContain('application/xml');
		for (const component of components) {
			expect(body).toContain(`<loc>https://preview.example/docs/components/${component}</loc>`);
		}
		expect(body).toContain('<loc>https://preview.example/docs/components</loc>');
		expect(body.match(/<url>/g)).toHaveLength(components.length + 9);
	});

	it('keeps the Docker docs runtime connected to the registry service', () => {
		const compose = readFileSync(resolve(root, 'docker-compose.yml'), 'utf8');
		const dockerfile = readFileSync(resolve(root, 'apps/docs/Dockerfile'), 'utf8');
		const registryDockerfile = readFileSync(resolve(root, 'apps/registry/Dockerfile'), 'utf8');
		const config = readFileSync(resolve(root, 'apps/docs/svelte.config.js'), 'utf8');
		const viteConfig = readFileSync(resolve(root, 'apps/docs/vite.config.ts'), 'utf8');

		expect(compose).toContain("THEME_REGISTRY_URL: 'http://registry:4100'");
		expect(dockerfile).toContain('FROM oven/bun:1.3.11');
		expect(dockerfile).toContain('ENV DOCS_ADAPTER=node');
		expect(dockerfile).toContain('ENV LEFTHOOK=0');
		expect(dockerfile).toContain('bun install --frozen-lockfile --ignore-scripts');
		expect(dockerfile).toContain('COPY apps/installer-lab/package.json');
		expect(dockerfile).not.toContain('/repo/node_modules ./node_modules');
		expect(config).toContain("process.env.DOCS_ADAPTER === 'node'");
		expect(viteConfig).toContain("noExternal: ['@floating-ui/dom', 'clsx', 'tailwind-variants']");
		expect(registryDockerfile).toContain('COPY packages/sivir ./packages/sivir');
		expect(registryDockerfile).toContain('FROM oven/bun:1.3.11');
		expect(registryDockerfile).toContain('ENV LEFTHOOK=0');
		expect(registryDockerfile).toContain('bun install --frozen-lockfile --ignore-scripts');
		expect(registryDockerfile).toContain("--filter='registry' --filter='@sivir/ui'");
		expect(registryDockerfile).toContain('COPY --from=build');
		expect(registryDockerfile).toContain('COPY apps/installer-lab/package.json');
	});
});

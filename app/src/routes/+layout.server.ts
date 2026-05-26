import { builtInThemePresets } from '$lib/silk/themes/builtin-presets';
import { listRegistryThemes, type RegistryTheme } from '$lib/server/theme-registry';
import type { LayoutServerLoad } from './$types';

const GITHUB_REPO = 'aidan-neel/ui';

async function fetchStarCount(fetchImpl: typeof fetch): Promise<number | null> {
	try {
		const response = await fetchImpl(`https://api.github.com/repos/${GITHUB_REPO}`, {
			headers: { accept: 'application/vnd.github+json' }
		});
		if (!response.ok) return null;
		const data = (await response.json()) as { stargazers_count?: number };
		return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
	} catch {
		return null;
	}
}

export const load: LayoutServerLoad = async ({ fetch, setHeaders }) => {
	let popularThemes: RegistryTheme[] = [];
	try {
		const all = await listRegistryThemes(fetch);
		popularThemes = [...all]
			.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
			.slice(0, 5);
	} catch {
		const fallbackTimestamp = '2026-01-01T00:00:00.000Z';
		popularThemes = builtInThemePresets.slice(0, 5).map((theme) => ({
			...theme,
			id: `builtin:${theme.slug}`,
			createdAt: fallbackTimestamp,
			updatedAt: fallbackTimestamp
		}));
	}

	const starCount = await fetchStarCount(fetch);

	// Cache the layout response edge-side for a minute — keeps the GitHub call
	// off the hot path without making counts stale. Skipped in dev because Vite
	// HMR re-runs the load within the same request, and SvelteKit's setHeaders
	// throws on a duplicate set of the same header.
	if (!import.meta.env.DEV) {
		setHeaders({ 'cache-control': 'public, max-age=60, stale-while-revalidate=300' });
	}

	return { popularThemes, starCount };
};

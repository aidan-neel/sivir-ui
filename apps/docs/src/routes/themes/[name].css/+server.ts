import { themeToCss } from '@sivir-ui/svelte/themes/theme';
import { error } from '@sveltejs/kit';
import { getRegistryTheme, RegistryRequestError } from '$lib/server/theme-registry';
import type { RequestHandler } from './$types';

const CACHE_CONTROL = {
    sivir: 'public, max-age=3600',
    community: 'public, max-age=300, stale-while-revalidate=3600'
} as const;

export const GET: RequestHandler = async ({ fetch, params }) => {
    try {
        const theme = await getRegistryTheme(fetch, params.name);

        return new Response(themeToCss(theme), {
            headers: {
                'content-type': 'text/css; charset=utf-8',
                'cache-control': CACHE_CONTROL[theme.source]
            }
        });
    } catch (requestError) {
        if (requestError instanceof RegistryRequestError && requestError.status === 404) {
            error(404, `Theme '${params.name}' not found`);
        }

        error(503, 'The theme registry is unavailable.');
    }
};

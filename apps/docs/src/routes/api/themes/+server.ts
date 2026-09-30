import { parseTheme, type Theme } from '@sivir-ui/svelte/themes/theme';
import { json } from '@sveltejs/kit';
import {
    listRegistryThemes,
    publishRegistryTheme,
    RegistryRequestError,
    registryErrorResponse
} from '$lib/server/theme-registry';
import type { ThemeSourceFilter } from '$lib/theme-registry';
import type { RequestHandler } from './$types';

const SOURCE_FILTERS: readonly ThemeSourceFilter[] = ['all', 'sivir', 'community'];

function optionalInteger(value: string | null): number | undefined {
    if (value === null || !/^\d+$/.test(value)) {
        return undefined;
    }

    return Number(value);
}

export const GET: RequestHandler = async ({ fetch, url }) => {
    const source = SOURCE_FILTERS.find((filter) => filter === url.searchParams.get('source'));

    try {
        const page = await listRegistryThemes(fetch, {
            q: url.searchParams.get('q') ?? undefined,
            source,
            limit: optionalInteger(url.searchParams.get('limit')),
            offset: optionalInteger(url.searchParams.get('offset'))
        });

        return json(page);
    } catch (error) {
        return registryErrorResponse(error, 'Failed to fetch the theme catalog.');
    }
};

async function readTheme(request: Request): Promise<Theme> {
    try {
        return parseTheme(await request.json());
    } catch (error) {
        throw new RegistryRequestError(
            400,
            error instanceof Error ? error.message : 'Invalid theme.'
        );
    }
}

export const POST: RequestHandler = async ({ fetch, getClientAddress, request }) => {
    try {
        const theme = await readTheme(request);
        const published = await publishRegistryTheme(fetch, theme, getClientAddress());

        return json(published, {
            status: 201
        });
    } catch (error) {
        return registryErrorResponse(error, 'Failed to publish the theme.');
    }
};

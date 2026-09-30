import { parseTheme, type Theme } from '@sivir-ui/svelte/themes/theme';
import { json } from '@sveltejs/kit';
import {
    deleteRegistryTheme,
    getRegistryTheme,
    RegistryRequestError,
    registryErrorResponse,
    updateRegistryTheme
} from '$lib/server/theme-registry';
import type { RequestHandler } from './$types';

function readEditToken(request: Request): string {
    const match = request.headers.get('authorization')?.match(/^Bearer\s+(\S+)$/i);
    if (!match) {
        throw new RegistryRequestError(401, 'An edit token is required to change this theme.');
    }

    return match[1];
}

async function readTheme(request: Request, slug: string): Promise<Theme> {
    let theme: Theme;
    try {
        theme = parseTheme(await request.json());
    } catch (error) {
        throw new RegistryRequestError(
            400,
            error instanceof Error ? error.message : 'Invalid theme.'
        );
    }

    if (theme.slug !== slug) {
        throw new RegistryRequestError(400, 'The theme slug cannot be changed after publishing.');
    }

    return theme;
}

export const GET: RequestHandler = async ({ fetch, params }) => {
    try {
        return json(await getRegistryTheme(fetch, params.slug));
    } catch (error) {
        return registryErrorResponse(error, 'Failed to fetch the theme.');
    }
};

export const PUT: RequestHandler = async ({ fetch, params, request }) => {
    try {
        const editToken = readEditToken(request);
        const theme = await readTheme(request, params.slug);

        return json(await updateRegistryTheme(fetch, theme, editToken));
    } catch (error) {
        return registryErrorResponse(error, 'Failed to update the theme.');
    }
};

export const DELETE: RequestHandler = async ({ fetch, params, request }) => {
    try {
        await deleteRegistryTheme(fetch, params.slug, readEditToken(request));

        return new Response(null, {
            status: 204
        });
    } catch (error) {
        return registryErrorResponse(error, 'Failed to unpublish the theme.');
    }
};

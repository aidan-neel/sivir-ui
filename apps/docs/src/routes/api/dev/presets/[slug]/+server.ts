import { parseTheme, type Theme } from '@sivir-ui/svelte/themes/theme';
import { error, json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
    if (!dev) {
        error(404, 'Not found');
    }

    let theme: Theme;

    try {
        theme = parseTheme(await request.json());
    } catch (cause) {
        error(400, cause instanceof Error ? cause.message : 'Invalid theme.');
    }

    if (theme.slug !== params.slug) {
        error(400, 'The theme slug does not match the preset.');
    }

    const { PresetSourceError, savePresetSource } = await import('$lib/server/preset-source');

    try {
        await savePresetSource(theme);
    } catch (cause) {
        if (cause instanceof PresetSourceError) {
            error(404, cause.message);
        }

        throw cause;
    }

    return json({
        slug: theme.slug
    });
};

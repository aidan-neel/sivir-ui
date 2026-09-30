import { builtInThemePage, getRegistryTheme, listRegistryThemes } from '$lib/server/theme-registry';
import {
    type RegistryListOptions,
    type RegistryTheme,
    THEMES_PAGE_SIZE,
    type ThemeSourceFilter
} from '$lib/theme-registry';
import type { PageServerLoad } from './$types';

const SOURCE_FILTERS: readonly ThemeSourceFilter[] = ['all', 'sivir', 'community'];

function readPage(value: string | null): number {
    const page = Number(value);

    return Number.isInteger(page) && page > 0 ? page : 1;
}

async function findSelectedTheme(
    fetchImpl: typeof fetch,
    slug: string | null,
    items: RegistryTheme[]
): Promise<RegistryTheme | null> {
    if (!slug) {
        return items[0] ?? null;
    }

    const listed = items.find((theme) => theme.slug === slug);
    if (listed) {
        return listed;
    }

    try {
        return await getRegistryTheme(fetchImpl, slug);
    } catch {
        return items[0] ?? null;
    }
}

export const load: PageServerLoad = async ({ fetch, url }) => {
    const q = url.searchParams.get('q')?.trim() ?? '';
    const source =
        SOURCE_FILTERS.find((filter) => filter === url.searchParams.get('source')) ?? 'all';
    const page = readPage(url.searchParams.get('page'));
    const options: RegistryListOptions = {
        q,
        source,
        limit: THEMES_PAGE_SIZE,
        offset: (page - 1) * THEMES_PAGE_SIZE
    };

    let registryAvailable = true;
    let catalog = builtInThemePage(options);
    try {
        catalog = await listRegistryThemes(fetch, options);
    } catch {
        registryAvailable = false;
    }

    return {
        catalog,
        filters: {
            q,
            source,
            page
        },
        registryAvailable,
        selected: await findSelectedTheme(fetch, url.searchParams.get('theme'), catalog.items)
    };
};

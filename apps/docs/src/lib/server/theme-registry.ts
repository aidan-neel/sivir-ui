import { createHash } from 'node:crypto';
import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
import { parseTheme, type Theme } from '@sivir-ui/svelte/themes/theme';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import {
    type PublishedTheme,
    type RegistryListOptions,
    type RegistryTheme,
    type RegistryThemePage,
    themeSources
} from '$lib/theme-registry';

const LOCAL_REGISTRY_URL = 'http://localhost:4100';
const BUILT_IN_TIMESTAMP = '2026-07-14T00:00:00.000Z';

export class RegistryRequestError extends Error {
    constructor(
        public readonly status: number,
        message: string
    ) {
        super(message);
    }
}

function registryBaseUrl(): string {
    const configured = env.THEME_REGISTRY_URL?.trim();
    if (configured) {
        return configured.replace(/\/+$/, '');
    }

    if (dev) {
        return LOCAL_REGISTRY_URL;
    }

    throw new RegistryRequestError(503, 'Theme registry is not configured.');
}

function registrySecret(): string {
    const secret = env.THEME_REGISTRY_SECRET?.trim();
    if (!secret) {
        throw new RegistryRequestError(503, 'Theme publishing is not configured.');
    }

    return secret;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseRegistryTheme(value: unknown): RegistryTheme {
    if (!isRecord(value)) {
        throw new TypeError('Theme registry returned a non-object record.');
    }

    const source = themeSources.find((candidate) => candidate === value.source);
    if (
        !source ||
        typeof value.id !== 'string' ||
        typeof value.createdAt !== 'string' ||
        typeof value.updatedAt !== 'string'
    ) {
        throw new TypeError('Theme registry returned invalid record metadata.');
    }

    return {
        ...parseTheme(value),
        id: value.id,
        source,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt
    };
}

function parseThemePage(value: unknown): RegistryThemePage {
    if (!isRecord(value) || !Array.isArray(value.items)) {
        throw new TypeError('Theme registry returned no theme list.');
    }

    return {
        items: value.items.map(parseRegistryTheme),
        total: typeof value.total === 'number' ? value.total : value.items.length,
        limit: typeof value.limit === 'number' ? value.limit : value.items.length,
        offset: typeof value.offset === 'number' ? value.offset : 0
    };
}

async function registryRequest<T>(
    fetchImpl: typeof fetch,
    path: string,
    parse: (body: unknown) => T,
    init: RequestInit = {}
): Promise<T> {
    let response: Response;
    try {
        response = await fetchImpl(`${registryBaseUrl()}${path}`, init);
    } catch (error) {
        if (error instanceof RegistryRequestError) {
            throw error;
        }

        throw new RegistryRequestError(503, 'Theme registry is unreachable.');
    }

    if (!response.ok) {
        const message = (await response.text()).trim();

        throw new RegistryRequestError(
            response.status,
            message || `Theme registry responded with ${response.status}.`
        );
    }

    if (response.status === 204) {
        return parse(null);
    }

    try {
        return parse(await response.json());
    } catch (error) {
        throw new RegistryRequestError(
            502,
            error instanceof Error ? error.message : 'Theme registry returned invalid data.'
        );
    }
}

function writeHeaders(extra: Record<string, string>): Record<string, string> {
    return {
        'x-registry-secret': registrySecret(),
        ...extra
    };
}

/** A salted fingerprint so the registry can rate limit without seeing addresses. */
export function registryClientKey(clientAddress: string): string {
    return createHash('sha256').update(`${registrySecret()}:${clientAddress}`).digest('hex');
}

export function builtInRegistryTheme(theme: Theme): RegistryTheme {
    return {
        ...theme,
        id: `sivir:${theme.slug}`,
        source: 'sivir',
        createdAt: BUILT_IN_TIMESTAMP,
        updatedAt: BUILT_IN_TIMESTAMP
    };
}

export function findBuiltInTheme(slug: string): RegistryTheme | undefined {
    const theme = builtInThemePresets.find((preset) => preset.slug === slug);

    return theme ? builtInRegistryTheme(theme) : undefined;
}

/** Built-in presets as a registry page, for when the registry cannot be reached. */
export function builtInThemePage(options: RegistryListOptions): RegistryThemePage {
    const needle = options.q?.trim().toLowerCase() ?? '';
    const limit = options.limit ?? builtInThemePresets.length;
    const offset = options.offset ?? 0;
    const matches =
        options.source === 'community'
            ? []
            : builtInThemePresets.filter((theme) => {
                  const haystack = [theme.name, theme.description, theme.publisher ?? '']
                      .join(' ')
                      .toLowerCase();

                  return haystack.includes(needle);
              });

    return {
        items: matches.slice(offset, offset + limit).map(builtInRegistryTheme),
        total: matches.length,
        limit,
        offset
    };
}

export function listRegistryThemes(
    fetchImpl: typeof fetch,
    options: RegistryListOptions
): Promise<RegistryThemePage> {
    const params = new URLSearchParams();
    if (options.q?.trim()) {
        params.set('q', options.q.trim());
    }

    if (options.source && options.source !== 'all') {
        params.set('source', options.source);
    }

    if (options.limit !== undefined) {
        params.set('limit', String(options.limit));
    }

    if (options.offset) {
        params.set('offset', String(options.offset));
    }

    const search = params.toString();
    const query = search ? `?${search}` : '';

    return registryRequest(fetchImpl, `/themes${query}`, parseThemePage);
}

/** Resolves a slug the way the CLI does: built-in presets first, then the registry. */
export async function getRegistryTheme(
    fetchImpl: typeof fetch,
    slug: string
): Promise<RegistryTheme> {
    const builtIn = findBuiltInTheme(slug);
    if (builtIn) {
        return builtIn;
    }

    return registryRequest(fetchImpl, `/themes/${encodeURIComponent(slug)}`, parseRegistryTheme);
}

function parsePublishedTheme(value: unknown): PublishedTheme {
    if (!isRecord(value) || typeof value.editToken !== 'string') {
        throw new TypeError('Theme registry returned no edit token.');
    }

    return {
        theme: parseRegistryTheme(value.theme),
        editToken: value.editToken
    };
}

export function publishRegistryTheme(
    fetchImpl: typeof fetch,
    theme: Theme,
    clientAddress: string
): Promise<PublishedTheme> {
    return registryRequest(fetchImpl, '/themes', parsePublishedTheme, {
        method: 'POST',
        headers: writeHeaders({
            'content-type': 'application/json',
            'x-registry-client': registryClientKey(clientAddress)
        }),
        body: JSON.stringify(theme)
    });
}

export function updateRegistryTheme(
    fetchImpl: typeof fetch,
    theme: Theme,
    editToken: string
): Promise<RegistryTheme> {
    return registryRequest(
        fetchImpl,
        `/themes/${encodeURIComponent(theme.slug)}`,
        parseRegistryTheme,
        {
            method: 'PUT',
            headers: writeHeaders({
                'content-type': 'application/json',
                authorization: `Bearer ${editToken}`
            }),
            body: JSON.stringify(theme)
        }
    );
}

export function deleteRegistryTheme(
    fetchImpl: typeof fetch,
    slug: string,
    editToken: string
): Promise<void> {
    return registryRequest(fetchImpl, `/themes/${encodeURIComponent(slug)}`, () => undefined, {
        method: 'DELETE',
        headers: writeHeaders({
            authorization: `Bearer ${editToken}`
        })
    });
}

export function registryErrorResponse(error: unknown, fallback: string): Response {
    if (error instanceof RegistryRequestError) {
        return new Response(error.message, {
            status: error.status
        });
    }

    console.error(fallback, error);

    return new Response(fallback, {
        status: 500
    });
}

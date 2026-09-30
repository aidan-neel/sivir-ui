import type { Theme } from '@sivir-ui/svelte/themes/theme';
import { type Static, t } from 'elysia';

export const SLUG_PATTERN = '^[a-z0-9]+(?:-[a-z0-9]+)*$';

export const themeSources = ['sivir', 'community'] as const;

export type ThemeSource = (typeof themeSources)[number];

/** A registry entry: the portable theme plus the metadata the registry owns. */
export type RegistryThemeRecord = Theme & {
    id: string;
    source: ThemeSource;
    createdAt: string;
    updatedAt: string;
};

export type ThemeListResponse = {
    items: RegistryThemeRecord[];
    total: number;
    limit: number;
    offset: number;
};

export type PublishResponse = {
    theme: RegistryThemeRecord;
    editToken: string;
};

export const slugParamsSchema = t.Object({
    slug: t.String({
        minLength: 1,
        maxLength: 80,
        pattern: SLUG_PATTERN
    })
});

export const listQuerySchema = t.Object({
    q: t.Optional(
        t.String({
            maxLength: 80
        })
    ),
    source: t.Optional(t.Union([t.Literal('all'), t.Literal('sivir'), t.Literal('community')])),
    limit: t.Optional(
        t.Numeric({
            minimum: 1,
            maximum: 100
        })
    ),
    offset: t.Optional(
        t.Numeric({
            minimum: 0
        })
    )
});

export type ListQuery = Static<typeof listQuerySchema>;

export const writeHeadersSchema = t.Object({
    'x-registry-secret': t.Optional(t.String()),
    'x-registry-client': t.Optional(
        t.String({
            maxLength: 128
        })
    ),
    authorization: t.Optional(t.String())
});

export type WriteHeaders = Static<typeof writeHeadersSchema>;

export const registryMessages = {
    notFound: 'A theme with this slug does not exist.',
    slugTaken: 'A theme with this slug already exists, try another one.',
    slugReserved: 'This slug is reserved for a built-in theme.',
    builtInReadOnly: 'Built-in themes cannot be changed.',
    slugMismatch: 'The theme slug cannot be changed after publishing.',
    rateLimited: 'Too many publishes, try again later.',
    publishingDisabled: 'Theme publishing is not configured on this registry.',
    unauthorizedProxy: 'This registry only accepts writes from the Sivir docs server.',
    missingEditToken: 'An edit token is required to change this theme.',
    invalidEditToken: 'The edit token does not match this theme.'
} as const;

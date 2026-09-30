import { prisma } from '@lib/prisma';
import type { Prisma } from '@root/prisma/generated/prisma/client';
import { parseTheme, type Theme } from '@sivir-ui/svelte/themes/theme';
import { registryConfig } from '@src/config';
import { status } from 'elysia';
import { createEditToken, hashEditToken, verifyEditToken } from './auth';
import { builtInRecord, builtInThemes, findBuiltInTheme, isBuiltInSlug } from './defaults';
import {
    type ListQuery,
    type PublishResponse,
    type RegistryThemeRecord,
    registryMessages,
    type ThemeListResponse
} from './model';
import { parsePublishableTheme, ThemeValidationError } from './validation';

type ThemeRow = {
    id: string;
    document: unknown;
    createdAt: Date;
    updatedAt: Date;
};

function toRecord(row: ThemeRow): RegistryThemeRecord {
    return {
        ...parseTheme(row.document),
        id: row.id,
        source: 'community',
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString()
    };
}

function toRecords(rows: ThemeRow[]): RegistryThemeRecord[] {
    return rows.flatMap((row) => {
        try {
            return [toRecord(row)];
        } catch (error) {
            console.error(`Skipping unreadable theme row ${row.id}:`, error);

            return [];
        }
    });
}

function matchesQuery(theme: Theme, needle: string): boolean {
    const haystack = [theme.name, theme.description, theme.publisher ?? ''].join(' ');

    return haystack.toLowerCase().includes(needle);
}

function searchWhere(needle: string): Prisma.ThemeWhereInput | undefined {
    if (!needle) {
        return undefined;
    }

    const contains = {
        contains: needle,
        mode: 'insensitive' as const
    };

    return {
        OR: [
            {
                name: contains
            },
            {
                description: contains
            },
            {
                publisher: contains
            }
        ]
    };
}

function parseOrReject(input: unknown): Theme {
    try {
        return parsePublishableTheme(input);
    } catch (error) {
        if (error instanceof ThemeValidationError) {
            throw status(400, error.message);
        }

        throw error;
    }
}

function isUniqueViolation(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: unknown }).code === 'P2002'
    );
}

function documentColumns(theme: Theme) {
    return {
        name: theme.name,
        description: theme.description,
        publisher: theme.publisher ?? null,
        version: theme.version,
        document: theme
    };
}

async function listBuiltIns(needle: string, includeBuiltIns: boolean): Promise<Theme[]> {
    if (!includeBuiltIns) {
        return [];
    }

    const hidden = await prisma.hiddenDefault.findMany({
        select: {
            slug: true
        }
    });
    const hiddenSlugs = new Set(hidden.map((row) => row.slug));

    return builtInThemes.filter((theme) => {
        return !hiddenSlugs.has(theme.slug) && (!needle || matchesQuery(theme, needle));
    });
}

/** Lists built-in themes first, then community themes newest first. */
export async function listThemes(query: ListQuery): Promise<ThemeListResponse> {
    const needle = query.q?.trim().toLowerCase() ?? '';
    const source = query.source ?? 'all';
    const limit = query.limit ?? registryConfig.defaultPageSize;
    const offset = query.offset ?? 0;
    const includeCommunity = source !== 'sivir';
    const builtIns = await listBuiltIns(needle, source !== 'community');
    const builtInPage = builtIns.slice(offset, offset + limit).map(builtInRecord);

    if (!includeCommunity) {
        return {
            items: builtInPage,
            total: builtIns.length,
            limit,
            offset
        };
    }

    const where = searchWhere(needle);
    const communityTake = limit - builtInPage.length;
    const communitySkip = Math.max(0, offset - builtIns.length);
    const [communityTotal, rows] = await Promise.all([
        prisma.theme.count({
            where
        }),
        communityTake > 0
            ? prisma.theme.findMany({
                  where,
                  orderBy: {
                      createdAt: 'desc'
                  },
                  skip: communitySkip,
                  take: communityTake
              })
            : Promise.resolve([])
    ]);

    return {
        items: [...builtInPage, ...toRecords(rows)],
        total: builtIns.length + communityTotal,
        limit,
        offset
    };
}

export async function getThemeBySlug(slug: string): Promise<RegistryThemeRecord> {
    const builtIn = findBuiltInTheme(slug);
    if (builtIn) {
        return builtInRecord(builtIn);
    }

    const row = await prisma.theme.findUnique({
        where: {
            slug
        }
    });
    if (!row) {
        throw status(404, registryMessages.notFound);
    }

    return toRecord(row);
}

/**
 * Serializes publishes per client with a transaction-scoped advisory lock, so
 * concurrent requests cannot all pass the count before any of them commits.
 */
async function reservePublishSlot(tx: Prisma.TransactionClient, clientKey: string) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${clientKey}))`;

    const since = new Date(Date.now() - registryConfig.publishWindowMs);
    const recent = await tx.publishEvent.count({
        where: {
            clientKey,
            createdAt: {
                gte: since
            }
        }
    });
    if (recent >= registryConfig.publishLimit) {
        throw status(429, registryMessages.rateLimited);
    }

    await tx.publishEvent.create({
        data: {
            clientKey
        }
    });
}

export async function publishTheme(input: unknown, clientKey: string): Promise<PublishResponse> {
    const theme = parseOrReject(input);
    if (isBuiltInSlug(theme.slug)) {
        throw status(409, registryMessages.slugReserved);
    }

    const editToken = createEditToken();
    try {
        const row = await prisma.$transaction(async (tx) => {
            await reservePublishSlot(tx, clientKey);

            return tx.theme.create({
                data: {
                    ...documentColumns(theme),
                    slug: theme.slug,
                    editTokenHash: hashEditToken(editToken)
                }
            });
        });

        return {
            theme: toRecord(row),
            editToken
        };
    } catch (error) {
        if (isUniqueViolation(error)) {
            throw status(409, registryMessages.slugTaken);
        }

        throw error;
    }
}

async function findEditableTheme(slug: string, editToken: string) {
    if (isBuiltInSlug(slug)) {
        throw status(403, registryMessages.builtInReadOnly);
    }

    const row = await prisma.theme.findUnique({
        where: {
            slug
        },
        select: {
            id: true,
            editTokenHash: true
        }
    });
    if (!row) {
        throw status(404, registryMessages.notFound);
    }

    if (!row.editTokenHash || !verifyEditToken(editToken, row.editTokenHash)) {
        throw status(403, registryMessages.invalidEditToken);
    }

    return row;
}

export async function updateTheme(
    slug: string,
    input: unknown,
    editToken: string
): Promise<RegistryThemeRecord> {
    const theme = parseOrReject(input);
    if (theme.slug !== slug) {
        throw status(400, registryMessages.slugMismatch);
    }

    const existing = await findEditableTheme(slug, editToken);
    const row = await prisma.theme.update({
        where: {
            id: existing.id
        },
        data: documentColumns(theme)
    });

    return toRecord(row);
}

export async function deleteTheme(slug: string, editToken: string): Promise<void> {
    const existing = await findEditableTheme(slug, editToken);

    await prisma.theme.delete({
        where: {
            id: existing.id
        }
    });
}

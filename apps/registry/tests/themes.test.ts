import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import type { Theme } from '@sivir-ui/svelte/themes/theme';
import { builtInThemes } from '@src/services/themes/defaults';

// The registry talks to Postgres through a generated Prisma client that opens a
// real pg pool on import. Tests must never touch a database, so `@lib/prisma`
// is replaced with an in-memory store before the controller loads it.
type Row = {
    id: string;
    slug: string;
    name: string;
    description: string;
    publisher: string | null;
    version: number;
    document: unknown;
    editTokenHash: string | null;
    createdAt: Date;
    updatedAt: Date;
};

type Where = {
    id?: string;
    slug?: string;
    createdAt?: {
        gte: Date;
    };
    OR?: Record<string, { contains: string }>[];
};

type PublishEvent = {
    clientKey: string;
    createdAt: Date;
};

let rows: Row[] = [];
let hiddenSlugs: string[] = [];
let failReads = false;
let publishEvents: PublishEvent[] = [];

function matches(row: Row, where: Where | undefined): boolean {
    if (!where) {
        return true;
    }

    if (where.id !== undefined && row.id !== where.id) {
        return false;
    }

    if (where.slug !== undefined && row.slug !== where.slug) {
        return false;
    }

    if (where.createdAt && row.createdAt < where.createdAt.gte) {
        return false;
    }

    if (where.OR) {
        return where.OR.some((condition) => {
            return Object.entries(condition).some(([field, filter]) => {
                const value = row[field as keyof Row];

                return (
                    typeof value === 'string' &&
                    value.toLowerCase().includes(filter.contains.toLowerCase())
                );
            });
        });
    }

    return true;
}

function uniqueViolation() {
    return Object.assign(new Error('Unique constraint failed'), {
        code: 'P2002'
    });
}

const db = {
    theme: {
        findMany: async (args: { where?: Where; skip?: number; take?: number }) => {
            if (failReads) {
                throw new Error('boom: secret detail');
            }

            const skip = args.skip ?? 0;

            return rows
                .filter((row) => matches(row, args.where))
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(skip, skip + (args.take ?? rows.length));
        },
        findUnique: async (args: { where: Where }) => {
            return rows.find((row) => matches(row, args.where)) ?? null;
        },
        count: async (args: { where?: Where }) => {
            return rows.filter((row) => matches(row, args.where)).length;
        },
        create: async (args: { data: Omit<Row, 'id' | 'createdAt' | 'updatedAt'> }) => {
            if (rows.some((row) => row.slug === args.data.slug)) {
                throw uniqueViolation();
            }

            const now = new Date();
            const row: Row = {
                ...args.data,
                id: `db-${rows.length + 1}`,
                createdAt: now,
                updatedAt: now
            };
            rows.push(row);

            return row;
        },
        update: async (args: { where: Where; data: Partial<Row> }) => {
            const row = rows.find((candidate) => matches(candidate, args.where));
            if (!row) {
                throw new Error('Record not found');
            }

            Object.assign(row, args.data, {
                updatedAt: new Date()
            });

            return row;
        },
        delete: async (args: { where: Where }) => {
            const row = rows.find((candidate) => matches(candidate, args.where));
            rows = rows.filter((candidate) => candidate !== row);

            return row;
        }
    },
    publishEvent: {
        count: async (args: { where: { clientKey: string; createdAt: { gte: Date } } }) => {
            return publishEvents.filter((event) => {
                return (
                    event.clientKey === args.where.clientKey &&
                    event.createdAt >= args.where.createdAt.gte
                );
            }).length;
        },
        create: async (args: { data: { clientKey: string } }) => {
            const event = {
                clientKey: args.data.clientKey,
                createdAt: new Date()
            };
            publishEvents.push(event);

            return event;
        }
    },
    $executeRaw: async () => {
        return 0;
    },
    $transaction: async <T>(work: (tx: object) => Promise<T>): Promise<T> => {
        const snapshot = {
            rows: [...rows],
            publishEvents: [...publishEvents]
        };
        try {
            return await work(db);
        } catch (error) {
            rows = snapshot.rows;
            publishEvents = snapshot.publishEvents;

            throw error;
        }
    },
    hiddenDefault: {
        findMany: async () => {
            return hiddenSlugs.map((slug) => ({
                slug
            }));
        }
    }
};

mock.module('@lib/prisma', () => ({
    prisma: db
}));

// Import the production app only after the database mock is registered.
const { app, default: vercelHandler } = await import('@src/index');

const SECRET = 'test-secret';

function request(path: string, init: RequestInit = {}) {
    return app.handle(new Request(`http://localhost${path}`, init));
}

function write(
    method: 'POST' | 'PUT' | 'DELETE',
    path: string,
    body: unknown,
    headers: Record<string, string> = {}
) {
    const hasBody = body !== undefined;

    return request(path, {
        method,
        headers: {
            ...(hasBody
                ? {
                      'content-type': 'application/json'
                  }
                : {}),
            'x-registry-secret': SECRET,
            'x-registry-client': 'client-a',
            ...headers
        },
        body: hasBody ? JSON.stringify(body) : undefined
    });
}

function communityTheme(slug: string, overrides: Partial<Theme> = {}): Theme {
    return {
        ...builtInThemes[0],
        slug,
        name: `Theme ${slug}`,
        description: 'A community theme.',
        publisher: 'Tester',
        ...overrides
    };
}

type PublishBody = {
    editToken: string;
    theme: {
        slug: string;
        id: string;
    };
};

function publish(theme: Theme, headers: Record<string, string> = {}) {
    return write('POST', '/themes', theme, headers);
}

async function publishOk(theme: Theme): Promise<PublishBody> {
    const res = await publish(theme);
    expect(res.status).toBe(201);

    return (await res.json()) as PublishBody;
}

beforeEach(() => {
    rows = [];
    publishEvents = [];
    hiddenSlugs = [];
    failReads = false;
    process.env.REGISTRY_PUBLISH_SECRET = SECRET;
});

afterEach(() => {
    mock.restore();
    delete process.env.REGISTRY_PUBLISH_SECRET;
});

describe('GET /themes', () => {
    it('exports the app as the Vercel Function handler', () => {
        expect(vercelHandler).toBe(app);
    });

    it('lists the built-in themes when nothing is published', async () => {
        const res = await request('/themes');
        expect(res.status).toBe(200);

        const body = (await res.json()) as {
            items: {
                slug: string;
                source: string;
            }[];
            total: number;
        };
        expect(body.total).toBe(builtInThemes.length);
        expect(body.items.map((theme) => theme.slug)).toEqual(
            builtInThemes.map((theme) => theme.slug)
        );
        expect(body.items.every((theme) => theme.source === 'sivir')).toBe(true);
    });

    it('lists built-ins first, then community themes newest first', async () => {
        await publishOk(communityTheme('ocean'));
        await publishOk(communityTheme('forest'));
        rows[0].createdAt = new Date('2026-01-01T00:00:00.000Z');

        const res = await request('/themes');
        const body = (await res.json()) as {
            items: {
                slug: string;
                source: string;
            }[];
            total: number;
        };
        const community = body.items.filter((theme) => theme.source === 'community');

        expect(body.total).toBe(builtInThemes.length + 2);
        expect(community.map((theme) => theme.slug)).toEqual(['forest', 'ocean']);
        expect(body.items.slice(0, builtInThemes.length).map((theme) => theme.source)).toEqual(
            builtInThemes.map(() => 'sivir')
        );
    });

    it('paginates across built-in and community themes', async () => {
        await publishOk(communityTheme('ocean'));

        const res = await request(`/themes?limit=2&offset=${builtInThemes.length - 1}`);
        const body = (await res.json()) as {
            items: {
                slug: string;
            }[];
            limit: number;
            offset: number;
        };

        expect(body.limit).toBe(2);
        expect(body.offset).toBe(builtInThemes.length - 1);
        expect(body.items.map((theme) => theme.slug)).toEqual([
            builtInThemes[builtInThemes.length - 1].slug,
            'ocean'
        ]);
    });

    it('filters by search query and source', async () => {
        await publishOk(
            communityTheme('ocean', {
                name: 'Ocean Breeze'
            })
        );

        const searched = await request('/themes?q=breeze');
        const searchedBody = (await searched.json()) as {
            items: {
                slug: string;
            }[];
        };
        expect(searchedBody.items.map((theme) => theme.slug)).toEqual(['ocean']);

        const sivirOnly = await request('/themes?source=sivir');
        const sivirBody = (await sivirOnly.json()) as {
            total: number;
        };
        expect(sivirBody.total).toBe(builtInThemes.length);
    });

    it('omits built-in themes that have been hidden', async () => {
        hiddenSlugs = ['magic'];

        const res = await request('/themes');
        const body = (await res.json()) as {
            items: {
                slug: string;
            }[];
        };
        expect(body.items.map((theme) => theme.slug)).not.toContain('magic');
    });

    it('rejects an out-of-range page size', async () => {
        const res = await request('/themes?limit=500');
        expect(res.status).toBe(422);
    });
});

describe('GET /themes/:slug', () => {
    it('returns a built-in theme', async () => {
        const res = await request('/themes/default');
        expect(res.status).toBe(200);

        const body = (await res.json()) as {
            slug: string;
            id: string;
            source: string;
        };
        expect(body.slug).toBe('default');
        expect(body.id).toBe('sivir:default');
        expect(body.source).toBe('sivir');
    });

    it('returns the full published document, including optional sections', async () => {
        const theme = communityTheme('ocean', {
            foundation: {
                dark: {
                    base: '#101820'
                }
            },
            tokens: {
                shared: {
                    '--radius-lg': '12px'
                }
            },
            typography: {
                headerSize: 18
            },
            chrome: {
                primaryStroke: true
            }
        });
        await publishOk(theme);

        const res = await request('/themes/ocean');
        expect(res.status).toBe(200);

        const body = (await res.json()) as Theme & {
            source: string;
        };
        expect(body.source).toBe('community');
        expect(body.foundation?.dark?.base).toBe('#101820');
        expect(body.tokens?.shared?.['--radius-lg']).toBe('12px');
        expect(body.typography?.headerSize).toBe(18);
        expect(body.chrome?.primaryStroke).toBe(true);
    });

    it('returns 404 for an unknown slug', async () => {
        const res = await request('/themes/does-not-exist');
        expect(res.status).toBe(404);
        expect(await res.text()).toBe('A theme with this slug does not exist.');
    });
});

describe('POST /themes', () => {
    it('publishes a theme and returns a one-time edit token', async () => {
        const body = await publishOk(communityTheme('ocean'));

        expect(body.theme.slug).toBe('ocean');
        expect(body.editToken.length).toBeGreaterThan(30);
        expect(rows[0].editTokenHash).not.toBe(body.editToken);
        expect(publishEvents.map((event) => event.clientKey)).toEqual(['client-a']);
    });

    it('is disabled when no publish secret is configured', async () => {
        delete process.env.REGISTRY_PUBLISH_SECRET;

        const res = await publish(communityTheme('ocean'));
        expect(res.status).toBe(503);
        expect(rows).toHaveLength(0);
    });

    it('rejects writers without the publish secret', async () => {
        const res = await write('POST', '/themes', communityTheme('ocean'), {
            'x-registry-secret': 'wrong'
        });

        expect(res.status).toBe(401);
        expect(rows).toHaveLength(0);
    });

    it('rejects an invalid theme with the contract error', async () => {
        const res = await write('POST', '/themes', {
            ...communityTheme('ocean'),
            brand: 'blue'
        });

        expect(res.status).toBe(400);
        expect(await res.text()).toContain('brand');
    });

    it('rejects CSS that loads resources or escapes its declaration', async () => {
        const unsafeFont = await write(
            'POST',
            '/themes',
            communityTheme('ocean', {
                fontSans: 'Inter; } body { color: red'
            })
        );
        expect(unsafeFont.status).toBe(400);

        const unsafeToken = await write(
            'POST',
            '/themes',
            communityTheme('ocean', {
                tokens: {
                    shared: {
                        '--color-card': 'url(https://example.com/pixel.png)'
                    }
                }
            })
        );
        expect(unsafeToken.status).toBe(400);
        expect(rows).toHaveLength(0);
    });

    it('rejects oversized identity fields', async () => {
        const res = await write(
            'POST',
            '/themes',
            communityTheme('ocean', {
                name: 'x'.repeat(81)
            })
        );

        expect(res.status).toBe(400);
    });

    it('reserves built-in slugs', async () => {
        const res = await publish(communityTheme('default'));
        expect(res.status).toBe(409);
    });

    it('rejects a slug that is already published', async () => {
        await publishOk(communityTheme('ocean'));

        const res = await publish(communityTheme('ocean'));
        expect(res.status).toBe(409);
    });

    it('rate limits publishes per client', async () => {
        for (let index = 0; index < 5; index += 1) {
            const res = await publish(communityTheme(`theme-${index}`));
            expect(res.status).toBe(201);
        }

        const limited = await publish(communityTheme('theme-5'));
        expect(limited.status).toBe(429);

        const otherClient = await publish(communityTheme('theme-6'), {
            'x-registry-client': 'client-b'
        });
        expect(otherClient.status).toBe(201);
    });

    it('does not give quota back when a client unpublishes', async () => {
        const tokens: string[] = [];
        for (let index = 0; index < 5; index += 1) {
            const body = await publishOk(communityTheme(`theme-${index}`));
            tokens.push(body.editToken);
        }

        const deleted = await write('DELETE', '/themes/theme-0', undefined, {
            authorization: `Bearer ${tokens[0]}`
        });
        expect(deleted.status).toBe(204);

        const limited = await publish(communityTheme('theme-5'));
        expect(limited.status).toBe(429);
    });

    it('does not spend quota on a publish that fails', async () => {
        await publishOk(communityTheme('ocean'));

        const duplicate = await publish(communityTheme('ocean'));
        expect(duplicate.status).toBe(409);
        expect(publishEvents).toHaveLength(1);
    });
});

describe('PUT /themes/:slug', () => {
    it('updates a theme with its edit token', async () => {
        const body = await publishOk(communityTheme('ocean'));

        const res = await write(
            'PUT',
            '/themes/ocean',
            communityTheme('ocean', {
                name: 'Ocean Deep'
            }),
            {
                authorization: `Bearer ${body.editToken}`
            }
        );

        expect(res.status).toBe(200);
        expect(rows[0].name).toBe('Ocean Deep');
        expect((rows[0].document as Theme).name).toBe('Ocean Deep');
    });

    it('requires a matching edit token', async () => {
        await publishOk(communityTheme('ocean'));

        const missing = await write('PUT', '/themes/ocean', communityTheme('ocean'));
        expect(missing.status).toBe(401);

        const wrong = await write('PUT', '/themes/ocean', communityTheme('ocean'), {
            authorization: 'Bearer not-the-token'
        });
        expect(wrong.status).toBe(403);
    });

    it('refuses to rename the slug', async () => {
        const body = await publishOk(communityTheme('ocean'));

        const res = await write('PUT', '/themes/ocean', communityTheme('lake'), {
            authorization: `Bearer ${body.editToken}`
        });

        expect(res.status).toBe(400);
    });

    it('refuses to change built-in themes', async () => {
        const res = await write('PUT', '/themes/default', communityTheme('default'), {
            authorization: 'Bearer anything'
        });

        expect(res.status).toBe(403);
    });
});

describe('DELETE /themes/:slug', () => {
    it('unpublishes a theme with its edit token', async () => {
        const body = await publishOk(communityTheme('ocean'));

        const res = await write('DELETE', '/themes/ocean', undefined, {
            authorization: `Bearer ${body.editToken}`
        });

        expect(res.status).toBe(204);
        expect(rows).toHaveLength(0);
    });

    it('returns 404 for an unknown theme', async () => {
        const res = await write('DELETE', '/themes/missing', undefined, {
            authorization: 'Bearer anything'
        });

        expect(res.status).toBe(404);
    });
});

describe('registry request guards', () => {
    it('caps request bodies at 128 KiB', () => {
        expect(app.config.serve?.maxRequestBodySize).toBe(128 * 1024);
    });

    it('does not leak unexpected service errors', async () => {
        const errorLog = spyOn(console, 'error').mockImplementation(() => {});
        await publishOk(communityTheme('ocean'));
        failReads = true;

        const res = await request('/themes');
        const body = await res.text();

        expect(res.status).toBe(500);
        expect(body).toBe('Internal error.');
        expect(body).not.toContain('boom');
        expect(errorLog).toHaveBeenCalled();
    });
});

import { readPublishSecret } from '@src/config';
import { Elysia, status, t } from 'elysia';
import { readBearerToken, verifyPublishSecret } from './auth';
import {
    listQuerySchema,
    registryMessages,
    slugParamsSchema,
    type WriteHeaders,
    writeHeadersSchema
} from './model';
import { deleteTheme, getThemeBySlug, listThemes, publishTheme, updateTheme } from './service';

const ANONYMOUS_CLIENT = 'anonymous';

function assertTrustedWriter(headers: WriteHeaders) {
    const secret = readPublishSecret();
    if (!secret) {
        throw status(503, registryMessages.publishingDisabled);
    }

    if (!verifyPublishSecret(headers['x-registry-secret'], secret)) {
        throw status(401, registryMessages.unauthorizedProxy);
    }
}

function requireEditToken(headers: WriteHeaders): string {
    const token = readBearerToken(headers.authorization);
    if (!token) {
        throw status(401, registryMessages.missingEditToken);
    }

    return token;
}

export const themesController = new Elysia({
    prefix: '/themes',
    tags: ['themes']
})
    .get('/', ({ query }) => listThemes(query), {
        query: listQuerySchema,
        detail: {
            summary: 'List built-in themes, then community themes newest first.'
        }
    })
    .get('/:slug', ({ params }) => getThemeBySlug(params.slug), {
        params: slugParamsSchema,
        detail: {
            summary: 'Fetch one theme by slug as a portable Theme document.'
        }
    })
    .post(
        '/',
        async ({ body, headers, set }) => {
            assertTrustedWriter(headers);

            const published = await publishTheme(
                body,
                headers['x-registry-client'] ?? ANONYMOUS_CLIENT
            );
            set.status = 201;

            return published;
        },
        {
            body: t.Unknown(),
            headers: writeHeadersSchema,
            detail: {
                summary: 'Publish a community theme. Returns a one-time edit token.'
            }
        }
    )
    .put(
        '/:slug',
        ({ body, headers, params }) => {
            assertTrustedWriter(headers);

            return updateTheme(params.slug, body, requireEditToken(headers));
        },
        {
            body: t.Unknown(),
            headers: writeHeadersSchema,
            params: slugParamsSchema,
            detail: {
                summary: 'Replace a community theme using its edit token.'
            }
        }
    )
    .delete(
        '/:slug',
        async ({ headers, params, set }) => {
            assertTrustedWriter(headers);

            await deleteTheme(params.slug, requireEditToken(headers));
            set.status = 204;
        },
        {
            headers: writeHeadersSchema,
            params: slugParamsSchema,
            detail: {
                summary: 'Unpublish a community theme using its edit token.'
            }
        }
    );

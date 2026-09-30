import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { registryConfig } from './config';
import { themesController } from './services/themes';

const FRAMEWORK_ERROR_CODES = new Set([
    'VALIDATION',
    'NOT_FOUND',
    'PARSE',
    'INVALID_COOKIE_SIGNATURE'
]);

export const app = new Elysia({
    serve: {
        maxRequestBodySize: registryConfig.maxRequestBodyBytes
    }
})
    .onError(({ code, error, set }) => {
        if (typeof code === 'string' && FRAMEWORK_ERROR_CODES.has(code)) {
            return;
        }

        if (
            typeof code === 'number' &&
            typeof error === 'object' &&
            error !== null &&
            'response' in error
        ) {
            set.status = code;

            return error.response;
        }

        console.error('Unhandled registry request error:', error);
        set.status = 500;

        return 'Internal error.';
    })
    .use(
        openapi({
            path: '/openapi'
        })
    )
    .use(themesController)
    .get('/', () => 'Sivir theme registry');

export default app;

if (import.meta.main) {
    app.listen(registryConfig.port);
    console.log(`Sivir registry listening at ${app.server?.hostname}:${app.server?.port}`);
}

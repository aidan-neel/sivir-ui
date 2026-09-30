import { describe, expect, it, vi } from 'vitest';
import { getRegistryTheme, RegistryRequestError } from '$lib/server/theme-registry';

vi.mock('$env/dynamic/private', () => {
    return {
        env: {
            THEME_REGISTRY_URL: 'http://registry.test'
        }
    };
});

function registryFetch(body: string, status: number): typeof fetch {
    return vi.fn(async () => {
        return new Response(body, {
            status
        });
    }) as unknown as typeof fetch;
}

async function readError(request: Promise<unknown>): Promise<RegistryRequestError> {
    try {
        await request;
    } catch (error) {
        if (error instanceof RegistryRequestError) {
            return error;
        }

        throw error;
    }

    throw new Error('Expected the registry request to fail.');
}

describe('theme registry client', () => {
    it('reports a malformed slug as missing without calling the registry', async () => {
        const fetchImpl = registryFetch('', 500);
        const error = await readError(getRegistryTheme(fetchImpl, 'Not_A_Slug'));

        expect(error.status).toBe(404);
        expect(error.message).toBe('A theme with this slug does not exist.');
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('replaces framework validation payloads with a readable message', async () => {
        const body = JSON.stringify({
            type: 'validation',
            message: "Expected string to match '^[a-z0-9]+$'"
        });
        const error = await readError(getRegistryTheme(registryFetch(body, 422), 'harbor-dusk'));

        expect(error.status).toBe(422);
        expect(error.message).toBe('The theme registry rejected this request as invalid.');
    });

    it('reads the message from a JSON error body', async () => {
        const body = JSON.stringify({
            message: 'Registry maintenance'
        });
        const error = await readError(getRegistryTheme(registryFetch(body, 503), 'harbor-dusk'));

        expect(error.message).toBe('Registry maintenance');
    });

    it('passes plain-text registry errors through', async () => {
        const error = await readError(
            getRegistryTheme(registryFetch('A theme with this slug does not exist.', 404), 'gone')
        );

        expect(error.status).toBe(404);
        expect(error.message).toBe('A theme with this slug does not exist.');
    });
});

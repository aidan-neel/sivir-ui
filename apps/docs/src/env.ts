import { defineEnvVars } from '@sveltejs/kit/env';

// Both are optional. theme-registry.ts treats an empty value as unset: it falls back to the local
// registry in development and refuses to publish without a secret.
export const variables = defineEnvVars({
    THEME_REGISTRY_URL: { schema: (input) => input ?? '' },
    THEME_REGISTRY_SECRET: { schema: (input) => input ?? '' }
});

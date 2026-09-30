export const registryConfig = {
    port: Number(process.env.PORT ?? 4100),
    maxRequestBodyBytes: 128 * 1024,
    publishLimit: 5,
    publishWindowMs: 60 * 60 * 1000,
    defaultPageSize: 60
} as const;

/** Shared secret the docs server sends on writes. Unset disables publishing. */
export function readPublishSecret(): string | null {
    return process.env.REGISTRY_PUBLISH_SECRET?.trim() || null;
}

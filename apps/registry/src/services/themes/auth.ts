import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

function sha256(value: string): Buffer {
    return createHash('sha256').update(value).digest();
}

function safeEqual(left: string, right: string): boolean {
    return timingSafeEqual(sha256(left), sha256(right));
}

export function createEditToken(): string {
    return randomBytes(32).toString('base64url');
}

export function hashEditToken(token: string): string {
    return sha256(token).toString('hex');
}

export function verifyEditToken(token: string, expectedHash: string): boolean {
    return safeEqual(hashEditToken(token), expectedHash);
}

export function verifyPublishSecret(candidate: string | undefined, secret: string): boolean {
    if (!candidate) {
        return false;
    }

    return safeEqual(candidate, secret);
}

export function readBearerToken(header: string | undefined): string | null {
    const match = header?.match(/^Bearer\s+(\S+)$/i);

    return match ? match[1] : null;
}

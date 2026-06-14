import { env } from '$env/dynamic/private';
import type { ThemeDraft } from '@silk/ui/themes/presets';

export type RegistryTheme = ThemeDraft & {
	id: string;
	createdAt: string;
	updatedAt: string;
};

const DEFAULT_REGISTRY_URL = 'http://localhost:4100';

// Bound registry reads so an unreachable registry (e.g. not running in local
// dev) fails fast and lets callers fall back, instead of hanging the request --
// a dead local port doesn't always refuse promptly (notably under WSL2). The
// registry is local, so a healthy instance answers in well under this; the
// timeout is only ever paid when it's down, so keep it short.
const REGISTRY_READ_TIMEOUT_MS = 1200;

export class RegistryRequestError extends Error {
	constructor(
		public readonly status: number,
		message: string
	) {
		super(message);
	}
}

function getRegistryBaseUrl() {
	return (env.THEME_REGISTRY_URL || DEFAULT_REGISTRY_URL).replace(/\/+$/, '');
}

async function parseErrorMessage(response: Response) {
	const body = await response.text();
	return body.trim() || `Registry request failed with status ${response.status}`;
}

export async function listRegistryThemes(fetchImpl: typeof fetch) {
	const response = await fetchImpl(`${getRegistryBaseUrl()}/themes`, {
		signal: AbortSignal.timeout(REGISTRY_READ_TIMEOUT_MS)
	});
	if (!response.ok) {
		throw new RegistryRequestError(response.status, await parseErrorMessage(response));
	}

	const data = (await response.json()) as RegistryTheme[];
	return data.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getRegistryThemeBySlug(fetchImpl: typeof fetch, slug: string) {
	const response = await fetchImpl(`${getRegistryBaseUrl()}/themes/${encodeURIComponent(slug)}`, {
		signal: AbortSignal.timeout(REGISTRY_READ_TIMEOUT_MS)
	});
	if (!response.ok) {
		throw new RegistryRequestError(response.status, await parseErrorMessage(response));
	}

	return (await response.json()) as RegistryTheme;
}

export async function publishRegistryTheme(fetchImpl: typeof fetch, theme: ThemeDraft) {
	const response = await fetchImpl(`${getRegistryBaseUrl()}/themes`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(theme)
	});

	if (!response.ok) {
		throw new RegistryRequestError(response.status, await parseErrorMessage(response));
	}

	return (await response.json()) as {
		success: boolean;
		message: 'Successfully published theme!';
	};
}

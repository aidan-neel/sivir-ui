import { env } from '$env/dynamic/private';
import type { ThemeDraft } from '@sivir/ui/themes/presets';

export type RegistryTheme = ThemeDraft & {
	id: string;
	createdAt: string;
	updatedAt: string;
};

const DEFAULT_REGISTRY_URL = 'http://localhost:4100';

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
	const response = await fetchImpl(`${getRegistryBaseUrl()}/themes`);
	if (!response.ok) {
		throw new RegistryRequestError(response.status, await parseErrorMessage(response));
	}

	const data = (await response.json()) as RegistryTheme[];
	return data.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getRegistryThemeBySlug(fetchImpl: typeof fetch, slug: string) {
	const response = await fetchImpl(`${getRegistryBaseUrl()}/themes/${encodeURIComponent(slug)}`);
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

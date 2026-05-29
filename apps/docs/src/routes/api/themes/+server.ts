import type { RequestHandler } from './$types';
import {
	RegistryRequestError,
	listRegistryThemes,
	publishRegistryTheme
} from '$lib/server/theme-registry';

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const themes = await listRegistryThemes(fetch);
		return new Response(JSON.stringify(themes), {
			headers: {
				'content-type': 'application/json; charset=utf-8'
			}
		});
	} catch (requestError) {
		const status = requestError instanceof RegistryRequestError ? requestError.status : 500;
		const message =
			requestError instanceof Error ? requestError.message : 'Failed to fetch theme catalog.';
		return new Response(message, { status });
	}
};

export const POST: RequestHandler = async ({ fetch, request }) => {
	try {
		const theme = await request.json();
		const result = await publishRegistryTheme(fetch, theme);

		return new Response(JSON.stringify(result), {
			headers: {
				'content-type': 'application/json; charset=utf-8'
			}
		});
	} catch (requestError) {
		const status = requestError instanceof RegistryRequestError ? requestError.status : 500;
		const message =
			requestError instanceof Error ? requestError.message : 'Failed to publish theme.';
		return new Response(message, { status });
	}
};

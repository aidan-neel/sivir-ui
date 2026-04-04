import type { RequestHandler } from './$types';
import { RegistryRequestError, getRegistryThemeBySlug } from '$lib/server/theme-registry';

export const GET: RequestHandler = async ({ fetch, params }) => {
	try {
		const theme = await getRegistryThemeBySlug(fetch, params.slug);
		return new Response(JSON.stringify(theme), {
			headers: {
				'content-type': 'application/json; charset=utf-8'
			}
		});
	} catch (requestError) {
		const status = requestError instanceof RegistryRequestError ? requestError.status : 500;
		const message =
			requestError instanceof Error ? requestError.message : 'Failed to fetch theme.';
		return new Response(message, { status });
	}
};

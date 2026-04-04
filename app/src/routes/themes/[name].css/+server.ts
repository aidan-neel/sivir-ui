import { themeToCss } from '$lib/silk/themes/presets';
import { RegistryRequestError, getRegistryThemeBySlug } from '$lib/server/theme-registry';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, params }) => {
	let theme = null;
	try {
		theme = await getRegistryThemeBySlug(fetch, params.name);
	} catch (requestError) {
		if (requestError instanceof RegistryRequestError) {
			error(requestError.status, requestError.message);
		}
		error(500, 'Unable to fetch theme.');
	}
	if (!theme) {
		error(500, 'Unable to fetch theme.');
	}

	return new Response(themeToCss(theme), {
		headers: {
			'content-type': 'text/css; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};

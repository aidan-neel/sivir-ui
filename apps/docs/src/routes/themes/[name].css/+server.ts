import { themeToCss } from '@silk/ui/themes/presets';
import { themeToCss as themeToCssV2 } from '@silk/ui/themes/theme';
import { defaultThemeV2 } from '@silk/ui/themes/builtin-presets';
import { RegistryRequestError, getRegistryThemeBySlug } from '$lib/server/theme-registry';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, params }) => {
	if (params.name === 'default') {
		return new Response(themeToCssV2(defaultThemeV2), {
			headers: {
				'content-type': 'text/css; charset=utf-8',
				'cache-control': 'public, max-age=3600'
			}
		});
	}

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

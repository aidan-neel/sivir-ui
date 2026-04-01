import { themePresetMap } from '$lib/silk/themes/presets';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const themes = themePresetMap;

export const GET: RequestHandler = ({ params }) => {
	const theme = themes[params.name as keyof typeof themes];

	if (!theme) {
		error(404, 'Theme not found');
	}

	return new Response(theme, {
		headers: {
			'content-type': 'text/css; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
};

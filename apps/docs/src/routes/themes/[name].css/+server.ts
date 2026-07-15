import { themeToCss } from '@sivir/ui/themes/theme';
import { defaultThemeV2 } from '@sivir/ui/themes/builtin-presets';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	if (params.name === 'default') {
		return new Response(themeToCss(defaultThemeV2), {
			headers: {
				'content-type': 'text/css; charset=utf-8',
				'cache-control': 'public, max-age=3600'
			}
		});
	}

	// For now, only the default v2 theme is served. Additional themes will be added in Phase B.
	error(404, `Theme '${params.name}' not found`);
};

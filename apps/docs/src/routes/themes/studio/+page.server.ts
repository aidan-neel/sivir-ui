import { error } from '@sveltejs/kit';
import { builtInThemePresets } from '@silk/ui/themes/builtin-presets';
import type { PageServerLoad } from './$types';

// Theme Studio is disabled for now. Block direct access until it's reworked.
export const load: PageServerLoad = async () => {
	error(404, 'Not Found');
	// Unreachable — kept so PageData keeps its shape for the (now inaccessible) page.
	return {
		themes: builtInThemePresets
	};
};

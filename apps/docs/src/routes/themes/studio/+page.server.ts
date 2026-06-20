import { builtInThemePresets } from '@silk/ui/themes/builtin-presets';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		themes: builtInThemePresets
	};
};

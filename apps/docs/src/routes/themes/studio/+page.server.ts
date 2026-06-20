import { themesV2 } from '@silk/ui/themes/builtin-presets';
import { listRegistryThemes } from '$lib/server/theme-registry';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const themes = await listRegistryThemes(fetch);
		return {
			themes: themes.length
				? [
						...themesV2,
						...themes.filter((theme) => !themesV2.some((preset) => preset.slug === theme.slug))
					]
				: themesV2
		};
	} catch {
		return {
			themes: themesV2
		};
	}
};

import { builtInThemePresets } from '$lib/silk/themes/builtin-presets';
import { listRegistryThemes } from '$lib/server/theme-registry';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const themes = await listRegistryThemes(fetch);
		return {
			themes: themes.length ? [...builtInThemePresets, ...themes.filter((theme) => !builtInThemePresets.some((preset) => preset.slug === theme.slug))] : builtInThemePresets
		};
	} catch {
		return {
			themes: builtInThemePresets
		};
	}
};

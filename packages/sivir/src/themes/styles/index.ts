import type { StylePreset } from './types';

type StylePresetModule = { style?: StylePreset };

// Auto-discover every style module so installing a new `styles/<slug>.ts` file
// (e.g. via the future CLI) registers it with zero wiring -- mirrors the
// transitions registry.
const styleModules = import.meta.glob('./*.ts', { eager: true }) as Record<
	string,
	StylePresetModule
>;

export const stylePresets: StylePreset[] = Object.entries(styleModules)
	.filter(([path]) => !path.endsWith('/index.ts') && !path.endsWith('/types.ts'))
	.map(([, module]) => module.style)
	.filter((style): style is StylePreset => Boolean(style))
	.sort((a, b) => a.name.localeCompare(b.name));

/** Looks up a style by slug; returns null for unknown/none. */
export function getStyle(slug: string | null | undefined): StylePreset | null {
	if (!slug || slug === 'none') return null;
	return stylePresets.find((style) => style.slug === slug) ?? null;
}

/**
 * Serializes a style's token overrides into a CSS block applied after the theme
 * (in both light and dark) so it wins the cascade. Returns '' for no style.
 */
export function styleToCss(style: StylePreset | null): string {
	if (!style) return '';
	const decls = Object.entries(style.tokens)
		.map(([key, value]) => `\t${key}: ${value};`)
		.join('\n');
	if (!decls) return '';
	return `\n/* Style: ${style.name} */\n:root,\n.dark {\n${decls}\n}`;
}

export type { StylePreset };

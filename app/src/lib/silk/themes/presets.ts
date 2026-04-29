import {
	cloneTransitionMotion,
	getTransitionPreset,
	type ThemeMotion,
	type ThemeTransitionPresetSlug
} from './transitions';

export type ThemePalette = {
	background: string;
	border: string;
	borderStrong: string;
	input: string;
	primary: string;
	info: string;
	foregroundOpposite: string;
	foreground: string;
	muted: string;
	panel: string;
	modal: string;
	foregroundMuted: string;
	foregroundButton: string;
	secondary: string;
	card: string;
	accent: string;
	alternate: string;
	success: string;
	warning: string;
	error: string;
	destructive: string;
	overlay: string;
	ring: string;
};

export type ThemeBasePalette = {
	background: string;
	card: string;
	text: string;
	primary: string;
	secondary?: string;
	/** Optional border override — if omitted, derived automatically from card + text mix. */
	border?: string;
};

export type ThemeDraft = {
	slug: string;
	name: string;
	description: string;
	publisher?: string;
	fontSans: string;
	fontMono: string;
	fontHeader: string;
	radiusBase: string;
	radiusSm: string;
	radiusMd: string;
	radiusLg: string;
	radiusXl: string;
	primaryButtonOutline: boolean;
	invertedPanels: boolean;
	durationPreset: ThemeTransitionPresetSlug;
	motion: ThemeMotion;
	light: ThemePalette;
	dark: ThemePalette;
};

/** Rounds a radius token to a stable rem string. */
function roundRadius(value: number) {
	return `${Math.round(value * 1000) / 1000}rem`;
}

/** Derives the shared radius scale from a single base radius. */
function radiiFromBase(base: string) {
	const parsed = Number.parseFloat(base);
	const safe = Number.isFinite(parsed) ? parsed : 0.5;

	return {
		sm: roundRadius(Math.max(safe - 0.24, 0.14)),
		md: roundRadius(safe),
		lg: roundRadius(safe + 0.1),
		xl: roundRadius(safe + 0.22)
	};
}

/** Fills in a theme palette with the library defaults for omitted values. */
function palette(
	values: Partial<ThemePalette> & Pick<ThemePalette, 'background' | 'primary' | 'foreground'>
): ThemePalette {
	return {
		background: values.background,
		border: values.border ?? '#dde2ea',
		borderStrong: values.borderStrong ?? '#c9d1dc',
		input: values.input ?? values.borderStrong ?? '#c9d1dc',
		primary: values.primary,
		info: values.info ?? '#2563eb',
		foregroundOpposite: values.foregroundOpposite ?? '#ffffff',
		foreground: values.foreground,
		muted: values.muted ?? '#f2f4f7',
		panel: values.panel ?? '#ffffff',
		modal: values.modal ?? values.panel ?? '#ffffff',
		foregroundMuted: values.foregroundMuted ?? '#667085',
		foregroundButton: values.foregroundButton ?? '#ffffff',
		secondary: values.secondary ?? '#f9fafb',
		card: values.card ?? '#ffffff',
		accent: values.accent ?? '#ffffff',
		alternate: values.alternate ?? '#2c2c2c',
		success: values.success ?? '#46ab61',
		warning: values.warning ?? '#ff9800',
		error: values.error ?? '#ef5350',
		destructive: values.destructive ?? '#fa4234',
		overlay: values.overlay ?? 'rgb(0 0 0 / 0.52)',
		ring: values.ring ?? 'rgb(21 94 239 / 0.18)'
	};
}

/** Builds the motion token set from a named duration preset plus overrides. */
function motionFromPreset(
	slug: ThemeTransitionPresetSlug,
	overrides: Partial<ThemeMotion> = {}
): ThemeMotion {
	const preset = getTransitionPreset(slug);
	return {
		...cloneTransitionMotion(preset.motion),
		...overrides
	};
}

/** Clamps a numeric value between a minimum and maximum. */
function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

/** Normalizes a hex value to six-digit lowercase form when possible. */
function normalizeHex(input: string) {
	const value = input.trim();
	if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
	if (/^#[0-9a-f]{3}$/i.test(value)) {
		const [, r, g, b] = value;
		return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
	}
	return null;
}

/** Converts a hex color into RGB channel values. */
function hexToRgb(hex: string) {
	const normalized = normalizeHex(hex) ?? '#000000';
	return {
		r: Number.parseInt(normalized.slice(1, 3), 16),
		g: Number.parseInt(normalized.slice(3, 5), 16),
		b: Number.parseInt(normalized.slice(5, 7), 16)
	};
}

/** Converts RGB channel values into a hex color string. */
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
	return `#${[r, g, b]
		.map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'))
		.join('')}`;
}

/** Mixes two hex colors using a 0-1 weight. */
function mixColors(colorA: string, colorB: string, weight: number) {
	const a = hexToRgb(colorA);
	const b = hexToRgb(colorB);
	const safe = clamp(weight, 0, 1);
	return rgbToHex({
		r: a.r * (1 - safe) + b.r * safe,
		g: a.g * (1 - safe) + b.g * safe,
		b: a.b * (1 - safe) + b.b * safe
	});
}

/** Wraps a hex color in an rgb alpha string. */
function alphaColor(color: string, alpha: number) {
	const { r, g, b } = hexToRgb(color);
	return `rgb(${r} ${g} ${b} / ${clamp(alpha, 0, 1)})`;
}

/** Calculates relative luminance for contrast-aware text decisions. */
function relativeLuminance(color: string) {
	const { r, g, b } = hexToRgb(color);
	const channels = [r, g, b].map((channel) => {
		const normalized = channel / 255;
		return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** Chooses a readable foreground color for a background swatch. */
function contrastText(color: string) {
	return relativeLuminance(color) > 0.45 ? '#09090b' : '#ffffff';
}

/** Expands a small set of base colors into a full semantic palette. */
export function generatePaletteFromBase(
	base: ThemeBasePalette,
	mode: 'light' | 'dark'
): ThemePalette {
	const baseBackground =
		normalizeHex(base.background) ?? (mode === 'light' ? '#fcfcfd' : '#090b0f');
	const baseCard = normalizeHex(base.card) ?? (mode === 'light' ? '#ffffff' : '#0f1318');
	const text = normalizeHex(base.text) ?? (mode === 'light' ? '#101828' : '#eef2f8');
	const primary = normalizeHex(base.primary) ?? (mode === 'light' ? '#155eef' : '#528bff');
	const background = mode === 'light' ? mixColors(baseBackground, '#ffffff', 0.38) : baseBackground;
	const card = mode === 'light' ? mixColors(baseCard, '#ffffff', 0.16) : baseCard;
	const panel =
		mode === 'light' ? mixColors(card, '#ffffff', 0.08) : mixColors(card, '#ffffff', 0.04);
	const modal =
		mode === 'light' ? mixColors(panel, '#ffffff', 0.06) : mixColors(panel, '#ffffff', 0.02);
	const secondary =
		normalizeHex(base.secondary ?? '') ??
		mixColors(background, card, mode === 'light' ? 0.44 : 0.45);
	const border = base.border
		? (normalizeHex(base.border) ?? mixColors(card, text, mode === 'light' ? 0.12 : 0.18))
		: mixColors(card, text, mode === 'light' ? 0.12 : 0.18);
	const borderStrong = base.border
		? mixColors(border, text, mode === 'light' ? 0.2 : 0.25)
		: mixColors(card, text, mode === 'light' ? 0.2 : 0.28);
	const muted = mixColors(background, card, mode === 'light' ? 0.28 : 0.24);
	const accent = mixColors(card, primary, mode === 'light' ? 0.035 : 0.14);
	const foregroundMuted = mixColors(text, background, mode === 'light' ? 0.38 : 0.32);
	const info = mixColors(
		secondary,
		mode === 'light' ? '#2563eb' : '#60a5fa',
		mode === 'light' ? 0.78 : 0.72
	);
	const success = mixColors(
		secondary,
		mode === 'light' ? '#16a34a' : '#4ade80',
		mode === 'light' ? 0.76 : 0.7
	);
	const warning = mixColors(
		secondary,
		mode === 'light' ? '#d97706' : '#fbbf24',
		mode === 'light' ? 0.8 : 0.72
	);
	const error = mixColors(
		secondary,
		mode === 'light' ? '#dc2626' : '#f87171',
		mode === 'light' ? 0.8 : 0.72
	);
	const destructive = mixColors(
		secondary,
		mode === 'light' ? '#b91c1c' : '#ef4444',
		mode === 'light' ? 0.84 : 0.76
	);

	return palette({
		background,
		border,
		borderStrong,
		input: borderStrong,
		primary,
		info,
		foreground: text,
		foregroundOpposite: contrastText(text),
		foregroundButton: contrastText(primary),
		muted,
		panel,
		modal,
		foregroundMuted,
		secondary,
		card,
		accent,
		alternate: mixColors(text, background, mode === 'light' ? 0.08 : 0.16),
		success,
		warning,
		error,
		destructive,
		overlay: alphaColor(mode === 'light' ? text : '#000000', mode === 'light' ? 0.18 : 0.62),
		ring: alphaColor(primary, 0.2)
	});
}

/** Turns a free-form theme name into a filesystem-friendly slug. */
export function slugifyThemeName(name: string) {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Resolves a theme motion object against the selected preset. */
export function resolveThemeMotion(
	durationPreset: ThemeTransitionPresetSlug,
	motion?: Partial<ThemeMotion> | null
) {
	return motionFromPreset(durationPreset, motion ?? {});
}

/** Chooses which palette should drive floating panel surfaces for a given mode. */
function getPanelPalette(theme: ThemeDraft, mode: 'light' | 'dark') {
	return mode === 'light' && theme.invertedPanels ? theme.dark : theme[mode];
}

/** Serializes the floating-surface tokens derived from the active panel palette. */
function panelTokensToCss(theme: ThemeDraft, mode: 'light' | 'dark') {
	const panel = getPanelPalette(theme, mode);
	const isInvertedLight = mode === 'light' && theme.invertedPanels;
	const panelForeground = isInvertedLight
		? mixColors(panel.foreground, '#ffffff', 0.04)
		: panel.foreground;
	const highlight = isInvertedLight
		? 'rgb(120 130 148 / 0.07)'
		: mode === 'dark'
			? 'rgb(120 130 148 / 0.07)'
			: 'rgb(255 255 255 / 0.58)';

	return `\t--color-floating-panel: ${panel.panel};
\t--color-floating-panel-foreground: ${panelForeground};
\t--floating-panel-highlight: ${highlight};
\t--floating-menu-item-foreground: ${panelForeground};
\t--floating-menu-item-hover-bg: color-mix(in srgb, ${panel.secondary} 42%, transparent);
\t--floating-menu-item-active-bg: color-mix(in srgb, ${panel.primary} 10%, transparent);`;
}

/** Serializes a palette into CSS variable declarations. */
function paletteToCss(palette: ThemePalette) {
	return `\t--color-background: ${palette.background};
\t--color-border: ${palette.border};
\t--color-border-strong: ${palette.borderStrong};
\t--color-input: ${palette.input};
\t--color-primary: ${palette.primary};
\t--color-info: ${palette.info};
\t--color-foreground-opposite: ${palette.foregroundOpposite};
\t--color-foreground: ${palette.foreground};
\t--color-muted: ${palette.muted};
\t--color-panel: ${palette.panel};
\t--color-modal: ${palette.modal};
\t--color-foreground-muted: ${palette.foregroundMuted};
\t--color-foreground-btn: ${palette.foregroundButton};
\t--color-secondary: ${palette.secondary};
\t--color-card: ${palette.card};
\t--color-accent: ${palette.accent};
\t--color-alternate: ${palette.alternate};
\t--color-success: ${palette.success};
\t--color-warning: ${palette.warning};
\t--color-error: ${palette.error};
\t--color-destructive: ${palette.destructive};
\t--color-overlay: ${palette.overlay};
\t--color-ring: ${palette.ring};`;
}

function serializeTypeScriptValue(value: unknown, indentLevel = 0): string {
	const indent = '\t'.repeat(indentLevel);
	const nestedIndent = '\t'.repeat(indentLevel + 1);

	if (Array.isArray(value)) {
		if (value.length === 0) return '[]';
		return `[\n${value
			.map((entry) => `${nestedIndent}${serializeTypeScriptValue(entry, indentLevel + 1)}`)
			.join(',\n')}\n${indent}]`;
	}

	if (value && typeof value === 'object') {
		const entries = Object.entries(value);
		if (entries.length === 0) return '{}';
		return `{\n${entries
			.map(
				([key, entry]) =>
					`${nestedIndent}${key}: ${serializeTypeScriptValue(entry, indentLevel + 1)}`
			)
			.join(',\n')}\n${indent}}`;
	}

	return JSON.stringify(value);
}

/** Converts a theme draft into a TypeScript preset module for direct reuse in presets/. */
export function themeToTypeScriptPreset(theme: ThemeDraft) {
	return `import type { ThemeDraft } from '$lib/silk/themes/presets';

export const preset: ThemeDraft = ${serializeTypeScriptValue(theme)};`;
}

/** Converts a theme draft into the CSS shipped by the preset endpoints and studio. */
export function themeToCss(theme: ThemeDraft) {
	const radii = radiiFromBase(theme.radiusBase || theme.radiusMd);
	const motion = resolveThemeMotion(theme.durationPreset, theme.motion);
	return `@theme {
\t--font-sans: ${theme.fontSans};
\t--font-mono: ${theme.fontMono};
\t--font-header: ${theme.fontHeader};
\t--radius-sm: ${radii.sm};
\t--radius-md: ${radii.md};
\t--radius-lg: ${radii.lg};
\t--radius-xl: ${radii.xl};
\t--motion-duration-hover: ${motion.hoverDuration};
\t--motion-duration-menu: ${motion.menuDuration};
\t--motion-duration-panel: ${motion.panelDuration};
\t--motion-duration-sheet: ${motion.sheetDuration};
\t--motion-duration-overlay: ${motion.overlayDuration};
\t--motion-duration-tooltip: ${motion.tooltipDuration};
\t--motion-duration-toast-in: ${motion.toastInDuration};
\t--motion-duration-toast-out: ${motion.toastOutDuration};
\t--motion-panel-x: ${motion.panelX}px;
\t--motion-panel-y: ${motion.panelY}px;
\t--motion-panel-blur: ${motion.panelBlur}px;
\t--motion-panel-scale-start: ${motion.panelScaleStart};
\t--motion-sheet-offset: ${motion.sheetOffset}px;
\t--motion-overlay-blur: ${motion.overlayBlur}px;
\t--button-primary-border: ${theme.primaryButtonOutline ? `color-mix(in srgb, ${theme.light.primary} 76%, #1237b9)` : 'transparent'};
\t--text-xs: 12px;
\t--text-sm: 14px;
${paletteToCss(theme.light)}
${panelTokensToCss(theme, 'light')}
}

.dark {
\t--font-sans: ${theme.fontSans};
\t--font-mono: ${theme.fontMono};
\t--font-header: ${theme.fontHeader};
\t--radius-sm: ${radii.sm};
\t--radius-md: ${radii.md};
\t--radius-lg: ${radii.lg};
\t--radius-xl: ${radii.xl};
\t--motion-duration-hover: ${motion.hoverDuration};
\t--motion-duration-menu: ${motion.menuDuration};
\t--motion-duration-panel: ${motion.panelDuration};
\t--motion-duration-sheet: ${motion.sheetDuration};
\t--motion-duration-overlay: ${motion.overlayDuration};
\t--motion-duration-tooltip: ${motion.tooltipDuration};
\t--motion-duration-toast-in: ${motion.toastInDuration};
\t--motion-duration-toast-out: ${motion.toastOutDuration};
\t--motion-panel-x: ${motion.panelX}px;
\t--motion-panel-y: ${motion.panelY}px;
\t--motion-panel-blur: ${motion.panelBlur}px;
\t--motion-panel-scale-start: ${motion.panelScaleStart};
\t--motion-sheet-offset: ${motion.sheetOffset}px;
\t--motion-overlay-blur: ${motion.overlayBlur}px;
\t--button-primary-border: ${theme.primaryButtonOutline ? `color-mix(in srgb, ${theme.dark.primary} 76%, #7aa2ff)` : 'transparent'};
${paletteToCss(theme.dark)}
${panelTokensToCss(theme, 'dark')}
}`;
}

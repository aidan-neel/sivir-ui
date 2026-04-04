export type ThemePalette = {
	background: string;
	border: string;
	borderStrong: string;
	input: string;
	primary: string;
	foregroundOpposite: string;
	foreground: string;
	muted: string;
	popover: string;
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

export type ThemeDurationPreset = {
	slug: 'default' | 'snappy' | 'instant' | 'smooth';
	name: string;
	description: string;
	hover: string;
	menu: string;
	panel: string;
	sheet: string;
	overlay: string;
	tooltip: string;
	toastIn: string;
	toastOut: string;
};

export type ThemeMotion = {
	panelDuration: string;
	panelX: number;
	panelBlur: number;
	panelScaleStart: number;
	sheetDuration: string;
	sheetOffset: number;
	overlayDuration: string;
	overlayBlur: number;
};

export type ThemeBasePalette = {
	background: string;
	surface: string;
	text: string;
	primary: string;
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
	durationPreset: ThemeDurationPreset['slug'];
	motion: ThemeMotion;
	light: ThemePalette;
	dark: ThemePalette;
};

export const durationPresets: ThemeDurationPreset[] = [
	{
		slug: 'default',
		name: 'Balanced',
		description: 'Matches the current Silk feel with polished but unhurried motion.',
		hover: '240ms',
		menu: '150ms',
		panel: '240ms',
		sheet: '320ms',
		overlay: '150ms',
		tooltip: '140ms',
		toastIn: '440ms',
		toastOut: '340ms'
	},
	{
		slug: 'snappy',
		name: 'Snappy',
		description: 'A little quicker across hovers, menus, and modal surfaces.',
		hover: '190ms',
		menu: '120ms',
		panel: '210ms',
		sheet: '260ms',
		overlay: '120ms',
		tooltip: '110ms',
		toastIn: '360ms',
		toastOut: '280ms'
	},
	{
		slug: 'instant',
		name: 'Instant',
		description: 'Very tight feedback for utility-first interfaces and fast workflows.',
		hover: '120ms',
		menu: '90ms',
		panel: '170ms',
		sheet: '210ms',
		overlay: '100ms',
		tooltip: '90ms',
		toastIn: '280ms',
		toastOut: '220ms'
	},
	{
		slug: 'smooth',
		name: 'Smooth',
		description: 'Softer, slower transitions for editorial or premium-feeling themes.',
		hover: '280ms',
		menu: '180ms',
		panel: '300ms',
		sheet: '380ms',
		overlay: '180ms',
		tooltip: '160ms',
		toastIn: '500ms',
		toastOut: '380ms'
	}
];

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
		foregroundOpposite: values.foregroundOpposite ?? '#ffffff',
		foreground: values.foreground,
		muted: values.muted ?? '#f2f4f7',
		popover: values.popover ?? '#ffffff',
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
	slug: ThemeDurationPreset['slug'],
	overrides: Partial<ThemeMotion> = {}
): ThemeMotion {
	const preset = getDurationPreset(slug);
	return {
		panelDuration: preset.panel,
		panelX: 0,
		panelBlur: 0,
		panelScaleStart: 0.99,
		sheetDuration: preset.sheet,
		sheetOffset: 132,
		overlayDuration: preset.overlay,
		overlayBlur: 0,
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
	const baseBackground = normalizeHex(base.background) ?? (mode === 'light' ? '#fcfcfd' : '#090b0f');
	const baseSurface = normalizeHex(base.surface) ?? (mode === 'light' ? '#ffffff' : '#0f1318');
	const text = normalizeHex(base.text) ?? (mode === 'light' ? '#101828' : '#eef2f8');
	const primary = normalizeHex(base.primary) ?? (mode === 'light' ? '#155eef' : '#528bff');
	const background =
		mode === 'light' ? mixColors(baseBackground, '#ffffff', 0.38) : baseBackground;
	const surface = mode === 'light' ? mixColors(baseSurface, '#ffffff', 0.16) : baseSurface;
	const border = mixColors(surface, text, mode === 'light' ? 0.12 : 0.18);
	const borderStrong = mixColors(surface, text, mode === 'light' ? 0.2 : 0.28);
	const secondary = mixColors(background, surface, mode === 'light' ? 0.44 : 0.45);
	const muted = mixColors(background, surface, mode === 'light' ? 0.28 : 0.24);
	const accent = mixColors(surface, primary, mode === 'light' ? 0.035 : 0.14);
	const foregroundMuted = mixColors(text, background, mode === 'light' ? 0.38 : 0.32);

	return palette({
		background,
		border,
		borderStrong,
		input: borderStrong,
		primary,
		foreground: text,
		foregroundOpposite: contrastText(text),
		foregroundButton: contrastText(primary),
		muted,
		popover: surface,
		foregroundMuted,
		secondary,
		card: surface,
		accent,
		alternate: mixColors(text, background, mode === 'light' ? 0.08 : 0.16),
		success: mixColors(primary, '#38a169', 0.42),
		warning: mixColors(primary, '#d97706', 0.5),
		error: mixColors(primary, '#dc2626', 0.56),
		destructive: mixColors(primary, '#b91c1c', 0.62),
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

/** Returns the matching duration preset or falls back to the default preset. */
export function getDurationPreset(slug: ThemeDurationPreset['slug']) {
	return durationPresets.find((preset) => preset.slug === slug) ?? durationPresets[0];
}

/** Chooses which palette should drive floating panel surfaces for a given mode. */
function getPanelPalette(theme: ThemeDraft, mode: 'light' | 'dark') {
	return mode === 'light' && theme.invertedPanels ? theme.dark : theme[mode];
}

/** Serializes the floating-surface tokens derived from the active panel palette. */
function panelTokensToCss(theme: ThemeDraft, mode: 'light' | 'dark') {
	const panel = getPanelPalette(theme, mode);
	const isInvertedLight = mode === 'light' && theme.invertedPanels;
	const panelForeground = isInvertedLight ? mixColors(panel.foreground, '#ffffff', 0.04) : panel.foreground;
	const panelBorder = isInvertedLight
		? alphaColor(mixColors(panel.borderStrong, panel.foreground, 0.18), 0.42)
		: `color-mix(in srgb, ${panel.borderStrong} 88%, transparent)`;
	const menuItemHoverBorder = isInvertedLight
		? alphaColor(mixColors(panel.borderStrong, panel.foreground, 0.14), 0.24)
		: `color-mix(in srgb, ${panel.borderStrong} 30%, transparent)`;
	const highlight =
		isInvertedLight
			? 'rgb(120 130 148 / 0.07)'
			: mode === 'dark'
				? 'rgb(120 130 148 / 0.07)'
				: 'rgb(255 255 255 / 0.58)';

	return `\t--color-floating-panel: ${panel.popover};
\t--color-floating-panel-foreground: ${panelForeground};
\t--floating-panel-border: ${panelBorder};
\t--floating-panel-highlight: ${highlight};
\t--floating-menu-item-foreground: ${panelForeground};
\t--floating-menu-item-hover-bg: color-mix(in srgb, ${panel.secondary} 42%, transparent);
\t--floating-menu-item-hover-border: ${menuItemHoverBorder};
\t--floating-menu-item-active-bg: color-mix(in srgb, ${panel.primary} 10%, transparent);`;
}

/** Serializes a palette into CSS variable declarations. */
function paletteToCss(palette: ThemePalette) {
	return `\t--color-background: ${palette.background};
\t--color-border: ${palette.border};
\t--color-border-strong: ${palette.borderStrong};
\t--color-input: ${palette.input};
\t--color-primary: ${palette.primary};
\t--color-foreground-opposite: ${palette.foregroundOpposite};
\t--color-foreground: ${palette.foreground};
\t--color-muted: ${palette.muted};
\t--color-popover: ${palette.popover};
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

/** Converts a theme draft into the CSS shipped by the preset endpoints and studio. */
export function themeToCss(theme: ThemeDraft) {
	const radii = radiiFromBase(theme.radiusBase || theme.radiusMd);
	const durations = getDurationPreset(theme.durationPreset);
	const motion = theme.motion ?? motionFromPreset(theme.durationPreset);
	return `@theme {
\t--font-sans: ${theme.fontSans};
\t--font-mono: ${theme.fontMono};
\t--font-header: ${theme.fontHeader};
\t--radius-sm: ${radii.sm};
\t--radius-md: ${radii.md};
\t--radius-lg: ${radii.lg};
\t--radius-xl: ${radii.xl};
\t--radius-btn: var(--radius-lg);
\t--motion-duration-hover: ${durations.hover};
\t--motion-duration-menu: ${durations.menu};
\t--motion-duration-panel: ${motion.panelDuration};
\t--motion-duration-sheet: ${motion.sheetDuration};
\t--motion-duration-overlay: ${motion.overlayDuration};
\t--motion-duration-tooltip: ${durations.tooltip};
\t--motion-duration-toast-in: ${durations.toastIn};
\t--motion-duration-toast-out: ${durations.toastOut};
\t--motion-panel-x: ${motion.panelX}px;
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
\t--motion-duration-hover: ${durations.hover};
\t--motion-duration-menu: ${durations.menu};
\t--motion-duration-panel: ${motion.panelDuration};
\t--motion-duration-sheet: ${motion.sheetDuration};
\t--motion-duration-overlay: ${motion.overlayDuration};
\t--motion-duration-tooltip: ${durations.tooltip};
\t--motion-duration-toast-in: ${durations.toastIn};
\t--motion-duration-toast-out: ${durations.toastOut};
\t--motion-panel-x: ${motion.panelX}px;
\t--motion-panel-blur: ${motion.panelBlur}px;
\t--motion-panel-scale-start: ${motion.panelScaleStart};
\t--motion-sheet-offset: ${motion.sheetOffset}px;
\t--motion-overlay-blur: ${motion.overlayBlur}px;
\t--button-primary-border: ${theme.primaryButtonOutline ? `color-mix(in srgb, ${theme.dark.primary} 76%, #7aa2ff)` : 'transparent'};
${paletteToCss(theme.dark)}
${panelTokensToCss(theme, 'dark')}
}`;
}

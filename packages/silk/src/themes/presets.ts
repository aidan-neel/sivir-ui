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
	/** Optional border override -- if omitted, derived automatically from card + text mix. */
	border?: string;
};

export type ThemeTypography = {
	/** Header / display text. Default 600. */
	weightHeader: number;
	/** Body / paragraph text. Default 400. */
	weightBody: number;
	/** Form labels. Default 500. */
	weightLabel: number;
	/** Button text. Default 500. */
	weightButton: number;
	/** Badge text. Default 500. */
	weightBadge: number;
	/** Header letter-spacing in em. Default -0.02. */
	trackingHeader: number;
	/** Body letter-spacing in em. Default 0. */
	trackingBody: number;
	/** Label letter-spacing in em. Default 0. */
	trackingLabel: number;
	/** Button letter-spacing in em. Default 0. */
	trackingButton: number;
	/** Badge letter-spacing in em. Default 0. */
	trackingBadge: number;
	/** Header font-size in px. Default 18. */
	sizeHeader: number;
	/** Body font-size in px. Default 16. */
	sizeBody: number;
	/** Label font-size in px. Default 14. */
	sizeLabel: number;
	/** Button font-size in px. Default 14. */
	sizeButton: number;
	/** Badge font-size in px. Default 12. */
	sizeBadge: number;
};

export type ThemeSpacing = {
	/** Horizontal button padding in px. Default 14. */
	buttonPaddingX: number;
	/** Horizontal badge padding in px. Default 9. */
	badgePaddingX: number;
	/** Vertical badge padding in px. Default 4. */
	badgePaddingY: number;
	/** Card body padding in px. Default 24. */
	cardPadding: number;
	/** Panel padding in px. Default 12. */
	panelPadding: number;
	/** Input/textarea horizontal padding in px. Default 12. */
	fieldPaddingX: number;
	/** Menu item horizontal padding in px. Default 7. */
	menuItemPaddingX: number;
	/** Default button height in px (controls .default-size buttons). Default 35. */
	buttonHeight: number;
	/** Small button height in px. Default 29. */
	buttonHeightSm: number;
	/** Large button height in px. Default 40. */
	buttonHeightLg: number;
	/** Input/textarea height in px. Default 35. */
	fieldHeight: number;
	/** Menu / select item height in px. Default 32. */
	menuItemHeight: number;
	/** Switch track width in px. Default 39. */
	switchTrackWidth: number;
	/** Switch thumb diameter in px. Default 14. */
	switchThumbSize: number;
	/** Default icon button size in px. Default 32. */
	iconButtonSize: number;
	/** Padding inside dropdown / context / select / combobox content wrappers (px). Default 4. */
	menuPadding: number;
	/** Padding inside menu search bars (command / combobox search) (px). Default 12. */
	menuSearchPadding: number;
	/** Horizontal padding inside menu labels (px). Default 8. */
	menuLabelPaddingX: number;
	/** Vertical padding inside menu labels (px). Default 4. */
	menuLabelPaddingY: number;
	/** Toggle button padding (sm size) (px). Default 8. */
	togglePaddingSm: number;
	/** Toggle button padding (default size) (px). Default 10. */
	togglePaddingMd: number;
	/** Toggle button padding (lg size) (px). Default 14. */
	togglePaddingLg: number;
	/** Tabs trigger horizontal padding (px). Default 14. */
	tabsTriggerPaddingX: number;
	/** Tabs trigger vertical padding (px). Default 6. */
	tabsTriggerPaddingY: number;
	/** Tabs list container padding (px). Default 3. */
	tabsListPadding: number;
	/** Toast horizontal padding (px). Default 16. */
	toastPaddingX: number;
	/** Toast vertical padding (px). Default 16. */
	toastPaddingY: number;
	/** Calendar surface padding (px). Default 12. */
	calendarPadding: number;
	/** Color picker section padding (px). Default 10. */
	colorPickerPadding: number;
	/** Sheet header bottom padding (px). Default 24. */
	sheetHeaderPaddingBottom: number;
	/** Modal/Dialog/AlertDialog body content padding (px). Default 16. */
	modalPadding: number;
	/** Gap between modal title and description (px). Default 6. */
	modalTitleDescriptionGap: number;
	/** Gap between modal header / body / footer sections (px). Default 16. */
	modalSectionGap: number;
	/** Sheet body content padding (px). Default 16. */
	sheetBodyPadding: number;
};

export const defaultSpacing: ThemeSpacing = {
	buttonPaddingX: 14,
	badgePaddingX: 9,
	badgePaddingY: 4,
	cardPadding: 24,
	panelPadding: 12,
	fieldPaddingX: 12,
	menuItemPaddingX: 7,
	buttonHeight: 35,
	buttonHeightSm: 29,
	buttonHeightLg: 40,
	fieldHeight: 35,
	menuItemHeight: 32,
	switchTrackWidth: 39,
	switchThumbSize: 14,
	iconButtonSize: 32,
	menuPadding: 4,
	menuSearchPadding: 12,
	menuLabelPaddingX: 8,
	menuLabelPaddingY: 4,
	togglePaddingSm: 8,
	togglePaddingMd: 10,
	togglePaddingLg: 14,
	tabsTriggerPaddingX: 14,
	tabsTriggerPaddingY: 6,
	tabsListPadding: 3,
	toastPaddingX: 16,
	toastPaddingY: 16,
	calendarPadding: 12,
	colorPickerPadding: 10,
	sheetHeaderPaddingBottom: 24,
	modalPadding: 16,
	modalTitleDescriptionGap: 6,
	modalSectionGap: 16,
	sheetBodyPadding: 16
};

export function resolveSpacing(input?: Partial<ThemeSpacing>): ThemeSpacing {
	return { ...defaultSpacing, ...(input ?? {}) };
}

export const defaultTypography: ThemeTypography = {
	weightHeader: 600,
	weightBody: 400,
	weightLabel: 500,
	weightButton: 500,
	weightBadge: 500,
	trackingHeader: -0.02,
	trackingBody: 0,
	trackingLabel: 0,
	trackingButton: 0,
	trackingBadge: 0,
	sizeHeader: 18,
	sizeBody: 16,
	sizeLabel: 14,
	sizeButton: 14,
	sizeBadge: 12
};

export function resolveTypography(input?: Partial<ThemeTypography>): ThemeTypography {
	return { ...defaultTypography, ...(input ?? {}) };
}

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
	/**
	 * Background for floating overlays (Modal, Dialog, AlertDialog, Sheet,
	 * Command, Popover). When true, overlays paint with `--color-card` so they
	 * sit "above" the page; when false (default) they reuse the page background.
	 */
	overlaysOnSurface?: boolean;
	/**
	 * When false, all button variants -- colored (primary/success/warning/error/
	 * destructive) and outlined -- drop their layered shadow and inner highlight,
	 * rendering flat. Default true.
	 */
	fancyButtons?: boolean;
	/**
	 * When false, badge variants drop their shadow + highlight, rendering flat.
	 * Default true.
	 */
	fancyBadges?: boolean;
	durationPreset: ThemeTransitionPresetSlug;
	motion: ThemeMotion;
	light: ThemePalette;
	dark: ThemePalette;
	/** Per-element font weights. Optional -- partial overrides merge into `defaultTypography`. */
	typography?: Partial<ThemeTypography>;
	/** Padding tokens. Optional -- partial overrides merge into `defaultSpacing`. */
	spacing?: Partial<ThemeSpacing>;
	/** When true, button:active translates -1px for a soft haptic feel. Default false. */
	hapticPress?: boolean;
	/** Master toggle for soft drop shadows on panels (card/modal/popover/select/etc.). Default true. */
	fancyShadows?: boolean;
	/**
	 * When false, interactive surfaces (buttons, tabs, switches, radios) show the
	 * default cursor on hover instead of a pointer. Default true.
	 */
	pointerCursor?: boolean;
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
	// Overlay surface (modal / dialog / alert-dialog / sheet / command).
	// Always sourced from the ACTIVE mode's palette -- `invertedPanels` is for
	// floating popover menus, not full overlays. When `overlaysOnSurface` is
	// true we paint with the card color so panels visually float above the
	// page; otherwise we reuse the page background.
	const overlayPalette = theme[mode];
	const overlayBg = theme.overlaysOnSurface ? overlayPalette.card : overlayPalette.background;

	return `\t--color-floating-panel: ${panel.panel};
\t--color-floating-panel-foreground: ${panelForeground};
\t--floating-panel-highlight: ${highlight};
\t--color-overlay-bg: ${overlayBg};
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
	return `import type { ThemeDraft } from '@silk/ui/themes/presets';

export const preset: ThemeDraft = ${serializeTypeScriptValue(theme)};`;
}

/** Converts a theme draft into the CSS shipped by the preset endpoints and studio. */
export function themeToCss(theme: ThemeDraft) {
	const radii = radiiFromBase(theme.radiusBase || theme.radiusMd);
	const motion = resolveThemeMotion(theme.durationPreset, theme.motion);
	const type = resolveTypography(theme.typography);
	const fancyButtons = theme.fancyButtons !== false;
	const fancyBadges = theme.fancyBadges !== false;
	const fancyShadows = theme.fancyShadows !== false;
	const hapticPress = theme.hapticPress === true;
	const pointerCursor = theme.pointerCursor !== false;
	const spacing = resolveSpacing(theme.spacing);
	const buttonShadowOverrides = fancyButtons
		? ''
		: `\n\t--button-primary-shadow: none;\n\t--button-success-shadow: none;\n\t--button-warning-shadow: none;\n\t--button-error-shadow: none;\n\t--button-destructive-shadow: none;\n\t--button-outlined-fancy-shadow: var(--button-outlined-flat-shadow, inset 0 0 0 1px var(--color-border));\n\t--button-fancy-highlight: transparent;`;
	const badgeShadowOverrides = fancyBadges ? '' : `\n\t--badge-shadow: none;\n\t--badge-fancy-highlight: transparent;`;
	const panelShadowOverrides = fancyShadows
		? ''
		: `\n\t--shadow-xs: none;\n\t--shadow-sm: none;\n\t--shadow-md: none;\n\t--shadow-lg: none;\n\t--panel-shadow: none;\n\t--card-shadow: none;\n\t--toast-shadow: none;\n\t--tooltip-shadow: none;\n\t--button-outlined-shadow: none;\n\t--field-outlined-shadow: inset 0 0 0 1px var(--color-border);`;
	const hapticOverrides = hapticPress ? '\n\t--haptic-press-y: -1px;' : '\n\t--haptic-press-y: 0px;';
	const cursorOverrides = pointerCursor ? '\n\t--ui-cursor-interactive: pointer;' : '\n\t--ui-cursor-interactive: default;';
	const spacingTokens = `\n\t--button-padding-x: ${spacing.buttonPaddingX}px;\n\t--badge-padding-x: ${spacing.badgePaddingX}px;\n\t--badge-padding-y: ${spacing.badgePaddingY}px;\n\t--card-padding: ${spacing.cardPadding}px;\n\t--panel-padding: ${spacing.panelPadding}px;\n\t--field-padding-x: ${spacing.fieldPaddingX}px;\n\t--space-menu-item-x: ${spacing.menuItemPaddingX}px;\n\t--menu-item-padding-x: ${spacing.menuItemPaddingX}px;\n\t--size-control-md: ${spacing.buttonHeight}px;\n\t--size-control-sm: ${spacing.buttonHeightSm}px;\n\t--size-control-lg: ${spacing.buttonHeightLg}px;\n\t--field-height: ${spacing.fieldHeight}px;\n\t--menu-item-height: ${spacing.menuItemHeight}px;\n\t--size-switch-track: ${spacing.switchTrackWidth}px;\n\t--size-switch-thumb: ${spacing.switchThumbSize}px;\n\t--size-icon-md: ${spacing.iconButtonSize}px;\n\t--menu-padding: ${spacing.menuPadding}px;\n\t--menu-search-padding: ${spacing.menuSearchPadding}px;\n\t--menu-label-padding-x: ${spacing.menuLabelPaddingX}px;\n\t--menu-label-padding-y: ${spacing.menuLabelPaddingY}px;\n\t--toggle-padding-sm: ${spacing.togglePaddingSm}px;\n\t--toggle-padding-md: ${spacing.togglePaddingMd}px;\n\t--toggle-padding-lg: ${spacing.togglePaddingLg}px;\n\t--tabs-trigger-padding-x: ${spacing.tabsTriggerPaddingX}px;\n\t--tabs-trigger-padding-y: ${spacing.tabsTriggerPaddingY}px;\n\t--tabs-list-padding: ${spacing.tabsListPadding}px;\n\t--toast-padding-x: ${spacing.toastPaddingX}px;\n\t--toast-padding-y: ${spacing.toastPaddingY}px;\n\t--calendar-padding: ${spacing.calendarPadding}px;\n\t--color-picker-padding: ${spacing.colorPickerPadding}px;\n\t--sheet-header-padding-bottom: ${spacing.sheetHeaderPaddingBottom}px;\n\t--modal-padding: ${spacing.modalPadding}px;\n\t--modal-title-description-gap: ${spacing.modalTitleDescriptionGap}px;\n\t--modal-section-gap: ${spacing.modalSectionGap}px;\n\t--sheet-body-padding: ${spacing.sheetBodyPadding}px;`;
	const flatShadowOverrides = buttonShadowOverrides + badgeShadowOverrides + panelShadowOverrides + hapticOverrides + cursorOverrides + spacingTokens;
	return `@theme {
\t--font-sans: ${theme.fontSans};
\t--font-mono: ${theme.fontMono};
\t--font-header: ${theme.fontHeader};
\t--font-weight-header: ${type.weightHeader};
\t--font-weight-body: ${type.weightBody};
\t--font-weight-label: ${type.weightLabel};
\t--font-weight-button: ${type.weightButton};
\t--font-weight-badge: ${type.weightBadge};
\t--tracking-header: ${type.trackingHeader}em;
\t--tracking-body: ${type.trackingBody}em;
\t--tracking-label: ${type.trackingLabel}em;
\t--tracking-button: ${type.trackingButton}em;
\t--tracking-badge: ${type.trackingBadge}em;
\t--font-size-header: ${type.sizeHeader}px;
\t--font-size-body: ${type.sizeBody}px;
\t--font-size-label: ${type.sizeLabel}px;
\t--font-size-button: ${type.sizeButton}px;
\t--font-size-badge: ${type.sizeBadge}px;
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
\t--motion-panel-perspective: ${motion.panelPerspective ?? 0};
\t--motion-panel-rotate-x: ${motion.panelRotateX ?? 0};
\t--motion-panel-opacity-start: ${motion.panelOpacityStart ?? 0};
\t--motion-panel-easing: ${motion.panelEasing ?? 'cubic-bezier(0.22,1,0.36,1)'};
\t--button-primary-border: ${theme.primaryButtonOutline ? `color-mix(in srgb, ${theme.light.primary} 76%, #1237b9)` : 'transparent'};
\t--text-xs: 12px;
\t--text-sm: 14px;${flatShadowOverrides}
${paletteToCss(theme.light)}
${panelTokensToCss(theme, 'light')}
}

.dark {
\t--font-sans: ${theme.fontSans};
\t--font-mono: ${theme.fontMono};
\t--font-header: ${theme.fontHeader};
\t--font-weight-header: ${type.weightHeader};
\t--font-weight-body: ${type.weightBody};
\t--font-weight-label: ${type.weightLabel};
\t--font-weight-button: ${type.weightButton};
\t--font-weight-badge: ${type.weightBadge};
\t--tracking-header: ${type.trackingHeader}em;
\t--tracking-body: ${type.trackingBody}em;
\t--tracking-label: ${type.trackingLabel}em;
\t--tracking-button: ${type.trackingButton}em;
\t--tracking-badge: ${type.trackingBadge}em;
\t--font-size-header: ${type.sizeHeader}px;
\t--font-size-body: ${type.sizeBody}px;
\t--font-size-label: ${type.sizeLabel}px;
\t--font-size-button: ${type.sizeButton}px;
\t--font-size-badge: ${type.sizeBadge}px;
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
\t--motion-panel-perspective: ${motion.panelPerspective ?? 0};
\t--motion-panel-rotate-x: ${motion.panelRotateX ?? 0};
\t--motion-panel-opacity-start: ${motion.panelOpacityStart ?? 0};
\t--motion-panel-easing: ${motion.panelEasing ?? 'cubic-bezier(0.22,1,0.36,1)'};
\t--button-primary-border: ${theme.primaryButtonOutline ? `color-mix(in srgb, ${theme.dark.primary} 76%, #7aa2ff)` : 'transparent'};${flatShadowOverrides}
${paletteToCss(theme.dark)}
${panelTokensToCss(theme, 'dark')}
}${
		theme.durationPreset === 'none'
			? `

/* "None" motion preset: zero out every transition and animation, including
   component-level hardcoded durations that ignore --motion-duration-* vars. */
*, *::before, *::after {
\ttransition-duration: 0ms !important;
\ttransition-delay: 0ms !important;
\tanimation-duration: 0.01ms !important;
\tanimation-delay: 0ms !important;
\tanimation-iteration-count: 1 !important;
}`
			: ''
	}`;
}

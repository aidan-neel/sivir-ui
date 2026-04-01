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
	durationPreset: ThemeDurationPreset['slug'];
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

function roundRadius(value: number) {
	return `${Math.round(value * 1000) / 1000}rem`;
}

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

export const themePresets: ThemeDraft[] = [
	{
		slug: 'default',
		name: 'Default',
		description: 'Balanced blue accents with neutral surfaces and polished contrast.',
		publisher: 'Silk UI',
		fontSans: 'Geist, sans-serif',
		fontMono: '"Geist Mono", monospace',
		fontHeader: 'Geist, sans-serif',
		radiusBase: '0.45rem',
		radiusSm: '0.2rem',
		radiusMd: '0.45rem',
		radiusLg: '0.55rem',
		radiusXl: '0.67rem',
		primaryButtonOutline: true,
		durationPreset: 'default',
		light: palette({
			background: '#fcfcfd',
			border: '#dde2ea',
			borderStrong: '#c9d1dc',
			input: '#c9d1dc',
			primary: '#155eef',
			foreground: '#101828',
			foregroundButton: '#ffffff',
			muted: '#f2f4f7',
			popover: '#ffffff',
			foregroundMuted: '#667085',
			secondary: '#f9fafb',
			card: '#ffffff',
			accent: '#ffffff',
			overlay: 'rgb(16 24 40 / 0.18)',
			ring: 'rgb(21 94 239 / 0.18)'
		}),
		dark: palette({
			background: '#090b0f',
			border: '#1b2028',
			borderStrong: '#282f3a',
			input: '#262d38',
			primary: '#528bff',
			foreground: '#eef2f8',
			foregroundButton: '#eef4ff',
			muted: '#101419',
			popover: '#0d1116',
			foregroundMuted: '#8a94a2',
			secondary: '#10141a',
			card: '#0f1318',
			accent: '#131922',
			overlay: 'rgb(0 0 0 / 0.62)',
			ring: 'rgb(82 139 255 / 0.16)'
		})
	},
	{
		slug: 'linen',
		name: 'Linen',
		description: 'Warm paper-like neutrals with a refined rust accent.',
		publisher: 'Silk UI',
		fontSans: 'Manrope, sans-serif',
		fontMono: '"IBM Plex Mono", monospace',
		fontHeader: 'Lora, serif',
		radiusBase: '0.42rem',
		radiusSm: '0.18rem',
		radiusMd: '0.42rem',
		radiusLg: '0.58rem',
		radiusXl: '0.8rem',
		primaryButtonOutline: true,
		durationPreset: 'smooth',
		light: palette({
			background: '#fbf7f0',
			border: '#ded4c7',
			borderStrong: '#cdbfae',
			input: '#d8cbbb',
			primary: '#a44a2f',
			foreground: '#271d19',
			foregroundButton: '#fff8f3',
			muted: '#f1e7dc',
			popover: '#fffdf9',
			foregroundMuted: '#7f6d62',
			secondary: '#f5ede3',
			card: '#fffaf4',
			accent: '#fbf3ea',
			overlay: 'rgb(31 23 18 / 0.24)',
			ring: 'rgb(164 74 47 / 0.18)'
		}),
		dark: palette({
			background: '#100e0c',
			border: '#27211d',
			borderStrong: '#372f29',
			input: '#342b26',
			primary: '#f08f69',
			foreground: '#f4ece6',
			foregroundButton: '#fff1ea',
			muted: '#171310',
			popover: '#14110e',
			foregroundMuted: '#a69386',
			secondary: '#1a1512',
			card: '#15110e',
			accent: '#201915',
			overlay: 'rgb(0 0 0 / 0.68)',
			ring: 'rgb(240 143 105 / 0.18)'
		})
	},
	{
		slug: 'grove',
		name: 'Grove',
		description: 'Botanical green accents with deeper olive neutrals.',
		publisher: 'Silk UI',
		fontSans: '"Plus Jakarta Sans", sans-serif',
		fontMono: '"IBM Plex Mono", monospace',
		fontHeader: '"Plus Jakarta Sans", sans-serif',
		radiusBase: '0.4rem',
		radiusSm: '0.15rem',
		radiusMd: '0.4rem',
		radiusLg: '0.56rem',
		radiusXl: '0.8rem',
		primaryButtonOutline: true,
		durationPreset: 'snappy',
		light: palette({
			background: '#f5f8f3',
			border: '#d8e2d3',
			borderStrong: '#c2d0bb',
			input: '#c7d5c1',
			primary: '#2f7a54',
			foreground: '#18261d',
			foregroundButton: '#f4fbf6',
			muted: '#eaf1e6',
			popover: '#fbfdf9',
			foregroundMuted: '#67776d',
			secondary: '#edf4e9',
			card: '#f9fcf7',
			accent: '#f0f6ed',
			overlay: 'rgb(13 31 22 / 0.2)',
			ring: 'rgb(47 122 84 / 0.18)'
		}),
		dark: palette({
			background: '#0c100d',
			border: '#1b241d',
			borderStrong: '#283229',
			input: '#273228',
			primary: '#63c08c',
			foreground: '#edf5ef',
			foregroundButton: '#effcf4',
			muted: '#111711',
			popover: '#0f140f',
			foregroundMuted: '#8ca092',
			secondary: '#121812',
			card: '#101510',
			accent: '#141b14',
			overlay: 'rgb(0 0 0 / 0.66)',
			ring: 'rgb(99 192 140 / 0.16)'
		})
	},
	{
		slug: 'supabase',
		name: 'Supabase',
		description: 'Crisp green product surfaces inspired by modern database tooling.',
		publisher: 'Silk UI',
		fontSans: '"Instrument Sans", sans-serif',
		fontMono: '"IBM Plex Mono", monospace',
		fontHeader: '"Instrument Sans", sans-serif',
		radiusBase: '0.38rem',
		radiusSm: '0.14rem',
		radiusMd: '0.38rem',
		radiusLg: '0.5rem',
		radiusXl: '0.68rem',
		primaryButtonOutline: false,
		durationPreset: 'instant',
		light: palette({
			background: '#f6fbf8',
			border: '#d3e7da',
			borderStrong: '#bedac9',
			input: '#c4dccd',
			primary: '#1f9d62',
			foreground: '#122018',
			foregroundButton: '#f1fff7',
			muted: '#ebf5ef',
			popover: '#fbfefc',
			foregroundMuted: '#65776c',
			secondary: '#eef7f1',
			card: '#fafdfa',
			accent: '#f1faf4',
			overlay: 'rgb(8 24 14 / 0.18)',
			ring: 'rgb(31 157 98 / 0.18)'
		}),
		dark: palette({
			background: '#0b110d',
			border: '#18231c',
			borderStrong: '#223127',
			input: '#213026',
			primary: '#3ecf8e',
			foreground: '#ebf6ef',
			foregroundButton: '#ecfff5',
			muted: '#101610',
			popover: '#0e140f',
			foregroundMuted: '#8ea394',
			secondary: '#101710',
			card: '#0f150f',
			accent: '#132014',
			overlay: 'rgb(0 0 0 / 0.66)',
			ring: 'rgb(62 207 142 / 0.18)'
		})
	},
	{
		slug: 'shadcn-ui',
		name: 'shadcn/ui',
		description: 'Utility-first grayscale with blue focus accents and tight neutral contrast.',
		publisher: 'Silk UI',
		fontSans: 'Geist, sans-serif',
		fontMono: '"Geist Mono", monospace',
		fontHeader: 'Geist, sans-serif',
		radiusBase: '0.5rem',
		radiusSm: '0.26rem',
		radiusMd: '0.5rem',
		radiusLg: '0.62rem',
		radiusXl: '0.8rem',
		primaryButtonOutline: false,
		durationPreset: 'instant',
		light: palette({
			background: '#ffffff',
			border: '#e5e7eb',
			borderStrong: '#d1d5db',
			input: '#d1d5db',
			primary: '#18181b',
			foreground: '#09090b',
			foregroundButton: '#fafafa',
			muted: '#f4f4f5',
			popover: '#ffffff',
			foregroundMuted: '#71717a',
			secondary: '#f4f4f5',
			card: '#ffffff',
			accent: '#fafafa',
			alternate: '#18181b',
			overlay: 'rgb(9 9 11 / 0.14)',
			ring: 'rgb(59 130 246 / 0.18)'
		}),
		dark: palette({
			background: '#080809',
			border: '#232326',
			borderStrong: '#35353a',
			input: '#242428',
			primary: '#fafafa',
			foreground: '#fafafa',
			foregroundOpposite: '#09090b',
			foregroundButton: '#09090b',
			muted: '#151518',
			popover: '#0b0b0d',
			foregroundMuted: '#a1a1aa',
			secondary: '#141417',
			card: '#0c0c0f',
			accent: '#151518',
			alternate: '#fafafa',
			overlay: 'rgb(0 0 0 / 0.72)',
			ring: 'rgb(96 165 250 / 0.18)'
		})
	}
];

export function slugifyThemeName(name: string) {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function getDurationPreset(slug: ThemeDurationPreset['slug']) {
	return durationPresets.find((preset) => preset.slug === slug) ?? durationPresets[0];
}

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

export function themeToCss(theme: ThemeDraft) {
	const radii = radiiFromBase(theme.radiusBase || theme.radiusMd);
	const durations = getDurationPreset(theme.durationPreset);
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
\t--motion-duration-panel: ${durations.panel};
\t--motion-duration-sheet: ${durations.sheet};
\t--motion-duration-overlay: ${durations.overlay};
\t--motion-duration-tooltip: ${durations.tooltip};
\t--motion-duration-toast-in: ${durations.toastIn};
\t--motion-duration-toast-out: ${durations.toastOut};
\t--button-primary-border: ${theme.primaryButtonOutline ? `color-mix(in srgb, ${theme.light.primary} 76%, #1237b9)` : 'transparent'};
\t--text-xs: 12px;
\t--text-sm: 14px;
${paletteToCss(theme.light)}
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
\t--motion-duration-panel: ${durations.panel};
\t--motion-duration-sheet: ${durations.sheet};
\t--motion-duration-overlay: ${durations.overlay};
\t--motion-duration-tooltip: ${durations.tooltip};
\t--motion-duration-toast-in: ${durations.toastIn};
\t--motion-duration-toast-out: ${durations.toastOut};
\t--button-primary-border: ${theme.primaryButtonOutline ? `color-mix(in srgb, ${theme.dark.primary} 76%, #7aa2ff)` : 'transparent'};
${paletteToCss(theme.dark)}
}`;
}

export const themePresetMap = Object.fromEntries(
	themePresets.map((theme) => [theme.slug, themeToCss(theme)])
);

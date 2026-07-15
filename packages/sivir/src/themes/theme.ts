export type NeutralTemp = 'cool' | 'true' | 'warm';
export type RadiusScale = 'sharp' | 'default' | 'rounded';
export type Density = 'compact' | 'default' | 'comfortable';
export type MotionFeel = 'none' | 'subtle' | 'default' | 'expressive';

/** The constrained theme contract — ~10 fields. Replaces the ~91-field ThemeDraft. */
export type Theme = {
	slug: string;
	name: string;
	description: string;
	publisher?: string;
	/** Primary/accent color as hex; the full blue ramp is derived from it. */
	brand: string;
	neutral: NeutralTemp;
	radius: RadiusScale;
	density: Density;
	motion: MotionFeel;
	fontSans: string;
	fontMono: string;
	fontHeader: string;
};

export const DEFAULT_THEME: Theme = {
	slug: 'default',
	name: 'Default',
	description: 'Sivir default — a calm, neutral, Notion-like system.',
	publisher: 'Sivir UI',
	brand: '#4a8cff',
	neutral: 'cool',
	radius: 'default',
	density: 'default',
	motion: 'default',
	fontSans: 'Inter',
	fontMono: 'Geist Mono',
	fontHeader: 'Inter'
};

const RADII: Record<RadiusScale, [string, string, string, string]> = {
	sharp: ['2px', '3px', '4px', '6px'],
	default: ['4px', '6px', '8px', '12px'],
	rounded: ['6px', '10px', '14px', '20px']
};

const DENSITY_UNIT: Record<Density, string> = {
	compact: '3.5px',
	default: '4px',
	comfortable: '4.5px'
};

type MotionSet = {
	hover: string;
	menu: string;
	panel: string;
	sheet: string;
	overlay: string;
	toastIn: string;
	toastOut: string;
};
const MOTION: Record<MotionFeel, MotionSet> = {
	none: {
		hover: '0ms',
		menu: '0ms',
		panel: '0ms',
		sheet: '0ms',
		overlay: '0ms',
		toastIn: '0ms',
		toastOut: '0ms'
	},
	subtle: {
		hover: '100ms',
		menu: '80ms',
		panel: '130ms',
		sheet: '160ms',
		overlay: '90ms',
		toastIn: '240ms',
		toastOut: '180ms'
	},
	default: {
		hover: '140ms',
		menu: '120ms',
		panel: '180ms',
		sheet: '220ms',
		overlay: '120ms',
		toastIn: '320ms',
		toastOut: '240ms'
	},
	expressive: {
		hover: '200ms',
		menu: '160ms',
		panel: '260ms',
		sheet: '300ms',
		overlay: '160ms',
		toastIn: '400ms',
		toastOut: '300ms'
	}
};

/** Neutral tint applied via color-mix over the baked cool ramp. 'cool' is the baked default (no override). */
const NEUTRAL_TINT: Record<NeutralTemp, string | null> = {
	cool: null,
	true: '#808080', // pull toward pure gray
	warm: '#8a5a2b' // pull toward warm
};
const NEUTRAL_STEPS = [0, 10, 50, 100, 150, 300, 500, 900];

function brandRamp(hex: string): string[] {
	return [
		`--color-primary: ${hex};`,
		`--color-primary-hover: color-mix(in srgb, ${hex} 88%, black);`,
		`--color-ring: oklch(from ${hex} l c h / 0.3);`,
		`--sivir-blue-500: ${hex};`,
		`--sivir-blue-50: oklch(from ${hex} calc(l + 0.36) calc(c * 0.35) h);`
	];
}

function neutralOverride(temp: NeutralTemp): string[] {
	const tint = NEUTRAL_TINT[temp];
	if (!tint) return [];
	// Re-tint each step relative to itself; the baked value is read via the var.
	return NEUTRAL_STEPS.map(
		(n) => `--sivir-neutral-${n}: color-mix(in srgb, var(--sivir-neutral-${n}) 94%, ${tint});`
	);
}

function block(selector: string, decls: string[]): string {
	if (decls.length === 0) return '';
	return `${selector} {\n${decls.map((d) => `\t${d}`).join('\n')}\n}\n`;
}

/**
 * Emits override CSS for a custom theme. The baked default lives in ui.css, so
 * an unmodified DEFAULT_THEME still emits a (harmless, identical) override block.
 */
export function themeToCss(theme: Theme): string {
	const [rsm, rmd, rlg, rxl] = RADII[theme.radius];
	const m = MOTION[theme.motion];
	const shared = [
		`--font-sans: ${theme.fontSans};`,
		`--font-mono: ${theme.fontMono};`,
		`--font-header: ${theme.fontHeader};`,
		`--radius-sm: ${rsm};`,
		`--radius-md: ${rmd};`,
		`--radius-lg: ${rlg};`,
		`--radius-xl: ${rxl};`,
		`--sivir-space-unit: ${DENSITY_UNIT[theme.density]};`,
		`--motion-duration-hover: ${m.hover};`,
		`--motion-duration-menu: ${m.menu};`,
		`--motion-duration-panel: ${m.panel};`,
		`--motion-duration-sheet: ${m.sheet};`,
		`--motion-duration-overlay: ${m.overlay};`,
		`--motion-duration-toast-in: ${m.toastIn};`,
		`--motion-duration-toast-out: ${m.toastOut};`,
		...brandRamp(theme.brand)
	];
	return (
		block(':root,\n.dark', shared) +
		block(':root', neutralOverride(theme.neutral)) +
		block('.dark', neutralOverride(theme.neutral))
	);
}

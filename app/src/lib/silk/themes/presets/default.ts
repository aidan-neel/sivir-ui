import { generatePaletteFromBase, type ThemeDraft } from '$lib/silk/themes/presets';

export const defaultTheme: ThemeDraft = {
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
	invertedPanels: false,
	durationPreset: 'default',
	motion: {
		panelDuration: '240ms',
		panelX: 0,
		panelBlur: 0,
		panelScaleStart: 0.99,
		sheetDuration: '320ms',
		sheetOffset: 132,
		overlayDuration: '150ms',
		overlayBlur: 0
	},
	light: generatePaletteFromBase(
		{ background: '#fcfcfd', surface: '#ffffff', text: '#101828', primary: '#155eef' },
		'light'
	),
	dark: generatePaletteFromBase(
		{ background: '#090b0f', surface: '#141b24', text: '#eef2f8', primary: '#528bff' },
		'dark'
	)
};

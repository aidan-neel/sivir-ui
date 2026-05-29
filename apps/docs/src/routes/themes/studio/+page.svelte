<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { mode, setMode } from 'mode-watcher';
	import { Badge } from '@silk/ui/components/badge';
	import { Button } from '@silk/ui/components/button';
	import { Input } from '@silk/ui/components/input';
	import { Switch } from '@silk/ui/components/switch';
	import { Slider } from '@silk/ui/components/slider';
	import { Checkbox } from '@silk/ui/components/checkbox';
	import { Skeleton } from '@silk/ui/components/skeleton';
	import { ColorPicker, type ColorOption } from '@silk/ui/components/color-picker';
	import * as Select from '@silk/ui/components/select';
	import * as Tabs from '@silk/ui/components/tabs';
	import * as DropdownMenu from '@silk/ui/components/dropdown-menu';
	import * as Alert from '@silk/ui/components/alert';
	import * as Tooltip from '@silk/ui/components/tooltip';
	import * as Breadcrumb from '@silk/ui/components/breadcrumb';
	import * as Modal from "@silk/ui/components/modal";
	import * as Command from '@silk/ui/components/command';
	import { toast } from '@silk/ui/components/toast';
	import {
		applyLiveThemeCss,
		getStoredLiveThemeCss,
		loadThemeStudioState,
		saveThemeStudioState,
		getSavedThemes,
		saveLocalTheme,
		deleteLocalTheme,
		type SavedTheme
	} from '@silk/ui/themes/live';
	import {
		type ThemePalette,
		generatePaletteFromBase,
		resolveThemeMotion,
		slugifyThemeName,
		themeToCss,
		themeToTypeScriptPreset,
		type ThemeBasePalette,
		type ThemeDraft,
		defaultTypography,
		resolveTypography,
		type ThemeTypography,
		defaultSpacing,
		resolveSpacing,
		type ThemeSpacing
	} from '@silk/ui/themes/presets';
	import { transitionPresets, type ThemeTransitionPresetSlug } from '@silk/ui/themes/transitions';
	import { builtInThemePresets } from '@silk/ui/themes/builtin-presets';

	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import RotateCw from '@lucide/svelte/icons/rotate-cw';
	import RefreshCcw from '@lucide/svelte/icons/refresh-ccw';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Send from '@lucide/svelte/icons/send';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Bell from '@lucide/svelte/icons/bell';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Settings from '@lucide/svelte/icons/settings';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Users from '@lucide/svelte/icons/users';
	import Search from '@lucide/svelte/icons/search';
	import Plus from '@lucide/svelte/icons/plus';
	import Inbox from '@lucide/svelte/icons/inbox';
	import FileText from '@lucide/svelte/icons/file-text';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Info from '@lucide/svelte/icons/info';
	import Slash from '@lucide/svelte/icons/slash';
	import Save from '@lucide/svelte/icons/save';
	import Sliders from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import Trash from '@lucide/svelte/icons/trash-2';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Maximize from '@lucide/svelte/icons/maximize-2';
	import Minimize from '@lucide/svelte/icons/minimize-2';
	import Layers2 from '@lucide/svelte/icons/layers-2';
	import Wind from '@lucide/svelte/icons/wind';
	import Equal from '@lucide/svelte/icons/equal';

	import type { PageData } from './$types';

	const { data = { themes: builtInThemePresets } as PageData }: { data?: PageData } = $props();

	type FontOption = { label: string; value: string; group: 'Sans Serif' | 'Serif' | 'Mono' };
	type RadiusOption = { label: string; value: string };
	type BasePaletteKey = keyof ThemeBasePalette;
	type StudioSnapshot = {
		selectedPresetSlug: string;
		editorTheme: ThemeDraft;
		editorName: string;
		headerFontSelection: string;
		bodyFontSelection: string;
		lightBasePalette: ThemeBasePalette;
		darkBasePalette: ThemeBasePalette;
	};

	const fontOptions: FontOption[] = [
		{ label: 'Geist', value: 'Geist, sans-serif', group: 'Sans Serif' },
		{ label: 'Inter', value: 'Inter, sans-serif', group: 'Sans Serif' },
		{ label: 'Instrument Sans', value: '"Instrument Sans", sans-serif', group: 'Sans Serif' },
		{ label: 'Manrope', value: 'Manrope, sans-serif', group: 'Sans Serif' },
		{ label: 'DM Sans', value: '"DM Sans", sans-serif', group: 'Sans Serif' },
		{ label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif', group: 'Sans Serif' },
		{ label: 'Outfit', value: 'Outfit, sans-serif', group: 'Sans Serif' },
		{ label: 'Space Grotesk', value: '"Space Grotesk", sans-serif', group: 'Sans Serif' },
		{ label: 'Sora', value: 'Sora, sans-serif', group: 'Sans Serif' },
		{ label: 'IBM Plex Sans', value: '"IBM Plex Sans", sans-serif', group: 'Sans Serif' },
		{ label: 'Lora', value: 'Lora, serif', group: 'Serif' },
		{ label: 'Source Serif 4', value: '"Source Serif 4", serif', group: 'Serif' },
		{ label: 'Fraunces', value: 'Fraunces, serif', group: 'Serif' },
		{ label: 'Newsreader', value: 'Newsreader, serif', group: 'Serif' },
		{ label: 'Geist Mono', value: '"Geist Mono", monospace', group: 'Mono' },
		{ label: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace', group: 'Mono' }
	];

	const radiusOptions: RadiusOption[] = [
		{ label: 'Sharp', value: '0.34rem' },
		{ label: 'Balanced', value: '0.45rem' },
		{ label: 'Soft', value: '0.58rem' },
		{ label: 'Rounded', value: '0.72rem' }
	];

	const lightBackgroundOptions: ColorOption[] = [
		{ label: 'White', value: '#ffffff' },
		{ label: 'Slate', value: '#f8fafc' },
		{ label: 'Gray', value: '#f9fafb' },
		{ label: 'Zinc', value: '#fafafa' },
		{ label: 'Stone', value: '#fafaf9' },
		{ label: 'Neutral', value: '#fafafa' },
		{ label: 'Warm', value: '#fffbeb' }
	];
	const lightSurfaceOptions: ColorOption[] = [
		{ label: 'White', value: '#ffffff' },
		{ label: 'Slate', value: '#f8fafc' },
		{ label: 'Gray', value: '#f9fafb' },
		{ label: 'Zinc', value: '#fafafa' },
		{ label: 'Stone', value: '#fafaf9' }
	];
	const lightSecondaryOptions: ColorOption[] = [
		{ label: 'Slate', value: '#f1f5f9' },
		{ label: 'Gray', value: '#f3f4f6' },
		{ label: 'Zinc', value: '#f4f4f5' },
		{ label: 'Stone', value: '#f5f5f4' },
		{ label: 'Blue Tint', value: '#eff6ff' },
		{ label: 'Amber Tint', value: '#fffbeb' }
	];
	const lightTextOptions: ColorOption[] = [
		{ label: 'Slate', value: '#0f172a' },
		{ label: 'Gray', value: '#111827' },
		{ label: 'Zinc', value: '#18181b' },
		{ label: 'Stone', value: '#1c1917' },
		{ label: 'Neutral', value: '#171717' }
	];
	const lightPrimaryOptions: ColorOption[] = [
		{ label: 'Blue', value: '#2563eb' },
		{ label: 'Indigo', value: '#4f46e5' },
		{ label: 'Violet', value: '#7c3aed' },
		{ label: 'Purple', value: '#9333ea' },
		{ label: 'Fuchsia', value: '#c026d3' },
		{ label: 'Pink', value: '#db2777' },
		{ label: 'Rose', value: '#e11d48' },
		{ label: 'Red', value: '#dc2626' },
		{ label: 'Orange', value: '#ea580c' },
		{ label: 'Amber', value: '#d97706' },
		{ label: 'Yellow', value: '#ca8a04' },
		{ label: 'Lime', value: '#65a30d' },
		{ label: 'Green', value: '#16a34a' },
		{ label: 'Emerald', value: '#059669' },
		{ label: 'Teal', value: '#0d9488' },
		{ label: 'Cyan', value: '#0891b2' },
		{ label: 'Sky', value: '#0284c7' },
		{ label: 'Slate', value: '#475569' }
	];
	const darkBackgroundOptions: ColorOption[] = [
		{ label: 'Slate', value: '#020617' },
		{ label: 'Gray', value: '#030712' },
		{ label: 'Zinc', value: '#09090b' },
		{ label: 'Stone', value: '#0c0a09' },
		{ label: 'Neutral', value: '#0a0a0a' }
	];
	const darkSurfaceOptions: ColorOption[] = [
		{ label: 'Slate', value: '#1e293b' },
		{ label: 'Gray', value: '#1f2937' },
		{ label: 'Zinc', value: '#27272a' },
		{ label: 'Stone', value: '#292524' },
		{ label: 'Neutral', value: '#262626' }
	];
	const darkSecondaryOptions: ColorOption[] = [
		{ label: 'Slate', value: '#1e293b' },
		{ label: 'Gray', value: '#1f2937' },
		{ label: 'Zinc', value: '#27272a' },
		{ label: 'Stone', value: '#292524' },
		{ label: 'Blue Tint', value: '#172554' },
		{ label: 'Amber Tint', value: '#451a03' }
	];
	const darkTextOptions: ColorOption[] = [
		{ label: 'White', value: '#ffffff' },
		{ label: 'Slate', value: '#f8fafc' },
		{ label: 'Gray', value: '#f9fafb' },
		{ label: 'Zinc', value: '#fafafa' },
		{ label: 'Stone', value: '#fafaf9' }
	];
	const darkPrimaryOptions: ColorOption[] = [
		{ label: 'Blue', value: '#60a5fa' },
		{ label: 'Indigo', value: '#818cf8' },
		{ label: 'Violet', value: '#a78bfa' },
		{ label: 'Purple', value: '#c084fc' },
		{ label: 'Fuchsia', value: '#e879f9' },
		{ label: 'Pink', value: '#f472b6' },
		{ label: 'Rose', value: '#fb7185' },
		{ label: 'Red', value: '#f87171' },
		{ label: 'Orange', value: '#fb923c' },
		{ label: 'Amber', value: '#fbbf24' },
		{ label: 'Yellow', value: '#facc15' },
		{ label: 'Lime', value: '#a3e635' },
		{ label: 'Green', value: '#4ade80' },
		{ label: 'Emerald', value: '#34d399' },
		{ label: 'Teal', value: '#2dd4bf' },
		{ label: 'Cyan', value: '#22d3ee' },
		{ label: 'Sky', value: '#38bdf8' },
		{ label: 'Slate', value: '#94a3b8' }
	];
	const lightBorderOptions: ColorOption[] = [
		{ label: 'Slate', value: '#e2e8f0' },
		{ label: 'Gray', value: '#e5e7eb' },
		{ label: 'Zinc', value: '#e4e4e7' },
		{ label: 'Stone', value: '#e7e5e4' },
		{ label: 'Neutral', value: '#e5e5e5' }
	];
	const darkBorderOptions: ColorOption[] = [
		{ label: 'Slate', value: '#334155' },
		{ label: 'Gray', value: '#374151' },
		{ label: 'Zinc', value: '#3f3f46' },
		{ label: 'Stone', value: '#44403c' },
		{ label: 'Neutral', value: '#404040' }
	];

	function cloneTheme(theme: ThemeDraft): ThemeDraft {
		// Round-trip through JSON to deep-clone, then guarantee `typography` and
		// `overlaysOnSurface` exist on the result. Without this, undefined fields
		// get stripped by JSON and the $state proxy never registers them -- which
		// silently breaks the studio's weights selects and the overlays toggle.
		const cloned = JSON.parse(JSON.stringify(theme)) as ThemeDraft;
		cloned.typography = resolveTypography(cloned.typography);
		cloned.overlaysOnSurface = cloned.overlaysOnSurface === true;
		cloned.fancyButtons = cloned.fancyButtons !== false;
		cloned.fancyBadges = cloned.fancyBadges !== false;
		cloned.fancyShadows = cloned.fancyShadows !== false;
		cloned.hapticPress = cloned.hapticPress === true;
		cloned.pointerCursor = cloned.pointerCursor !== false;
		cloned.spacing = resolveSpacing(cloned.spacing);
		return cloned;
	}

	function normalizeGeneratedCss(css: string) {
		return css.replace('@theme', ':root');
	}

	function isMonoFont(fontValue: string) {
		return fontValue.includes('monospace');
	}

	function resolveMonoFont(headerFont: string, bodyFont: string, currentMono: string) {
		if (isMonoFont(bodyFont)) return bodyFont;
		if (isMonoFont(headerFont)) return headerFont;
		if (isMonoFont(currentMono)) return currentMono;
		return '"Geist Mono", monospace';
	}

	function getFontLabel(fontValue: string) {
		return fontOptions.find((font) => font.value === fontValue)?.label ?? fontOptions[0].label;
	}

	function createBasePalette(theme: ThemeDraft, mode: 'light' | 'dark'): ThemeBasePalette {
		const palette = theme[mode];
		return {
			background: palette.background,
			card: palette.card,
			text: palette.foreground,
			primary: palette.primary,
			secondary: palette.secondary,
			border: palette.border
		};
	}

	function createStudioState(theme: ThemeDraft): StudioSnapshot {
		return {
			selectedPresetSlug: theme.slug,
			editorTheme: cloneTheme(theme),
			editorName: theme.name,
			headerFontSelection: getFontLabel(theme.fontHeader),
			bodyFontSelection: getFontLabel(theme.fontSans),
			lightBasePalette: createBasePalette(theme, 'light'),
			darkBasePalette: createBasePalette(theme, 'dark')
		};
	}

	function captureStudioSnapshot(): StudioSnapshot {
		return {
			selectedPresetSlug,
			editorTheme: cloneTheme(editorTheme),
			editorName,
			headerFontSelection,
			bodyFontSelection,
			lightBasePalette: { ...lightBasePalette },
			darkBasePalette: { ...darkBasePalette }
		};
	}

	function findPresetFromStoredCss() {
		const stored = getStoredLiveThemeCss();
		if (!stored) return null;
		return (
			themesCatalog.find((theme) => normalizeGeneratedCss(themeToCss(theme)) === stored) ?? null
		);
	}

	function applyStudioState(state: StudioSnapshot) {
		selectedPresetSlug = state.selectedPresetSlug;
		editorTheme = cloneTheme(state.editorTheme);
		editorTheme.motion = resolveThemeMotion(editorTheme.durationPreset, editorTheme.motion);
		editorName = state.editorName;
		headerFontSelection = state.headerFontSelection;
		bodyFontSelection = state.bodyFontSelection;
		lightBasePalette = state.lightBasePalette;
		darkBasePalette = state.darkBasePalette;
		editorTheme.fontMono = resolveMonoFont(
			editorTheme.fontHeader,
			editorTheme.fontSans,
			editorTheme.fontMono
		);
	}

	function loadPreset(theme: ThemeDraft, notify = true) {
		applyStudioState(createStudioState(theme));
		// Loaded preset = the new "clean" reference for dirty tracking.
		queueMicrotask(() => {
			lastSavedSignature = JSON.stringify(captureStudioSnapshot());
		});
		if (notify) {
			toast({
				title: `${theme.name} loaded`,
				description: 'Preset applied across the studio.',
				duration: 2000,
				type: 'success'
			});
		}
	}

	function syncBasePalette(mode: 'light' | 'dark', palette: ThemeBasePalette) {
		const next = generatePaletteFromBase(palette, mode);
		if (mode === 'light') {
			lightBasePalette = { ...palette };
			editorTheme.light = next;
		} else {
			darkBasePalette = { ...palette };
			editorTheme.dark = next;
		}
		selectedPresetSlug = 'custom';
	}

	function updateBasePalette(mode: 'light' | 'dark', key: BasePaletteKey, nextValue: string) {
		syncBasePalette(mode, {
			...(mode === 'light' ? lightBasePalette : darkBasePalette),
			[key]: nextValue
		});
	}

	function updatePrimaryColor(sourceMode: 'light' | 'dark', hex: string) {
		// Light and dark palettes are now independent -- picking red primary on
		// light leaves dark untouched. Use the mode-specific picker for each.
		syncBasePalette(sourceMode, {
			...(sourceMode === 'light' ? lightBasePalette : darkBasePalette),
			primary: hex
		});
	}

	async function copyGeneratedCss() {
		await navigator.clipboard.writeText(generatedCss);
		copiedCss = true;
		setTimeout(() => (copiedCss = false), 1600);
		toast({
			title: 'Copied CSS',
			description: 'Theme CSS is on your clipboard.',
			duration: 1600,
			type: 'success'
		});
	}

	async function copyTypeScriptPreset() {
		await navigator.clipboard.writeText(generatedTypeScriptPreset);
		copiedTs = true;
		setTimeout(() => (copiedTs = false), 1600);
		toast({
			title: 'Copied TypeScript preset',
			description: 'Preset module is on your clipboard.',
			duration: 1600,
			type: 'success'
		});
	}

	function preloadFont(fontStack: string) {
		if (!browser) return;
		const primaryFamily = fontStack.split(',')[0]?.trim();
		if (!primaryFamily) return;
		for (const weight of ['400', '500', '600', '700']) {
			void document.fonts.load(`${weight} 16px ${primaryFamily}`);
		}
	}

	function updateHeaderFont(label: string) {
		const next = fontOptions.find((font) => font.label === label)?.value;
		if (!next) return;
		preloadFont(next);
		headerFontSelection = label;
		editorTheme.fontHeader = next;
		editorTheme.fontMono = resolveMonoFont(next, editorTheme.fontSans, editorTheme.fontMono);
		selectedPresetSlug = 'custom';
	}

	function updateBodyFont(label: string) {
		const next = fontOptions.find((font) => font.label === label)?.value;
		if (!next) return;
		preloadFont(next);
		bodyFontSelection = label;
		editorTheme.fontSans = next;
		editorTheme.fontMono = resolveMonoFont(editorTheme.fontHeader, next, editorTheme.fontMono);
		selectedPresetSlug = 'custom';
	}

	function updateWeight(key: keyof ThemeTypography, value: number) {
		const current = resolveTypography(editorTheme.typography);
		editorTheme.typography = { ...current, [key]: value };
		selectedPresetSlug = 'custom';
	}

	function updateTracking(key: keyof ThemeTypography, value: number) {
		const current = resolveTypography(editorTheme.typography);
		editorTheme.typography = { ...current, [key]: value };
		selectedPresetSlug = 'custom';
	}

	function updateSize(key: keyof ThemeTypography, value: number) {
		const current = resolveTypography(editorTheme.typography);
		editorTheme.typography = { ...current, [key]: value };
		selectedPresetSlug = 'custom';
	}

	// ─── Easing ───
	const defaultEasing = 'cubic-bezier(0.22,1,0.36,1)';
	const easingOptions = [
		{ label: 'Soft', value: 'cubic-bezier(0.22,1,0.36,1)', description: 'Gentle ease-out -- Silk default.' },
		{ label: 'Standard', value: 'cubic-bezier(0.4,0,0.2,1)', description: 'Material standard easing -- even acceleration, sharp landing.' },
		{ label: 'Sharp', value: 'cubic-bezier(0.4,0,0.6,1)', description: 'Quick start, smooth tail.' },
		{ label: 'Spring', value: 'cubic-bezier(0.34,1.56,0.64,1)', description: 'Overshoots a touch, springs back.' },
		{ label: 'Linear', value: 'linear', description: 'Constant velocity. Use sparingly.' },
		{ label: 'Ease in-out', value: 'cubic-bezier(0.65,0,0.35,1)', description: 'Symmetric acceleration / deceleration.' }
	] as const;

	const currentEasing = $derived(
		easingOptions.find((o) => o.value === (editorTheme.motion.panelEasing ?? defaultEasing)) ??
			{ label: 'Custom', value: 'custom', description: 'Custom cubic-bezier set via All motion options.' }
	);

	function updateEasing(value: string) {
		editorTheme.motion = { ...editorTheme.motion, panelEasing: value };
		selectedPresetSlug = 'custom';
	}

	const weightFields: {
		key: keyof ThemeTypography;
		trackingKey: keyof ThemeTypography;
		sizeKey: keyof ThemeTypography;
		label: string;
	}[] = [
		{ key: 'weightHeader', trackingKey: 'trackingHeader', sizeKey: 'sizeHeader', label: 'Header' },
		{ key: 'weightBody', trackingKey: 'trackingBody', sizeKey: 'sizeBody', label: 'Body' },
		{ key: 'weightLabel', trackingKey: 'trackingLabel', sizeKey: 'sizeLabel', label: 'Label' },
		{ key: 'weightButton', trackingKey: 'trackingButton', sizeKey: 'sizeButton', label: 'Button' },
		{ key: 'weightBadge', trackingKey: 'trackingBadge', sizeKey: 'sizeBadge', label: 'Badge' }
	];

	const weightOptions = [
		{ value: 300, label: 'Light' },
		{ value: 400, label: 'Regular' },
		{ value: 500, label: 'Medium' },
		{ value: 600, label: 'Semibold' },
		{ value: 700, label: 'Bold' },
		{ value: 800, label: 'Extrabold' }
	] as const;

	function weightLabel(value: number) {
		return weightOptions.find((o) => o.value === value)?.label ?? '';
	}

	const trackingOptions = [
		{ value: -0.04, label: 'Tightest' },
		{ value: -0.02, label: 'Tight' },
		{ value: -0.01, label: 'Snug' },
		{ value: 0, label: 'Normal' },
		{ value: 0.01, label: 'Relaxed' },
		{ value: 0.025, label: 'Wide' },
		{ value: 0.05, label: 'Wider' },
		{ value: 0.1, label: 'Widest' }
	] as const;

	function trackingLabelFor(value: number) {
		const closest = trackingOptions.reduce((best, opt) =>
			Math.abs(opt.value - value) < Math.abs(best.value - value) ? opt : best
		);
		return closest.label;
	}

	const sizeOptions = [
		{ value: 10, label: '10px' },
		{ value: 12, label: '12px' },
		{ value: 13, label: '13px' },
		{ value: 14, label: '14px' },
		{ value: 15, label: '15px' },
		{ value: 16, label: '16px' },
		{ value: 18, label: '18px' },
		{ value: 20, label: '20px' },
		{ value: 22, label: '22px' },
		{ value: 24, label: '24px' },
		{ value: 28, label: '28px' },
		{ value: 32, label: '32px' }
	] as const;

	function sizeLabelFor(value: number) {
		return `${value}px`;
	}

	function updateRadius(next: string) {
		editorTheme.radiusBase = next;
		selectedPresetSlug = 'custom';
	}

	function updateDurationPreset(next: ThemeTransitionPresetSlug) {
		// Motion preset = durations only. Panel-shape fields (panelX, panelY,
		// panelBlur, panelScaleStart, sheetOffset, overlayBlur, panelPerspective,
		// panelRotateX, panelOpacityStart) stay put -- those are controlled by
		// the Transition preset below.
		editorTheme.durationPreset = next;
		const preset = resolveThemeMotion(next);
		editorTheme.motion = {
			...editorTheme.motion,
			hoverDuration: preset.hoverDuration,
			menuDuration: preset.menuDuration,
			panelDuration: preset.panelDuration,
			sheetDuration: preset.sheetDuration,
			overlayDuration: preset.overlayDuration,
			tooltipDuration: preset.tooltipDuration,
			toastInDuration: preset.toastInDuration,
			toastOutDuration: preset.toastOutDuration
		};
		selectedPresetSlug = 'custom';
	}

	function shuffleTheme() {
		function pick<T>(arr: T[]): T {
			return arr[Math.floor(Math.random() * arr.length)];
		}
		const primaryIdx = Math.floor(Math.random() * lightPrimaryOptions.length);
		const newLightBase: ThemeBasePalette = {
			background: pick(lightBackgroundOptions).value,
			card: pick(lightSurfaceOptions).value,
			text: pick(lightTextOptions).value,
			primary: lightPrimaryOptions[primaryIdx].value,
			secondary: pick(lightSecondaryOptions).value,
			border: pick(lightBorderOptions).value
		};
		const newDarkBase: ThemeBasePalette = {
			background: pick(darkBackgroundOptions).value,
			card: pick(darkSurfaceOptions).value,
			text: pick(darkTextOptions).value,
			primary: darkPrimaryOptions[primaryIdx].value,
			secondary: pick(darkSecondaryOptions).value,
			border: pick(darkBorderOptions).value
		};
		const radius = pick(radiusOptions).value;
		const duration = pick(transitionPresets).slug;
		lightBasePalette = newLightBase;
		darkBasePalette = newDarkBase;
		editorTheme.light = generatePaletteFromBase(newLightBase, 'light');
		editorTheme.dark = generatePaletteFromBase(newDarkBase, 'dark');
		editorTheme.radiusBase = radius;
		editorTheme.durationPreset = duration;
		editorTheme.motion = resolveThemeMotion(duration);
		selectedPresetSlug = 'custom';
	}

	function applySnapshot(snapshot: StudioSnapshot) {
		ignoreHistory = true;
		applyStudioState(snapshot);
		lastSnapshot = captureStudioSnapshot();
		lastSnapshotSignature = JSON.stringify(lastSnapshot);
		queueMicrotask(() => {
			ignoreHistory = false;
		});
	}

	function undoHistory() {
		const previous = undoStack[undoStack.length - 1];
		if (!previous) return;
		const current = captureStudioSnapshot();
		undoStack = undoStack.slice(0, -1);
		redoStack = [...redoStack, current].slice(-40);
		applySnapshot(previous);
	}

	function redoHistory() {
		const next = redoStack[redoStack.length - 1];
		if (!next) return;
		const current = captureStudioSnapshot();
		redoStack = redoStack.slice(0, -1);
		undoStack = [...undoStack, current].slice(-40);
		applySnapshot(next);
	}

	function openPublishDialog() {
		publishName = editorName.trim() || editorTheme.name;
		publishDescription = editorTheme.description?.trim() ?? '';
		publishPublisher = editorTheme.publisher?.trim() ?? '';
		publishDialogOpen = true;
	}

	async function publishTheme() {
		const cleanedName = publishName.trim();
		const slug = slugifyThemeName(cleanedName);
		if (!cleanedName || !slug) {
			toast({
				title: 'Theme name required',
				description: 'Add a valid theme name before publishing.',
				duration: 2400,
				type: 'error'
			});
			return;
		}
		const payload: ThemeDraft = {
			...cloneTheme(editorTheme),
			name: cleanedName,
			slug,
			description:
				publishDescription.trim() ||
				'A custom theme published from the Silk UI Theme Studio.',
			publisher: publishPublisher.trim() || undefined
		};
		isPublishing = true;
		try {
			const response = await fetch('/api/themes', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const responseText = await response.text();
			if (!response.ok) throw new Error(responseText || 'Failed to publish.');
			if (!themesCatalog.some((theme) => theme.slug === payload.slug)) {
				themesCatalog = [payload, ...themesCatalog];
			}
			selectedPresetSlug = payload.slug;
			editorName = cleanedName;
			editorTheme.name = cleanedName;
			editorTheme.description = payload.description;
			editorTheme.publisher = payload.publisher;
			publishDialogOpen = false;
			toast({
				title: 'Theme published',
				description: `${payload.name} is in the catalog.`,
				duration: 2200,
				type: 'success'
			});
		} catch (err) {
			toast({
				title: 'Publish failed',
				description: err instanceof Error ? err.message : 'Could not publish this theme.',
				duration: 3000,
				type: 'error'
			});
		} finally {
			isPublishing = false;
		}
	}

	const getInitialThemesCatalog = () => {
		const themes = Array.isArray(data?.themes) ? data.themes : [];
		return themes.length
			? [...builtInThemePresets, ...themes.filter((t) => t.slug !== 'default')]
			: builtInThemePresets;
	};
	const initialThemesCatalog = getInitialThemesCatalog();
	const defaultTheme = initialThemesCatalog[0];

	let themesCatalog = $state<ThemeDraft[]>([...initialThemesCatalog]);
	let selectedPresetSlug = $state(defaultTheme.slug);
	let editorTheme = $state(cloneTheme(defaultTheme));
	let editorName = $state(defaultTheme.name);
	let copiedCss = $state(false);
	let copiedTs = $state(false);
	let isPublishing = $state(false);
	let headerFontSelection = $state(getFontLabel(defaultTheme.fontHeader));
	let bodyFontSelection = $state(getFontLabel(defaultTheme.fontSans));
	let lightBasePalette = $state<ThemeBasePalette>(createBasePalette(defaultTheme, 'light'));
	let darkBasePalette = $state<ThemeBasePalette>(createBasePalette(defaultTheme, 'dark'));
	let hydrated = $state(false);
	let undoStack = $state<StudioSnapshot[]>([]);
	let redoStack = $state<StudioSnapshot[]>([]);
	let ignoreHistory = $state(false);
	let lastSnapshot = $state<StudioSnapshot>(createStudioState(defaultTheme));
	let lastSnapshotSignature = $state(JSON.stringify(createStudioState(defaultTheme)));
	let inspectorTab = $state('colors');
	// Mobile: inspector is a slide-up drawer toggled by a floating button.
	// On lg+ this is ignored and the inspector renders inline on the right.
	let mobileInspectorOpen = $state(false);

	// Source of truth: editorTheme.overlaysOnSurface. The Switch reads the
	// derived `overlaysOnSurfaceOn` and writes via the onclick callback --
	// no bidirectional bind / no racing effects.
	const overlaysOnSurfaceOn = $derived(editorTheme.overlaysOnSurface === true);
	function toggleOverlaysOnSurface() {
		editorTheme.overlaysOnSurface = !overlaysOnSurfaceOn;
		selectedPresetSlug = 'custom';
	}

	const fancyButtonsOn = $derived(editorTheme.fancyButtons !== false);
	function toggleFancyButtons() {
		editorTheme.fancyButtons = !fancyButtonsOn;
		selectedPresetSlug = 'custom';
	}

	const fancyBadgesOn = $derived(editorTheme.fancyBadges !== false);
	function toggleFancyBadges() {
		editorTheme.fancyBadges = !fancyBadgesOn;
		selectedPresetSlug = 'custom';
	}

	const fancyShadowsOn = $derived(editorTheme.fancyShadows !== false);
	function toggleFancyShadows() {
		editorTheme.fancyShadows = !fancyShadowsOn;
		selectedPresetSlug = 'custom';
	}

	const hapticPressOn = $derived(editorTheme.hapticPress === true);
	function toggleHapticPress() {
		editorTheme.hapticPress = !hapticPressOn;
		selectedPresetSlug = 'custom';
	}

	const pointerCursorOn = $derived(editorTheme.pointerCursor !== false);
	function togglePointerCursor() {
		editorTheme.pointerCursor = !pointerCursorOn;
		selectedPresetSlug = 'custom';
	}

	function updateSpacing(key: keyof ThemeSpacing, value: number) {
		const current = resolveSpacing(editorTheme.spacing);
		editorTheme.spacing = { ...current, [key]: value };
		selectedPresetSlug = 'custom';
	}

	type SpacingFieldGroup = {
		title: string;
		fields: { key: keyof ThemeSpacing; label: string; min: number; max: number; unit?: string }[];
	};
	const spacingGroups: SpacingFieldGroup[] = [
		{
			title: 'Heights',
			fields: [
				{ key: 'buttonHeight', label: 'Button (default)', min: 24, max: 56 },
				{ key: 'buttonHeightSm', label: 'Button (small)', min: 20, max: 44 },
				{ key: 'buttonHeightLg', label: 'Button (large)', min: 28, max: 64 },
				{ key: 'fieldHeight', label: 'Input field', min: 24, max: 56 },
				{ key: 'menuItemHeight', label: 'Menu / select item', min: 20, max: 48 },
				{ key: 'iconButtonSize', label: 'Icon button', min: 20, max: 48 }
			]
		},
		{
			title: 'Switch',
			fields: [
				{ key: 'switchTrackWidth', label: 'Track width', min: 24, max: 64 },
				{ key: 'switchThumbSize', label: 'Thumb', min: 8, max: 28 }
			]
		},
		{
			title: 'Button & field padding',
			fields: [
				{ key: 'buttonPaddingX', label: 'Button (X)', min: 4, max: 32 },
				{ key: 'fieldPaddingX', label: 'Field (X)', min: 4, max: 24 },
				{ key: 'badgePaddingX', label: 'Badge (X)', min: 2, max: 20 },
				{ key: 'badgePaddingY', label: 'Badge (Y)', min: 0, max: 12 }
			]
		},
		{
			title: 'Surface padding',
			fields: [
				{ key: 'cardPadding', label: 'Card', min: 8, max: 48 },
				{ key: 'panelPadding', label: 'Panel', min: 4, max: 24 }
			]
		},
		{
			title: 'Modal & overlay',
			fields: [
				{ key: 'modalPadding', label: 'Modal padding', min: 0, max: 48 },
				{ key: 'modalTitleDescriptionGap', label: 'Title ↔ description', min: 0, max: 24 },
				{ key: 'modalSectionGap', label: 'Section gap', min: 0, max: 32 },
				{ key: 'sheetBodyPadding', label: 'Sheet padding', min: 0, max: 48 },
				{ key: 'sheetHeaderPaddingBottom', label: 'Sheet header (bottom)', min: 0, max: 48 }
			]
		},
		{
			title: 'Menu padding',
			fields: [
				{ key: 'menuPadding', label: 'Menu surface', min: 0, max: 16 },
				{ key: 'menuItemPaddingX', label: 'Menu item (X)', min: 2, max: 16 },
				{ key: 'menuSearchPadding', label: 'Menu search', min: 0, max: 24 },
				{ key: 'menuLabelPaddingX', label: 'Menu label (X)', min: 0, max: 16 },
				{ key: 'menuLabelPaddingY', label: 'Menu label (Y)', min: 0, max: 12 }
			]
		},
		{
			title: 'Tabs padding',
			fields: [
				{ key: 'tabsTriggerPaddingX', label: 'Trigger (X)', min: 4, max: 32 },
				{ key: 'tabsTriggerPaddingY', label: 'Trigger (Y)', min: 0, max: 16 },
				{ key: 'tabsListPadding', label: 'List padding', min: 0, max: 12 }
			]
		},
		{
			title: 'Toggle padding',
			fields: [
				{ key: 'togglePaddingSm', label: 'Toggle (small)', min: 0, max: 20 },
				{ key: 'togglePaddingMd', label: 'Toggle (default)', min: 0, max: 24 },
				{ key: 'togglePaddingLg', label: 'Toggle (large)', min: 0, max: 32 }
			]
		},
		{
			title: 'Component padding',
			fields: [
				{ key: 'toastPaddingX', label: 'Toast (X)', min: 4, max: 32 },
				{ key: 'toastPaddingY', label: 'Toast (Y)', min: 4, max: 32 },
				{ key: 'calendarPadding', label: 'Calendar', min: 0, max: 24 },
				{ key: 'colorPickerPadding', label: 'Color picker', min: 0, max: 24 }
			]
		}
	];

	const generatedCss = $derived(
		themeToCss({
			...editorTheme,
			motion: resolveThemeMotion(editorTheme.durationPreset, editorTheme.motion),
			name: editorName,
			slug: slugifyThemeName(editorName) || 'custom-theme'
		})
	);
	const generatedTypeScriptPreset = $derived(
		themeToTypeScriptPreset({
			...cloneTheme(editorTheme),
			motion: resolveThemeMotion(editorTheme.durationPreset, editorTheme.motion),
			name: editorName.trim() || editorTheme.name,
			slug: slugifyThemeName(editorName) || 'custom-theme'
		})
	);

	const activePreset = $derived(
		themesCatalog.find((theme) => theme.slug === selectedPresetSlug) ?? null
	);

	const colorMode = $derived<'light' | 'dark'>(mode.current === 'dark' ? 'dark' : 'light');

	onMount(() => {
		// Prefer whatever theme is *currently applied* across the app so the studio
		// opens onto what the user is looking at -- falling back to the persisted
		// studio draft only when no live theme is detected.
		const matchedPreset = findPresetFromStoredCss();
		if (matchedPreset) {
			loadPreset(matchedPreset, false);
		} else {
			const restored = loadThemeStudioState();
			if (restored) applyStudioState(restored);
		}
		lastSnapshot = captureStudioSnapshot();
		lastSnapshotSignature = JSON.stringify(lastSnapshot);
		lastSavedSignature = lastSnapshotSignature;
		hydrated = true;
		preloadFont(editorTheme.fontHeader);
		preloadFont(editorTheme.fontSans);
		refreshSavedThemes();
	});

	$effect(() => {
		const parsed = Number.parseFloat(editorTheme.radiusBase);
		if (!Number.isFinite(parsed)) return;
		const safe = Math.max(parsed, 0);
		const rounded = `${Math.round(safe * 1000) / 1000}rem`;
		if (editorTheme.radiusBase !== rounded) editorTheme.radiusBase = rounded;
		editorTheme.radiusMd = rounded;
		editorTheme.radiusSm = `${Math.round(Math.max(safe - 0.24, 0) * 1000) / 1000}rem`;
		editorTheme.radiusLg = `${Math.round((safe + 0.1) * 1000) / 1000}rem`;
		editorTheme.radiusXl = `${Math.round((safe + 0.22) * 1000) / 1000}rem`;
	});

	$effect(() => {
		if (!hydrated) return;
		applyLiveThemeCss(generatedCss);
	});

	$effect(() => {
		if (!hydrated || !browser) return;
		saveThemeStudioState({
			selectedPresetSlug,
			editorTheme,
			editorName,
			headerFontSelection,
			bodyFontSelection,
			lightBasePalette,
			darkBasePalette
		});
	});

	$effect(() => {
		if (!hydrated || ignoreHistory) return;
		const currentSnapshot = captureStudioSnapshot();
		const signature = JSON.stringify(currentSnapshot);
		if (signature === lastSnapshotSignature) return;
		undoStack = [...undoStack, lastSnapshot].slice(-40);
		redoStack = [];
		lastSnapshot = currentSnapshot;
		lastSnapshotSignature = signature;
	});

	const tabs = [
		{ id: 'colors', label: 'Colors' },
		{ id: 'type', label: 'Type' },
		{ id: 'shape', label: 'Shape' },
		{ id: 'padding', label: 'Padding' },
		{ id: 'presets', label: 'Presets' }
	] as const;

	// Interactive state for the canvas playground
	const activeMotionDescription = $derived(
		transitionPresets.find((p) => p.slug === editorTheme.durationPreset)?.description ?? ''
	);

	let playgroundTab = $state('overview');
	let pgInputName = $state('Aidan');
	let pgInputEmail = $state('aidan@silk-ui.dev');
	let pgNotifications = $state(true);
	let pgEmailDigest = $state(false);
	let pgTwoFactor = $state(true);
	let pgAcceptTerms = $state(true);
	let pgRole = $state('designer');
	let pgProgress = $state(64);

	let screenTab = $state('dashboard');
	let newProjectOpen = $state(false);
	let newProjectName = $state('');
	let newProjectTeam = $state('design');
	let selectedMailId = $state(1);

	let publishDialogOpen = $state(false);
	let publishName = $state('');
	let publishDescription = $state('');
	let publishPublisher = $state('');

	let advancedColorsOpen = $state(false);
	let advancedColorsMode = $state<'light' | 'dark'>('light');

	type PaletteField = keyof ThemePalette;
	type PaletteGroup = { title: string; fields: { key: PaletteField; label: string }[] };
	const paletteGroups: PaletteGroup[] = [
		{
			title: 'Surfaces',
			fields: [
				{ key: 'background', label: 'Background' },
				{ key: 'panel', label: 'Panel' },
				{ key: 'modal', label: 'Modal' },
				{ key: 'card', label: 'Card' },
				{ key: 'muted', label: 'Muted' }
			]
		},
		{
			title: 'Foreground',
			fields: [
				{ key: 'foreground', label: 'Foreground' },
				{ key: 'foregroundOpposite', label: 'Foreground opposite' },
				{ key: 'foregroundMuted', label: 'Foreground muted' },
				{ key: 'foregroundButton', label: 'Foreground button' }
			]
		},
		{
			title: 'Brand',
			fields: [
				{ key: 'primary', label: 'Primary' },
				{ key: 'secondary', label: 'Secondary' },
				{ key: 'accent', label: 'Accent' },
				{ key: 'alternate', label: 'Alternate' },
				{ key: 'info', label: 'Info' }
			]
		},
		{
			title: 'Status',
			fields: [
				{ key: 'success', label: 'Success' },
				{ key: 'warning', label: 'Warning' },
				{ key: 'error', label: 'Error' },
				{ key: 'destructive', label: 'Destructive' }
			]
		},
		{
			title: 'Lines & system',
			fields: [
				{ key: 'border', label: 'Border' },
				{ key: 'borderStrong', label: 'Border strong' },
				{ key: 'input', label: 'Input' },
				{ key: 'overlay', label: 'Overlay' },
				{ key: 'ring', label: 'Ring' }
			]
		}
	];

	function updatePaletteField(mode: 'light' | 'dark', field: PaletteField, value: string) {
		editorTheme[mode] = { ...editorTheme[mode], [field]: value };
		selectedPresetSlug = 'custom';
	}

	function openAdvancedColors() {
		advancedColorsMode = colorMode;
		advancedColorsOpen = true;
	}

	let advancedMotionOpen = $state(false);

	type MotionDurationField = {
		key:
			| 'hoverDuration'
			| 'menuDuration'
			| 'panelDuration'
			| 'sheetDuration'
			| 'overlayDuration'
			| 'tooltipDuration'
			| 'toastInDuration'
			| 'toastOutDuration';
		label: string;
		hint: string;
		max: number;
	};
	type MotionNumberField = {
		key:
			| 'panelX'
			| 'panelY'
			| 'panelBlur'
			| 'panelScaleStart'
			| 'sheetOffset'
			| 'overlayBlur'
			| 'panelPerspective'
			| 'panelRotateX'
			| 'panelOpacityStart';
		label: string;
		hint: string;
		min: number;
		max: number;
		step: number;
		unit?: string;
		format?: (value: number) => string;
		experimental?: boolean;
	};
	const motionDurationFields: MotionDurationField[] = [
		{ key: 'hoverDuration', label: 'Hover', hint: 'Buttons, links, ghost state', max: 500 },
		{ key: 'menuDuration', label: 'Menu', hint: 'Dropdowns, select items', max: 500 },
		{ key: 'panelDuration', label: 'Panel', hint: 'Popovers, dialogs', max: 700 },
		{ key: 'sheetDuration', label: 'Sheet', hint: 'Side sheets, drawers', max: 800 },
		{ key: 'overlayDuration', label: 'Overlay', hint: 'Modal backdrop fade', max: 500 },
		{ key: 'tooltipDuration', label: 'Tooltip', hint: 'Hover hints', max: 400 },
		{ key: 'toastInDuration', label: 'Toast in', hint: 'Notification entry', max: 900 },
		{ key: 'toastOutDuration', label: 'Toast out', hint: 'Notification exit', max: 900 }
	];
	const motionNumberFields: MotionNumberField[] = [
		{
			key: 'panelX',
			label: 'Panel X offset',
			hint: 'Horizontal lift on entry',
			min: -40,
			max: 40,
			step: 1,
			unit: 'px'
		},
		{
			key: 'panelY',
			label: 'Panel Y offset',
			hint: 'Vertical lift on entry',
			min: -40,
			max: 40,
			step: 1,
			unit: 'px'
		},
		{
			key: 'panelBlur',
			label: 'Panel blur',
			hint: 'Backdrop blur',
			min: 0,
			max: 24,
			step: 1,
			unit: 'px'
		},
		{
			key: 'panelScaleStart',
			label: 'Panel start scale',
			hint: 'Initial scale on enter',
			min: 0.9,
			max: 1,
			step: 0.005,
			format: (v) => v.toFixed(3)
		},
		{
			key: 'sheetOffset',
			label: 'Sheet offset',
			hint: 'Slide distance',
			min: 0,
			max: 240,
			step: 4,
			unit: 'px'
		},
		{
			key: 'overlayBlur',
			label: 'Overlay blur',
			hint: 'Modal backdrop blur',
			min: 0,
			max: 24,
			step: 1,
			unit: 'px'
		},
		{
			key: 'panelPerspective',
			label: 'Perspective',
			hint: '3D depth. 0 = flat. Try 600-1200 for subtle tilt.',
			min: 0,
			max: 2000,
			step: 50,
			unit: 'px',
			experimental: true
		},
		{
			key: 'panelRotateX',
			label: 'Rotate X',
			hint: 'Entry tilt in degrees. Needs perspective > 0.',
			min: -20,
			max: 20,
			step: 1,
			unit: '°',
			experimental: true
		},
		{
			key: 'panelOpacityStart',
			label: 'Opacity start',
			hint: '0 = fade from invisible, 1 = no fade.',
			min: 0,
			max: 1,
			step: 0.05,
			format: (v) => v.toFixed(2),
			experimental: true
		}
	];

	function durationToMs(value: string) {
		const parsed = Number.parseFloat(value);
		return Number.isFinite(parsed) ? parsed : 0;
	}

	function updateMotionDuration(key: MotionDurationField['key'], rawValue: string | number) {
		const ms = typeof rawValue === 'number' ? rawValue : Number.parseFloat(rawValue);
		if (!Number.isFinite(ms)) return;
		editorTheme.motion = { ...editorTheme.motion, [key]: `${Math.round(ms)}ms` };
		selectedPresetSlug = 'custom';
	}

	function updateMotionNumber(key: MotionNumberField['key'], rawValue: string | number) {
		const parsed = typeof rawValue === 'number' ? rawValue : Number.parseFloat(rawValue);
		if (!Number.isFinite(parsed)) return;
		editorTheme.motion = { ...editorTheme.motion, [key]: parsed };
		selectedPresetSlug = 'custom';
	}

	function openAdvancedMotion() {
		advancedMotionOpen = true;
	}

	type TransitionShape = {
		slug: string;
		name: string;
		description: string;
		icon: typeof ArrowDown;
		motion: {
			panelX: number;
			panelY: number;
			panelScaleStart: number;
			panelBlur: number;
			panelPerspective?: number;
			panelRotateX?: number;
		};
	};
	const transitionShapes: TransitionShape[] = [
		{
			slug: 'subtle',
			name: 'Subtle',
			description: 'Gentle lift -- Silk default.',
			icon: ArrowDown,
			motion: { panelX: 0, panelY: 5, panelScaleStart: 0.99, panelBlur: 0, panelPerspective: 0, panelRotateX: 0 }
		},
		{
			slug: 'lift',
			name: 'Lift',
			description: 'Bigger rise with a soft blur.',
			icon: ArrowUp,
			motion: { panelX: 0, panelY: 12, panelScaleStart: 0.97, panelBlur: 2, panelPerspective: 0, panelRotateX: 0 }
		},
		{
			slug: 'depth',
			name: 'Depth',
			description: '3D tilt -- perspective + rotateX. Experimental.',
			icon: Layers2,
			motion: { panelX: 0, panelY: 6, panelScaleStart: 0.985, panelBlur: 0, panelPerspective: 800, panelRotateX: -10 }
		},
		{
			slug: 'slide',
			name: 'Slide',
			description: 'Enters from the right.',
			icon: ArrowRight,
			motion: { panelX: 14, panelY: 0, panelScaleStart: 1, panelBlur: 0 }
		},
		{
			slug: 'scale',
			name: 'Scale',
			description: 'Grows in from smaller.',
			icon: Maximize,
			motion: { panelX: 0, panelY: 0, panelScaleStart: 0.94, panelBlur: 0 }
		},
		{
			slug: 'pop',
			name: 'Pop',
			description: 'Shrinks down from larger.',
			icon: Minimize,
			motion: { panelX: 0, panelY: 0, panelScaleStart: 1.06, panelBlur: 0 }
		},
		{
			slug: 'glide',
			name: 'Glide',
			description: 'Lift with backdrop blur.',
			icon: Wind,
			motion: { panelX: 0, panelY: 8, panelScaleStart: 0.98, panelBlur: 4 }
		},
		{
			slug: 'stack',
			name: 'Stack',
			description: 'Sits in place, fades only.',
			icon: Layers2,
			motion: { panelX: 0, panelY: 0, panelScaleStart: 1, panelBlur: 0 }
		}
	];

	function approxEqual(a: number, b: number, eps = 0.005) {
		return Math.abs(a - b) < eps;
	}

	const activeTransitionShape = $derived(
		transitionShapes.find(
			(shape) =>
				approxEqual(shape.motion.panelX, editorTheme.motion.panelX) &&
				approxEqual(shape.motion.panelY, editorTheme.motion.panelY) &&
				approxEqual(shape.motion.panelScaleStart, editorTheme.motion.panelScaleStart) &&
				approxEqual(shape.motion.panelBlur, editorTheme.motion.panelBlur) &&
				approxEqual(shape.motion.panelPerspective ?? 0, editorTheme.motion.panelPerspective ?? 0) &&
				approxEqual(shape.motion.panelRotateX ?? 0, editorTheme.motion.panelRotateX ?? 0)
		) ?? null
	);

	function applyTransitionShape(shape: TransitionShape) {
		editorTheme.motion = {
			...editorTheme.motion,
			panelX: shape.motion.panelX,
			panelY: shape.motion.panelY,
			panelScaleStart: shape.motion.panelScaleStart,
			panelBlur: shape.motion.panelBlur,
			panelPerspective: shape.motion.panelPerspective ?? 0,
			panelRotateX: shape.motion.panelRotateX ?? 0
		};
		selectedPresetSlug = 'custom';
	}

	function resetMotionToPreset() {
		editorTheme.motion = resolveThemeMotion(editorTheme.durationPreset);
		selectedPresetSlug = editorTheme.durationPreset;
		toast({
			title: 'Motion reset',
			description: 'Restored values from the selected preset.',
			duration: 1800,
			type: 'success'
		});
	}

	let savedThemes = $state<SavedTheme[]>([]);
	let activeSavedThemeId = $state<string | null>(null);

	// Toolbar Select.Item values for saved themes use their unique `id` (with a
	// `local:` prefix) so two saved themes with the same name don't collide.
	const selectedSelectValue = $derived(
		activeSavedThemeId
			? `local:${activeSavedThemeId}`
			: selectedPresetSlug
	);

	const activeSavedTheme = $derived(
		activeSavedThemeId ? (savedThemes.find((t) => t.id === activeSavedThemeId) ?? null) : null
	);

	let lastSavedSignature = $state('');
	let saveAlertOpen = $state(false);
	let pendingThemeLoad = $state<ThemeDraft | null>(null);

	const isDirty = $derived(
		hydrated && lastSavedSignature !== '' && lastSavedSignature !== lastSnapshotSignature
	);

	function markStateClean() {
		lastSavedSignature = JSON.stringify(captureStudioSnapshot());
	}

	function refreshSavedThemes() {
		savedThemes = getSavedThemes();
	}

	function saveCurrentThemeLocally() {
		const name = editorName.trim() || 'Untitled theme';
		const slug = slugifyThemeName(name) || 'custom-theme';
		const payload: ThemeDraft = {
			...cloneTheme(editorTheme),
			motion: resolveThemeMotion(editorTheme.durationPreset, editorTheme.motion),
			name,
			slug
		};
		// If the user is currently viewing a saved theme, overwrite that entry
		// in place; otherwise mint a brand-new entry with a fresh ID.
		const saved = saveLocalTheme(payload, activeSavedThemeId ?? undefined);
		activeSavedThemeId = saved.id;
		refreshSavedThemes();
		queueMicrotask(markStateClean);
		toast({
			title: `${name} saved locally`,
			description: 'Available anytime from the preset picker.',
			duration: 2000,
			type: 'success'
		});
	}

	function loadSavedTheme(theme: SavedTheme) {
		activeSavedThemeId = theme.id;
		loadPreset(theme);
	}

	let removeSavedTarget = $state<SavedTheme | null>(null);

	function requestDeleteSavedTheme(theme: SavedTheme, event: Event) {
		event.stopPropagation();
		removeSavedTarget = theme;
	}

	function cancelDeleteSavedTheme() {
		removeSavedTarget = null;
	}

	function confirmDeleteSavedTheme() {
		const theme = removeSavedTarget;
		removeSavedTarget = null;
		if (!theme) return;
		deleteLocalTheme(theme.id);
		if (activeSavedThemeId === theme.id) activeSavedThemeId = null;
		refreshSavedThemes();
		toast({
			title: `${theme.name} removed`,
			description: 'Removed from your local library.',
			duration: 1600,
			type: 'success'
		});
	}

	let pendingLoadSavedId = $state<string | null>(null);

	function attemptLoadPreset(theme: ThemeDraft, fromSavedId: string | null = null) {
		// Same theme already active? skip.
		if (fromSavedId) {
			if (fromSavedId === activeSavedThemeId) return;
		} else if (theme.slug === selectedPresetSlug && !activeSavedThemeId) {
			return;
		}
		if (isDirty) {
			pendingThemeLoad = cloneTheme(theme);
			pendingLoadSavedId = fromSavedId;
			saveAlertOpen = true;
			return;
		}
		if (fromSavedId) {
			activeSavedThemeId = fromSavedId;
			loadPreset(theme);
		} else {
			activeSavedThemeId = null;
			loadPreset(theme);
		}
	}

	function resetToDefault() {
		// Force-resets to the built-in default -- bypasses attemptLoadPreset's
		// slug-equality short-circuit so the action still works when the editor
		// is on the default preset but values have diverged.
		if (isDirty) {
			pendingThemeLoad = cloneTheme(defaultTheme);
			pendingLoadSavedId = null;
			saveAlertOpen = true;
			return;
		}
		activeSavedThemeId = null;
		loadPreset(defaultTheme);
	}

	function applyPendingLoad() {
		const pending = pendingThemeLoad;
		const savedId = pendingLoadSavedId;
		pendingThemeLoad = null;
		pendingLoadSavedId = null;
		saveAlertOpen = false;
		if (!pending) return;
		if (savedId) {
			activeSavedThemeId = savedId;
		} else {
			activeSavedThemeId = null;
		}
		loadPreset(pending);
	}

	function saveAndContinue() {
		saveCurrentThemeLocally();
		applyPendingLoad();
	}

	function discardAndContinue() {
		applyPendingLoad();
	}

	function cancelPendingLoad() {
		pendingThemeLoad = null;
		saveAlertOpen = false;
	}

	const mailMessages = [
		{
			id: 1,
			sender: 'Maya Chen',
			initials: 'MC',
			subject: 'v2.5 release notes -- needs your review',
			preview:
				"I've put together the draft for v2.5. Could you take a look before EOD? I've flagged the breaking changes.",
			time: '10:42 AM',
			unread: true,
			tag: 'design'
		},
		{
			id: 2,
			sender: 'Leo Park',
			initials: 'LP',
			subject: 'Quick question about the migration',
			preview:
				"The codemod handles 90% of the cases but I'm seeing some edge cases around nested providers.",
			time: '9:18 AM',
			unread: true,
			tag: 'engineering'
		},
		{
			id: 3,
			sender: 'GitHub',
			initials: 'GH',
			subject: 'PR #482 has new comments',
			preview: 'Aidan opened a pull request: "refactor toolbar to use shared components".',
			time: 'Yesterday',
			unread: false,
			tag: 'system'
		},
		{
			id: 4,
			sender: 'Sofia Reyes',
			initials: 'SR',
			subject: 'Customer feedback digest -- week 18',
			preview:
				'12 new responses, NPS holding at 64. Top theme: people want dark mode in the dashboard.',
			time: 'Tue',
			unread: false,
			tag: 'product'
		},
		{
			id: 5,
			sender: 'Stripe',
			initials: 'St',
			subject: 'Your invoice is ready',
			preview: 'Invoice INV-00042 for $1,240.00 USD is ready to view.',
			time: 'Mon',
			unread: false,
			tag: 'billing'
		}
	];

	const screenOptions = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'settings', label: 'Settings' },
		{ id: 'mail', label: 'Mail' }
	] as const;

	const tagToTone: Record<string, string> = {
		design: 'var(--color-info)',
		engineering: 'var(--color-success)',
		product: 'var(--color-warning)',
		billing: 'var(--color-destructive)',
		system: 'var(--color-foreground-muted)'
	};

	const selectedMail = $derived(
		mailMessages.find((m) => m.id === selectedMailId) ?? mailMessages[0]
	);

	function createProject() {
		const name = newProjectName.trim();
		if (!name) {
			toast({
				title: 'Project name required',
				description: 'Give your project a name before creating it.',
				duration: 2400,
				type: 'error'
			});
			return;
		}
		toast({
			title: 'Project created',
			description: `${name} is ready in ${newProjectTeam}.`,
			duration: 2400,
			type: 'success'
		});
		newProjectName = '';
		newProjectOpen = false;
	}
</script>

<svelte:head>
	<title>Silk · Theme Studio</title>
	<meta
		name="description"
		content="Design, preview, and publish Silk UI themes with live tokens and instant export."
	/>
</svelte:head>

<div
	class="studio-shell mt-16 flex h-[calc(100vh-4rem)] flex-col bg-background"
	style={`--font-header:${editorTheme.fontHeader}; --font-sans:${editorTheme.fontSans}; --font-mono:${editorTheme.fontMono};`}
>
	<!-- ─────────────────────────  TOOLBAR  ───────────────────────── -->
	<header
		class="z-10 flex h-14 shrink-0 items-center gap-3 overflow-x-auto whitespace-nowrap border-b border-border bg-background px-3 md:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
	>
		<!-- Left cluster: theme identity -->
		<div class="flex min-w-0 items-center gap-2">
			<span
				class="grid size-8 place-items-center rounded-lg bg-primary text-foreground-opposite shadow-[inset_0_1px_0_rgb(255_255_255_/_0.15)]"
				aria-hidden="true"
			>
				<Sparkles size={14} />
			</span>
			<div class="flex min-w-0 flex-col leading-none">
				<span class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
					>Theme Studio</span
				>
				<span
					class="truncate text-[0.95rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] tracking-tight text-foreground"
					style="font-family: var(--font-header);"
					aria-label="Theme name"
				>
					{editorName}
				</span>
			</div>
		</div>

		<span class="h-6 w-px bg-border" aria-hidden="true"></span>

		<!-- Preset select -->
		<div class="hidden md:block">
			<Select.Root value={selectedSelectValue}>
				<Select.Trigger class="h-8 min-w-[10rem] gap-1.5 text-[0.82rem]" variant="outlined">
					{activeSavedTheme?.name ?? activePreset?.name ?? 'Custom'}
				</Select.Trigger>
				<Select.Content class="max-h-72 overflow-y-auto">
					{#if savedThemes.length > 0}
						<Select.Label class="">Custom</Select.Label>
						{#each savedThemes as preset (preset.id)}
							<Select.Item
								value={`local:${preset.id}`}
								onclick={() => attemptLoadPreset(preset, preset.id)}
							>
								<span class="flex w-full items-center gap-2 text-left">
									<span
										class="size-3 rounded-full ring-1 ring-border"
										style={`background:${preset.light.primary};`}
									></span>
									<span class="flex-1 truncate">{preset.name}</span>
								</span>
							</Select.Item>
						{/each}
						<Select.Label class="">Catalog</Select.Label>
					{/if}
					{#each themesCatalog.slice(0, 7) as preset (preset.slug)}
						<Select.Item value={preset.slug} onclick={() => attemptLoadPreset(preset)}>
							<span class="flex w-full items-center gap-2 text-left">
								<span
									class="size-3 rounded-full ring-1 ring-border"
									style={`background:${preset.light.primary};`}
								></span>
								<span class="flex-1 truncate">{preset.name}</span>
							</span>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Spacer -->
		<div class="flex-1"></div>

		<!-- Right cluster: actions -->
		<div class="flex items-center gap-1">
			<Button
				variant="ghost"
				size="icon"
				class="size-8"
				onclick={undoHistory}
				disabled={undoStack.length === 0}
				aria-label="Undo"
			>
				<RotateCcw size={14} />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				class="size-8"
				onclick={redoHistory}
				disabled={redoStack.length === 0}
				aria-label="Redo"
			>
				<RotateCw size={14} />
			</Button>

			<span class="mx-1 h-5 w-px bg-border" aria-hidden="true"></span>

			<Button
				variant="ghost"
				size="sm"
				class="h-8 gap-1.5 text-[0.78rem]"
				onclick={shuffleTheme}
			>
				<Shuffle size={13} />
				<span class="max-md:hidden">Shuffle</span>
			</Button>

			<Button
				variant="ghost"
				size="sm"
				class="h-8 gap-1.5 text-[0.78rem]"
				onclick={resetToDefault}
			>
				<RefreshCcw size={13} />
				<span class="max-md:hidden">Reset</span>
			</Button>

			<Button
				variant="ghost"
				size="sm"
				class="h-8 gap-1.5 text-[0.78rem]"
				onclick={saveCurrentThemeLocally}
			>
				<Save size={13} />
				<span class="max-md:hidden">Save</span>
			</Button>

			<Button
				variant="ghost"
				size="icon"
				class="size-8"
				onclick={() => setMode(colorMode === 'dark' ? 'light' : 'dark')}
				aria-label="Toggle color mode"
			>
				{#if colorMode === 'dark'}
					<Moon size={14} />
				{:else}
					<Sun size={14} />
				{/if}
			</Button>

			<span class="mx-1 h-5 w-px bg-border" aria-hidden="true"></span>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					variant="outlined"
					size="sm"
					class="h-8 gap-1.5 text-[0.78rem]"
					aria-label="Export menu"
				>
					Export
					<ChevronDown size={12} />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[14rem]">
					<DropdownMenu.Item onclick={copyGeneratedCss}>
						<span>Copy CSS</span>
						{#if copiedCss}
							<Check size={14} />
						{:else}
							<Copy size={14} />
						{/if}
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={copyTypeScriptPreset}>
						<span>Copy TypeScript preset</span>
						{#if copiedTs}
							<Check size={14} />
						{:else}
							<Copy size={14} />
						{/if}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<Modal.Root bind:open={publishDialogOpen}>
				<Button
					variant="primary"
					size="sm"
					class="h-8 gap-1.5 text-[0.78rem]"
					onclick={openPublishDialog}
				>
					<Send size={12} />
					Publish
				</Button>
				<Modal.Content
					class="w-full max-w-[min(30rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
				>
					<div
						class="flex shrink-0 items-start justify-between px-5 py-4"
					>
						<div class="flex flex-col gap-1">
							<Modal.Title>Publish theme</Modal.Title>
							<Modal.Description>
								Add the details people will see when browsing the registry.
							</Modal.Description>
						</div>
						<Modal.Close
							variant="ghost"
							size="icon"
							class="size-8 shrink-0"
							aria-label="Close"
						>
							<svg
								viewBox="0 0 16 16"
								aria-hidden="true"
								class="size-3.5 fill-none stroke-current"
								stroke-width="1.5"
							>
								<path d="M3 3l10 10M13 3L3 13" stroke-linecap="round" />
							</svg>
						</Modal.Close>
					</div>
					<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
						<Input
							label="Theme name"
							variant="outlined"
							placeholder="e.g. Soft Aurora"
							bind:value={publishName}
						/>
						<div class="flex flex-col gap-1.5">
							<label
								for="publish-description"
								class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
							>
								Description
							</label>
							<textarea
								id="publish-description"
								rows="3"
								placeholder="What makes this theme special? Who should use it?"
								bind:value={publishDescription}
								class="min-h-[5rem] resize-y rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 py-2 text-[0.86rem] leading-relaxed text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-muted focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
							></textarea>
							<span class="text-[0.7rem] text-foreground-muted">
								Optional · if blank we publish with "A custom theme published from the Silk UI
								Theme Studio."
							</span>
						</div>
						<Input
							label="Publisher"
							variant="outlined"
							placeholder="Your name or handle"
							bind:value={publishPublisher}
						/>
						<div
							class="flex flex-col gap-1 rounded-[var(--radius-md)] border border-border/70 bg-secondary/40 px-3 py-2.5 text-[0.74rem] text-foreground-muted"
						>
							<span>
								Slug: <span class="font-mono text-foreground"
									>{slugifyThemeName(publishName) || 'custom-theme'}</span
								>
							</span>
							<span>This is the unique id used in the registry URL.</span>
						</div>
					</div>
					<div
						class="flex shrink-0 items-center justify-end gap-2 px-5 py-3"
					>
						<Modal.Close variant="ghost" size="sm" class="h-8 text-[0.8rem]">
							Cancel
						</Modal.Close>
						<Button
							variant="primary"
							size="sm"
							class="h-8 gap-1.5 text-[0.8rem]"
							onclick={publishTheme}
							disabled={isPublishing || !publishName.trim()}
						>
							<Send size={12} />
							{isPublishing ? 'Publishing…' : 'Publish theme'}
						</Button>
					</div>
				</Modal.Content>
			</Modal.Root>
		</div>
	</header>

	<!-- ───────────────────────  WORKSPACE  ─────────────────────── -->
	<div class="flex min-h-0 flex-1 max-lg:flex-col">
		<!-- ───── CANVAS ───── -->
		<main class="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
			<!-- Scrollable canvas body — single continuous surface, sections divided by hairlines -->
			<div class="min-h-0 flex-1 overflow-y-auto">
				<div class="mx-auto w-full max-w-[860px]">
					<!-- ─── Page header ─── -->
					<header class="flex flex-col gap-3 border-b border-border/60 px-6 py-7 md:px-8">
						<Breadcrumb.Root class="text-[0.78rem]">
							<Breadcrumb.Item href="/themes/studio">Home</Breadcrumb.Item>
							<Breadcrumb.Separator><Slash size={12} /></Breadcrumb.Separator>
							<Breadcrumb.Item href="/themes/studio">Workspace</Breadcrumb.Item>
							<Breadcrumb.Separator><Slash size={12} /></Breadcrumb.Separator>
							<Breadcrumb.Item>Playground</Breadcrumb.Item>
						</Breadcrumb.Root>

						<div class="flex items-start justify-between gap-3">
							<div class="flex items-center gap-3">
								<div class="flex -space-x-2">
									<span
										class="grid size-9 place-items-center rounded-full border-2 border-card bg-primary/15 text-[0.78rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-primary"
										>AN</span
									>
									<span
										class="grid size-9 place-items-center rounded-full border-2 border-card bg-secondary text-[0.78rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
										>MC</span
									>
									<span
										class="grid size-9 place-items-center rounded-full border-2 border-card bg-secondary text-[0.78rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
										>LK</span
									>
									<span
										class="grid size-9 place-items-center rounded-full border-2 border-card bg-background text-[0.7rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
										>+4</span
									>
								</div>
								<div>
									<h2
										class="m-0 text-[1.5rem] [font-weight:var(--font-weight-header,500)] leading-tight [letter-spacing:var(--tracking-header,-0.02em)]"
										style="font-family: var(--font-header);"
									>
										Welcome back, {pgInputName}
									</h2>
									<p class="m-0 mt-0.5 text-[0.85rem] text-foreground-muted">
										Here's what's happening in your workspace today.
									</p>
								</div>
							</div>
							<div class="flex items-center gap-1.5">
								<Tooltip.Root>
									<Tooltip.Trigger>
										<Button variant="ghost" size="icon" aria-label="Inbox">
											<Inbox size={15} />
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>Inbox · 3 new</Tooltip.Content>
								</Tooltip.Root>

								<Command.Root>
									<Command.Trigger
										variant="outlined"
										size="sm"
										class="gap-1.5 text-[0.82rem]"
										aria-label="Open command palette"
									>
										<Search size={13} />
										<span>Search</span>
									</Command.Trigger>
									<Command.Content>
										<Command.Search placeholder="Search projects, people, commands…" />
										<Command.Results>
											<Command.Group heading="Quick actions">
												<Command.Item
													name="new project create"
													callback={() => (newProjectOpen = true)}
												>
													<Plus class="text-foreground-muted" />
													<span>New project</span>
												</Command.Item>
												<Command.Item
													name="invite member team"
													callback={() =>
														toast({
															title: 'Invite sent',
															description: 'Email invitation queued.',
															duration: 2000,
															type: 'success'
														})}
												>
													<Users class="text-foreground-muted" />
													<span>Invite member</span>
												</Command.Item>
												<Command.Item
													name="open settings preferences"
													callback={() => (screenTab = 'settings')}
												>
													<Settings class="text-foreground-muted" />
													<span>Open settings</span>
												</Command.Item>
												<Command.Item
													name="open inbox mail"
													callback={() => (screenTab = 'mail')}
												>
													<Inbox class="text-foreground-muted" />
													<span>Open mail</span>
												</Command.Item>
											</Command.Group>
											<Command.Separator />
											<Command.Group heading="Navigation">
												{#each screenOptions as opt}
													<Command.Item
														name={`go to ${opt.label}`}
														callback={() => (screenTab = opt.id)}
													>
														<Layers class="text-foreground-muted" />
														<span>Go to {opt.label}</span>
													</Command.Item>
												{/each}
											</Command.Group>
										</Command.Results>
									</Command.Content>
								</Command.Root>

								<Modal.Root bind:open={newProjectOpen}>
									<Modal.Trigger size="sm" class="gap-1.5 text-[0.82rem]">
										<Plus size={13} />
										New project
									</Modal.Trigger>
									<Modal.Content
										class="w-full max-w-[min(28rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
									>
										<div
											class="flex shrink-0 items-start justify-between px-5 py-4"
										>
											<div class="flex flex-col gap-1">
												<Modal.Title>Create a new project</Modal.Title>
												<Modal.Description>
													Give your project a name and pick the team it belongs to.
												</Modal.Description>
											</div>
											<Modal.Close
												variant="ghost"
												size="icon"
												class="size-8 shrink-0"
												aria-label="Close"
											>
												<svg
													viewBox="0 0 16 16"
													aria-hidden="true"
													class="size-3.5 fill-none stroke-current"
													stroke-width="1.5"
												>
													<path d="M3 3l10 10M13 3L3 13" stroke-linecap="round" />
												</svg>
											</Modal.Close>
										</div>
										<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
											<Input
												label="Project name"
												variant="outlined"
												placeholder="e.g. Marketing site refresh"
												bind:value={newProjectName}
											/>
											<div class="flex flex-col gap-1.5">
												<span class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">Team</span>
												<Select.Root value={newProjectTeam}>
													<Select.Trigger class="w-full" variant="outlined">
														{newProjectTeam.charAt(0).toUpperCase() + newProjectTeam.slice(1)}
													</Select.Trigger>
													<Select.Content>
														{#each [{ v: 'design', l: 'Design' }, { v: 'engineering', l: 'Engineering' }, { v: 'product', l: 'Product' }, { v: 'marketing', l: 'Marketing' }] as t}
															<Select.Item
																value={t.v}
																onclick={() => (newProjectTeam = t.v)}
															>
																{t.l}
															</Select.Item>
														{/each}
													</Select.Content>
												</Select.Root>
											</div>
										</div>
										<div
											class="flex shrink-0 items-center justify-end gap-2 px-5 py-3"
										>
											<Modal.Close variant="ghost" size="sm" class="text-[0.8rem]">
												Cancel
											</Modal.Close>
											<Modal.Confirm
												size="sm"
												class="text-[0.8rem]"
												onclick={createProject}
											>
												<Plus size={13} />
												Create project
											</Modal.Confirm>
										</div>
									</Modal.Content>
								</Modal.Root>
							</div>
						</div>
					</header>

					<!-- ─── Screen tabs ─── -->
					<div
						class="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-4 md:px-8"
					>
						<Tabs.Root bind:value={screenTab}>
							<Tabs.List>
								{#each screenOptions as opt}
									<Tabs.Trigger value={opt.id}>{opt.label}</Tabs.Trigger>
								{/each}
							</Tabs.List>
						</Tabs.Root>
						<span class="text-[0.72rem] text-foreground-muted max-md:hidden">
							Swap example screens to preview your theme across surfaces.
						</span>
					</div>

					<div class="divide-y divide-border/60">
						{#if screenTab === 'dashboard'}

					<!-- ─── KPI strip ─── -->
					<section class="grid grid-cols-3 gap-3 px-6 py-7 md:px-8 max-sm:grid-cols-1">
						{#each [{ label: 'Revenue', value: '$48.2k', delta: '+12%' }, { label: 'Active users', value: '1,840', delta: '+8%' }, { label: 'Churn rate', value: '1.2%', delta: '−0.4%' }] as stat}
							<div class="flex flex-col gap-1">
								<p class="m-0 text-[0.78rem] text-foreground-muted">{stat.label}</p>
								<p
									class="m-0 text-[1.6rem] [font-weight:var(--font-weight-header,500)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									{stat.value}
								</p>
								<div class="mt-0.5 flex items-center gap-1.5">
									<span
										class="inline-flex items-center gap-0.5 rounded-full bg-[var(--color-success)]/12 px-1.5 py-0.5 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-[var(--color-success)]"
									>
										<TrendingUp size={11} />
										{stat.delta}
									</span>
									<span class="text-[0.7rem] text-foreground-muted">vs last month</span>
								</div>
							</div>
						{/each}
					</section>

					<!-- ─── Tabs with sliding indicator (live) ─── -->
					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						<div class="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
							<div>
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Tabs</p>
								<p
									class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									Project activity
								</p>
							</div>
							<Tabs.Root bind:value={playgroundTab}>
								<Tabs.List>
									<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
									<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
									<Tabs.Trigger value="files">Files</Tabs.Trigger>
								</Tabs.List>
							</Tabs.Root>
						</div>
						<div class="text-[0.86rem] text-foreground-muted">
							{#if playgroundTab === 'overview'}
								<p class="m-0">
									<span class="text-foreground">All systems operational.</span> The pipeline finished
									in 42s with 0 regressions and a 99.4% cache hit rate.
								</p>
							{:else if playgroundTab === 'activity'}
								<div class="flex flex-col gap-2">
									{#each [{ who: 'Maya', what: 'merged main into release-2.5', when: '2m' }, { who: 'Aidan', what: 'opened PR #482 · refactor toolbar', when: '14m' }, { who: 'Leo', what: 'commented on issue #311', when: '1h' }] as item}
										<div class="flex items-center gap-2">
											<span class="size-1.5 rounded-full bg-[var(--color-info)]"></span>
											<span class="text-foreground">{item.who}</span>
											<span>{item.what}</span>
											<span class="ml-auto text-[0.7rem]">{item.when}</span>
										</div>
									{/each}
								</div>
							{:else}
								<div class="flex flex-col gap-2">
									{#each ['silk-ui-roadmap.md', 'design-tokens.json', 'brand-guidelines.fig'] as file}
										<div class="flex items-center gap-2">
											<FileText size={13} />
											<span class="text-foreground">{file}</span>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</section>

					<!-- ─── Form section ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div>
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Form</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Account settings
							</p>
						</div>

						<div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
							<Input
								label="Full name"
								placeholder="Alex Johnson"
								variant="outlined"
								bind:value={pgInputName}
							/>
							<Input
								label="Email"
								type="email"
								placeholder="alex@company.com"
								variant="outlined"
								bind:value={pgInputEmail}
							/>
						</div>

						<div class="flex flex-col gap-1.5">
							<span class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">Role</span>
							<Select.Root value={pgRole}>
								<Select.Trigger class="w-full" variant="outlined">
									{pgRole.charAt(0).toUpperCase() + pgRole.slice(1)}
								</Select.Trigger>
								<Select.Content>
									{#each [{ v: 'engineer', l: 'Engineer' }, { v: 'designer', l: 'Designer' }, { v: 'product', l: 'Product manager' }, { v: 'founder', l: 'Founder' }] as r}
										<Select.Item value={r.v} onclick={() => (pgRole = r.v)}>{r.l}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div class="flex flex-col divide-y divide-border/60 overflow-hidden rounded-[var(--radius-md)] border border-border">
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<Bell size={14} class="text-foreground-muted" />
									<span class="text-[0.86rem]">Push notifications</span>
								</div>
								<Switch bind:switched={pgNotifications} aria-label="Toggle notifications" />
							</div>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<FileText size={14} class="text-foreground-muted" />
									<span class="text-[0.86rem]">Weekly email digest</span>
								</div>
								<Switch bind:switched={pgEmailDigest} aria-label="Toggle email digest" />
							</div>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<Settings size={14} class="text-foreground-muted" />
									<span class="text-[0.86rem]">Two-factor auth</span>
								</div>
								<Switch bind:switched={pgTwoFactor} aria-label="Toggle two-factor" />
							</div>
						</div>

						<Checkbox
							bind:checked={pgAcceptTerms}
							label="I agree to the terms of service"
							description="You can revoke access at any time from the settings page."
						/>

						<div class="flex items-center justify-end gap-2">
							<Button variant="ghost" size="sm">Cancel</Button>
							<Button size="sm">
								<Pencil size={13} />
								Save changes
							</Button>
						</div>
					</section>

					<!-- ─── Buttons + Badges showcase ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div>
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Variants</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Buttons & badges
							</p>
						</div>

						<div class="flex flex-wrap items-center gap-2">
							<Button>Primary</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="outlined">Outlined</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="flat">Flat</Button>
							<Button variant="destructive">Destructive</Button>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<Button variant="success">Success</Button>
							<Button variant="warning">Warning</Button>
							<Button variant="error">Error</Button>
							<Button disabled>Disabled</Button>
							<Button size="sm">Small</Button>
							<Button size="lg">Large</Button>
						</div>

						<div class="flex flex-wrap items-center gap-1.5">
							<Badge>Primary</Badge>
							<Badge variant="secondary">Secondary</Badge>
							<Badge variant="outlined">Outlined</Badge>
							<Badge variant="flat">Flat</Badge>
							<Badge variant="ghost">Ghost</Badge>
							<Badge variant="destructive">Destructive</Badge>
							<Badge variant="alternate">Alternate</Badge>
						</div>
					</section>

					<!-- ─── Alerts ─── -->
					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						<div>
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Feedback</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Alerts
							</p>
						</div>
						<div class="grid grid-cols-2 gap-2.5 max-md:grid-cols-1">
							<Alert.Root variant="info">
								<Alert.Title>Heads up</Alert.Title>
								<Alert.Description>A new release just rolled out to staging.</Alert.Description>
							</Alert.Root>
							<Alert.Root variant="success">
								<Alert.Title>Saved</Alert.Title>
								<Alert.Description>Your changes are in good shape.</Alert.Description>
							</Alert.Root>
							<Alert.Root variant="warning">
								<Alert.Title>Almost out of credit</Alert.Title>
								<Alert.Description>Add a card before usage caps out.</Alert.Description>
							</Alert.Root>
							<Alert.Root variant="error">
								<Alert.Title>Build failed</Alert.Title>
								<Alert.Description>Type-check returned 4 errors.</Alert.Description>
							</Alert.Root>
						</div>
					</section>

					<!-- ─── Progress + Skeleton ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div>
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Progress</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Storage usage
							</p>
						</div>

						<div class="flex flex-col gap-2.5">
							{#each [{ label: 'Documents', pct: pgProgress }, { label: 'Images', pct: 38 }, { label: 'Builds', pct: 12 }] as bar}
								<div>
									<div class="mb-1 flex items-center justify-between text-[0.78rem]">
										<span class="text-foreground-muted">{bar.label}</span>
										<span class="[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">{bar.pct}%</span>
									</div>
									<div class="h-1.5 overflow-hidden rounded-full bg-secondary">
										<div
											class="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
											style="width:{bar.pct}%;"
										></div>
									</div>
								</div>
							{/each}
						</div>

						<div class="flex items-center gap-2">
							<Button
								size="sm"
								variant="outlined"
								onclick={() => (pgProgress = Math.max(0, pgProgress - 8))}>−</Button
							>
							<Button
								size="sm"
								variant="outlined"
								onclick={() => (pgProgress = Math.min(100, pgProgress + 8))}>+</Button
							>
							<span class="ml-2 text-[0.78rem] text-foreground-muted">Adjust documents</span>
						</div>

						<div class="flex flex-col gap-2 pt-1">
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Skeleton</p>
							<Skeleton class="h-3 w-full" />
							<Skeleton class="h-3 w-[80%]" />
							<Skeleton class="h-3 w-[60%]" />
						</div>
					</section>

					<!-- ─── Notifications ─── -->
					<section class="flex flex-col gap-2 px-6 py-7 md:px-8">
						<div class="flex items-center justify-between">
							<div>
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Activity</p>
								<p
									class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									Notifications
								</p>
							</div>
							<Badge variant="ghost" class="px-1.5 text-[0.66rem]">3 new</Badge>
						</div>
						<div class="flex flex-col">
							{#each [{ title: 'Deployment succeeded', desc: 'v2.4.1 is live in production', time: 'now', dot: 'var(--color-success)' }, { title: 'New team member', desc: 'Maya joined the workspace', time: '4m ago', dot: 'var(--color-info)' }, { title: 'Card expires soon', desc: 'Update your payment method', time: '1h ago', dot: 'var(--color-warning)' }, { title: 'Build failed', desc: 'Type-check returned 4 errors', time: 'yesterday', dot: 'var(--color-destructive)' }] as item}
								<div
									class="flex items-start gap-2.5 rounded-md px-1.5 py-2 transition-colors hover:bg-secondary/40"
								>
									<span
										class="mt-1.5 size-1.5 shrink-0 rounded-full"
										style={`background:${item.dot};`}
									></span>
									<div class="min-w-0 flex-1">
										<p class="m-0 truncate text-[0.84rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">{item.title}</p>
										<p class="m-0 mt-0.5 truncate text-[0.76rem] text-foreground-muted">
											{item.desc}
										</p>
									</div>
									<span class="shrink-0 text-[0.72rem] text-foreground-muted">{item.time}</span>
								</div>
							{/each}
						</div>
					</section>

					<!-- ─── Command teaser + Tooltip ─── -->
					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						<div>
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Command</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Quick actions
							</p>
						</div>

						<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border">
							<div class="flex items-center gap-2 border-b border-border px-3 py-2">
								<Search size={14} class="text-foreground-muted" />
								<span class="flex-1 text-[0.84rem] text-foreground-muted">Type a command…</span>
								<kbd
									class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.66rem] text-foreground-muted"
									>⌘K</kbd
								>
							</div>
							<div class="flex flex-col p-1.5">
								{#each [{ icon: Plus, label: 'Create project' }, { icon: Users, label: 'Invite member' }, { icon: CreditCard, label: 'Upgrade plan' }, { icon: Settings, label: 'Open settings' }] as item}
									<Button variant="ghost" size="sm" class="w-full justify-start gap-2 text-[0.84rem]">
										<item.icon size={13} class="text-foreground-muted" />
										<span>{item.label}</span>
										<span class="ml-auto text-[0.7rem] text-foreground-muted">↵</span>
									</Button>
								{/each}
							</div>
						</div>

						<div class="flex items-center gap-2">
							<Tooltip.Root>
								<Tooltip.Trigger>
									<Button variant="outlined" size="sm" class="gap-1.5 text-[0.78rem]">
										<Info size={12} />
										<span>Hover me</span>
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>This is a Silk tooltip.</Tooltip.Content>
							</Tooltip.Root>
							<span class="text-[0.76rem] text-foreground-muted"
								>Tooltip uses the same motion preset</span
							>
						</div>
					</section>

					<!-- ─── Typography preview ─── -->
					<section class="flex flex-col gap-5 px-6 py-7 md:px-8">
						<div>
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Typography</p>
							<p class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]" style="font-family: var(--font-header);">
								Every role, live
							</p>
						</div>

						<!-- Header sample -->
						<div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4">
							<div class="flex items-baseline justify-between gap-3">
								<span class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted">Header</span>
								<span class="font-mono text-[0.62rem] text-foreground-muted/70">--font-header · --font-size-header · --font-weight-header · --tracking-header</span>
							</div>
							<h3
								class="m-0 text-[2rem] leading-[1.05] [font-family:var(--font-header)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
							>
								Pack my box with five dozen liquor jugs.
							</h3>
							<p class="m-0 text-[1.25rem] leading-tight [font-family:var(--font-header)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] text-foreground-muted">
								Sphinx of black quartz, judge my vow.
							</p>
						</div>

						<!-- Body sample -->
						<div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4">
							<div class="flex items-baseline justify-between gap-3">
								<span class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted">Body</span>
								<span class="font-mono text-[0.62rem] text-foreground-muted/70">--font-sans · --font-size-body · --font-weight-body · --tracking-body</span>
							</div>
							<p class="m-0 leading-relaxed [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground">
								Silk uses the body role for prose, descriptions, and most paragraph copy. Switch fonts or tweak weights and tracking from the inspector — the change ripples through every body element in this preview and in your published theme.
								<a href="/docs/introduction" class="text-primary underline-offset-2 hover:underline">Inline links</a> respect the primary token.
							</p>
							<p class="m-0 text-[0.86rem] leading-relaxed [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted">
								Muted secondary text — used for descriptions and helper copy underneath fields.
							</p>
						</div>

						<!-- Label sample -->
						<div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4">
							<div class="flex items-baseline justify-between gap-3">
								<span class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted">Label</span>
								<span class="font-mono text-[0.62rem] text-foreground-muted/70">--font-size-label · --font-weight-label · --tracking-label</span>
							</div>
							<div class="flex flex-wrap items-center gap-x-5 gap-y-2">
								<span class="[font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Field label</span>
								<span class="[font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Section header</span>
								<span class="[font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted">Eyebrow</span>
								<span class="rounded-full bg-secondary px-2 py-0.5 [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Chip</span>
							</div>
						</div>

						<!-- Button + Badge sample -->
						<div class="grid grid-cols-2 gap-3 max-md:grid-cols-1">
							<div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4">
								<div class="flex items-baseline justify-between gap-3">
									<span class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted">Button</span>
									<span class="font-mono text-[0.62rem] text-foreground-muted/70">--font-size-button · --font-weight-button · --tracking-button</span>
								</div>
								<div class="flex flex-wrap items-center gap-2">
									<Button>Save changes</Button>
									<Button variant="outlined">Discard</Button>
									<Button variant="ghost">Cancel</Button>
								</div>
							</div>

							<div class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4">
								<div class="flex items-baseline justify-between gap-3">
									<span class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted">Badge</span>
									<span class="font-mono text-[0.62rem] text-foreground-muted/70">--font-size-badge · --font-weight-badge · --tracking-badge</span>
								</div>
								<div class="flex flex-wrap items-center gap-1.5">
									<Badge>Live</Badge>
									<Badge variant="secondary">Draft</Badge>
									<Badge variant="outlined">Beta</Badge>
									<Badge variant="ghost">v1.0</Badge>
								</div>
							</div>
						</div>

						<!-- Mono fallback -->
						<p class="m-0 font-mono text-[0.82rem] text-foreground-muted">
							const tokens = $derived(themeToCss(draft));
						</p>
					</section>
					{:else if screenTab === 'settings'}
						<!-- ─── Settings: General ─── -->
						<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
							<div>
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">General</p>
								<p
									class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									Profile
								</p>
							</div>
							<div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
								<Input
									label="Display name"
									variant="outlined"
									bind:value={pgInputName}
								/>
								<Input
									label="Email"
									type="email"
									variant="outlined"
									bind:value={pgInputEmail}
								/>
							</div>
							<div class="flex flex-col gap-1.5">
								<span class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">Default role</span>
								<Select.Root value={pgRole}>
									<Select.Trigger class="w-full" variant="outlined">
										{pgRole.charAt(0).toUpperCase() + pgRole.slice(1)}
									</Select.Trigger>
									<Select.Content>
										{#each [{ v: 'engineer', l: 'Engineer' }, { v: 'designer', l: 'Designer' }, { v: 'product', l: 'Product manager' }, { v: 'founder', l: 'Founder' }] as r}
											<Select.Item value={r.v} onclick={() => (pgRole = r.v)}
												>{r.l}</Select.Item
											>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>
						</section>

						<!-- ─── Settings: Preferences ─── -->
						<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
							<div>
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Preferences</p>
								<p
									class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									Notifications & security
								</p>
							</div>
							<div
								class="flex flex-col divide-y divide-border/60 overflow-hidden rounded-[var(--radius-md)] border border-border"
							>
								<div class="flex items-center justify-between gap-3 px-3 py-2.5">
									<div class="flex items-center gap-2">
										<Bell size={14} class="text-foreground-muted" />
										<div class="flex flex-col">
											<span class="text-[0.86rem]">Push notifications</span>
											<span class="text-[0.72rem] text-foreground-muted"
												>Get notified about mentions and replies.</span
											>
										</div>
									</div>
									<Switch bind:switched={pgNotifications} aria-label="Toggle notifications" />
								</div>
								<div class="flex items-center justify-between gap-3 px-3 py-2.5">
									<div class="flex items-center gap-2">
										<FileText size={14} class="text-foreground-muted" />
										<div class="flex flex-col">
											<span class="text-[0.86rem]">Weekly email digest</span>
											<span class="text-[0.72rem] text-foreground-muted"
												>A Monday summary of activity in your workspace.</span
											>
										</div>
									</div>
									<Switch bind:switched={pgEmailDigest} aria-label="Toggle email digest" />
								</div>
								<div class="flex items-center justify-between gap-3 px-3 py-2.5">
									<div class="flex items-center gap-2">
										<Settings size={14} class="text-foreground-muted" />
										<div class="flex flex-col">
											<span class="text-[0.86rem]">Two-factor auth</span>
											<span class="text-[0.72rem] text-foreground-muted"
												>Add an extra layer of sign-in security.</span
											>
										</div>
									</div>
									<Switch bind:switched={pgTwoFactor} aria-label="Toggle two-factor" />
								</div>
							</div>
							<Checkbox
								bind:checked={pgAcceptTerms}
								label="I agree to the terms of service"
								description="You can revoke access at any time from the settings page."
							/>
							<div class="flex items-center justify-end gap-2">
								<Button variant="ghost" size="sm">Cancel</Button>
								<Button size="sm">
									<Pencil size={13} />
									Save changes
								</Button>
							</div>
						</section>

						<!-- ─── Settings: Danger zone ─── -->
						<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
							<div>
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Danger zone</p>
								<p
									class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									Workspace lifecycle
								</p>
							</div>
							<Alert.Root variant="warning">
								<Alert.Title>Archive workspace</Alert.Title>
								<Alert.Description>
									Members lose access until you unarchive. You can do this at any time.
								</Alert.Description>
							</Alert.Root>
							<Alert.Root variant="error">
								<Alert.Title>Delete workspace</Alert.Title>
								<Alert.Description>
									Permanent — your projects, comments, and data will be removed.
								</Alert.Description>
							</Alert.Root>
							<div class="flex items-center justify-end gap-2">
								<Button variant="outlined" size="sm">Archive</Button>
								<Button variant="destructive" size="sm">Delete workspace</Button>
							</div>
						</section>
					{:else if screenTab === 'mail'}
						<!-- ─── Mail: Inbox list ─── -->
						<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
							<div class="flex items-center justify-between">
								<div>
									<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Inbox</p>
									<p
										class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
										style="font-family: var(--font-header);"
									>
										{mailMessages.filter((m) => m.unread).length} unread
									</p>
								</div>
								<Badge variant="outlined" class="text-[0.7rem]">5 messages</Badge>
							</div>
							<div
								class="flex flex-col divide-y divide-border/60 overflow-hidden rounded-[var(--radius-md)] border border-border"
							>
								{#each mailMessages as msg}
									{@const active = msg.id === selectedMailId}
									<button
										type="button"
										onclick={() => (selectedMailId = msg.id)}
										class={`flex items-start gap-3 px-3 py-3 text-left transition-colors ${active ? 'bg-secondary/60' : 'hover:bg-secondary/40'}`}
									>
										<span
											class="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-[0.74rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
											>{msg.initials}</span
										>
										<div class="min-w-0 flex-1">
											<div class="flex items-center justify-between gap-2">
												<span class="truncate text-[0.84rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">{msg.sender}</span>
												<span class="shrink-0 text-[0.7rem] text-foreground-muted"
													>{msg.time}</span
												>
											</div>
											<p class="m-0 mt-0.5 truncate text-[0.8rem]">
												{msg.subject}
											</p>
											<p class="m-0 mt-0.5 truncate text-[0.74rem] text-foreground-muted">
												{msg.preview}
											</p>
										</div>
										{#if msg.unread}
											<span
												class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
												aria-label="Unread"
											></span>
										{/if}
									</button>
								{/each}
							</div>
						</section>

						<!-- ─── Mail: Open message ─── -->
						<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
							<div class="flex items-start justify-between gap-3">
								<div class="flex items-center gap-3">
									<span
										class="grid size-10 place-items-center rounded-full bg-primary/12 text-[0.78rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-primary"
										>{selectedMail.initials}</span
									>
									<div>
										<p class="m-0 text-[0.92rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">{selectedMail.sender}</p>
										<p class="m-0 mt-0.5 text-[0.74rem] text-foreground-muted">
											to me · {selectedMail.time}
										</p>
									</div>
								</div>
								<div class="flex items-center gap-1.5">
									<span
										class="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[0.68rem] text-foreground-muted"
									>
										<span
											class="size-1.5 rounded-full"
											style={`background:${tagToTone[selectedMail.tag] ?? 'var(--color-foreground-muted)'};`}
										></span>
										{selectedMail.tag}
									</span>
								</div>
							</div>
							<h3
								class="m-0 text-[1.2rem] [font-weight:var(--font-weight-header,500)] leading-tight [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								{selectedMail.subject}
							</h3>
							<p class="m-0 text-[0.92rem] leading-relaxed text-foreground">
								{selectedMail.preview}
							</p>
							<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
								Reply if you have any questions. Otherwise this thread will close automatically in 7
								days.
							</p>
							<div class="flex flex-wrap items-center gap-2">
								<Button size="sm">
									<Send size={13} />
									Reply
								</Button>
								<Button variant="outlined" size="sm">Forward</Button>
								<Button variant="ghost" size="sm">Mark unread</Button>
								<Button variant="ghost" size="sm" class="text-[var(--color-destructive)]">
									Delete
								</Button>
							</div>
						</section>
					{/if}
				</div>
			</div>
		</div>
		</main>

		<!-- Mobile drawer toggle (lg-: floating button, lg+: hidden) -->
		<button
			type="button"
			onclick={() => (mobileInspectorOpen = !mobileInspectorOpen)}
			class="lg:hidden fixed bottom-4 right-4 z-40 inline-flex h-11 items-center gap-2 rounded-full border border-border bg-primary px-4 text-[0.82rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-opposite shadow-[0_8px_24px_-6px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]"
			aria-expanded={mobileInspectorOpen}
			aria-controls="studio-inspector"
		>
			<Sliders size={14} />
			{mobileInspectorOpen ? 'Close' : 'Tweak theme'}
		</button>

		<!-- Mobile backdrop when drawer is open -->
		{#if mobileInspectorOpen}
			<button
				type="button"
				aria-label="Close inspector"
				onclick={() => (mobileInspectorOpen = false)}
				class="lg:hidden fixed inset-0 z-30 bg-[var(--color-overlay)] backdrop-blur-[2px]"
			></button>
		{/if}

		<!-- ───── INSPECTOR ───── -->
		<aside
			id="studio-inspector"
			class={`flex w-[22.5rem] shrink-0 flex-col overflow-hidden border-l border-border bg-background
				max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40 max-lg:w-auto max-lg:h-[78vh] max-lg:border-l-0 max-lg:border-t max-lg:rounded-t-[var(--radius-lg)] max-lg:transition-transform max-lg:duration-[var(--motion-duration-sheet,260ms)] max-lg:ease-out max-lg:shadow-[0_-12px_36px_-12px_color-mix(in_srgb,var(--color-foreground)_18%,transparent)]
				${mobileInspectorOpen ? 'max-lg:translate-y-0' : 'max-lg:translate-y-full max-lg:pointer-events-none'}`}
		>
			<!-- Mobile drawer handle -->
			<div class="lg:hidden flex justify-center pt-2 pb-1">
				<span class="h-1 w-10 rounded-full bg-border"></span>
			</div>
			<Tabs.Root bind:value={inspectorTab} class="flex h-full flex-col">
				<div class="flex justify-center border-b border-border p-2.5">
					<Tabs.List class="flex w-full">
						{#each tabs as t}
							<Tabs.Trigger value={t.id} class="flex-1 min-w-0 text-[0.76rem] px-2">
								{t.label}
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</div>

				<div class="min-h-0 flex-1 overflow-y-auto">
					{#snippet colorRow(label: string, value: string | undefined, opts: ColorOption[], onChange: (v: string) => void)}
						<div class="flex items-center justify-between gap-2">
							<span class="text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">{label}</span>
							<ColorPicker
								class="w-[170px]"
								value={value ?? ''}
								options={opts}
								onValueChange={onChange}
							/>
						</div>
					{/snippet}

					<!-- COLORS TAB -->
					<Tabs.Content value="colors" class="flex flex-col gap-4 p-3.5">

						<section class="flex flex-col gap-2.5">
							<div class="flex items-center justify-between">
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">
									Light mode
								</p>
								<span class="text-[0.65rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted/70">6 tokens</span>
							</div>
							{@render colorRow('Background', lightBasePalette.background, lightBackgroundOptions, (v) => updateBasePalette('light', 'background', v))}
							{@render colorRow('Surface', lightBasePalette.card, lightSurfaceOptions, (v) => updateBasePalette('light', 'card', v))}
							{@render colorRow('Secondary', lightBasePalette.secondary, lightSecondaryOptions, (v) => updateBasePalette('light', 'secondary', v))}
							{@render colorRow('Text', lightBasePalette.text, lightTextOptions, (v) => updateBasePalette('light', 'text', v))}
							{@render colorRow('Primary', lightBasePalette.primary, lightPrimaryOptions, (v) => updatePrimaryColor('light', v))}
							{@render colorRow('Border', lightBasePalette.border, lightBorderOptions, (v) => updateBasePalette('light', 'border', v))}
						</section>

						<div class="border-t border-border"></div>

						<section class="flex flex-col gap-2.5">
							<div class="flex items-center justify-between">
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">
									Dark mode
								</p>
								<span class="text-[0.65rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted/70">6 tokens</span>
							</div>
							{@render colorRow('Background', darkBasePalette.background, darkBackgroundOptions, (v) => updateBasePalette('dark', 'background', v))}
							{@render colorRow('Surface', darkBasePalette.card, darkSurfaceOptions, (v) => updateBasePalette('dark', 'card', v))}
							{@render colorRow('Secondary', darkBasePalette.secondary, darkSecondaryOptions, (v) => updateBasePalette('dark', 'secondary', v))}
							{@render colorRow('Text', darkBasePalette.text, darkTextOptions, (v) => updateBasePalette('dark', 'text', v))}
							{@render colorRow('Primary', darkBasePalette.primary, darkPrimaryOptions, (v) => updatePrimaryColor('dark', v))}
							{@render colorRow('Border', darkBasePalette.border, darkBorderOptions, (v) => updateBasePalette('dark', 'border', v))}
						</section>

						<div class="border-t border-border"></div>

						<section class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
							<div class="flex flex-col gap-0.5">
								<span class="text-[0.82rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Overlays on surface</span>
								<span class="text-[0.72rem] text-foreground-muted">Modals, dialogs &amp; sheets paint with Surface instead of Background.</span>
							</div>
							<Switch
								switched={overlaysOnSurfaceOn}
								onclick={toggleOverlaysOnSurface}
								aria-label="Toggle overlays-on-surface"
							/>
						</section>

						<section class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
							<div class="flex flex-col gap-0.5">
								<span class="text-[0.82rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Fancy buttons</span>
								<span class="text-[0.72rem] text-foreground-muted">Layered shadow &amp; inner highlight on all button variants. Off for flat.</span>
							</div>
							<Switch
								switched={fancyButtonsOn}
								onclick={toggleFancyButtons}
								aria-label="Toggle fancy buttons"
							/>
						</section>

						<section class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
							<div class="flex flex-col gap-0.5">
								<span class="text-[0.82rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Fancy badges</span>
								<span class="text-[0.72rem] text-foreground-muted">Layered shadow &amp; inner highlight on badges. Off for flat.</span>
							</div>
							<Switch
								switched={fancyBadgesOn}
								onclick={toggleFancyBadges}
								aria-label="Toggle fancy badges"
							/>
						</section>

						<section class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
							<div class="flex flex-col gap-0.5">
								<span class="text-[0.82rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Fancy shadows</span>
								<span class="text-[0.72rem] text-foreground-muted">Soft drop shadows on cards, modals, popovers, toasts, tooltips. Off for flat.</span>
							</div>
							<Switch
								switched={fancyShadowsOn}
								onclick={toggleFancyShadows}
								aria-label="Toggle fancy shadows"
							/>
						</section>

						<section class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
							<div class="flex flex-col gap-0.5">
								<span class="text-[0.82rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Haptic press</span>
								<span class="text-[0.72rem] text-foreground-muted">Buttons nudge -1px on press. Off for static.</span>
							</div>
							<Switch
								switched={hapticPressOn}
								onclick={toggleHapticPress}
								aria-label="Toggle haptic press"
							/>
						</section>

						<section class="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2.5">
							<div class="flex flex-col gap-0.5">
								<span class="text-[0.82rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">Pointer cursor</span>
								<span class="text-[0.72rem] text-foreground-muted">Buttons, tabs, switches, and radios show a pointer on hover. Off for the system default cursor.</span>
							</div>
							<Switch
								switched={pointerCursorOn}
								onclick={togglePointerCursor}
								aria-label="Toggle pointer cursor"
							/>
						</section>

						<Button
							variant="outlined"
							size="sm"
							class="h-8 gap-1.5 text-[0.78rem]"
							onclick={openAdvancedColors}
						>
							<Sliders size={13} />
							All color options
						</Button>
					</Tabs.Content>

					<!-- TYPE TAB -->
					<Tabs.Content value="type" class="flex flex-col gap-4 p-3.5">
						<section class="flex flex-col gap-2">
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">
								Header font
							</p>
							<Select.Root value={headerFontSelection}>
								<Select.Trigger class="h-9 w-full" variant="outlined">
									{headerFontSelection}
								</Select.Trigger>
								<Select.Content class="max-h-72 overflow-y-auto">
									{#each fontOptions as font}
										<Select.Item
											value={font.label}
											onclick={() => updateHeaderFont(font.label)}
										>
											<span style={`font-family:${font.value};`} class="text-left">
												{font.label}
											</span>
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</section>

						<section class="flex flex-col gap-2">
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">
								Body font
							</p>
							<Select.Root value={bodyFontSelection}>
								<Select.Trigger class="h-9 w-full" variant="outlined">
									{bodyFontSelection}
								</Select.Trigger>
								<Select.Content class="max-h-72 overflow-y-auto">
									{#each fontOptions as font}
										<Select.Item
											value={font.label}
											onclick={() => updateBodyFont(font.label)}
										>
											<span style={`font-family:${font.value};`} class="text-left">
												{font.label}
											</span>
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</section>

						<div class="border-t border-border"></div>

						<section class="flex flex-col gap-2">
							<div class="flex items-center justify-between">
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Size, Weight & Tracking</p>
								<span class="text-[0.66rem] text-foreground-muted/70">Per-element</span>
							</div>
							<div class="flex flex-col gap-2.5">
								{#each weightFields as field}
									{@const typo = editorTheme.typography ?? defaultTypography}
									{@const currentWeight = typo[field.key] ?? defaultTypography[field.key]}
									{@const currentTracking = typo[field.trackingKey] ?? defaultTypography[field.trackingKey]}
									{@const currentSize = typo[field.sizeKey] ?? defaultTypography[field.sizeKey]}
									{@const fontFam = field.key === 'weightHeader' ? 'var(--font-header)' : 'var(--font-sans)'}
									<div class="flex flex-col gap-1.5">
										<span class="text-[0.74rem] text-foreground-muted">{field.label}</span>
										<div class="flex items-center gap-1.5">
											<Select.Root value={String(currentSize)} class="">
												<Select.Trigger class="h-8 w-[4.75rem] shrink-0 text-[0.78rem]" variant="outlined">
													<span class="block min-w-0 flex-1 truncate text-left">{sizeLabelFor(currentSize)}</span>
												</Select.Trigger>
												<Select.Content class="max-h-72 overflow-y-auto">
													{#each sizeOptions as opt}
														<Select.Item
															class=""
															value={String(opt.value)}
															onclick={() => updateSize(field.sizeKey, opt.value)}
														>
															<span class="silk-weight-row">
																<span
																	class="silk-weight-aa"
																	style={`font-size:${opt.value}px;font-family:${fontFam};font-weight:${currentWeight};line-height:1;`}
																	aria-hidden="true"
																></span>
																{opt.label}
															</span>
														</Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
											<Select.Root value={String(currentWeight)} class="">
												<Select.Trigger class="h-8 w-[6.5rem] shrink-0 text-[0.78rem]" variant="outlined">
													<span class="block min-w-0 flex-1 truncate text-left">{weightLabel(currentWeight)}</span>
												</Select.Trigger>
												<Select.Content class="max-h-72 overflow-y-auto">
													{#each weightOptions as opt}
														<Select.Item
															class=""
															value={String(opt.value)}
															onclick={() => updateWeight(field.key, opt.value)}
														>
															<span class="silk-weight-row">
																<span
																	class="silk-weight-aa"
																	style={`font-weight:${opt.value};font-family:${fontFam};`}
																	aria-hidden="true"
																></span>
																{opt.label}
															</span>
														</Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
											<Select.Root value={String(currentTracking)} class="">
												<Select.Trigger class="h-8 w-[6.5rem] shrink-0 text-[0.78rem]" variant="outlined">
													<span class="block min-w-0 flex-1 truncate text-left">{trackingLabelFor(currentTracking)}</span>
												</Select.Trigger>
												<Select.Content class="max-h-72 overflow-y-auto">
													{#each trackingOptions as opt}
														<Select.Item
															class=""
															value={String(opt.value)}
															onclick={() => updateTracking(field.trackingKey, opt.value)}
														>
															<span class="silk-weight-row">
																<span
																	class="silk-weight-aa"
																	style={`letter-spacing:${opt.value}em;font-family:${fontFam};font-weight:${currentWeight};`}
																	aria-hidden="true"
																></span>
																{opt.label}
															</span>
														</Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
										</div>
									</div>
								{/each}
							</div>
						</section>

						<div class="border-t border-border"></div>

						<section class="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3">
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">
								Preview
							</p>
							<p class="m-0 text-[1.4rem] leading-tight" style="font-family: var(--font-header); font-weight: var(--font-weight-header, 500); letter-spacing: var(--tracking-header, -0.02em);">
								The quick brown fox jumps.
							</p>
							<p class="m-0 text-[0.86rem] leading-[1.55] text-foreground-muted" style="font-weight: var(--font-weight-body, 400); letter-spacing: var(--tracking-body, 0em);">
								Body text in {bodyFontSelection}. A calmer base that adapts to your product's tone.
							</p>
							<p class="m-0 font-mono text-[0.72rem] text-foreground-muted">
								{editorTheme.fontMono.split(',')[0].replaceAll('"', '')} · monospace
							</p>
						</section>
					</Tabs.Content>

					<!-- SHAPE TAB -->
					<Tabs.Content value="shape" class="flex flex-col gap-4 p-3.5">
						<section class="flex flex-col gap-2">
							<div class="flex items-baseline justify-between">
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Radius</p>
								<span
									class="rounded-md bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.66rem] text-foreground"
								>
									{Number.parseFloat(editorTheme.radiusBase).toFixed(2)}rem
								</span>
							</div>
							<div class="grid grid-cols-4 gap-1.5">
								{#each radiusOptions as opt}
									<button
										type="button"
										onclick={() => updateRadius(opt.value)}
										class={`flex flex-col items-center gap-1.5 rounded-lg border p-2 text-[0.68rem] transition-colors ${editorTheme.radiusBase === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background/40 text-foreground-muted hover:border-border-strong'}`}
									>
										<span
											class="block size-6 border border-current"
											style={`border-radius:${opt.value};`}
											aria-hidden="true"
										></span>
										<span>{opt.label}</span>
									</button>
								{/each}
							</div>
							<input
								type="range"
								min="0.14"
								max="1.2"
								step="0.01"
								value={Number.parseFloat(editorTheme.radiusBase) || 0.45}
								oninput={(e) =>
									updateRadius(
										`${Number.parseFloat((e.currentTarget as HTMLInputElement).value).toFixed(2)}rem`
									)}
								class="silk-range mt-1"
							/>
							<span class="text-[0.66rem] text-foreground-muted">
								Drag to fine-tune between presets.
							</span>
						</section>

						<div class="border-t border-border"></div>

						<section class="flex flex-col gap-2">
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Motion preset</p>
							<div class="grid grid-cols-3 gap-1.5">
								{#each transitionPresets as preset}
									{@const active = editorTheme.durationPreset === preset.slug}
									{@const speedDots =
										preset.slug === 'none' || preset.slug === 'instant'
											? 4
											: preset.slug === 'swift' || preset.slug === 'snappy'
												? 3
											: preset.slug === 'crisp' || preset.slug === 'default'
												? 2
												: 1}
									<button
										type="button"
										onclick={() => updateDurationPreset(preset.slug)}
										title={preset.description ?? preset.name}
										class={`flex flex-col items-center gap-1.5 rounded-lg border p-2 text-[0.72rem] transition-colors ${active ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background/40 text-foreground-muted hover:border-border-strong'}`}
									>
										<span class="flex items-center gap-0.5" aria-hidden="true">
											{#each Array(4) as _, i}
												<span
													class={`size-1 rounded-full ${i < speedDots ? (active ? 'bg-primary' : 'bg-foreground-muted') : 'bg-border'}`}
												></span>
											{/each}
										</span>
										<span class="[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] {active ? 'text-foreground' : ''}">{preset.name}</span>
									</button>
								{/each}
							</div>
							{#if activeMotionDescription}
								<p class="m-0 text-[0.72rem] text-foreground-muted">{activeMotionDescription}</p>
							{/if}
						</section>

						<div class="border-t border-border"></div>

						<section class="flex flex-col gap-2">
							<div class="flex items-baseline justify-between">
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">
									Transition preset
								</p>
								<span class="text-[0.65rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted/70">
									{activeTransitionShape?.name ?? 'Custom'}
								</span>
							</div>
							<div class="grid grid-cols-3 gap-1.5">
								{#each transitionShapes as shape (shape.slug)}
									{@const active = activeTransitionShape?.slug === shape.slug}
									<button
										type="button"
										onclick={() => applyTransitionShape(shape)}
										title={shape.description}
										class={`flex flex-col items-center gap-1.5 rounded-lg border p-2 text-[0.7rem] transition-colors ${active ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background/40 text-foreground-muted hover:border-border-strong'}`}
									>
										<span
											class={`grid size-6 place-items-center rounded-md ${active ? 'bg-primary/15 text-primary' : 'bg-secondary/60'}`}
											aria-hidden="true"
										>
											<shape.icon size={12} />
										</span>
										<span class={`[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] ${active ? 'text-foreground' : ''}`}>
											{shape.name}
										</span>
									</button>
								{/each}
							</div>
							{#if activeTransitionShape}
								<p class="m-0 text-[0.72rem] text-foreground-muted">
									{activeTransitionShape.description}
								</p>
							{:else}
								<p class="m-0 text-[0.72rem] text-foreground-muted">
									Custom transform — fine-tune with All motion options.
								</p>
							{/if}
							<Button
								variant="outlined"
								size="sm"
								class="h-8 gap-1.5 text-[0.78rem]"
								onclick={openAdvancedMotion}
							>
								<Sliders size={13} />
								All motion options
							</Button>
						</section>

						<div class="border-t border-border"></div>

						<section class="flex flex-col gap-2">
							<div class="flex items-baseline justify-between">
								<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Easing</p>
								<span class="text-[0.65rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted/70">{currentEasing.label}</span>
							</div>
							<Select.Root value={editorTheme.motion.panelEasing ?? defaultEasing} class="">
								<Select.Trigger class="h-9 w-full text-[0.82rem]" variant="outlined">
									{currentEasing.label}
								</Select.Trigger>
								<Select.Content class="max-h-72 overflow-y-auto">
									{#each easingOptions as opt}
										<Select.Item
											value={opt.value}
											label={opt.label}
											class=""
											onclick={() => updateEasing(opt.value)}
										>
											<span class="flex w-full items-center justify-between gap-3">
												<span class="[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">{opt.label}</span>
												<code class="font-mono text-[0.66rem] text-foreground-muted">{opt.value}</code>
											</span>
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<p class="m-0 text-[0.72rem] text-foreground-muted">{currentEasing.description}</p>
						</section>
					</Tabs.Content>

					<!-- PADDING TAB -->
					<Tabs.Content value="padding" class="flex flex-col gap-5 p-3.5">
						<div class="flex flex-col gap-1">
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">Spacing & sizing</p>
						</div>

						{#each spacingGroups as group, gi (group.title)}
							{#if gi > 0}
								<div class="border-t border-border/60"></div>
							{/if}
							<section class="flex flex-col gap-3">
								<div class="flex items-center justify-between">
									<span class="text-[0.7rem] uppercase [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted/80">{group.title}</span>
									<span class="text-[0.62rem] font-mono text-foreground-muted/60">px</span>
								</div>
								<div class="flex flex-col gap-3">
									{#each group.fields as field (field.key)}
										{@const spacing = resolveSpacing(editorTheme.spacing)}
										{@const value = spacing[field.key]}
										<div class="flex flex-col gap-2">
											<div class="flex items-baseline justify-between gap-2">
												<span class="text-[0.76rem] text-foreground">{field.label}</span>
												<span class="rounded bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.66rem] text-foreground-muted">{value}</span>
											</div>
											<Slider
												min={field.min}
												max={field.max}
												step={1}
												value={value}
												onValueChange={(v: number) => updateSpacing(field.key, v)}
												label={field.label}
											/>
										</div>
									{/each}
								</div>
							</section>
						{/each}

						<div class="border-t border-border/60"></div>

						<section class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-3">
							<p class="m-0 text-[0.66rem] uppercase [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted/80">Live preview</p>
							<div class="flex flex-wrap items-center gap-2">
								<Button size="sm">Small</Button>
								<Button>Default</Button>
								<Button size="lg">Large</Button>
							</div>
							<div class="flex flex-wrap items-center gap-1.5">
								<Badge>Live</Badge>
								<Badge variant="secondary">Draft</Badge>
								<Badge variant="outlined">Beta</Badge>
							</div>
							<Input placeholder="Field preview" variant="outlined" />
							<div class="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-card px-3 py-2">
								<span class="text-[0.78rem]">Toggle preview</span>
								<Switch switched={true} aria-label="Switch preview" />
							</div>
						</section>
					</Tabs.Content>

					<!-- PRESETS TAB -->
					<Tabs.Content value="presets" class="flex flex-col gap-3.5 p-3.5">
						{#if savedThemes.length > 0}
							<section class="flex flex-col gap-2">
								<div class="flex items-center justify-between">
									<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">
										Saved locally
									</p>
									<span class="text-[0.65rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted/70"
										>{savedThemes.length}
										{savedThemes.length === 1 ? 'theme' : 'themes'}</span
									>
								</div>
								<div class="flex flex-col gap-1">
									{#each savedThemes as preset (preset.id)}
										<div
											class={`group relative flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors ${activeSavedThemeId === preset.id ? 'border-primary bg-primary/8' : 'border-border bg-background/40 hover:border-border-strong'}`}
										>
											<button
												type="button"
												onclick={() => attemptLoadPreset(preset, preset.id)}
												class="absolute inset-0"
												aria-label={`Load ${preset.name}`}
											></button>
											<div class="relative flex gap-0.5">
												<span
													class="size-5 rounded-md ring-1 ring-border/60"
													style={`background:${preset.light.background};`}
												></span>
												<span
													class="size-5 rounded-md ring-1 ring-border/60"
													style={`background:${preset.light.primary};`}
												></span>
												<span
													class="size-5 rounded-md ring-1 ring-border/60"
													style={`background:${preset.dark.background};`}
												></span>
												<span
													class="size-5 rounded-md ring-1 ring-border/60"
													style={`background:${preset.dark.primary};`}
												></span>
											</div>
											<div class="relative min-w-0 flex-1">
												<p class="m-0 truncate text-[0.8rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">{preset.name}</p>
												<p class="m-0 truncate text-[0.68rem] text-foreground-muted">
													Saved {new Date(preset.savedAt).toLocaleDateString(undefined, {
														month: 'short',
														day: 'numeric'
													})}
												</p>
											</div>
											<button
												type="button"
												onclick={(e) => requestDeleteSavedTheme(preset, e)}
												aria-label={`Remove ${preset.name}`}
												class="relative grid size-7 place-items-center rounded-md text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
											>
												<Trash size={12} />
											</button>
										</div>
									{/each}
								</div>
							</section>
						{/if}

						<section class="flex flex-col gap-2">
							<p class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">
								Catalog
							</p>
							<div class="flex flex-col gap-1">
								{#each themesCatalog as preset}
									<button
										type="button"
										onclick={() => attemptLoadPreset(preset)}
										class={`group flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors ${selectedPresetSlug === preset.slug ? 'border-primary bg-primary/8' : 'border-border bg-background/40 hover:border-border-strong'}`}
									>
										<div class="flex gap-0.5">
											<span class="size-5 rounded-md ring-1 ring-border/60" style={`background:${preset.light.background};`}></span>
											<span class="size-5 rounded-md ring-1 ring-border/60" style={`background:${preset.light.primary};`}></span>
											<span class="size-5 rounded-md ring-1 ring-border/60" style={`background:${preset.dark.background};`}></span>
											<span class="size-5 rounded-md ring-1 ring-border/60" style={`background:${preset.dark.primary};`}></span>
										</div>
										<div class="min-w-0 flex-1">
											<p class="m-0 truncate text-[0.8rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">{preset.name}</p>
											<p class="m-0 truncate text-[0.68rem] text-foreground-muted">
												{preset.description ?? 'Custom theme preset'}
											</p>
										</div>
										{#if selectedPresetSlug === preset.slug}
											<Check size={14} class="shrink-0 text-primary" />
										{/if}
									</button>
								{/each}
							</div>
						</section>
					</Tabs.Content>
				</div>
			</Tabs.Root>
		</aside>
	</div>

	<!-- ─── All colors dialog ─── -->
	<Modal.Root bind:open={advancedColorsOpen}>
		<Modal.Content
			class="flex w-full max-w-[min(42rem,calc(100vw-2rem))] flex-col gap-0 overflow-hidden p-0"
		>
			<div
				class="flex shrink-0 items-start justify-between px-5 py-4"
			>
				<div class="flex flex-col gap-1">
					<Modal.Title>All color tokens</Modal.Title>
					<Modal.Description>
						Override every palette token individually for light and dark mode.
					</Modal.Description>
				</div>
				<Modal.Close
					variant="ghost"
					size="icon"
					class="size-8 shrink-0"
					aria-label="Close"
				>
					<X size={14} />
				</Modal.Close>
			</div>

			<Tabs.Root bind:value={advancedColorsMode} class="flex min-h-0 flex-1 flex-col">
				<div class="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
					<Tabs.List>
						<Tabs.Trigger value="light">Light</Tabs.Trigger>
						<Tabs.Trigger value="dark">Dark</Tabs.Trigger>
					</Tabs.List>
					<span class="text-[0.7rem] text-foreground-muted">
						{paletteGroups.reduce((n, g) => n + g.fields.length, 0)} tokens
					</span>
				</div>

				<div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
					{#each ['light', 'dark'] as mode}
						<Tabs.Content value={mode} class="flex flex-col gap-5">
							{#each paletteGroups as group}
								<section class="flex flex-col gap-2">
									<p
										class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
									>
										{group.title}
									</p>
									<div class="grid grid-cols-2 gap-x-3 gap-y-2 max-sm:grid-cols-1">
										{#each group.fields as field}
											<div class="flex items-center justify-between gap-2">
												<span class="text-[0.74rem] text-foreground">{field.label}</span>
												<ColorPicker
													class="w-[160px]"
													value={editorTheme[mode as 'light' | 'dark'][field.key]}
													onValueChange={(v) =>
														updatePaletteField(mode as 'light' | 'dark', field.key, v)}
												/>
											</div>
										{/each}
									</div>
								</section>
							{/each}
						</Tabs.Content>
					{/each}
				</div>
			</Tabs.Root>

			<div
				class="flex shrink-0 items-center justify-end gap-2 px-5 py-3"
			>
				<Modal.Close variant="primary" size="sm" class="h-8 text-[0.8rem]">
					Done
				</Modal.Close>
			</div>
		</Modal.Content>
	</Modal.Root>

	<!-- ─── Remove saved theme confirm ─── -->
	<Modal.Root
		bind:open={
			() => removeSavedTarget !== null,
			(v) => {
				if (!v) cancelDeleteSavedTheme();
			}
		}
	>
		<Modal.Content
			class="w-full max-w-[min(24rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
		>
			<div class="flex shrink-0 items-start justify-between px-5 py-4">
				<div class="flex flex-col gap-1">
					<Modal.Title>Remove from library?</Modal.Title>
					<Modal.Description>
						<span class="[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">{removeSavedTarget?.name ?? ''}</span>
						will be deleted from your local saved themes.
					</Modal.Description>
				</div>
			</div>
			<div class="px-5 py-4">
				<Alert.Root variant="warning">
					<Alert.Title>This only affects your browser</Alert.Title>
					<Alert.Description>
						Saved themes live in localStorage on this device — nothing is synced to the
						registry.
					</Alert.Description>
				</Alert.Root>
			</div>
			<div
				class="flex shrink-0 items-center justify-end gap-2 px-5 py-3"
			>
				<Modal.Close variant="ghost" size="sm" class="h-8 text-[0.8rem]">
					Cancel
				</Modal.Close>
				<Button
					variant="destructive"
					size="sm"
					class="h-8 gap-1.5 text-[0.8rem]"
					onclick={confirmDeleteSavedTheme}
				>
					<Trash size={12} />
					Remove
				</Button>
			</div>
		</Modal.Content>
	</Modal.Root>

	<!-- ─── Save-before-swap alert ─── -->
	<Modal.Root bind:open={saveAlertOpen}>
		<Modal.Content
			class="w-full max-w-[min(26rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
		>
			<div class="flex shrink-0 items-start justify-between px-5 py-4">
				<div class="flex flex-col gap-1">
					<Modal.Title>Save changes first?</Modal.Title>
					<Modal.Description>
						You have unsaved tweaks to
						<span class="[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">{editorName || 'this theme'}</span>.
						Loading
						<span class="[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
							>{pendingThemeLoad?.name ?? 'another theme'}</span
						>
						will replace them.
					</Modal.Description>
				</div>
			</div>
			<div class="px-5 py-4">
				<Alert.Root variant="warning">
					<Alert.Title>Unsaved edits will be lost</Alert.Title>
					<Alert.Description>
						Save them to your local library to come back to them later.
					</Alert.Description>
				</Alert.Root>
			</div>
			<div
				class="flex shrink-0 flex-wrap items-center justify-end gap-2 px-5 py-3"
			>
				<Button
					variant="ghost"
					size="sm"
					class="h-8 text-[0.8rem]"
					onclick={cancelPendingLoad}
				>
					Cancel
				</Button>
				<Button
					variant="outlined"
					size="sm"
					class="h-8 text-[0.8rem]"
					onclick={discardAndContinue}
				>
					Discard
				</Button>
				<Button
					variant="primary"
					size="sm"
					class="h-8 gap-1.5 text-[0.8rem]"
					onclick={saveAndContinue}
				>
					<Save size={13} />
					Save & continue
				</Button>
			</div>
		</Modal.Content>
	</Modal.Root>

	<!-- ─── All motion dialog ─── -->
	<Modal.Root bind:open={advancedMotionOpen}>
		<Modal.Content
			class="flex w-full max-w-[min(36rem,calc(100vw-2rem))] flex-col gap-0 overflow-hidden p-0"
		>
			<div
				class="flex shrink-0 items-start justify-between px-5 py-4"
			>
				<div class="flex flex-col gap-1">
					<Modal.Title>All motion tokens</Modal.Title>
					<Modal.Description>
						Hand-tune every duration and panel offset. Starts from the current preset.
					</Modal.Description>
				</div>
				<Modal.Close
					variant="ghost"
					size="icon"
					class="size-8 shrink-0"
					aria-label="Close"
				>
					<X size={14} />
				</Modal.Close>
			</div>

			<div class="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-4">
				<section class="flex flex-col gap-2">
					<p
						class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
					>
						Durations
					</p>
					<div class="grid grid-cols-2 gap-x-4 gap-y-4 max-sm:grid-cols-1">
						{#each motionDurationFields as field}
							{@const value = durationToMs(editorTheme.motion[field.key])}
							<label class="flex flex-col gap-1.5">
								<div class="flex items-baseline justify-between gap-2">
									<span class="text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">{field.label}</span>
									<span
										class="rounded-md bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.68rem] text-foreground"
									>
										{Math.round(value)}ms
									</span>
								</div>
								<input
									type="range"
									min="0"
									max={field.max}
									step="10"
									{value}
									oninput={(e) =>
										updateMotionDuration(
											field.key,
											(e.currentTarget as HTMLInputElement).value
										)}
									class="silk-range"
								/>
								<span class="text-[0.66rem] text-foreground-muted">{field.hint}</span>
							</label>
						{/each}
					</div>
				</section>

				<section class="flex flex-col gap-2">
					<p
						class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
					>
						Transition
					</p>
					<span class="-mt-1 text-[0.7rem] text-foreground-muted">
						Per-surface transform & blur — shapes how panels enter the screen.
					</span>
					<div class="grid grid-cols-2 gap-x-4 gap-y-4 max-sm:grid-cols-1">
						{#each motionNumberFields as field}
							{@const numericValue = (editorTheme.motion[field.key] ?? 0) as number}
							{@const display = field.format
								? field.format(numericValue)
								: String(numericValue)}
							<label class="flex flex-col gap-1.5">
								<div class="flex items-baseline justify-between gap-2">
									<span class="flex items-center gap-1.5 text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground">
										{field.label}
										{#if field.experimental}
											<span
												class="rounded-full border border-border bg-secondary/40 px-1.5 py-0.5 text-[0.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
											>
												Experimental
											</span>
										{/if}
									</span>
									<span
										class="rounded-md bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.68rem] text-foreground"
									>
										{display}{field.unit ?? ''}
									</span>
								</div>
								<input
									type="range"
									min={field.min}
									max={field.max}
									step={field.step}
									value={numericValue}
									oninput={(e) =>
										updateMotionNumber(
											field.key,
											(e.currentTarget as HTMLInputElement).value
										)}
									class="silk-range"
								/>
								<span class="text-[0.66rem] text-foreground-muted">{field.hint}</span>
							</label>
						{/each}
					</div>
				</section>
			</div>

			<div
				class="flex shrink-0 items-center justify-between gap-2 px-5 py-3"
			>
				<Button
					variant="ghost"
					size="sm"
					class="h-8 text-[0.8rem]"
					onclick={resetMotionToPreset}
				>
					Reset to preset
				</Button>
				<Modal.Close variant="primary" size="sm" class="h-8 text-[0.8rem]">
					Done
				</Modal.Close>
			</div>
		</Modal.Content>
	</Modal.Root>
</div>

<style>
	.studio-shell {
		font-family: var(--font-sans), sans-serif;
	}

	/* Weight preview "Aa" rendered via ::before so it shows visually but
	   doesn't enter textContent (which Select.Item uses for its label).
	   Without this trick the trigger would shift from e.g. "Medium" to
	   "Aa Medium" the first time the dropdown is opened. */
	.silk-weight-row {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-align: left;
	}
	.silk-weight-aa::before {
		content: 'Aa';
		display: inline-block;
		min-width: 1.6rem;
		text-align: center;
		font-size: 0.86rem;
		line-height: 1;
	}

	.silk-range {
		appearance: none;
		width: 100%;
		height: 4px;
		background: var(--color-secondary);
		border-radius: 9999px;
		outline: none;
		cursor: pointer;
		transition: background-color 150ms ease;
	}
	.silk-range:hover {
		background: color-mix(in srgb, var(--color-secondary) 60%, var(--color-border-strong));
	}
	.silk-range::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		background: var(--color-primary);
		border: 2px solid var(--color-background);
		border-radius: 9999px;
		cursor: pointer;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.18);
		transition: transform 150ms ease;
	}
	.silk-range::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}
	.silk-range::-moz-range-thumb {
		width: 14px;
		height: 14px;
		background: var(--color-primary);
		border: 2px solid var(--color-background);
		border-radius: 9999px;
		cursor: pointer;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.18);
	}
	.silk-range:focus-visible {
		box-shadow: 0 0 0 3px var(--color-ring);
	}
</style>

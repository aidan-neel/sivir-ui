<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { mode } from 'mode-watcher';
	import { Badge } from '$lib/silk/components/badge';
	import { Button } from '$lib/silk/components/button';
	import { Input } from '$lib/silk/components/input';
	import { Textarea } from '$lib/silk/components/textarea';
	import * as Select from '$lib/silk/components/select';
	import { Switch } from '$lib/silk/components/switch';
	import { toast } from '$lib/silk/components/toast';
	import {
		applyLiveThemeCss,
		getStoredLiveThemeCss,
		loadThemeStudioState,
		saveThemeStudioState
	} from '$lib/silk/themes/live';
	import {
		type ThemeDurationPreset,
		type ThemePalette,
		durationPresets,
		generatePaletteFromBase,
		getDurationPreset,
		slugifyThemeName,
		themeToCss,
		type ThemeBasePalette,
		type ThemeDraft
	} from '$lib/silk/themes/presets';
	import { builtInThemePresets } from '$lib/silk/themes/builtin-presets';
	import StudioSidebar from '$lib/components/themes/studio-sidebar.svelte';
	import type { ColorOption } from '$lib/silk/components/color-picker';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	type FontOption = { label: string; value: string };
	type RadiusOption = { label: string; value: string };
	type BasePaletteKey = keyof ThemeBasePalette;
	type PaletteKey = keyof ThemePalette;
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
		{ label: 'Geist', value: 'Geist, sans-serif' },
		{ label: 'Instrument Sans', value: '"Instrument Sans", sans-serif' },
		{ label: 'Manrope', value: 'Manrope, sans-serif' },
		{ label: 'DM Sans', value: '"DM Sans", sans-serif' },
		{ label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
		{ label: 'Outfit', value: 'Outfit, sans-serif' },
		{ label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
		{ label: 'Sora', value: 'Sora, sans-serif' },
		{ label: 'IBM Plex Sans', value: '"IBM Plex Sans", sans-serif' },
		{ label: 'Lora', value: 'Lora, serif' },
		{ label: 'Source Serif 4', value: '"Source Serif 4", serif' },
		{ label: 'Fraunces', value: 'Fraunces, serif' },
		{ label: 'Newsreader', value: 'Newsreader, serif' },
		{ label: 'Geist Mono', value: '"Geist Mono", monospace' },
		{ label: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' }
	];

	const radiusOptions: RadiusOption[] = [
		{ label: 'Compact', value: '0.34rem' },
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

	// lightPrimaryOptions and darkPrimaryOptions share labels in the same order — used for cross-mode sync

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
		return JSON.parse(JSON.stringify(theme));
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
			surface: palette.card,
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
		return themesCatalog.find((theme) => normalizeGeneratedCss(themeToCss(theme)) === stored) ?? null;
	}

	async function publishTheme() {
		const cleanedName = editorName.trim();
		const slug = slugifyThemeName(cleanedName);
		if (!cleanedName || !slug) {
			toast({ title: 'Theme name required', description: 'Add a valid theme name before publishing.', duration: 2500, type: 'error' });
			return;
		}
		const payload: ThemeDraft = {
			...cloneTheme(editorTheme),
			name: cleanedName,
			slug,
			description: editorTheme.description?.trim() || 'A custom theme published from the Silk UI Theme Studio.'
		};
		isPublishing = true;
		try {
			const response = await fetch('/api/themes', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const responseText = await response.text();
			if (!response.ok) throw new Error(responseText || 'Failed to publish theme.');
			if (!themesCatalog.some((theme) => theme.slug === payload.slug)) {
				themesCatalog = [payload, ...themesCatalog];
			}
			selectedPresetSlug = payload.slug;
			toast({ title: 'Theme published', description: `${payload.name} is now in the catalog.`, duration: 2400, type: 'success' });
		} catch (publishError) {
			toast({
				title: 'Publish failed',
				description: publishError instanceof Error ? publishError.message : 'Unable to publish this theme right now.',
				duration: 3000,
				type: 'error'
			});
		} finally {
			isPublishing = false;
		}
	}

	function applyStudioState(state: StudioSnapshot) {
		selectedPresetSlug = state.selectedPresetSlug;
		editorTheme = cloneTheme(state.editorTheme);
		editorName = state.editorName;
		headerFontSelection = state.headerFontSelection;
		bodyFontSelection = state.bodyFontSelection;
		lightBasePalette = state.lightBasePalette;
		darkBasePalette = state.darkBasePalette;
		editorTheme.fontMono = resolveMonoFont(editorTheme.fontHeader, editorTheme.fontSans, editorTheme.fontMono);
	}

	function loadPreset(theme: ThemeDraft, notify = true) {
		applyStudioState(createStudioState(theme));
		if (notify) {
			toast({ title: `${theme.name} loaded`, description: 'The preset is now applied across the site.', duration: 2200, type: 'success' });
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
		syncBasePalette(mode, { ...(mode === 'light' ? lightBasePalette : darkBasePalette), [key]: nextValue });
	}

	function updatePaletteToken(mode: 'light' | 'dark', key: 'border', nextValue: string) {
		const base = mode === 'light' ? lightBasePalette : darkBasePalette;
		syncBasePalette(mode, { ...base, border: nextValue });
	}

	function applyBasePalette(mode: 'light' | 'dark') {
		syncBasePalette(mode, mode === 'light' ? lightBasePalette : darkBasePalette);
		toast({ title: `${mode === 'light' ? 'Light' : 'Dark'} palette generated`, description: 'Semantic tokens regenerated from base colors.', duration: 2200, type: 'success' });
	}

	async function copyGeneratedCss() {
		await navigator.clipboard.writeText(generatedCss);
		copiedCss = true;
		setTimeout(() => (copiedCss = false), 1800);
		toast({ title: 'Copied CSS', description: 'Generated theme CSS copied to your clipboard.', duration: 1800, type: 'success' });
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

	function updateEditorName(value: string) {
		editorName = value;
	}

	function updateRadius(next: string) {
		editorTheme.radiusBase = next;
		selectedPresetSlug = 'custom';
	}

	function updatePrimaryButtonOutline(next: boolean) {
		editorTheme.primaryButtonOutline = next;
		selectedPresetSlug = 'custom';
	}

	function updateDurationPreset(next: ThemeDurationPreset['slug']) {
		editorTheme.durationPreset = next;
		selectedPresetSlug = 'custom';
	}

	function updatePrimaryColor(sourcMode: 'light' | 'dark', hex: string) {
		const srcOpts = sourcMode === 'light' ? lightPrimaryOptions : darkPrimaryOptions;
		const dstOpts = sourcMode === 'light' ? darkPrimaryOptions : lightPrimaryOptions;
		const idx = srcOpts.findIndex((o) => o.value.toLowerCase() === hex.toLowerCase());
		// Always update the source mode
		syncBasePalette(sourcMode, {
			...(sourcMode === 'light' ? lightBasePalette : darkBasePalette),
			primary: hex
		});
		// If there's a paired color, update the opposite mode too
		if (idx !== -1 && dstOpts[idx]) {
			const opposite: 'light' | 'dark' = sourcMode === 'light' ? 'dark' : 'light';
			syncBasePalette(opposite, {
				...(opposite === 'light' ? lightBasePalette : darkBasePalette),
				primary: dstOpts[idx].value
			});
		}
	}

	function shuffleTheme() {
		function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

		// Pick a paired primary (same index in light/dark options)
		const primaryIdx = Math.floor(Math.random() * lightPrimaryOptions.length);
		const lightPrimary = lightPrimaryOptions[primaryIdx].value;
		const darkPrimary = darkPrimaryOptions[primaryIdx].value;

		// Pick background / surface from presets
		const lightBg = pick(lightBackgroundOptions).value;
		const lightSurface = pick(lightSurfaceOptions).value;
		const darkBg = pick(darkBackgroundOptions).value;
		const darkSurface = pick(darkSurfaceOptions).value;

		// Keep text neutral (don't randomize — keeps readability)
		const lightText = pick(lightTextOptions).value;
		const darkText = pick(darkTextOptions).value;

		// Optionally randomize border
		const lightSecondary = pick(lightSecondaryOptions).value;
		const lightBorder = pick(lightBorderOptions).value;
		const darkBorder = pick(darkBorderOptions).value;
		const darkSecondary = pick(darkSecondaryOptions).value;

		// Randomize radius & motion
		const radius = pick(radiusOptions).value;
		const duration = pick(durationPresets).slug;

		// Apply both palettes atomically
		const newLightBase: ThemeBasePalette = {
			background: lightBg,
			surface: lightSurface,
			text: lightText,
			primary: lightPrimary,
			secondary: lightSecondary,
			border: lightBorder
		};
		const newDarkBase: ThemeBasePalette = {
			background: darkBg,
			surface: darkSurface,
			text: darkText,
			primary: darkPrimary,
			secondary: darkSecondary,
			border: darkBorder
		};

		lightBasePalette = newLightBase;
		darkBasePalette = newDarkBase;
		editorTheme.light = generatePaletteFromBase(newLightBase, 'light');
		editorTheme.dark = generatePaletteFromBase(newDarkBase, 'dark');
		editorTheme.radiusBase = radius;
		editorTheme.durationPreset = duration;
		selectedPresetSlug = 'custom';
	}

	function updateRawToken(tokenMode: 'light' | 'dark', key: PaletteKey, value: string) {
		if (tokenMode === 'light') {
			editorTheme.light = { ...editorTheme.light, [key]: value };
		} else {
			editorTheme.dark = { ...editorTheme.dark, [key]: value };
		}
		selectedPresetSlug = 'custom';
	}

	function applySnapshot(snapshot: StudioSnapshot) {
		ignoreHistory = true;
		applyStudioState(snapshot);
		lastSnapshot = captureStudioSnapshot();
		lastSnapshotSignature = JSON.stringify(lastSnapshot);
		queueMicrotask(() => { ignoreHistory = false; });
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

	const getInitialThemesCatalog = () =>
		data.themes.length ? [...builtInThemePresets, ...data.themes.filter((t) => t.slug !== 'default')] : builtInThemePresets;
	const initialThemesCatalog = getInitialThemesCatalog();
	const defaultTheme = initialThemesCatalog[0];

	let themesCatalog = $state<ThemeDraft[]>([...initialThemesCatalog]);
	let selectedPresetSlug = $state(defaultTheme.slug);
	let editorTheme = $state(cloneTheme(defaultTheme));
	let editorName = $state(defaultTheme.name);
	let copiedCss = $state(false);
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

	const generatedCss = $derived(themeToCss({ ...editorTheme, name: editorName, slug: slugifyThemeName(editorName) || 'custom-theme' }));

	const activePreset = $derived(
		themesCatalog.find((theme) => theme.slug === selectedPresetSlug) ?? {
			...defaultTheme, slug: 'custom', name: 'Custom',
			description: 'A generated theme draft based on your current base colors and guided controls.'
		}
	);

	const colorMode = $derived<'light' | 'dark'>(mode.current === 'dark' ? 'dark' : 'light');

	onMount(() => {
		const restored = loadThemeStudioState();
		if (restored) {
			applyStudioState(restored);
		} else {
			const matchedPreset = findPresetFromStoredCss();
			if (matchedPreset) loadPreset(matchedPreset, false);
		}
		lastSnapshot = captureStudioSnapshot();
		lastSnapshotSignature = JSON.stringify(lastSnapshot);
		hydrated = true;
		// Preload the active fonts so they're immediately available
		preloadFont(editorTheme.fontHeader);
		preloadFont(editorTheme.fontSans);
	});

	$effect(() => {
		const parsed = Number.parseFloat(editorTheme.radiusBase);
		if (!Number.isFinite(parsed)) return;
		const safe = Math.max(parsed, 0.14);
		const rounded = `${Math.round(safe * 1000) / 1000}rem`;
		if (editorTheme.radiusBase !== rounded) editorTheme.radiusBase = rounded;
		editorTheme.radiusMd = rounded;
		editorTheme.radiusSm = `${Math.round(Math.max(safe - 0.24, 0.14) * 1000) / 1000}rem`;
		editorTheme.radiusLg = `${Math.round((safe + 0.1) * 1000) / 1000}rem`;
		editorTheme.radiusXl = `${Math.round((safe + 0.22) * 1000) / 1000}rem`;
	});

	$effect(() => {
		if (!hydrated) return;
		applyLiveThemeCss(generatedCss);
	});

	$effect(() => {
		if (!hydrated || !browser) return;
		saveThemeStudioState({ selectedPresetSlug, editorTheme, editorName, headerFontSelection, bodyFontSelection, lightBasePalette, darkBasePalette });
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
</script>

<svelte:head>
	<title>Silk UI Theme Studio</title>
	<meta name="description" content="Build, preview, and export Silk UI themes from a dedicated full-width studio workspace." />
</svelte:head>

<!-- Full-height layout: floating left sidebar | canvas -->
<div class="flex h-[calc(100vh-4rem)] pt-16">

	<!-- Left sidebar (floating) -->
	<div class="w-72 shrink-0 p-3">
		<div class="flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--outline-shadow)]">
			<StudioSidebar
				editorName={editorName}
				editorTheme={editorTheme}
				colorMode={colorMode}
				headerFontSelection={headerFontSelection}
				bodyFontSelection={bodyFontSelection}
				radiusOptions={radiusOptions}
				durationPresets={durationPresets}
				fontOptions={fontOptions}
				themesCatalog={themesCatalog}
				lightBasePalette={lightBasePalette}
				darkBasePalette={darkBasePalette}
				lightBackgroundOptions={lightBackgroundOptions}
				lightSurfaceOptions={lightSurfaceOptions}
				lightSecondaryOptions={lightSecondaryOptions}
				lightTextOptions={lightTextOptions}
				lightPrimaryOptions={lightPrimaryOptions}
				lightBorderOptions={lightBorderOptions}
				darkBackgroundOptions={darkBackgroundOptions}
				darkSurfaceOptions={darkSurfaceOptions}
				darkSecondaryOptions={darkSecondaryOptions}
				darkTextOptions={darkTextOptions}
				darkPrimaryOptions={darkPrimaryOptions}
				darkBorderOptions={darkBorderOptions}
				copiedCss={copiedCss}
				isPublishing={isPublishing}
				undoDisabled={undoStack.length === 0}
				redoDisabled={redoStack.length === 0}
				loadPreset={loadPreset}
				updateEditorName={updateEditorName}
				updateRadius={updateRadius}
				updateDurationPreset={updateDurationPreset}
				updateHeaderFont={updateHeaderFont}
				updateBodyFont={updateBodyFont}
				updateBasePalette={updateBasePalette}
				updatePrimaryColor={updatePrimaryColor}
				updatePaletteToken={updatePaletteToken}
				updateRawToken={updateRawToken}
				shuffleTheme={shuffleTheme}
				undoHistory={undoHistory}
				redoHistory={redoHistory}
				copyGeneratedCss={copyGeneratedCss}
				publishTheme={publishTheme}
			/>
		</div>
	</div>

	<!-- Canvas -->
	<div
		class="min-w-0 flex-1 overflow-y-auto"
		style={`--font-header:${editorTheme.fontHeader}; --font-sans:${editorTheme.fontSans}; --font-mono:${editorTheme.fontMono};`}
	>
		<div class="p-6">
			<div class="grid auto-rows-max gap-4 xl:grid-cols-3">

				<!-- Card: Sign-up form -->
				<section class="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--outline-shadow)]">
					<p class="text-lg font-semibold tracking-tight text-foreground" style="font-family: var(--font-header);">
						Create your account
					</p>
					<p class="mt-1 text-sm text-foreground-muted">
						Join thousands of teams already using Silk.
					</p>
					<div class="mt-5 space-y-3">
						<Input label="Full name" placeholder="Alex Johnson" variant="outlined" />
						<Input label="Email address" placeholder="alex@company.com" type="email" variant="outlined" />
						<div class="space-y-1.5">
							<span class="text-sm font-medium text-foreground">Role</span>
							<Select.Root value="" class="">
								<Select.Trigger class="w-full" variant="outlined">Select a role</Select.Trigger>
								<Select.Content class="">
									<Select.Item value="engineer">Engineer</Select.Item>
									<Select.Item value="designer">Designer</Select.Item>
									<Select.Item value="product">Product Manager</Select.Item>
									<Select.Item value="founder">Founder</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</div>
					<Button class="mt-5 w-full">Create Account</Button>
					<p class="mt-3 text-center text-sm text-foreground-muted">
						Already have an account? <a href="/themes/studio" class="text-primary underline-offset-4 hover:underline">Sign in</a>
					</p>
				</section>

				<!-- Card: Typography -->
				<section class="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--outline-shadow)]">
					<div class="flex items-start justify-between gap-3">
						<div>
							<Badge variant="secondary" class="mb-3">Typography</Badge>
							<p class="text-2xl font-bold leading-tight tracking-tight text-foreground" style="font-family: var(--font-header);">
								The quick brown fox
							</p>
						</div>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-foreground">
						Build interfaces people love. Silk UI gives your team a shared language — from colors and spacing to motion and typography.
					</p>
					<p class="mt-3 text-sm text-foreground-muted">
						Supporting body text in a muted tone, used for captions, descriptions, and secondary information throughout the interface.
					</p>
					<div class="mt-4 flex flex-wrap items-center gap-2">
						<Badge>Primary</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="outlined">Outlined</Badge>
						<Badge variant="flat">Flat</Badge>
					</div>
					<div class="mt-4 space-y-1 border-t border-border pt-4">
						{#each ['Geist · sans-serif', 'Inter · system', 'Fraunces · serif'] as sample}
							<p class="text-sm text-foreground-muted">{sample}</p>
						{/each}
					</div>
				</section>

				<!-- Card: Stats -->
				<section class="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--outline-shadow)]">
					<div class="flex items-center justify-between gap-3">
						<p class="text-lg font-semibold tracking-tight text-foreground" style="font-family: var(--font-header);">
							Monthly Overview
						</p>
						<Badge variant="secondary">Oct 2024</Badge>
					</div>
					<div class="mt-5 grid grid-cols-2 gap-3">
						{#each [
							['Revenue', '$48,200', '+12%'],
							['Customers', '1,840', '+8%'],
							['Churn Rate', '1.2%', '−0.4%'],
							['MRR Growth', '18%', '+3%']
						] as [label, value, delta]}
							<div class="rounded-[var(--radius-md)] bg-secondary/40 p-3">
								<p class="text-sm text-foreground-muted">{label}</p>
								<p class="mt-1 text-xl font-semibold tracking-tight text-foreground" style="font-family: var(--font-header);">
									{value}
								</p>
								<p class="mt-0.5 text-sm text-primary">{delta}</p>
							</div>
						{/each}
					</div>
					<div class="mt-4 space-y-2.5">
						{#each [['Q1 Target', '82%'], ['Q2 Target', '67%'], ['Q3 Target', '91%']] as [label, pct]}
							<div>
								<div class="mb-1.5 flex items-center justify-between text-sm">
									<span class="text-foreground-muted">{label}</span>
									<span class="font-medium text-foreground">{pct}</span>
								</div>
								<div class="h-1.5 overflow-hidden rounded-full bg-secondary/50">
									<div class="h-full rounded-full bg-primary transition-all" style="width:{pct};"></div>
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- Card: Buttons (full width) -->
				<section class="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--outline-shadow)] xl:col-span-3">
					<p class="mb-4 text-sm font-medium text-foreground-muted">Button variants</p>
					<div class="flex flex-wrap items-center gap-3">
						<Button>Primary</Button>
						<Button variant="success">Success</Button>
						<Button variant="warning">Warning</Button>
						<Button variant="error">Error</Button>
						<Button variant="destructive">Destructive</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outlined">Outlined</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="flat">Flat</Button>
						<div class="h-5 w-px bg-border/60"></div>
						<Button class="rounded-full">Pill</Button>
						<Button variant="outlined" class="rounded-full border-border">Pill outlined</Button>
						<div class="h-5 w-px bg-border/60"></div>
						<Button disabled>Disabled</Button>
					</div>
					<p class="mb-4 mt-6 text-sm font-medium text-foreground-muted">Input variants</p>
					<div class="grid gap-3 sm:grid-cols-3">
						<Input placeholder="Default input" />
						<Input placeholder="Outlined input" variant="outlined" />
						<Input placeholder="Secondary input" variant="secondary" />
					</div>
					<p class="mb-4 mt-6 text-sm font-medium text-foreground-muted">Status colors</p>
					<div class="grid gap-3 sm:grid-cols-5">
						{#each [
							['Info', 'var(--color-info)'],
							['Success', 'var(--color-success)'],
							['Warning', 'var(--color-warning)'],
							['Error', 'var(--color-error)'],
							['Destructive', 'var(--color-destructive)']
						] as [label, color]}
							<div class="rounded-[var(--radius-md)] border border-border bg-background p-3">
								<div class="flex items-center gap-2">
									<span class="size-3 rounded-full" style={`background:${color};`}></span>
									<p class="text-sm font-medium text-foreground">{label}</p>
								</div>
								<p class="mt-2 font-mono text-[11px] text-foreground-muted">{color}</p>
							</div>
						{/each}
					</div>
				</section>

				<!-- Card: Notifications -->
				<section class="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--outline-shadow)]">
					<div class="flex items-center justify-between gap-3">
						<p class="text-lg font-semibold tracking-tight text-foreground" style="font-family: var(--font-header);">
							Notifications
						</p>
						<Badge variant="secondary">3 new</Badge>
					</div>
					<div class="mt-4 space-y-1">
						{#each [
							{ title: 'Deployment succeeded', desc: 'v2.4.1 is live in production', time: 'Just now', dot: 'var(--color-success)' },
							{ title: 'New team member', desc: 'Maya Chen joined the workspace', time: '4m ago', dot: 'var(--color-info)' },
							{ title: 'Billing warning', desc: 'Payment method expires in 2 days', time: '1h ago', dot: 'var(--color-warning)' },
							{ title: 'Theme publish failed', desc: 'Slug already exists in the catalog', time: 'Yesterday', dot: 'var(--color-destructive)' }
						] as item}
							<div class="flex items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-secondary/30">
								<div class="mt-1.5 size-2 shrink-0 rounded-full" style={`background:${item.dot};`}></div>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium text-foreground">{item.title}</p>
									<p class="mt-0.5 truncate text-sm text-foreground-muted">{item.desc}</p>
								</div>
								<p class="shrink-0 text-sm text-foreground-muted">{item.time}</p>
							</div>
						{/each}
					</div>
				</section>

				<!-- Card: Settings form -->
				<section class="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--outline-shadow)]">
					<p class="text-lg font-semibold tracking-tight text-foreground" style="font-family: var(--font-header);">
						Workspace settings
					</p>
					<div class="mt-5 space-y-5">
						<Input label="Workspace name" placeholder="Acme Inc." variant="outlined" />
						<div class="space-y-3">
							{#each [
								{ label: 'Email notifications', desc: 'Receive updates about your account' },
								{ label: 'Two-factor auth', desc: 'Add an extra layer of security' },
								{ label: 'Public profile', desc: 'Let others find your workspace' }
							] as item}
								<div class="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-background/60 px-4 py-3">
									<div>
										<p class="text-sm font-medium text-foreground">{item.label}</p>
										<p class="text-sm text-foreground-muted">{item.desc}</p>
									</div>
									<Switch />
								</div>
							{/each}
						</div>
						<Button variant="outlined" class="w-full">Save changes</Button>
					</div>
				</section>

				<!-- Card: Transaction list -->
				<section class="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--outline-shadow)]">
					<div class="flex items-center justify-between gap-3">
						<p class="text-lg font-semibold tracking-tight text-foreground" style="font-family: var(--font-header);">
							Transactions
						</p>
						<button class="text-sm text-primary hover:underline underline-offset-4">View all</button>
					</div>
					<div class="mt-4 space-y-px">
						{#each [
							{ name: 'Figma', category: 'Design', amount: '−$45.00', date: 'Today' },
							{ name: 'Vercel', category: 'Infrastructure', amount: '−$20.00', date: 'Yesterday' },
							{ name: 'Stripe Payout', category: 'Income', amount: '+$4,300.00', date: 'Oct 13' },
							{ name: 'Linear', category: 'Productivity', amount: '−$18.00', date: 'Oct 11' },
							{ name: 'AWS', category: 'Infrastructure', amount: '−$214.60', date: 'Oct 1' }
						] as tx}
							<div class="flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2.5 transition-colors hover:bg-secondary/30">
								<div class="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-secondary/50 text-sm font-medium text-foreground">
									{tx.name[0]}
								</div>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium text-foreground">{tx.name}</p>
									<p class="text-sm text-foreground-muted">{tx.category}</p>
								</div>
								<div class="text-right">
									<p class="text-sm font-medium text-foreground">{tx.amount}</p>
									<p class="text-sm text-foreground-muted">{tx.date}</p>
								</div>
							</div>
						{/each}
					</div>
				</section>

			</div>
		</div>
	</div>


</div>

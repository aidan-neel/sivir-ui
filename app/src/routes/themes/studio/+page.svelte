<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import * as Dialog from '$lib/silk/components/dialog';
	import { Badge } from '$lib/silk/components/badge';
	import { Button } from '$lib/silk/components/button';
	import { Checkbox } from '$lib/silk/components/checkbox';
	import { Input } from '$lib/silk/components/input';
	import { Switch } from '$lib/silk/components/switch';
	import { Textarea } from '$lib/silk/components/textarea';
	import * as Tooltip from '$lib/silk/components/tooltip';
	import { toast } from '$lib/silk/components/toast';
	import {
		applyLiveThemeCss,
		getStoredLiveThemeCss,
		loadThemeStudioState,
		saveThemeStudioState
	} from '$lib/silk/themes/live';
	import {
		type ThemeDurationPreset,
		durationPresets,
		generatePaletteFromBase,
		getDurationPreset,
		slugifyThemeName,
		themeToCss,
		type ThemeBasePalette,
		type ThemeDraft
	} from '$lib/silk/themes/presets';
	import { builtInThemePresets, defaultTheme as defaultThemePreset } from '$lib/silk/themes/builtin-presets';
	import StudioLeftSidebar from '$lib/components/themes/studio-left-sidebar.svelte';
	import StudioRightSidebar from '$lib/components/themes/studio-right-sidebar.svelte';
	import type { ColorOption } from '$lib/silk/components/color-picker';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	type FontOption = { label: string; value: string };
	type RadiusOption = { label: string; value: string };
	type DurationOption = { label: string; value: string };
	type PanelStyleOption = { label: string; value: 'standard' | 'inverted' };
	type NumericMotionKey = 'panelX' | 'panelBlur' | 'panelScaleStart' | 'sheetOffset' | 'overlayBlur';
	type MotionField = {
		key: NumericMotionKey;
		label: string;
		min: number;
		max: number;
		step: number;
		suffix?: string;
	};
	type BasePaletteKey = keyof ThemeBasePalette;
	type AccentOption = {
		label: string;
		value: string;
		light: string;
		dark: string;
	};
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

	const durationOptions: DurationOption[] = [
		{ label: '100ms', value: '100ms' },
		{ label: '140ms', value: '140ms' },
		{ label: '180ms', value: '180ms' },
		{ label: '220ms', value: '220ms' },
		{ label: '260ms', value: '260ms' },
		{ label: '320ms', value: '320ms' },
		{ label: '380ms', value: '380ms' }
	];

	const panelStyleOptions: PanelStyleOption[] = [
		{ label: 'Standard', value: 'standard' },
		{ label: 'Inverted', value: 'inverted' }
	];

	const lightBackgroundOptions: ColorOption[] = [
		{ label: 'Paper', value: '#fcfcfd' },
		{ label: 'Cloud', value: '#f8fafc' },
		{ label: 'Mist', value: '#f6f8fb' },
		{ label: 'Warm', value: '#fdfaf6' }
	];
	const lightSurfaceOptions: ColorOption[] = [
		{ label: 'White', value: '#ffffff' },
		{ label: 'Soft', value: '#fbfcfe' },
		{ label: 'Fog', value: '#f7f9fc' },
		{ label: 'Warm', value: '#fffdf9' }
	];
	const lightTextOptions: ColorOption[] = [
		{ label: 'Ink', value: '#101828' },
		{ label: 'Slate', value: '#162033' },
		{ label: 'Charcoal', value: '#1c2434' },
		{ label: 'Warm Ink', value: '#271d19' }
	];
	const lightPrimaryOptions: ColorOption[] = [
		{ label: 'Blue', value: '#155eef' },
		{ label: 'Graphite', value: '#4d607f' },
		{ label: 'Green', value: '#2f7a54' },
		{ label: 'Copper', value: '#a44a2f' }
	];
	const darkBackgroundOptions: ColorOption[] = [
		{ label: 'Midnight', value: '#0b0d11' },
		{ label: 'Navy', value: '#091018' },
		{ label: 'Forest', value: '#0c100d' },
		{ label: 'Ash', value: '#100e0c' }
	];
	const darkSurfaceOptions: ColorOption[] = [
		{ label: 'Panel', value: '#141b24' },
		{ label: 'Deep Navy', value: '#111824' },
		{ label: 'Soft Midnight', value: '#131922' },
		{ label: 'Forest Panel', value: '#101510' }
	];
	const darkTextOptions: ColorOption[] = [
		{ label: 'Frost', value: '#eef2f8' },
		{ label: 'Pearl', value: '#e8f4fb' },
		{ label: 'Soft White', value: '#edf5ef' },
		{ label: 'Warm Light', value: '#f6ece7' }
	];
	const darkPrimaryOptions: ColorOption[] = [
		{ label: 'Blue', value: '#528bff' },
		{ label: 'Graphite', value: '#4d607f' },
		{ label: 'Mint', value: '#63c08c' },
		{ label: 'Copper', value: '#ef8c5a' }
	];

	const motionFields: MotionField[] = [
		{ key: 'panelX', label: 'Panel X Offset', min: -24, max: 24, step: 2, suffix: 'px' },
		{ key: 'panelBlur', label: 'Panel Blur', min: 0, max: 8, step: 1, suffix: 'px' },
		{ key: 'panelScaleStart', label: 'Panel Scale Start', min: 0.94, max: 1, step: 0.005 },
		{ key: 'sheetOffset', label: 'Sheet Offset', min: 24, max: 160, step: 4, suffix: 'px' },
		{ key: 'overlayBlur', label: 'Overlay Blur', min: 0, max: 6, step: 1, suffix: 'px' }
	];

	const accentOptions: AccentOption[] = [
		{ label: 'Blue', value: 'blue', light: '#2563eb', dark: '#3b82f6' },
		{ label: 'Emerald', value: 'emerald', light: '#059669', dark: '#10b981' },
		{ label: 'Violet', value: 'violet', light: '#7c3aed', dark: '#8b5cf6' },
		{ label: 'Amber', value: 'amber', light: '#d97706', dark: '#f59e0b' },
		{ label: 'Rose', value: 'rose', light: '#e11d48', dark: '#f43f5e' },
		{ label: 'Cyan', value: 'cyan', light: '#0891b2', dark: '#06b6d4' }
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

	function getRadiusLabel(radiusValue: string) {
		return radiusOptions.find((option) => option.value === radiusValue)?.label ?? 'Balanced';
	}

	function createBasePalette(theme: ThemeDraft, mode: 'light' | 'dark'): ThemeBasePalette {
		const palette = theme[mode];
		return {
			background: palette.background,
			surface: palette.card,
			text: palette.foreground,
			primary: palette.primary
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
			toast({
				title: 'Theme name required',
				description: 'Add a valid theme name before publishing.',
				duration: 2500,
				type: 'error'
			});
			return;
		}

		const payload: ThemeDraft = {
			...cloneTheme(editorTheme),
			name: cleanedName,
			slug,
			description:
				editorTheme.description?.trim() ||
				'A custom theme published from the Silk UI Theme Studio.'
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
			toast({
				title: 'Theme published',
				description: `${payload.name} is now in the catalog.`,
				duration: 2400,
				type: 'success'
			});
		} catch (publishError) {
			toast({
				title: 'Publish failed',
				description:
					publishError instanceof Error
						? publishError.message
						: 'Unable to publish this theme right now.',
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
		editorTheme.fontMono = resolveMonoFont(
			editorTheme.fontHeader,
			editorTheme.fontSans,
			editorTheme.fontMono
		);
	}

	function loadPreset(theme: ThemeDraft, notify = true) {
		applyStudioState(createStudioState(theme));
		if (notify) {
			toast({
				title: `${theme.name} loaded`,
				description: 'The preset is now applied across the site.',
				duration: 2200,
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
		const nextPalette = {
			...(mode === 'light' ? lightBasePalette : darkBasePalette),
			[key]: nextValue
		};
		syncBasePalette(mode, nextPalette);
	}

	function applyBasePalette(mode: 'light' | 'dark') {
		const palette = mode === 'light' ? lightBasePalette : darkBasePalette;
		syncBasePalette(mode, palette);
		toast({
			title: `${mode === 'light' ? 'Light' : 'Dark'} palette generated`,
			description: 'The semantic tokens were regenerated from the current base colors.',
			duration: 2200,
			type: 'success'
		});
	}

	async function copyGeneratedCss() {
		await navigator.clipboard.writeText(generatedCss);
		copiedCss = true;
		setTimeout(() => (copiedCss = false), 1800);
		toast({
			title: 'Copied CSS',
			description: 'Generated theme CSS copied to your clipboard.',
			duration: 1800,
			type: 'success'
		});
	}

	function showPreviewToast() {
		toast({
			title: 'Preview toast',
			description: 'This should still feel balanced inside the active theme.',
			duration: 2600,
			type: 'success'
		});
	}

	function updateHeaderFont(label: string) {
		const next = fontOptions.find((font) => font.label === label)?.value;
		if (!next) return;
		headerFontSelection = label;
		editorTheme.fontHeader = next;
		editorTheme.fontMono = resolveMonoFont(next, editorTheme.fontSans, editorTheme.fontMono);
		selectedPresetSlug = 'custom';
	}

	function updateBodyFont(label: string) {
		const next = fontOptions.find((font) => font.label === label)?.value;
		if (!next) return;
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

	function updateMotionDuration(
		key: 'panelDuration' | 'sheetDuration' | 'overlayDuration',
		next: string
	) {
		editorTheme.motion[key] = next;
		selectedPresetSlug = 'custom';
	}

	function updateMotionField(key: NumericMotionKey, next: number) {
		editorTheme.motion[key] = next;
		selectedPresetSlug = 'custom';
	}

	function updatePanelStyle(next: PanelStyleOption['value']) {
		editorTheme.invertedPanels = next === 'inverted';
		selectedPresetSlug = 'custom';
	}

	function applyAccentColor(option: AccentOption) {
		syncBasePalette('light', { ...lightBasePalette, primary: option.light });
		syncBasePalette('dark', { ...darkBasePalette, primary: option.dark });
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

	const getInitialThemesCatalog = () =>
		data.themes.length ? [...builtInThemePresets, ...data.themes.filter((theme) => theme.slug !== 'default')] : builtInThemePresets;
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
	let advancedOptionsOpen = $state(false);
	let undoStack = $state<StudioSnapshot[]>([]);
	let redoStack = $state<StudioSnapshot[]>([]);
	let ignoreHistory = $state(false);
	let lastSnapshot = $state<StudioSnapshot>(createStudioState(defaultTheme));
	let lastSnapshotSignature = $state(JSON.stringify(createStudioState(defaultTheme)));

	const generatedCss = $derived(
		themeToCss({
			...editorTheme,
			name: editorName,
			slug: slugifyThemeName(editorName) || 'custom-theme'
		})
	);

	const activePreset = $derived(
		themesCatalog.find((theme) => theme.slug === selectedPresetSlug) ?? {
			...defaultTheme,
			slug: 'custom',
			name: 'Custom',
			description: 'A generated theme draft based on your current base colors and guided controls.'
		}
	);

	const activeDuration = $derived(getDurationPreset(editorTheme.durationPreset));
	const activeAccentValue = $derived(
		accentOptions.find(
			(option) =>
				option.light.toLowerCase() === lightBasePalette.primary.toLowerCase() &&
				option.dark.toLowerCase() === darkBasePalette.primary.toLowerCase()
		)?.value ?? 'custom'
	);

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
</script>

<svelte:head>
	<title>Silk UI Theme Studio</title>
	<meta
		name="description"
		content="Build, preview, and export Silk UI themes from a dedicated full-width studio workspace."
	/>
</svelte:head>

<div class="min-h-[calc(100vh-3.5rem)] px-3 pb-6 pt-[4.2rem] md:px-5 xl:px-6">
	<div class="grid min-h-[calc(100vh-5.1rem)] overflow-hidden rounded-[2rem] border border-border/60 bg-background shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:grid-cols-[15rem_minmax(0,1fr)]">
		<div class="border-r border-border/50 bg-card/80 p-4 text-foreground backdrop-blur">
			<StudioLeftSidebar
				bind:editorName
				activePresetName={activePreset.name}
				selectedPresetSlug={selectedPresetSlug}
				activeAccentValue={activeAccentValue}
				accentOptions={accentOptions}
				themesCatalog={themesCatalog}
				editorTheme={editorTheme}
				headerFontSelection={headerFontSelection}
				bodyFontSelection={bodyFontSelection}
				radiusOptions={radiusOptions}
				durationPresets={durationPresets}
				panelStyleOptions={panelStyleOptions}
				fontOptions={fontOptions}
				durationOptions={durationOptions}
				motionFields={motionFields}
				undoDisabled={undoStack.length === 0}
				redoDisabled={redoStack.length === 0}
				loadPreset={loadPreset}
				updateEditorName={updateEditorName}
				undoHistory={undoHistory}
				redoHistory={redoHistory}
				updateRadius={updateRadius}
				updateDurationPreset={updateDurationPreset}
				updatePanelStyle={updatePanelStyle}
				updatePrimaryButtonOutline={updatePrimaryButtonOutline}
				updateHeaderFont={updateHeaderFont}
				updateBodyFont={updateBodyFont}
				updateMotionDuration={updateMotionDuration}
				updateMotionField={updateMotionField}
				applyAccentColor={applyAccentColor}
				openAdvancedOptions={() => (advancedOptionsOpen = true)}
			/>
		</div>

		<div class="min-w-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-primary)_10%,transparent),transparent_28%),linear-gradient(180deg,color-mix(in_srgb,var(--color-background)_96%,transparent),color-mix(in_srgb,var(--color-card)_82%,transparent))]">
			<div class="border-b border-border/60 px-6 py-4 md:px-8">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="space-y-1">
						<p class="text-[0.72rem] uppercase tracking-[0.18em] text-foreground-muted">Theme canvas</p>
						<p class="text-sm text-foreground-muted">
							{activePreset.name} · {activeDuration.name} · {slugifyThemeName(editorName) || 'custom-theme'}
						</p>
					</div>
					<div class="flex flex-wrap items-center gap-2">
						<Button onclick={copyGeneratedCss} variant="outlined" class="h-10 border-border/60 bg-card text-sm text-foreground shadow-none">
							{copiedCss ? 'Copied CSS' : 'Copy CSS'}
						</Button>
						<Button onclick={publishTheme} class="h-10 px-4 text-sm" disabled={isPublishing}>
							{isPublishing ? 'Publishing...' : 'Publish Theme'}
						</Button>
					</div>
				</div>
			</div>

			<div class="grid gap-5 p-4 md:p-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
				<div class="grid auto-rows-max gap-4 xl:grid-cols-3">
					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)] xl:col-span-1">
						<div class="flex items-start justify-between gap-4">
							<div>
								<p class="text-[1.15rem] font-medium tracking-[-0.04em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
									Contribution History
								</p>
								<p class="mt-1 text-xs text-foreground-muted" style={`font-family:${editorTheme.fontSans};`}>
									Last 6 months of activity
								</p>
							</div>
							<div class="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground">
								+12% vs last month
							</div>
						</div>
						<div class="mt-5 flex h-32 items-end gap-3">
							{#each [52, 68, 58, 80, 49, 86] as height, index}
								<div class="flex flex-1 flex-col items-center gap-3">
									<div
										class="w-full rounded-t-[0.55rem] bg-[var(--color-primary)]"
										style={`height:${height}%; opacity:${index === 4 ? 0.86 : 1};`}
									></div>
									<span class="text-[11px] text-foreground-muted">{['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][index]}</span>
								</div>
							{/each}
						</div>
						<div class="mt-5 grid gap-3 sm:grid-cols-2">
							<div class="rounded-[1rem] bg-secondary/35 p-3">
								<p class="text-[11px] uppercase tracking-[0.12em] text-foreground-muted">Upcoming</p>
								<p class="mt-2 text-base font-medium text-foreground">May 25, 2024</p>
								<p class="mt-1 text-xs text-foreground-muted">$1,000 scheduled</p>
							</div>
							<div class="rounded-[1rem] bg-secondary/35 p-3">
								<p class="text-[11px] uppercase tracking-[0.12em] text-foreground-muted">Auto-save plan</p>
								<p class="mt-2 text-base font-medium text-foreground">Accelerated</p>
								<p class="mt-1 text-xs text-foreground-muted">Recurring weekly</p>
							</div>
						</div>
						<Button class="mt-5 h-10 w-full rounded-full">
							View Full Report
						</Button>
					</section>

					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)] xl:col-span-1">
						<div class="flex items-start justify-between gap-4">
							<div>
								<p class="text-[1.15rem] font-medium tracking-[-0.04em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
									Payout Threshold
								</p>
								<p class="mt-1 max-w-[30ch] text-xs text-foreground-muted" style={`font-family:${editorTheme.fontSans};`}>
									Set the minimum balance required before a payout is triggered.
								</p>
							</div>
							<div class="flex size-8 items-center justify-center rounded-full bg-secondary/35 text-sm text-foreground">
								×
							</div>
						</div>
						<div class="mt-5 space-y-5">
							<div>
								<p class="text-sm font-medium text-foreground">Preferred Currency</p>
								<div class="mt-2 rounded-full bg-secondary/35 px-4 py-3 text-sm text-foreground">
									USD — United States Dollar
								</div>
							</div>
							<div>
								<div class="flex items-end justify-between gap-4">
									<p class="text-sm font-medium text-foreground">Minimum Payout Amount</p>
									<p class="text-lg font-medium text-foreground">$2500.00</p>
								</div>
								<div class="mt-4 h-2 rounded-full bg-secondary/45">
									<div class="h-full w-[28%] rounded-full bg-primary"></div>
								</div>
								<div class="mt-2 flex items-center justify-between text-xs text-foreground-muted">
									<span>$50 (MIN)</span>
									<span>$10,000 (MAX)</span>
								</div>
							</div>
							<div>
								<p class="text-sm font-medium text-foreground">Notes</p>
								<Textarea
									class="mt-2 min-h-20 rounded-[1rem] border-0 bg-secondary/35 text-sm"
									placeholder="Add any notes for this payout configuration..."
								/>
							</div>
							<Button class="h-10 w-full rounded-full">
								Save Threshold
							</Button>
						</div>
					</section>

					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)] xl:col-span-1">
						<div class="flex items-center justify-between gap-4">
							<div>
								<p class="text-[1.15rem] font-medium tracking-[-0.04em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
									Savings Targets
								</p>
								<p class="mt-1 text-xs text-foreground-muted" style={`font-family:${editorTheme.fontSans};`}>
									Active milestones for 2024
								</p>
							</div>
							<button class="rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-foreground">
								New Goal
							</button>
						</div>
						<div class="mt-4 space-y-3">
							{#each [
								['Retirement', '$420,000', '65% achieved', '$273,000', '65%'],
								['Real Estate', '$85,000', '32% achieved', '$27,200', '32%']
							] as [label, total, progress, current, width]}
								<div class="rounded-[1rem] bg-secondary/35 p-3">
									<p class="text-[11px] uppercase tracking-[0.12em] text-foreground-muted">{label}</p>
									<p class="mt-2 text-[1.55rem] font-medium leading-none text-foreground">{total}</p>
									<div class="mt-4 h-2.5 rounded-full bg-secondary/45">
										<div class="h-full rounded-full bg-primary" style={`width:${width};`}></div>
									</div>
									<div class="mt-3 flex items-center justify-between text-xs text-foreground-muted">
										<span>{progress}</span>
										<span class="font-medium text-foreground">{current}</span>
									</div>
								</div>
							{/each}
						</div>
						<p class="mt-4 text-xs text-foreground-muted">You have not met your targets for this year.</p>
					</section>

					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
						<div>
							<p class="text-[1.15rem] font-medium tracking-[-0.04em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
								Buy Investment
							</p>
						</div>
						<div class="mt-5 space-y-4">
							<div>
								<p class="text-sm font-medium text-foreground">Amount to Invest</p>
								<div class="mt-2 rounded-[1rem] bg-secondary/35 px-4 py-3 text-base text-foreground">$ 1,000.00</div>
							</div>
							<div>
								<p class="text-sm font-medium text-foreground">Order Type</p>
								<div class="mt-2 rounded-[1rem] bg-secondary/35 px-4 py-3 text-sm text-foreground">Market Order</div>
								<p class="mt-2 text-xs text-foreground-muted">Market orders execute at the current price.</p>
							</div>
							<div class="flex items-end justify-between gap-4 text-sm">
								<div class="space-y-2 text-foreground-muted">
									<p>Estimated Shares</p>
									<p>Buying Power</p>
								</div>
								<div class="space-y-2 text-right font-medium text-foreground">
									<p>12.4</p>
									<p>$3,840.00</p>
								</div>
							</div>
							<Button class="h-10 w-full rounded-full">
								Review Order
							</Button>
							<p class="text-center text-xs text-foreground-muted">
								Trades are typically executed within minutes during market hours.
							</p>
						</div>
					</section>

					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="text-[1.05rem] font-medium tracking-[-0.03em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
									Team Presence
								</p>
								<p class="mt-1 text-xs text-foreground-muted">Who is active right now</p>
							</div>
							<div class="flex -space-x-2">
								{#each ['A', 'J', 'M'] as initial}
									<div class="flex size-8 items-center justify-center rounded-full border border-background bg-primary/15 text-xs font-medium text-foreground">
										{initial}
									</div>
								{/each}
							</div>
						</div>
						<div class="mt-4 grid gap-2">
							{#each [['Design', 'Reviewing palette'], ['Product', 'Checking previews'], ['QA', 'Watching contrast']] as [team, status]}
								<div class="flex items-center justify-between rounded-[1rem] bg-secondary/35 px-3 py-2.5">
									<div>
										<p class="text-sm font-medium text-foreground">{team}</p>
										<p class="text-xs text-foreground-muted">{status}</p>
									</div>
									<div class="size-2 rounded-full bg-primary"></div>
								</div>
							{/each}
						</div>
					</section>

					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="text-[1.05rem] font-medium tracking-[-0.03em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
									Notification Stack
								</p>
								<p class="mt-1 text-xs text-foreground-muted">Feedback in compact form</p>
							</div>
							<Button variant="ghost" class="h-8 px-3 text-xs" onclick={showPreviewToast}>Test</Button>
						</div>
						<div class="mt-4 space-y-2">
							{#each [
								['Theme updated', 'Accent tokens regenerated'],
								['Preview shared', 'Workspace link copied'],
								['Contrast check', 'Muted text still passes']
							] as [title, message]}
								<div class="rounded-[1rem] border border-border/50 bg-background/70 px-3 py-3">
									<p class="text-sm font-medium text-foreground">{title}</p>
									<p class="mt-1 text-xs text-foreground-muted">{message}</p>
								</div>
							{/each}
						</div>
					</section>

					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
						<div class="flex h-full flex-col items-center justify-center text-center">
							<div class="flex size-10 items-center justify-center rounded-2xl bg-secondary/35 text-[1.5rem] text-foreground">+</div>
							<p class="mt-5 text-[1.15rem] font-medium tracking-[-0.04em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
								Distribute Track
							</p>
							<p class="mt-3 max-w-[28ch] text-xs leading-6 text-foreground-muted" style={`font-family:${editorTheme.fontSans};`}>
								Upload your first master to start reaching listeners on Spotify, Apple Music, and more.
							</p>
							<Button class="mt-5 h-10 rounded-full px-6">
								Create Release
							</Button>
						</div>
					</section>

					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
						<p class="text-xs text-foreground-muted">Claimable Balance</p>
						<p class="mt-2 text-[2.1rem] font-medium leading-none tracking-[-0.05em] text-foreground">$0.00</p>
						<div class="mt-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs text-foreground">
							<span class="size-2 rounded-full bg-primary"></span>
							Pending Setup
						</div>
						<div class="mt-5 rounded-[1rem] bg-secondary/35 p-3">
							<div class="flex items-center justify-between text-sm">
								<span class="text-foreground-muted">Net Royalties</span>
								<span class="font-medium text-foreground">$0.00</span>
							</div>
							<div class="mt-3 flex items-center justify-between text-sm">
								<span class="text-foreground-muted">Payout Threshold</span>
								<span class="font-medium text-foreground">$2,500.00</span>
							</div>
						</div>
					</section>
				</div>

				<div class="space-y-6">
					<section class="rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)] xl:sticky xl:top-6">
						<div class="flex items-start justify-between gap-3">
							<div>
								<p class="text-[1.1rem] font-medium tracking-[-0.04em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
									Recent Transactions
								</p>
								<p class="mt-1 text-xs text-foreground-muted" style={`font-family:${editorTheme.fontSans};`}>
									Your latest account activity.
								</p>
							</div>
							<button class="rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-foreground">View All</button>
						</div>
						<div class="mt-4 space-y-1">
							{#each [
								['Blue Bottle Coffee', 'Food & Drink', 'Today, 10:24 AM', '-$6.50'],
								['Whole Foods Market', 'Groceries', 'Yesterday', '-$142.30'],
								['Stripe Payout', 'Income', 'Oct 13', '+$4,300.00']
							] as [title, meta, time, amount]}
								<div class="flex items-center gap-4 border-t border-border/50 py-3 first:border-t-0">
									<div class="flex size-9 items-center justify-center rounded-2xl bg-secondary/35 text-foreground">◦</div>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium text-foreground">{title}</p>
										<p class="mt-1 text-xs text-foreground-muted">{meta}</p>
									</div>
									<div class="text-right">
										<p class="text-xs text-foreground-muted">{time}</p>
										<p class="mt-1 text-sm font-medium text-foreground">{amount}</p>
									</div>
								</div>
							{/each}
						</div>
					</section>

					<details class="group rounded-[1.45rem] border border-border/60 bg-card p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
						<summary class="flex list-none items-center justify-between gap-4">
							<div class="space-y-1">
								<p class="text-[1.05rem] font-medium tracking-[-0.03em] text-foreground" style={`font-family:${editorTheme.fontHeader};`}>
									Generated CSS
								</p>
								<p class="text-xs text-foreground-muted">Inspect the final export and copy it directly.</p>
							</div>
							<div class="flex items-center gap-3">
								<Tooltip.Root placement="top" delay={0}>
									<Tooltip.Trigger>
										<button
											type="button"
											class="inline-flex size-10 items-center justify-center rounded-full border border-border/60 bg-background text-foreground"
											onclick={copyGeneratedCss}
										>
											{#if copiedCss}
												<Check size={16} />
											{:else}
												<Copy size={16} />
											{/if}
										</button>
									</Tooltip.Trigger>
									<Tooltip.Content>{copiedCss ? 'Copied' : 'Copy generated CSS'}</Tooltip.Content>
								</Tooltip.Root>
								<span class="text-xs uppercase tracking-[0.14em] text-foreground-muted group-open:hidden">Expand</span>
								<span class="hidden text-xs uppercase tracking-[0.14em] text-foreground-muted group-open:inline">Collapse</span>
							</div>
						</summary>
						<div class="mt-5">
							<Textarea class="min-h-[24rem] rounded-[1.15rem] border-0 bg-secondary/35 font-mono text-xs leading-6" readonly value={generatedCss} />
						</div>
					</details>
				</div>
			</div>
		</div>
	</div>

	<Dialog.Root bind:open={advancedOptionsOpen}>
		<Dialog.Content class="max-w-[min(92vw,88rem)] rounded-[2rem] border border-border/60 bg-background p-0 shadow-[0_28px_120px_rgba(15,23,42,0.2)]">
			<div class="grid gap-0 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
				<div class="border-b border-border/60 p-6 xl:border-b-0 xl:border-r">
					<Dialog.Header>
						<Dialog.Title>More Options</Dialog.Title>
						<Dialog.Description>
							Adjust custom colors, advanced surfaces, and export details without crowding the main studio.
						</Dialog.Description>
					</Dialog.Header>

					<div class="mt-6 grid gap-6">
						<div class="grid gap-4 md:grid-cols-2">
							<div class="space-y-3">
								<p class="text-sm font-medium text-foreground">Panel style</p>
								<div class="grid grid-cols-2 gap-2">
									{#each panelStyleOptions as option}
										<Button
											variant={editorTheme.invertedPanels === (option.value === 'inverted') ? 'primary' : 'outlined'}
											class="justify-start text-sm"
											onclick={() => updatePanelStyle(option.value)}
										>
											{option.label}
										</Button>
									{/each}
								</div>
							</div>
							<div class="space-y-3">
								<p class="text-sm font-medium text-foreground">Primary buttons</p>
								<div class="grid grid-cols-2 gap-2">
									<Button
										variant={editorTheme.primaryButtonOutline ? 'primary' : 'outlined'}
										class="justify-start text-sm"
										onclick={() => updatePrimaryButtonOutline(true)}
									>
										Stroke
									</Button>
									<Button
										variant={!editorTheme.primaryButtonOutline ? 'primary' : 'outlined'}
										class="justify-start text-sm"
										onclick={() => updatePrimaryButtonOutline(false)}
									>
										Filled
									</Button>
								</div>
							</div>
						</div>

						<div class="space-y-4">
							<p class="text-sm font-medium text-foreground">Motion details</p>
							<div class="grid gap-4 md:grid-cols-3">
								{#each [
									['Panel duration', 'panelDuration'],
									['Sheet duration', 'sheetDuration'],
									['Overlay duration', 'overlayDuration']
								] as [label, key]}
									<div class="space-y-2">
										<p class="text-xs uppercase tracking-[0.12em] text-foreground-muted">{label}</p>
										<div class="grid gap-2">
											{#each durationOptions as option}
												{#if option.label === '140ms' || option.label === '220ms' || option.label === '320ms'}
													<Button
														variant={editorTheme.motion[key as 'panelDuration' | 'sheetDuration' | 'overlayDuration'] === option.value ? 'primary' : 'outlined'}
														class="justify-start text-xs"
														onclick={() =>
															updateMotionDuration(
																key as 'panelDuration' | 'sheetDuration' | 'overlayDuration',
																option.value
															)}
													>
														{option.label}
													</Button>
												{/if}
											{/each}
										</div>
									</div>
								{/each}
							</div>

							<div class="grid gap-4 md:grid-cols-2">
								{#each motionFields as field}
									<label class="grid gap-2">
										<div class="flex items-center justify-between gap-3 text-sm font-medium text-foreground">
											<span>{field.label}</span>
											<span class="text-xs text-foreground-muted">
												{editorTheme.motion[field.key]}{field.suffix ?? ''}
											</span>
										</div>
										<input
											type="range"
											min={field.min}
											max={field.max}
											step={field.step}
											value={editorTheme.motion[field.key]}
											oninput={(event) => updateMotionField(field.key, Number((event.currentTarget as HTMLInputElement).value))}
										/>
									</label>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<div class="p-6">
					<StudioRightSidebar
						selectedPresetSlug={selectedPresetSlug}
						activePresetName={activePreset.name}
						activeDurationName={activeDuration.name}
						editorName={editorName}
						editorTheme={editorTheme}
						lightBasePalette={lightBasePalette}
						darkBasePalette={darkBasePalette}
						lightBackgroundOptions={lightBackgroundOptions}
						lightSurfaceOptions={lightSurfaceOptions}
						lightTextOptions={lightTextOptions}
						lightPrimaryOptions={lightPrimaryOptions}
						darkBackgroundOptions={darkBackgroundOptions}
						darkSurfaceOptions={darkSurfaceOptions}
						darkTextOptions={darkTextOptions}
						darkPrimaryOptions={darkPrimaryOptions}
						slugifyThemeName={slugifyThemeName}
						applyBasePalette={applyBasePalette}
						updateBasePalette={updateBasePalette}
					/>
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</div>

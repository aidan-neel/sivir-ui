<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import RotateCw from '@lucide/svelte/icons/rotate-cw';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import Sliders from '@lucide/svelte/icons/sliders';
	import * as Select from '$lib/silk/components/select';
	import * as Dialog from '$lib/silk/components/dialog';
	import * as Tabs from '$lib/silk/components/tabs';
	import { Button } from '$lib/silk/components/button';
	import { ColorPicker, type ColorOption } from '$lib/silk/components/color-picker';
	import type { ThemeBasePalette, ThemeDraft, ThemeDurationPreset, ThemePalette } from '$lib/silk/themes/presets';
	import { setMode } from 'mode-watcher';

	type FontOption = { label: string; value: string };
	type RadiusOption = { label: string; value: string };
	type BasePaletteKey = keyof ThemeBasePalette;
	type PaletteKey = keyof ThemePalette;

	type Props = {
		editorName: string;
		editorTheme: ThemeDraft;
		colorMode: 'light' | 'dark';
		headerFontSelection: string;
		bodyFontSelection: string;
		radiusOptions: RadiusOption[];
		durationPresets: ThemeDurationPreset[];
		fontOptions: FontOption[];
		themesCatalog: ThemeDraft[];
		lightBasePalette: ThemeBasePalette;
		darkBasePalette: ThemeBasePalette;
		lightBackgroundOptions: ColorOption[];
		lightSurfaceOptions: ColorOption[];
		lightSecondaryOptions: ColorOption[];
		lightTextOptions: ColorOption[];
		lightPrimaryOptions: ColorOption[];
		lightBorderOptions: ColorOption[];
		darkBackgroundOptions: ColorOption[];
		darkSurfaceOptions: ColorOption[];
		darkSecondaryOptions: ColorOption[];
		darkTextOptions: ColorOption[];
		darkPrimaryOptions: ColorOption[];
		darkBorderOptions: ColorOption[];
		copiedCss: boolean;
		isPublishing: boolean;
		undoDisabled: boolean;
		redoDisabled: boolean;
		loadPreset: (theme: ThemeDraft) => void;
		updateEditorName: (value: string) => void;
		updateRadius: (value: string) => void;
		updateDurationPreset: (value: ThemeDurationPreset['slug']) => void;
		updateHeaderFont: (label: string) => void;
		updateBodyFont: (label: string) => void;
		updateBasePalette: (mode: 'light' | 'dark', key: BasePaletteKey, value: string) => void;
		updatePrimaryColor: (mode: 'light' | 'dark', hex: string) => void;
		updatePaletteToken: (mode: 'light' | 'dark', key: 'border', value: string) => void;
		updateRawToken: (mode: 'light' | 'dark', key: PaletteKey, value: string) => void;
		shuffleTheme: () => void;
		undoHistory: () => void;
		redoHistory: () => void;
		copyGeneratedCss: () => void;
		publishTheme: () => void;
	};

	let {
		editorName,
		editorTheme,
		colorMode,
		headerFontSelection,
		bodyFontSelection,
		radiusOptions,
		durationPresets,
		fontOptions,
		themesCatalog,
		lightBasePalette,
		darkBasePalette,
		lightBackgroundOptions,
		lightSurfaceOptions,
		lightSecondaryOptions,
		lightTextOptions,
		lightPrimaryOptions,
		lightBorderOptions,
		darkBackgroundOptions,
		darkSurfaceOptions,
		darkSecondaryOptions,
		darkTextOptions,
		darkPrimaryOptions,
		darkBorderOptions,
		copiedCss,
		isPublishing,
		undoDisabled,
		redoDisabled,
		loadPreset,
		updateEditorName,
		updateRadius,
		updateDurationPreset,
		updateHeaderFont,
		updateBodyFont,
		updateBasePalette,
		updatePrimaryColor,
		updatePaletteToken,
		updateRawToken,
		shuffleTheme,
		undoHistory,
		redoHistory,
		copyGeneratedCss,
		publishTheme
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	let paletteMode = $state<'light' | 'dark'>(colorMode);
	let advancedOpen = $state(false);

	$effect(() => {
		paletteMode = colorMode;
	});

	$effect(() => {
		if (paletteMode !== colorMode) {
			setMode(paletteMode);
		}
	});

	const activeRadius = $derived(
		radiusOptions.find((o) => o.value === editorTheme.radiusBase)?.label ?? radiusOptions[0].label
	);
	const activeDurationName = $derived(
		durationPresets.find((p) => p.slug === editorTheme.durationPreset)?.name ?? durationPresets[0].name
	);

	const activeBasePalette = $derived(paletteMode === 'light' ? lightBasePalette : darkBasePalette);
	const activeBgOptions = $derived(paletteMode === 'light' ? lightBackgroundOptions : darkBackgroundOptions);
	const activeSurfaceOptions = $derived(paletteMode === 'light' ? lightSurfaceOptions : darkSurfaceOptions);
	const activeSecondaryOptions = $derived(paletteMode === 'light' ? lightSecondaryOptions : darkSecondaryOptions);
	const activeTextOptions = $derived(paletteMode === 'light' ? lightTextOptions : darkTextOptions);
	const activePrimaryOptions = $derived(paletteMode === 'light' ? lightPrimaryOptions : darkPrimaryOptions);
	const activeBorderOptions = $derived(paletteMode === 'light' ? lightBorderOptions : darkBorderOptions);
	const activePalette = $derived(paletteMode === 'light' ? editorTheme.light : editorTheme.dark);

	// Token groups for the advanced modal
	const baseTokens: { key: PaletteKey; label: string }[] = [
		{ key: 'background', label: 'Background' },
		{ key: 'card', label: 'Card / Surface' },
		{ key: 'secondary', label: 'Secondary' },
		{ key: 'muted', label: 'Muted' },
		{ key: 'popover', label: 'Popover' },
	];
	const textTokens: { key: PaletteKey; label: string }[] = [
		{ key: 'foreground', label: 'Text' },
		{ key: 'foregroundMuted', label: 'Text Muted' },
		{ key: 'foregroundOpposite', label: 'Text Opposite' },
		{ key: 'foregroundButton', label: 'Text on Button' },
	];
	const borderTokens: { key: PaletteKey; label: string }[] = [
		{ key: 'border', label: 'Border' },
		{ key: 'borderStrong', label: 'Border Strong' },
		{ key: 'input', label: 'Input Border' },
	];
	const interactiveTokens: { key: PaletteKey; label: string }[] = [
		{ key: 'primary', label: 'Primary' },
		{ key: 'accent', label: 'Accent Tint' },
		{ key: 'alternate', label: 'Alternate' },
	];
	const statusTokens: { key: PaletteKey; label: string }[] = [
		{ key: 'success', label: 'Success' },
		{ key: 'warning', label: 'Warning' },
		{ key: 'error', label: 'Error' },
		{ key: 'destructive', label: 'Destructive' },
	];

	type ModalMode = 'light' | 'dark';
	let advancedMode = $state<ModalMode>('light');
	const advancedPalette = $derived(advancedMode === 'light' ? editorTheme.light : editorTheme.dark);
</script>

<div class="flex h-full flex-col overflow-hidden">

	<!-- Header -->
	<div class="shrink-0 border-b border-border px-4 py-3.5">
		<div class="flex items-center justify-between gap-2">
			<p class="text-sm font-semibold text-foreground">Theme Studio</p>
			<div class="flex gap-1">
				<button
					type="button"
					class="flex size-7 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-background text-foreground-muted transition-colors hover:text-foreground"
					onclick={shuffleTheme}
					aria-label="Shuffle theme"
					title="Shuffle theme"
				>
					<Shuffle size={12} />
				</button>
				<button
					type="button"
					class="flex size-7 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-background text-foreground-muted transition-colors hover:text-foreground disabled:opacity-35"
					onclick={undoHistory}
					disabled={undoDisabled}
					aria-label="Undo"
				>
					<RotateCcw size={13} />
				</button>
				<button
					type="button"
					class="flex size-7 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-background text-foreground-muted transition-colors hover:text-foreground disabled:opacity-35"
					onclick={redoHistory}
					disabled={redoDisabled}
					aria-label="Redo"
				>
					<RotateCw size={13} />
				</button>
			</div>
		</div>
	</div>

	<!-- Scrollable body -->
	<div class="flex-1 overflow-y-auto">

		<!-- Radius -->
		<div class="border-b border-border p-4">
			<p class="mb-2.5 text-sm font-medium text-foreground-muted">Radius</p>
			<Select.Root value={activeRadius} class="">
				<Select.Trigger class="w-full" variant="outlined">{activeRadius}</Select.Trigger>
				<Select.Content class="">
					{#each radiusOptions as option}
						<Select.Item value={option.label} onclick={() => updateRadius(option.value)}>
							<span class="flex items-center gap-3">
								<span
									class="inline-block h-4 w-5 shrink-0 border-2 border-foreground-muted/50"
									style="border-radius: calc({option.value} * 1.8);"
								></span>
								{option.label}
							</span>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Fonts -->
		<div class="border-b border-border p-4">
			<p class="mb-3 text-sm font-medium text-foreground-muted">Fonts</p>
			<div class="space-y-3">
				<div class="space-y-1.5">
					<p class="text-sm text-foreground-muted">Heading</p>
					<Select.Root value={headerFontSelection} class="">
						<Select.Trigger class="w-full" variant="outlined">{headerFontSelection}</Select.Trigger>
						<Select.Content class="">
							{#each fontOptions as opt}
								<Select.Item value={opt.label} onclick={() => updateHeaderFont(opt.label)}>
									{opt.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-1.5">
					<p class="text-sm text-foreground-muted">Body</p>
					<Select.Root value={bodyFontSelection} class="">
						<Select.Trigger class="w-full" variant="outlined">{bodyFontSelection}</Select.Trigger>
						<Select.Content class="">
							{#each fontOptions as opt}
								<Select.Item value={opt.label} onclick={() => updateBodyFont(opt.label)}>
									{opt.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>

		<!-- Motion -->
		<div class="border-b border-border p-4">
			<p class="mb-2.5 text-sm font-medium text-foreground-muted">Motion</p>
			<Select.Root value={activeDurationName} class="">
				<Select.Trigger class="w-full" variant="outlined">{activeDurationName}</Select.Trigger>
				<Select.Content class="">
					{#each durationPresets as preset}
						<Select.Item value={preset.name} onclick={() => updateDurationPreset(preset.slug)}>
							{preset.name}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Colors -->
		<Tabs.Root bind:value={paletteMode} class="p-4">
			<div class="mb-3 flex items-center justify-between">
				<p class="text-sm font-medium text-foreground-muted">Colors</p>
				<Tabs.List>
					<Tabs.Trigger value="light">Light</Tabs.Trigger>
					<Tabs.Trigger value="dark">Dark</Tabs.Trigger>
				</Tabs.List>
			</div>
			<div class="space-y-3">
				<ColorPicker
					label="Background"
					value={activeBasePalette.background}
					onValueChange={(v) => updateBasePalette(paletteMode, 'background', v)}
					options={activeBgOptions}
				/>
				<ColorPicker
					label="Surface"
					value={activeBasePalette.surface}
					onValueChange={(v) => updateBasePalette(paletteMode, 'surface', v)}
					options={activeSurfaceOptions}
				/>
				<ColorPicker
					label="Text"
					value={activeBasePalette.text}
					onValueChange={(v) => updateBasePalette(paletteMode, 'text', v)}
					options={activeTextOptions}
				/>
				<ColorPicker
					label="Secondary"
					value={activeBasePalette.secondary ?? activePalette.secondary}
					onValueChange={(v) => updateBasePalette(paletteMode, 'secondary', v)}
					options={activeSecondaryOptions}
				/>
				<ColorPicker
					label="Primary"
					value={activeBasePalette.primary}
					onValueChange={(v) => updatePrimaryColor(paletteMode, v)}
					options={activePrimaryOptions}
				/>
				<ColorPicker
					label="Border"
					value={activePalette.border}
					onValueChange={(v) => updatePaletteToken(paletteMode, 'border', v)}
					options={activeBorderOptions}
				/>
			</div>
			<div class="mt-3 flex justify-end">
				<button
					type="button"
					class="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2 py-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
					onclick={() => { advancedMode = paletteMode; advancedOpen = true; }}
				>
					<Sliders size={13} />
					All color options
				</button>
			</div>
		</Tabs.Root>

	</div>

	<!-- Bottom actions -->
	<div class="shrink-0 space-y-2 border-t border-border p-4">
		<div class="space-y-1.5">
			<p class="text-sm text-foreground-muted">Theme name</p>
			<input
				class="h-9 w-full rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-muted focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
				value={editorName}
				placeholder="Untitled Theme"
				oninput={(e) => updateEditorName((e.currentTarget as HTMLInputElement).value)}
				aria-label="Theme name"
			/>
		</div>
		<Button
			variant="outlined"
			class="w-full gap-2 border-border"
			onclick={copyGeneratedCss}
		>
			{#if copiedCss}
				<Check size={15} />
				Copied
			{:else}
				<Copy size={15} />
				Copy CSS
			{/if}
		</Button>
		<Button class="w-full" onclick={publishTheme} disabled={isPublishing}>
			{isPublishing ? 'Publishing…' : 'Publish Theme'}
		</Button>
		<div class="flex gap-2">
			<button
				type="button"
				class="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] py-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
				onclick={() => loadPreset(themesCatalog[0])}
			>
				Reset to default
			</button>
		</div>
	</div>

</div>

<!-- Advanced full-screen color modal -->
<Dialog.Root bind:open={advancedOpen}>
	<Dialog.Content class="max-w-[min(72rem,calc(100vw-2rem))] w-full max-h-[min(44rem,calc(100dvh-2rem))] flex flex-col gap-0 p-0 overflow-hidden">
		<div class="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
			<div>
				<Dialog.Title>All color tokens</Dialog.Title>
				<Dialog.Description>Fine-tune every color variable for light and dark mode.</Dialog.Description>
			</div>
			<div class="flex items-center gap-3">
				<Tabs.Root bind:value={advancedMode}>
					<Tabs.List>
						<Tabs.Trigger value="light">Light</Tabs.Trigger>
						<Tabs.Trigger value="dark">Dark</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
				<Dialog.Exit />
			</div>
		</div>

		<div class="flex-1 overflow-y-auto px-6 py-5">
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

				<!-- Base colors -->
				<div class="space-y-3">
					<p class="text-sm font-semibold text-foreground">Base</p>
					{#each baseTokens as token}
						<ColorPicker
							label={token.label}
							value={advancedPalette[token.key] as string}
							onValueChange={(v) => updateRawToken(advancedMode, token.key, v)}
						/>
					{/each}
				</div>

				<!-- Text colors -->
				<div class="space-y-3">
					<p class="text-sm font-semibold text-foreground">Text</p>
					{#each textTokens as token}
						<ColorPicker
							label={token.label}
							value={advancedPalette[token.key] as string}
							onValueChange={(v) => updateRawToken(advancedMode, token.key, v)}
						/>
					{/each}
				</div>

				<!-- Border colors -->
				<div class="space-y-3">
					<p class="text-sm font-semibold text-foreground">Borders</p>
					{#each borderTokens as token}
						<ColorPicker
							label={token.label}
							value={advancedPalette[token.key] as string}
							onValueChange={(v) => updateRawToken(advancedMode, token.key, v)}
						/>
					{/each}
				</div>

				<!-- Interactive colors -->
				<div class="space-y-3">
					<p class="text-sm font-semibold text-foreground">Interactive</p>
					{#each interactiveTokens as token}
						<ColorPicker
							label={token.label}
							value={advancedPalette[token.key] as string}
							onValueChange={(v) => updateRawToken(advancedMode, token.key, v)}
						/>
					{/each}
				</div>

				<!-- Status colors -->
				<div class="space-y-3">
					<p class="text-sm font-semibold text-foreground">Status</p>
					{#each statusTokens as token}
						<ColorPicker
							label={token.label}
							value={advancedPalette[token.key] as string}
							onValueChange={(v) => updateRawToken(advancedMode, token.key, v)}
						/>
					{/each}
				</div>

			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

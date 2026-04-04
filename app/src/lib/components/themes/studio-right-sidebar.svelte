<script lang="ts">
	import * as Alert from '$lib/silk/components/alert';
	import { Badge } from '$lib/silk/components/badge';
	import { Button } from '$lib/silk/components/button';
	import { ColorPicker, type ColorOption } from '$lib/silk/components/color-picker';
	import type { ThemeBasePalette, ThemeDraft } from '$lib/silk/themes/presets';

	type BasePaletteKey = keyof ThemeBasePalette;

	type Props = {
		selectedPresetSlug: string;
		activePresetName: string;
		activeDurationName: string;
		editorName: string;
		editorTheme: ThemeDraft;
		lightBasePalette: ThemeBasePalette;
		darkBasePalette: ThemeBasePalette;
		lightBackgroundOptions: ColorOption[];
		lightSurfaceOptions: ColorOption[];
		lightTextOptions: ColorOption[];
		lightPrimaryOptions: ColorOption[];
		darkBackgroundOptions: ColorOption[];
		darkSurfaceOptions: ColorOption[];
		darkTextOptions: ColorOption[];
		darkPrimaryOptions: ColorOption[];
		slugifyThemeName: (value: string) => string;
		applyBasePalette: (mode: 'light' | 'dark') => void;
		updateBasePalette: (mode: 'light' | 'dark', key: BasePaletteKey, value: string) => void;
	};

	let {
		selectedPresetSlug,
		activePresetName,
		activeDurationName,
		editorName,
		editorTheme,
		lightBasePalette,
		darkBasePalette,
		lightBackgroundOptions,
		lightSurfaceOptions,
		lightTextOptions,
		lightPrimaryOptions,
		darkBackgroundOptions,
		darkSurfaceOptions,
		darkTextOptions,
		darkPrimaryOptions,
		slugifyThemeName,
		applyBasePalette,
		updateBasePalette
	}: Props = $props();
</script>

<div class="space-y-10">
	<section class="grid gap-5 border-b border-border/60 pb-7 xl:grid-cols-[13rem_minmax(0,1fr)]">
		<div>
			<p class="text-[0.72rem] uppercase tracking-[0.16em] text-foreground-muted">Output</p>
			<p class="mt-2 text-sm font-medium text-foreground">Current build</p>
		</div>
		<div class="space-y-4">
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="secondary">{selectedPresetSlug === 'custom' ? 'Custom' : 'Preset'}</Badge>
				<Badge variant="outlined">{activePresetName}</Badge>
				<Badge variant="outlined">{activeDurationName}</Badge>
			</div>
			<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
				{#each [
					['Slug', slugifyThemeName(editorName) || 'custom-theme'],
					['Radius', editorTheme.radiusBase],
					['Panels', editorTheme.invertedPanels ? 'Inverted' : 'Standard'],
					['Primary buttons', editorTheme.primaryButtonOutline ? 'Stroke' : 'Clean']
				] as [label, value]}
					<div class="border-b border-border/45 pb-3">
						<p class="text-xs uppercase tracking-[0.12em] text-foreground-muted">{label}</p>
						<p class="mt-1 text-sm font-medium text-foreground">{value}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="grid gap-5 border-b border-border/60 pb-7 xl:grid-cols-[13rem_minmax(0,1fr)]">
		<div>
			<p class="text-[0.72rem] uppercase tracking-[0.16em] text-foreground-muted">Palette</p>
			<p class="mt-2 text-sm font-medium text-foreground">Light anchors</p>
		</div>
		<div class="grid gap-4">
			<div class="flex items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<Badge variant="secondary">Light</Badge>
					<p class="text-sm text-foreground">Base palette</p>
				</div>
				<Button variant="secondary" class="h-8 px-3 text-xs" onclick={() => applyBasePalette('light')}>
					Generate
				</Button>
			</div>
			<div class="grid gap-3 md:grid-cols-2">
				<ColorPicker
					label="Background"
					value={lightBasePalette.background}
					onValueChange={(value) => updateBasePalette('light', 'background', value)}
					options={lightBackgroundOptions}
				/>
				<ColorPicker
					label="Surface"
					value={lightBasePalette.surface}
					onValueChange={(value) => updateBasePalette('light', 'surface', value)}
					options={lightSurfaceOptions}
				/>
				<ColorPicker
					label="Text"
					value={lightBasePalette.text}
					onValueChange={(value) => updateBasePalette('light', 'text', value)}
					options={lightTextOptions}
				/>
				<ColorPicker
					label="Primary"
					value={lightBasePalette.primary}
					onValueChange={(value) => updateBasePalette('light', 'primary', value)}
					options={lightPrimaryOptions}
				/>
			</div>
		</div>
	</section>

	<section class="grid gap-5 border-b border-border/60 pb-7 xl:grid-cols-[13rem_minmax(0,1fr)]">
		<div>
			<p class="text-[0.72rem] uppercase tracking-[0.16em] text-foreground-muted">Palette</p>
			<p class="mt-2 text-sm font-medium text-foreground">Dark anchors</p>
		</div>
		<div class="grid gap-4">
			<div class="flex items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<Badge variant="secondary">Dark</Badge>
					<p class="text-sm text-foreground">Base palette</p>
				</div>
				<Button variant="secondary" class="h-8 px-3 text-xs" onclick={() => applyBasePalette('dark')}>
					Generate
				</Button>
			</div>
			<div class="grid gap-3 md:grid-cols-2">
				<ColorPicker
					label="Background"
					value={darkBasePalette.background}
					onValueChange={(value) => updateBasePalette('dark', 'background', value)}
					options={darkBackgroundOptions}
				/>
				<ColorPicker
					label="Surface"
					value={darkBasePalette.surface}
					onValueChange={(value) => updateBasePalette('dark', 'surface', value)}
					options={darkSurfaceOptions}
				/>
				<ColorPicker
					label="Text"
					value={darkBasePalette.text}
					onValueChange={(value) => updateBasePalette('dark', 'text', value)}
					options={darkTextOptions}
				/>
				<ColorPicker
					label="Primary"
					value={darkBasePalette.primary}
					onValueChange={(value) => updateBasePalette('dark', 'primary', value)}
					options={darkPrimaryOptions}
				/>
			</div>
		</div>
	</section>

	<Alert.Root variant="info">
		<Alert.Title>Contrast check</Alert.Title>
		<Alert.Description>
			Muted text should stay readable, borders should separate quietly, and the accent color
			should lead without overpowering the interface.
		</Alert.Description>
	</Alert.Root>
</div>

<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { Button } from '@silk/ui/components/button';
	import { ColorPicker } from '@silk/ui/components/color-picker';
	import * as Select from '@silk/ui/components/select';
	import { toast } from '@silk/ui/components/toast';
	import {
		applyLiveThemeCss,
		loadStudioThemeV2,
		saveStudioThemeV2,
		clearLiveThemeCss
	} from '@silk/ui/themes/live';
	import {
		type Theme,
		DEFAULT_THEME,
		themeToCss,
		type NeutralTemp,
		type RadiusScale,
		type Density,
		type MotionFeel
	} from '@silk/ui/themes/theme';

	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	import StudioPreview from '$lib/components/themes/studio/studio-preview.svelte';

	// Curated font list
	const fontOptions: Array<{ label: string; value: string; group: 'Sans' | 'Header' | 'Mono' }> = [
		{ label: 'Inter', value: 'Inter', group: 'Sans' },
		{ label: 'Geist', value: 'Geist', group: 'Sans' },
		{ label: 'System UI', value: 'system-ui', group: 'Sans' },
		{ label: 'Inter', value: 'Inter', group: 'Header' },
		{ label: 'Geist', value: 'Geist', group: 'Header' },
		{ label: 'Geist Mono', value: 'Geist Mono', group: 'Mono' },
		{ label: 'Courier New', value: 'Courier New', group: 'Mono' }
	];

	// Curated brand color swatches (matching original's accessible, timeless palette)
	const brandSwatches = [
		{ label: 'Blue', value: '#2563eb' },
		{ label: 'Indigo', value: '#4f46e5' },
		{ label: 'Purple', value: '#7c3aed' },
		{ label: 'Violet', value: '#a855f7' },
		{ label: 'Pink', value: '#ec4899' },
		{ label: 'Red', value: '#dc2626' },
		{ label: 'Orange', value: '#ea580c' },
		{ label: 'Green', value: '#16a34a' },
		{ label: 'Teal', value: '#0d9488' },
		{ label: 'Slate', value: '#475569' }
	];

	// V2 theme state
	let theme = $state<Theme>(JSON.parse(JSON.stringify(DEFAULT_THEME)));
	let copied: 'css' | 'json' | null = $state(null);

	// Initialize from storage on mount
	onMount(() => {
		if (!browser) return;
		const stored = loadStudioThemeV2();
		if (stored) {
			theme = stored;
			applyLiveThemeCss(themeToCss(theme));
		}
	});

	// Sync to storage + live CSS on change
	$effect(() => {
		if (!browser) return;
		saveStudioThemeV2(theme);
		applyLiveThemeCss(themeToCss(theme));
	});

	function resetToDefault() {
		theme = JSON.parse(JSON.stringify(DEFAULT_THEME));
		clearLiveThemeCss();
		applyLiveThemeCss(themeToCss(theme));
		toast({
			title: 'Theme reset',
			description: 'Reverted to default.',
			duration: 1800,
			type: 'success'
		});
	}

	function copyToClipboard(value: string, type: 'css' | 'json') {
		if (!navigator.clipboard) return;
		navigator.clipboard.writeText(value).then(() => {
			copied = type;
			toast({
				title: `${type.toUpperCase()} copied`,
				description: 'Paste it wherever you need it.',
				duration: 1600,
				type: 'success'
			});
			setTimeout(() => {
				if (copied === type) copied = null;
			}, 1600);
		});
	}

	const css = $derived(themeToCss(theme));
	const json = $derived(JSON.stringify(theme, null, 2));
</script>

<svelte:head>
	<title>Silk · Theme Studio</title>
	<meta
		name="description"
		content="Build and preview your Silk theme with constrained, preset-based controls."
	/>
</svelte:head>

<div class="flex min-h-screen bg-background">
	<!-- ─────────────────── CONTROL PANEL (SIDEBAR) ─────────────────── -->
	<aside
		class="w-96 flex-shrink-0 border-r border-border bg-background/60 flex flex-col overflow-hidden"
	>
		<!-- Header -->
		<div class="shrink-0 border-b border-border px-6 py-5">
			<h1 class="text-lg font-semibold text-foreground">Theme Studio</h1>
			<p class="mt-1 text-sm text-foreground-muted">
				Customize your theme with preset-based controls.
			</p>
		</div>

		<!-- Scrollable content -->
		<div class="flex-1 overflow-y-auto">
			<div class="flex flex-col gap-1 px-6 py-4">
				<!-- ─────── APPEARANCE SECTION ─────── -->
				<div class="mb-2 pb-4 border-b border-border/40">
					<h2 class="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-4">
						Appearance
					</h2>

					<!-- Brand color -->
					<div class="mb-5 flex flex-col gap-3">
						<label class="text-sm font-medium text-foreground">Brand color</label>
						<ColorPicker
							value={theme.brand}
							onValueChange={(value) => {
								theme.brand = value;
							}}
						/>
						<div class="grid grid-cols-5 gap-2 mt-2">
							{#each brandSwatches as swatch (swatch.value)}
								<button
									type="button"
									class="h-8 rounded-md border-2 transition-all hover:scale-110"
									style={`background: ${swatch.value}; border-color: ${theme.brand === swatch.value ? 'var(--color-foreground)' : 'transparent'}`}
									onclick={() => {
										theme.brand = swatch.value;
									}}
									title={swatch.label}
									aria-label={`${swatch.label} color`}
								/>
							{/each}
						</div>
					</div>

					<!-- Neutral temperature -->
					<div class="mb-5 flex flex-col gap-3">
						<label class="text-sm font-medium text-foreground">Neutral tone</label>
						<div class="grid grid-cols-3 gap-2">
							{#each ['cool', 'true', 'warm'] as temp (temp)}
								<button
									type="button"
									onclick={() => {
										theme.neutral = temp as NeutralTemp;
									}}
									class={`rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
										theme.neutral === temp
											? 'bg-primary text-foreground-opposite shadow-sm'
											: 'bg-secondary/50 text-foreground hover:bg-secondary/70'
									}`}
								>
									{temp === 'true' ? 'Neutral' : temp.charAt(0).toUpperCase() + temp.slice(1)}
								</button>
							{/each}
						</div>
					</div>

					<!-- Radius -->
					<div class="mb-5 flex flex-col gap-3">
						<label class="text-sm font-medium text-foreground">Radius</label>
						<div class="grid grid-cols-3 gap-2">
							{#each ['sharp', 'default', 'rounded'] as r (r)}
								<button
									type="button"
									onclick={() => {
										theme.radius = r as RadiusScale;
									}}
									class={`rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
										theme.radius === r
											? 'bg-primary text-foreground-opposite shadow-sm'
											: 'bg-secondary/50 text-foreground hover:bg-secondary/70'
									}`}
								>
									{r.charAt(0).toUpperCase() + r.slice(1)}
								</button>
							{/each}
						</div>
					</div>

					<!-- Density -->
					<div class="mb-5 flex flex-col gap-3">
						<label class="text-sm font-medium text-foreground">Density</label>
						<div class="grid grid-cols-3 gap-2">
							{#each ['compact', 'default', 'comfortable'] as d (d)}
								<button
									type="button"
									onclick={() => {
										theme.density = d as Density;
									}}
									class={`rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
										theme.density === d
											? 'bg-primary text-foreground-opposite shadow-sm'
											: 'bg-secondary/50 text-foreground hover:bg-secondary/70'
									}`}
								>
									{d === 'comfortable' ? 'Comfort' : d.charAt(0).toUpperCase() + d.slice(1)}
								</button>
							{/each}
						</div>
					</div>

					<!-- Motion -->
					<div class="flex flex-col gap-3">
						<label class="text-sm font-medium text-foreground">Motion</label>
						<div class="grid grid-cols-2 gap-2">
							{#each ['none', 'subtle', 'default', 'expressive'] as m (m)}
								<button
									type="button"
									onclick={() => {
										theme.motion = m as MotionFeel;
									}}
									class={`rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
										theme.motion === m
											? 'bg-primary text-foreground-opposite shadow-sm'
											: 'bg-secondary/50 text-foreground hover:bg-secondary/70'
									}`}
								>
									{m.charAt(0).toUpperCase() + m.slice(1)}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- ─────── TYPOGRAPHY SECTION ─────── -->
				<div class="pb-4 border-b border-border/40">
					<h2 class="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-4">
						Typography
					</h2>

					<!-- Font: Sans -->
					<div class="mb-4 flex flex-col gap-2">
						<label class="text-sm font-medium text-foreground">Sans-serif</label>
						<Select.Root value={theme.fontSans}>
							<Select.Trigger variant="outline" class="w-full h-9 text-sm">
								{theme.fontSans}
							</Select.Trigger>
							<Select.Content>
								{#each fontOptions.filter((f) => f.group === 'Sans') as font (font.label)}
									<Select.Item
										value={font.value}
										onclick={() => {
											theme.fontSans = font.value;
										}}
									>
										{font.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<!-- Font: Header -->
					<div class="mb-4 flex flex-col gap-2">
						<label class="text-sm font-medium text-foreground">Heading</label>
						<Select.Root value={theme.fontHeader}>
							<Select.Trigger variant="outline" class="w-full h-9 text-sm">
								{theme.fontHeader}
							</Select.Trigger>
							<Select.Content>
								{#each fontOptions.filter((f) => f.group === 'Header') as font (font.label)}
									<Select.Item
										value={font.value}
										onclick={() => {
											theme.fontHeader = font.value;
										}}
									>
										{font.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<!-- Font: Mono -->
					<div class="flex flex-col gap-2">
						<label class="text-sm font-medium text-foreground">Monospace</label>
						<Select.Root value={theme.fontMono}>
							<Select.Trigger variant="outline" class="w-full h-9 text-sm">
								{theme.fontMono}
							</Select.Trigger>
							<Select.Content>
								{#each fontOptions.filter((f) => f.group === 'Mono') as font (font.label)}
									<Select.Item
										value={font.value}
										onclick={() => {
											theme.fontMono = font.value;
										}}
									>
										{font.label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>

				<!-- ─────── ACTIONS SECTION ─────── -->
				<div class="pt-2 flex flex-col gap-2">
					<Button
						variant="outline"
						size="sm"
						class="justify-start gap-2 w-full h-9"
						onclick={resetToDefault}
					>
						<RotateCcw size={14} />
						Reset to default
					</Button>

					<Button
						variant="ghost"
						size="sm"
						class="justify-start gap-2 w-full h-9"
						onclick={() => copyToClipboard(css, 'css')}
					>
						{#if copied === 'css'}
							<Check size={14} class="text-green-600" />
							Copied CSS
						{:else}
							<Copy size={14} />
							Copy CSS
						{/if}
					</Button>

					<Button
						variant="ghost"
						size="sm"
						class="justify-start gap-2 w-full h-9"
						onclick={() => copyToClipboard(json, 'json')}
					>
						{#if copied === 'json'}
							<Check size={14} class="text-green-600" />
							Copied JSON
						{:else}
							<Copy size={14} />
							Copy JSON
						{/if}
					</Button>
				</div>
			</div>
		</div>
	</aside>

	<!-- ─────────────────── PREVIEW CANVAS ─────────────────── -->
	<main class="flex-1 flex flex-col min-h-0">
		<StudioPreview />
	</main>
</div>

<style>
	:global(.silk-theme-preview) {
		background: var(--color-background);
		color: var(--color-foreground);
	}
</style>

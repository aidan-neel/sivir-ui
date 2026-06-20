<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { Button } from '@silk/ui/components/button';
	import { ColorPicker } from '@silk/ui/components/color-picker';
	import * as Select from '@silk/ui/components/select';
	import { toast } from '@silk/ui/components/toast';
	import { applyLiveThemeCss, loadStudioThemeV2, saveStudioThemeV2 } from '@silk/ui/themes/live';
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
	<meta name="description" content="Build and preview your Silk theme with constrained controls." />
</svelte:head>

<div class="flex min-h-screen bg-background">
	<!-- ─────────────────── CONTROL PANEL ─────────────────── -->
	<aside class="w-80 flex-shrink-0 border-r border-border bg-background/40 p-6 overflow-y-auto">
		<div class="flex flex-col gap-6">
			<!-- Header -->
			<div class="flex flex-col gap-2">
				<h1 class="text-[1.25rem] font-[600] text-foreground">Theme Studio</h1>
				<p class="text-[0.85rem] text-foreground-muted">
					Adjust 6 controls to customize your theme.
				</p>
			</div>

			<!-- Brand color -->
			<div class="flex flex-col gap-2">
				<label class="text-[0.78rem] font-[500] text-foreground">Brand color</label>
				<ColorPicker
					value={theme.brand}
					onValueChange={(value) => {
						theme.brand = value;
					}}
				/>
			</div>

			<!-- Neutral temperature -->
			<div class="flex flex-col gap-2">
				<label class="text-[0.78rem] font-[500] text-foreground">Neutral temperature</label>
				<div class="flex gap-2">
					{#each ['cool', 'true', 'warm'] as temp (temp)}
						<button
							type="button"
							onclick={() => {
								theme.neutral = temp as NeutralTemp;
							}}
							class={`flex-1 rounded-[var(--radius-md)] px-3 py-2 text-[0.78rem] font-[500] transition-colors ${
								theme.neutral === temp
									? 'bg-primary text-foreground-opposite'
									: 'bg-secondary text-foreground hover:bg-secondary/80'
							}`}
						>
							{temp.charAt(0).toUpperCase() + temp.slice(1)}
						</button>
					{/each}
				</div>
			</div>

			<!-- Radius -->
			<div class="flex flex-col gap-2">
				<label class="text-[0.78rem] font-[500] text-foreground">Radius</label>
				<div class="flex gap-2">
					{#each ['sharp', 'default', 'rounded'] as r (r)}
						<button
							type="button"
							onclick={() => {
								theme.radius = r as RadiusScale;
							}}
							class={`flex-1 rounded-[var(--radius-md)] px-3 py-2 text-[0.78rem] font-[500] transition-colors ${
								theme.radius === r
									? 'bg-primary text-foreground-opposite'
									: 'bg-secondary text-foreground hover:bg-secondary/80'
							}`}
						>
							{r.charAt(0).toUpperCase() + r.slice(1)}
						</button>
					{/each}
				</div>
			</div>

			<!-- Density -->
			<div class="flex flex-col gap-2">
				<label class="text-[0.78rem] font-[500] text-foreground">Density</label>
				<div class="flex gap-2">
					{#each ['compact', 'default', 'comfortable'] as d (d)}
						<button
							type="button"
							onclick={() => {
								theme.density = d as Density;
							}}
							class={`flex-1 rounded-[var(--radius-md)] px-3 py-2 text-[0.78rem] font-[500] transition-colors ${
								theme.density === d
									? 'bg-primary text-foreground-opposite'
									: 'bg-secondary text-foreground hover:bg-secondary/80'
							}`}
						>
							{d.charAt(0).toUpperCase() + d.slice(1)}
						</button>
					{/each}
				</div>
			</div>

			<!-- Motion -->
			<div class="flex flex-col gap-2">
				<label class="text-[0.78rem] font-[500] text-foreground">Motion</label>
				<div class="flex gap-2">
					{#each ['none', 'subtle', 'default', 'expressive'] as m (m)}
						<button
							type="button"
							onclick={() => {
								theme.motion = m as MotionFeel;
							}}
							class={`flex-1 rounded-[var(--radius-md)] px-3 py-2 text-[0.78rem] font-[500] transition-colors ${
								theme.motion === m
									? 'bg-primary text-foreground-opposite'
									: 'bg-secondary text-foreground hover:bg-secondary/80'
							}`}
						>
							{m.charAt(0).toUpperCase() + m.slice(1)}
						</button>
					{/each}
				</div>
			</div>

			<!-- Font: Sans -->
			<div class="flex flex-col gap-2">
				<label class="text-[0.78rem] font-[500] text-foreground">Sans font</label>
				<Select.Root value={theme.fontSans}>
					<Select.Trigger variant="outline" class="w-full">
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
			<div class="flex flex-col gap-2">
				<label class="text-[0.78rem] font-[500] text-foreground">Header font</label>
				<Select.Root value={theme.fontHeader}>
					<Select.Trigger variant="outline" class="w-full">
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
				<label class="text-[0.78rem] font-[500] text-foreground">Mono font</label>
				<Select.Root value={theme.fontMono}>
					<Select.Trigger variant="outline" class="w-full">
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

			<!-- Divider -->
			<div class="border-t border-border"></div>

			<!-- Actions -->
			<div class="flex flex-col gap-2">
				<Button
					variant="outline"
					size="sm"
					class="justify-start gap-2 w-full"
					onclick={resetToDefault}
				>
					<RotateCcw size={14} />
					Reset to default
				</Button>

				<Button
					variant="ghost"
					size="sm"
					class="justify-start gap-2 w-full"
					onclick={() => copyToClipboard(css, 'css')}
				>
					{#if copied === 'css'}
						<Check size={14} class="text-[var(--color-success)]" />
						Copied CSS
					{:else}
						<Copy size={14} />
						Copy CSS
					{/if}
				</Button>

				<Button
					variant="ghost"
					size="sm"
					class="justify-start gap-2 w-full"
					onclick={() => copyToClipboard(json, 'json')}
				>
					{#if copied === 'json'}
						<Check size={14} class="text-[var(--color-success)]" />
						Copied JSON
					{:else}
						<Copy size={14} />
						Copy JSON
					{/if}
				</Button>
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

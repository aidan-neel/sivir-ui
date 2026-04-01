<script lang="ts">
	import { onMount } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Palette from '@lucide/svelte/icons/palette';
	import Type from '@lucide/svelte/icons/type';
	import * as Alert from '$lib/silk/components/alert';
	import { Badge } from '$lib/silk/components/badge';
	import { Button } from '$lib/silk/components/button';
	import * as Card from '$lib/silk/components/card';
	import { Checkbox } from '$lib/silk/components/checkbox';
	import * as Combobox from '$lib/silk/components/combobox';
	import ColorPicker from '$lib/components/themes/color-picker.svelte';
	import { Input } from '$lib/silk/components/input';
	import { Switch } from '$lib/silk/components/switch';
	import { Textarea } from '$lib/silk/components/textarea';
	import * as Tooltip from '$lib/silk/components/tooltip';
	import { toast } from '$lib/silk/components/toast';
	import { applyLiveThemeCss } from '$lib/silk/themes/live';
	import {
		durationPresets,
		getDurationPreset,
		themePresets,
		themeToCss,
		type ThemeDraft,
		slugifyThemeName
	} from '$lib/silk/themes/presets';

	type EditableField = {
		key: keyof ThemeDraft['light'];
		label: string;
	};

	const editableFields: EditableField[] = [
		{ key: 'background', label: 'Background' },
		{ key: 'foreground', label: 'Foreground' },
		{ key: 'foregroundMuted', label: 'Muted Text' },
		{ key: 'foregroundButton', label: 'Button Text' },
		{ key: 'foregroundOpposite', label: 'Opposite Text' },
		{ key: 'primary', label: 'Primary' },
		{ key: 'border', label: 'Border' },
		{ key: 'borderStrong', label: 'Strong Border' },
		{ key: 'input', label: 'Input' },
		{ key: 'secondary', label: 'Secondary' },
		{ key: 'card', label: 'Card' },
		{ key: 'muted', label: 'Muted' },
		{ key: 'popover', label: 'Popover' },
		{ key: 'accent', label: 'Accent Surface' },
		{ key: 'alternate', label: 'Alternate' },
		{ key: 'success', label: 'Success' },
		{ key: 'warning', label: 'Warning' },
		{ key: 'error', label: 'Error' },
		{ key: 'destructive', label: 'Destructive' },
		{ key: 'ring', label: 'Focus Ring' },
		{ key: 'overlay', label: 'Overlay' }
	];

	type FontOption = {
		label: string;
		value: string;
		category: 'Sans Serif' | 'Serif' | 'Mono';
	};

	const fontOptions: FontOption[] = [
		{ label: 'Geist', value: 'Geist, sans-serif', category: 'Sans Serif' },
		{ label: 'Instrument Sans', value: '"Instrument Sans", sans-serif', category: 'Sans Serif' },
		{ label: 'Manrope', value: 'Manrope, sans-serif', category: 'Sans Serif' },
		{ label: 'DM Sans', value: '"DM Sans", sans-serif', category: 'Sans Serif' },
		{
			label: 'Plus Jakarta Sans',
			value: '"Plus Jakarta Sans", sans-serif',
			category: 'Sans Serif'
		},
		{ label: 'Outfit', value: 'Outfit, sans-serif', category: 'Sans Serif' },
		{ label: 'Space Grotesk', value: '"Space Grotesk", sans-serif', category: 'Sans Serif' },
		{ label: 'Sora', value: 'Sora, sans-serif', category: 'Sans Serif' },
		{ label: 'IBM Plex Sans', value: '"IBM Plex Sans", sans-serif', category: 'Sans Serif' },
		{ label: 'Lora', value: 'Lora, serif', category: 'Serif' },
		{ label: 'Source Serif 4', value: '"Source Serif 4", serif', category: 'Serif' },
		{ label: 'Fraunces', value: 'Fraunces, serif', category: 'Serif' },
		{ label: 'Newsreader', value: 'Newsreader, serif', category: 'Serif' },
		{ label: 'Geist Mono', value: '"Geist Mono", monospace', category: 'Mono' },
		{ label: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace', category: 'Mono' }
	];

	const fontCategories: FontOption['category'][] = ['Sans Serif', 'Serif', 'Mono'];

	const colorSwatches: Partial<Record<keyof ThemeDraft['light'], string[]>> = {
		primary: [
			'#155eef',
			'#2f7a54',
			'#a44a2f',
			'#1f9d62',
			'#c26a3d',
			'#18181b',
			'#7c3aed',
			'#d97706'
		],
		background: [
			'#fcfcfd',
			'#fbf7f0',
			'#f5f8f3',
			'#f6fbf8',
			'#f8f5ef',
			'#ffffff',
			'#090b0f',
			'#080809'
		],
		card: ['#ffffff', '#fffaf4', '#f9fcf7', '#fafdfa', '#fcf8f2', '#ffffff', '#0f1318', '#0c0c0f'],
		border: [
			'#dde2ea',
			'#ded4c7',
			'#d8e2d3',
			'#d3e7da',
			'#e0d6c8',
			'#e5e7eb',
			'#1b2028',
			'#232326'
		],
		input: ['#c9d1dc', '#d8cbbb', '#c7d5c1', '#c4dccd', '#d5c8b7', '#d1d5db', '#262d38', '#242428'],
		foreground: [
			'#101828',
			'#271d19',
			'#18261d',
			'#122018',
			'#221a15',
			'#09090b',
			'#eef2f8',
			'#fafafa'
		],
		foregroundMuted: [
			'#667085',
			'#7f6d62',
			'#67776d',
			'#65776c',
			'#79695b',
			'#71717a',
			'#8a94a2',
			'#a1a1aa'
		],
		ring: [
			'rgb(21 94 239 / 0.18)',
			'rgb(47 122 84 / 0.18)',
			'rgb(31 157 98 / 0.18)',
			'rgb(194 106 61 / 0.18)',
			'rgb(59 130 246 / 0.18)'
		]
	};

	let selectedPresetSlug = $state(themePresets[0].slug);
	let editorTheme = $state(cloneTheme(themePresets[0]));
	let editorName = $state(themePresets[0].name);
	let copiedCss = $state(false);
	let headerFontSelection = $state('');
	let bodyFontSelection = $state('');

	const generatedCss = $derived(
		themeToCss({
			...editorTheme,
			name: editorName,
			slug: slugifyThemeName(editorName) || 'custom-theme'
		})
	);

	const activePreset = $derived(
		themePresets.find((theme) => theme.slug === selectedPresetSlug) ?? themePresets[0]
	);
	const activeDuration = $derived(getDurationPreset(editorTheme.durationPreset));

	onMount(() => {
		syncFontSelections();
	});

	$effect(() => {
		applyLiveThemeCss(generatedCss);
	});

	$effect(() => {
		const next = fontOptions.find((font) => font.label === headerFontSelection)?.value;
		if (next && editorTheme.fontHeader !== next) editorTheme.fontHeader = next;
	});

	$effect(() => {
		const next = fontOptions.find((font) => font.label === bodyFontSelection)?.value;
		if (next && editorTheme.fontSans !== next) editorTheme.fontSans = next;
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

	function cloneTheme(theme: ThemeDraft): ThemeDraft {
		return JSON.parse(JSON.stringify(theme));
	}

	function cleanFontName(value: string) {
		return value.split(',')[0]?.replaceAll('"', '') ?? value;
	}

	function syncFontSelections() {
		headerFontSelection =
			fontOptions.find((font) => font.value === editorTheme.fontHeader)?.label ??
			fontOptions[0].label;
		bodyFontSelection =
			fontOptions.find((font) => font.value === editorTheme.fontSans)?.label ??
			fontOptions[0].label;
		editorTheme.fontMono = resolveMonoFont(
			editorTheme.fontHeader,
			editorTheme.fontSans,
			editorTheme.fontMono
		);
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

	function loadPreset(theme: ThemeDraft) {
		selectedPresetSlug = theme.slug;
		editorTheme = cloneTheme(theme);
		editorTheme.fontMono = resolveMonoFont(
			editorTheme.fontHeader,
			editorTheme.fontSans,
			editorTheme.fontMono
		);
		editorName = theme.name;
		if (!editorTheme.radiusBase) editorTheme.radiusBase = editorTheme.radiusMd;
		syncFontSelections();
		toast({
			title: `${theme.name} loaded`,
			description: 'The preset is now applied across the site.',
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
		headerFontSelection = label;
		const next = fontOptions.find((font) => font.label === label)?.value;
		if (!next) return;
		editorTheme.fontHeader = next;
		editorTheme.fontMono = resolveMonoFont(next, editorTheme.fontSans, editorTheme.fontMono);
	}

	function updateBodyFont(label: string) {
		bodyFontSelection = label;
		const next = fontOptions.find((font) => font.label === label)?.value;
		if (!next) return;
		editorTheme.fontSans = next;
		editorTheme.fontMono = resolveMonoFont(editorTheme.fontHeader, next, editorTheme.fontMono);
	}
</script>

<svelte:head>
	<title>Silk UI Themes</title>
	<meta
		name="description"
		content="Explore five Silk UI presets, adjust motion and theme tokens live, and generate custom theme CSS."
	/>
</svelte:head>

<div class="relative min-h-screen overflow-x-clip">
	<div class="pointer-events-none fixed inset-0 -z-10">
		<div
			class="absolute left-[-16rem] top-[-3rem] h-[38rem] w-[38rem] rounded-[999px] blur-[130px]"
			style="background: color-mix(in srgb, var(--color-primary) 14%, transparent);"
		></div>
		<div
			class="absolute right-[-12rem] top-[10rem] h-[30rem] w-[30rem] rounded-[999px] blur-[130px]"
			style="background: color-mix(in srgb, var(--color-primary) 10%, transparent);"
		></div>
		<div
			class="absolute inset-0"
			style="background-image:
				linear-gradient(color-mix(in srgb, var(--color-foreground) 3%, transparent) 1px, transparent 1px),
				linear-gradient(90deg, color-mix(in srgb, var(--color-foreground) 3%, transparent) 1px, transparent 1px);
				background-size: 52px 52px;
				mask-image: linear-gradient(180deg, rgb(0 0 0 / 0.44), transparent 90%);"
		></div>
	</div>

	<main class="mx-auto flex w-full max-w-[1400px] flex-col gap-12 px-4 pb-24 pt-30 md:px-8">
		<section class="relative z-[1] grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
			<div class="flex flex-col gap-5">
				<div class="space-y-4">
					<p class="text-sm font-medium uppercase tracking-[0.18em] text-foreground-muted">
						Theme Studio
					</p>
					<h1
						class="max-w-[16ch] text-[clamp(2.4rem,4vw,3.75rem)] font-semibold leading-[0.97] tracking-[-0.05em]"
						style="font-family: var(--font-header);"
					>
						Five stronger presets and a cleaner way to shape them.
					</h1>
					<p class="max-w-[56rem] text-[1rem] leading-8 text-foreground-muted">
						Choose a preset, refine typography and color, and keep the result applied across the app
						while you test real components instead of tiny token swatches.
					</p>
				</div>

				<div class="grid gap-4 sm:grid-cols-3">
					<div class="border-t border-border-strong/65 pt-4">
						<p class="text-sm font-semibold text-foreground">5 distinct presets</p>
						<p class="mt-2 text-sm leading-6 text-foreground-muted">
							Each preset now has a clearer personality, with the closest warm duplicate removed.
						</p>
					</div>
					<div class="border-t border-border-strong/65 pt-4">
						<p class="text-sm font-semibold text-foreground">Whole-site live preview</p>
						<p class="mt-2 text-sm leading-6 text-foreground-muted">
							Your edits apply to the whole app while you move through docs, pages, and examples.
						</p>
					</div>
					<div class="border-t border-border-strong/65 pt-4">
						<p class="text-sm font-semibold text-foreground">CSS-first output</p>
						<p class="mt-2 text-sm leading-6 text-foreground-muted">
							Everything stays local and exportable as CSS without any registry or backend layer.
						</p>
					</div>
				</div>
			</div>

			<div
				class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] flex flex-col gap-5 rounded-2xl p-6"
			>
				<div class="flex items-start justify-between gap-4">
					<div class="space-y-2">
						<p class="text-sm font-medium text-foreground-muted">Currently loaded</p>
						<h2
							class="text-2xl font-semibold tracking-[-0.03em]"
							style={`font-family:${editorTheme.fontHeader};`}
						>
							{editorName}
						</h2>
						<p class="text-sm leading-7 text-foreground-muted">{activePreset.description}</p>
					</div>
					<div
						class="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm text-foreground-muted"
					>
						<Palette size={14} />
						Site-wide
					</div>
				</div>

				<div class="grid grid-cols-6 gap-2">
					{#each [editorTheme.light.primary, editorTheme.light.background, editorTheme.light.card, editorTheme.dark.primary, editorTheme.dark.background, editorTheme.dark.card] as color}
						<div class="h-12 rounded-lg" style={`background:${color};`}></div>
					{/each}
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="rounded-xl bg-secondary/28 p-4">
						<p
							class="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-foreground-muted"
						>
							Header / Body
						</p>
						<p class="mt-2 text-base font-semibold text-foreground">
							{cleanFontName(editorTheme.fontHeader)}
						</p>
						<p class="text-sm text-foreground-muted">{cleanFontName(editorTheme.fontSans)}</p>
						<p class="mt-2 text-xs text-foreground-muted">
							Mono usage follows header/body automatically.
						</p>
					</div>
					<div class="rounded-xl bg-secondary/28 p-4">
						<p
							class="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-foreground-muted"
						>
							Shape / Motion
						</p>
						<p class="mt-2 text-base font-semibold text-foreground">
							{editorTheme.radiusBase} base radius
						</p>
						<p class="text-sm text-foreground-muted">{activeDuration.name} timings</p>
						<p class="mt-2 text-xs text-foreground-muted">
							Hover {activeDuration.hover} / Panel {activeDuration.panel}
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="relative z-[1] grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
			<aside class="xl:sticky xl:top-28 xl:self-start">
				<div
					class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] rounded-2xl p-4"
				>
					<div class="mb-4 space-y-1 px-1">
						<p class="text-sm font-semibold text-foreground">Preset library</p>
						<p class="text-sm leading-6 text-foreground-muted">
							Five stronger starting points with clearer type, contrast, tone, and motion.
						</p>
					</div>

					<div class="flex flex-col gap-2">
						{#each themePresets as preset}
							<button
								type="button"
								class={`flex w-full flex-col gap-3 rounded-xl border px-4 py-4 text-left transition-[background-color,border-color,transform] duration-200 ${
									selectedPresetSlug === preset.slug
										? 'border-border-strong/65 bg-secondary/45'
										: 'border-transparent hover:border-border/70 hover:bg-secondary/18 hover:-translate-y-[1px]'
								}`}
								onclick={() => loadPreset(preset)}
							>
								<div class="flex items-start justify-between gap-3">
									<div class="space-y-1">
										<p class="text-sm font-semibold text-foreground">{preset.name}</p>
										<p class="text-xs leading-5 text-foreground-muted">{preset.description}</p>
									</div>
									<div class="flex min-w-0 items-center gap-2 pt-0.5">
										{#if selectedPresetSlug === preset.slug}
											<span class="size-2 rounded-full bg-primary"></span>
										{/if}
									</div>
								</div>

								<div class="grid grid-cols-4 gap-1.5">
									<div class="h-8 rounded-md" style={`background:${preset.light.primary};`}></div>
									<div class="h-8 rounded-md" style={`background:${preset.light.card};`}></div>
									<div class="h-8 rounded-md" style={`background:${preset.dark.primary};`}></div>
									<div class="h-8 rounded-md" style={`background:${preset.dark.card};`}></div>
								</div>

								<div
									class="flex items-center justify-between gap-3 text-[0.72rem] text-foreground-muted"
								>
									<span>{cleanFontName(preset.fontHeader)}</span>
									<span>{getDurationPreset(preset.durationPreset).name}</span>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</aside>

			<div class="flex min-w-0 flex-col gap-6">
				<Card.Root class="rounded-2xl p-6">
					<Card.Header class="gap-3">
						<div class="flex items-start justify-between gap-4">
							<div class="space-y-2">
								<Card.Title class="text-xl">Theme editor</Card.Title>
								<Card.Description class="leading-7">
									Tune identity, typography, radius, button treatment, and both color palettes.
								</Card.Description>
							</div>
							<div class="flex items-center gap-2 text-sm text-foreground-muted">
								<Type size={14} />
								Editable
							</div>
						</div>
					</Card.Header>

					<Card.Content class="flex flex-col gap-8">
						<div class="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
							<div class="grid gap-4 md:grid-cols-2">
								<div class="flex flex-col gap-2 md:col-span-2">
									<span
										class="text-[length:var(--text-sm)] font-medium text-foreground [font-family:var(--font-sans),sans-serif]"
										>Theme name</span
									>
									<Input variant="outlined" bind:value={editorName} placeholder="Midnight Loom" />
								</div>

								<div class="flex flex-col gap-2">
									<span
										class="text-[length:var(--text-sm)] font-medium text-foreground [font-family:var(--font-sans),sans-serif]"
										>Header font</span
									>
									{#key `header-${headerFontSelection}`}
										<Combobox.Root>
											<Combobox.Trigger variant="outlined" class="w-full"
												>{headerFontSelection}</Combobox.Trigger
											>
											<Combobox.Content class="w-[15rem]">
												<Combobox.Search placeholder="Search fonts..." />
												<Combobox.Results>
													{#each fontCategories as category}
														<Combobox.Label>{category}</Combobox.Label>
														{#each fontOptions.filter((font) => font.category === category) as font}
															<Combobox.Item
																value={`${category.toLowerCase()} ${font.label.toLowerCase()}`}
																label={font.label}
																callback={() => updateHeaderFont(font.label)}
															/>
														{/each}
													{/each}
												</Combobox.Results>
											</Combobox.Content>
										</Combobox.Root>
									{/key}
								</div>

								<div class="flex flex-col gap-2">
									<span
										class="text-[length:var(--text-sm)] font-medium text-foreground [font-family:var(--font-sans),sans-serif]"
										>Body font</span
									>
									{#key `body-${bodyFontSelection}`}
										<Combobox.Root>
											<Combobox.Trigger variant="outlined" class="w-full"
												>{bodyFontSelection}</Combobox.Trigger
											>
											<Combobox.Content class="w-[15rem]">
												<Combobox.Search placeholder="Search fonts..." />
												<Combobox.Results>
													{#each fontCategories as category}
														<Combobox.Label>{category}</Combobox.Label>
														{#each fontOptions.filter((font) => font.category === category) as font}
															<Combobox.Item
																value={`${category.toLowerCase()} ${font.label.toLowerCase()}`}
																label={font.label}
																callback={() => updateBodyFont(font.label)}
															/>
														{/each}
													{/each}
												</Combobox.Results>
											</Combobox.Content>
										</Combobox.Root>
									{/key}
								</div>

								<div class="flex flex-col gap-2">
									<span
										class="text-[length:var(--text-sm)] font-medium text-foreground [font-family:var(--font-sans),sans-serif]"
										>Base radius</span
									>
									<Input
										variant="outlined"
										bind:value={editorTheme.radiusBase}
										placeholder="0.5rem"
									/>
								</div>

								<div class="flex flex-col gap-2 md:col-span-2">
									<span
										class="text-[length:var(--text-sm)] font-medium text-foreground [font-family:var(--font-sans),sans-serif]"
										>Motion preset</span
									>
									<div class="grid gap-2 sm:grid-cols-2">
										{#each durationPresets as preset}
											<button
												type="button"
												class={`rounded-xl border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-200 ${
													editorTheme.durationPreset === preset.slug
														? 'border-border-strong/70 bg-secondary/45'
														: 'border-border/60 hover:border-border-strong/70 hover:bg-secondary/20'
												}`}
												onclick={() => {
													editorTheme.durationPreset = preset.slug;
												}}
											>
												<p class="text-sm font-semibold text-foreground">{preset.name}</p>
												<p class="mt-1 text-xs leading-5 text-foreground-muted">
													{preset.description}
												</p>
												<p
													class="mt-2 text-[11px] uppercase tracking-[0.14em] text-foreground-muted"
												>
													Hover {preset.hover} / Panel {preset.panel}
												</p>
											</button>
										{/each}
									</div>
								</div>
							</div>

							<div class="grid gap-4">
								<div
									class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] rounded-xl p-4"
								>
									<p class="text-sm font-semibold text-foreground">Typography preview</p>
									<p
										class="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground"
										style={`font-family:${editorTheme.fontHeader};`}
									>
										Calm structure, softer contrast.
									</p>
									<p
										class="mt-2 text-sm leading-7 text-foreground-muted"
										style={`font-family:${editorTheme.fontSans};`}
									>
										Use the header font for emphasis and the body font for day-to-day readability.
									</p>
									<p
										class="mt-3 text-xs text-foreground-muted"
										style={`font-family:${editorTheme.fontMono};`}
									>
										token.radius = {editorTheme.radiusBase}
									</p>
								</div>

								<div
									class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] flex items-center justify-between gap-4 rounded-xl p-4"
								>
									<div class="space-y-1">
										<p class="text-sm font-semibold text-foreground">Primary button stroke</p>
										<p class="text-xs leading-5 text-foreground-muted">
											Turn the extra outline on or off for filled primary buttons.
										</p>
									</div>
									<Switch bind:switched={editorTheme.primaryButtonOutline} />
								</div>
							</div>
						</div>

						<div class="grid gap-8 xl:grid-cols-2">
							<div class="flex flex-col gap-4">
								<div class="flex items-center justify-between gap-3">
									<h3 class="text-base font-semibold text-foreground">Light palette</h3>
									<Badge variant="secondary">Light</Badge>
								</div>
								<div class="grid gap-3">
									{#each editableFields as field}
										<ColorPicker
											label={field.label}
											value={editorTheme.light[field.key]}
											swatches={colorSwatches[field.key] ?? []}
											onValueChange={(value) => {
												editorTheme.light[field.key] = value;
											}}
										/>
									{/each}
								</div>
							</div>

							<div class="flex flex-col gap-4">
								<div class="flex items-center justify-between gap-3">
									<h3 class="text-base font-semibold text-foreground">Dark palette</h3>
									<Badge variant="secondary">Dark</Badge>
								</div>
								<div class="grid gap-3">
									{#each editableFields as field}
										<ColorPicker
											label={field.label}
											value={editorTheme.dark[field.key]}
											swatches={colorSwatches[field.key] ?? []}
											onValueChange={(value) => {
												editorTheme.dark[field.key] = value;
											}}
										/>
									{/each}
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root class="rounded-2xl p-6">
					<Card.Header class="gap-3">
						<div class="flex items-start justify-between gap-4">
							<div class="space-y-2">
								<Card.Title class="text-xl">Live component gallery</Card.Title>
								<Card.Description class="leading-7">
									Check buttons, forms, surfaces, badges, toggles, alerts, and toast behavior in one
									place.
								</Card.Description>
							</div>
							<Button variant="secondary" onclick={showPreviewToast}>Fire toast</Button>
						</div>
					</Card.Header>

					<Card.Content>
						<div class="rounded-2xl bg-secondary/18 p-4 md:p-5">
							<div class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
								<div class="grid gap-4">
									<div class="rounded-xl bg-card/88 p-5">
										<div class="flex flex-wrap items-center gap-2">
											<Button>Primary</Button>
											<Button variant="secondary">Secondary</Button>
											<Button variant="outlined">Outlined</Button>
											<Button variant="ghost">Ghost</Button>
											<Badge>New</Badge>
											<Badge variant="secondary">Neutral</Badge>
											<Badge variant="outlined">Outline</Badge>
										</div>
									</div>

									<div class="rounded-xl bg-card/88 p-5">
										<div class="space-y-4">
											<div class="space-y-2">
												<p class="text-sm font-semibold text-foreground">Interface copy</p>
												<p
													class="text-[1.35rem] font-semibold tracking-[-0.03em] text-foreground"
													style={`font-family:${editorTheme.fontHeader};`}
												>
													A theme should set the tone before you even notice the tokens.
												</p>
											</div>

											<div class="grid gap-3">
												<Input
													variant="outlined"
													placeholder="Search surfaces, color, and contrast"
												/>
												<div class="grid gap-3 md:grid-cols-2">
													<Input variant="outlined" value={editorName} />
													<Button variant="flat" class="justify-start">Save current variant</Button>
												</div>
												<Textarea
													class="min-h-28"
													placeholder="Longer notes for testing textarea contrast, borders, and comfortable reading color."
												/>
											</div>
										</div>
									</div>
								</div>

								<div class="grid gap-4">
									<div class="rounded-xl bg-card/88 p-5">
										<div class="flex items-start justify-between gap-4">
											<div class="space-y-1">
												<p class="text-sm font-semibold text-foreground">Preferences</p>
												<p class="text-sm leading-6 text-foreground-muted">
													Quick checks for fields, toggles, and quiet surfaces.
												</p>
											</div>
											<Switch switched={true} />
										</div>
										<div class="mt-4 flex flex-col gap-3">
											<Checkbox
												variant="default"
												checked={true}
												label="Preserve semantic tokens"
												description="Keep the system easy to extend and remix later."
											/>
											<Checkbox
												variant="default"
												checked={false}
												label="Export component token overrides"
											/>
										</div>
									</div>

									<Alert.Root variant="info">
										<Alert.Title>Contrast check</Alert.Title>
										<Alert.Description>
											Muted text should stay readable, borders should separate quietly, and cards
											should not disappear into the page.
										</Alert.Description>
									</Alert.Root>

									<div class="grid gap-3 sm:grid-cols-3">
										<div class="rounded-xl bg-card/88 p-4">
											<p class="text-sm font-semibold text-foreground">Light surfaces</p>
											<p class="mt-1 text-sm leading-6 text-foreground-muted">
												Should feel clean, not washed out.
											</p>
										</div>
										<div class="rounded-xl bg-card/88 p-4">
											<p class="text-sm font-semibold text-foreground">Dark surfaces</p>
											<p class="mt-1 text-sm leading-6 text-foreground-muted">
												Should be deep and calm, not overly saturated.
											</p>
										</div>
										<div class="rounded-xl bg-card/88 p-4">
											<p class="text-sm font-semibold text-foreground">Accent balance</p>
											<p class="mt-1 text-sm leading-6 text-foreground-muted">
												Primary should lead without overpowering the page.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root class="rounded-2xl p-6">
					<Card.Header class="gap-3">
						<div class="flex items-center justify-between gap-4">
							<div class="space-y-2">
								<Card.Title class="text-xl">Generated CSS</Card.Title>
								<Card.Description
									>The exact CSS generated from the current editor state.</Card.Description
								>
							</div>
							<Tooltip.Root placement="top" delay={0}>
								<Tooltip.Trigger>
									<button
										type="button"
										class="inline-flex size-9 items-center justify-center rounded-lg border border-transparent bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] transition-[background-color,border-color,color,box-shadow,transform] duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--button-ghost-hover-bg)] focus-visible:translate-y-px focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--color-ring)]"
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
						</div>
					</Card.Header>
					<Card.Content>
						<Textarea
							class="min-h-[22rem] font-mono text-xs leading-6"
							readonly
							value={generatedCss}
						/>
					</Card.Content>
				</Card.Root>
			</div>
		</section>
	</main>
</div>

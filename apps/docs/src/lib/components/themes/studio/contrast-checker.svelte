<script lang="ts">
	import { contrastRatio, type ThemePalette } from '@silk/ui/themes/presets';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';

	type PaletteMode = 'light' | 'dark';
	type ContrastPair = {
		label: string;
		description: string;
		fg: keyof ThemePalette;
		bg: keyof ThemePalette;
	};

	let {
		light,
		dark,
		mode = 'light'
	}: { light: ThemePalette; dark: ThemePalette; mode?: PaletteMode } = $props();

	// Follows the studio's color mode until the user picks a side explicitly.
	let modeOverride = $state<PaletteMode | null>(null);
	const activeMode = $derived(modeOverride ?? mode);
	const palette = $derived(activeMode === 'light' ? light : dark);

	const pairs: ContrastPair[] = [
		{ label: 'Body text', description: 'Text on Background', fg: 'foreground', bg: 'background' },
		{ label: 'Surface text', description: 'Text on Surface', fg: 'foreground', bg: 'card' },
		{
			label: 'Muted text',
			description: 'Muted text on Background',
			fg: 'foregroundMuted',
			bg: 'background'
		},
		{
			label: 'Primary button',
			description: 'Button text on Primary',
			fg: 'foregroundButton',
			bg: 'primary'
		},
		{
			label: 'Secondary surface',
			description: 'Text on Secondary',
			fg: 'foreground',
			bg: 'secondary'
		},
		{ label: 'Muted surface', description: 'Text on Muted', fg: 'foreground', bg: 'muted' }
	];

	const results = $derived(
		pairs.map((pair) => {
			const fgValue = palette[pair.fg];
			const bgValue = palette[pair.bg];
			const ratio = contrastRatio(fgValue, bgValue);
			return { ...pair, fgValue, bgValue, ratio, aa: ratio >= 4.5, aaa: ratio >= 7 };
		})
	);

	const passCount = $derived(results.filter((result) => result.aa).length);
</script>

{#snippet levelPill(label: string, pass: boolean)}
	<span
		class={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-[0.1rem] text-[0.58rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] ${
			pass ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
		}`}
		title={pass ? `Passes WCAG ${label}` : `Fails WCAG ${label}`}
	>
		{#if pass}
			<Check size={9} strokeWidth={3} />
		{:else}
			<X size={9} strokeWidth={3} />
		{/if}
		{label}
	</span>
{/snippet}

<section class="flex flex-col gap-2.5">
	<div class="flex items-center justify-between gap-2">
		<p
			class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
		>
			Contrast
		</p>
		<div class="flex items-center gap-2">
			<span
				class="text-[0.65rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted/70"
				>{passCount}/{results.length} pass AA</span
			>
			<div
				class="flex items-center rounded-md border border-border p-0.5"
				role="group"
				aria-label="Contrast palette mode"
			>
				<button
					type="button"
					onclick={() => (modeOverride = 'light')}
					aria-pressed={activeMode === 'light'}
					aria-label="Check light palette"
					class={`flex h-5 w-6 items-center justify-center rounded-[0.3rem] transition-colors ${
						activeMode === 'light'
							? 'bg-secondary text-foreground'
							: 'text-foreground-muted hover:text-foreground'
					}`}
				>
					<Sun size={11} />
				</button>
				<button
					type="button"
					onclick={() => (modeOverride = 'dark')}
					aria-pressed={activeMode === 'dark'}
					aria-label="Check dark palette"
					class={`flex h-5 w-6 items-center justify-center rounded-[0.3rem] transition-colors ${
						activeMode === 'dark'
							? 'bg-secondary text-foreground'
							: 'text-foreground-muted hover:text-foreground'
					}`}
				>
					<Moon size={11} />
				</button>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-1.5">
		{#each results as result (result.label)}
			<div
				class="flex items-center gap-2.5 rounded-lg border border-border bg-background/40 px-2.5 py-2"
			>
				<span
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-[0.78rem] [font-weight:var(--font-weight-label,600)]"
					style={`background:${result.bgValue};color:${result.fgValue};`}
					aria-hidden="true"
				>
					Aa
				</span>
				<div class="flex min-w-0 flex-1 flex-col">
					<span
						class="truncate text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
						>{result.label}</span
					>
					<span class="truncate text-[0.66rem] text-foreground-muted">{result.description}</span>
				</div>
				<span
					class="shrink-0 text-[0.74rem] tabular-nums [font-weight:var(--font-weight-label,500)] text-foreground-muted"
					>{result.ratio.toFixed(2)}</span
				>
				<div class="flex shrink-0 items-center gap-1">
					{@render levelPill('AA', result.aa)}
					{@render levelPill('AAA', result.aaa)}
				</div>
			</div>
		{/each}
	</div>

	<p
		class="m-0 text-[0.65rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted/70"
	>
		WCAG 2.1 ratios — AA needs 4.5:1, AAA needs 7:1. Large text passes AA at 3:1.
	</p>
</section>

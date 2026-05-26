<script lang="ts">
	import { Button } from '$lib/silk/components/button';
	import { Badge } from '$lib/silk/components/badge';
	import { highlight } from '$lib/highlight';
	import { ColorPicker, type ColorOption } from '$lib/silk/components/color-picker';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import Palette from '@lucide/svelte/icons/palette';

	const TITLE = 'Color Picker';
	const SLUG = 'color-picker';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/color-picker';

	const curIndex = components.indexOf('color-picker');
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	let pgValue = $state('#5e6ad2');
	let pgValueWithOptions = $state('#0284c7');

	const presetSwatches: ColorOption[] = [
		{ label: 'Blue', value: '#2563eb' },
		{ label: 'Indigo', value: '#4f46e5' },
		{ label: 'Violet', value: '#7c3aed' },
		{ label: 'Pink', value: '#db2777' },
		{ label: 'Rose', value: '#e11d48' },
		{ label: 'Orange', value: '#ea580c' },
		{ label: 'Amber', value: '#d97706' },
		{ label: 'Emerald', value: '#059669' },
		{ label: 'Teal', value: '#0d9488' },
		{ label: 'Sky', value: '#0284c7' }
	];

	const apiRows = [
		{ prop: 'value', type: 'string', default: '—', description: 'Hex string (e.g. `#5e6ad2`).' },
		{ prop: 'onValueChange', type: '(value: string) => void', default: '—', description: 'Fires on every committed change (drag, hex, or swatch).' },
		{ prop: 'options', type: 'ColorOption[]', default: '[]', description: 'Optional preset swatches shown under the picker.' },
		{ prop: 'label', type: 'string', default: '—', description: 'Renders a label above the trigger.' },
		{ prop: 'variant', type: '"outlined" | "secondary" | "ghost"', default: '"outlined"', description: 'Trigger style — matches the Button variants.' },
		{ prop: 'class', type: 'string', default: '—', description: 'Wraps the trigger container — set `w-44` for fixed width.' }
	];

	const playgroundCode = $derived(`<ColorPicker value="${pgValue}" onValueChange={(v) => (color = v)} />`);

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add color-picker';
</script>

<svelte:head>
	<title>Silk · Color Picker</title>
	<meta name="description" content="Interactive HSV + HSL color picker with hex input and optional preset swatches." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
		<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">HSV + HSL</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">Hex input</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1 class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] leading-[1] tracking-[-0.035em] md:text-[3rem]" style="font-family: var(--font-header);">Color Picker</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			A compact color picker built around the same primitives the Theme Studio uses. Drag the SB
			plane, tune the hue, or punch in a hex — every change emits the same event.
		</p>
	</div>

	<div class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"><Hash size={12} /></span>
			<code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code>
		</div>
		<button type="button" onclick={() => copy(installCommand, 'install')} class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground" aria-label="Copy install command">
			{#if copiedSnippet === 'install'}<Check size={14} class="text-[var(--color-success)]" />{:else}<Copy size={14} />{/if}
		</button>
	</div>
</header>

<!-- Playground -->
<section class="pt-10">
	<div class="relative">
		<div class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"></div>
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]">
			<div class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8">
				<div class="flex flex-col items-center gap-4">
					<ColorPicker
						class="w-44"
						value={pgValue}
						onValueChange={(v) => (pgValue = v)}
					/>
					<div class="flex items-center gap-2 text-[0.78rem] text-foreground-muted">
						<span class="size-4 rounded-md ring-1 ring-inset ring-black/10" style={`background:${pgValue};`}></span>
						<code class="font-mono text-foreground">{pgValue.toUpperCase()}</code>
					</div>
				</div>
			</div>
			<pre class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(playgroundCode, "svelte")}</code></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<!-- WITH PRESETS -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"><Palette size={12} /></span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">With preset swatches</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Pass an array of <code class="font-mono text-foreground">ColorOption</code> to surface
				curated picks below the HSV plane.
			</p>
		</div>

		<div class="grid gap-3 md:grid-cols-2">
			<div class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8">
				<ColorPicker
					class="w-44"
					value={pgValueWithOptions}
					options={presetSwatches}
					onValueChange={(v) => (pgValueWithOptions = v)}
				/>
			</div>
			<pre class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`const swatches: ColorOption[] = [
  { label: 'Blue',    value: '#2563eb' },
  { label: 'Violet',  value: '#7c3aed' },
  { label: 'Emerald', value: '#059669' },
  // …
];

<ColorPicker
  value={color}
  options={swatches}
  onValueChange={(v) => (color = v)}
/>`, "svelte")}</code></pre>
		</div>
	</section>

	<!-- Variants -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"><Palette size={12} /></span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">Trigger variants</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Style the trigger the same way as Buttons. Defaults to <code class="font-mono text-foreground">outlined</code>.
			</p>
		</div>

		<div class="grid gap-3 md:grid-cols-3">
			{#each ['outlined', 'secondary', 'ghost'] as v}
				<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
					<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wider text-foreground-muted">{v}</span>
					<ColorPicker
						class="w-full"
						variant={v as 'outlined' | 'secondary' | 'ghost'}
						value={pgValue}
						options={presetSwatches}
						onValueChange={(val) => (pgValue = val)}
					/>
				</div>
			{/each}
		</div>
	</section>

	<!-- API -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"><Hash size={12} /></span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">API</h2>
			</div>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row}
					<li class="grid grid-cols-[1fr_1.6fr_0.5fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<code class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)]">{row.prop}</code>
						<div class="flex flex-col gap-1">
							<code class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground">{row.type}</code>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">{row.description}</p>
						</div>
						<div class="md:text-right">
							<code class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem]">{row.default}</code>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center">
		<div class="flex flex-col gap-1">
			<p class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">Want to make it yours?</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">Every Silk component reads from your theme tokens — open the studio to restyle them.</p>
		</div>
		<Button href="/themes/studio">Open theme studio<ArrowRight size={14} /></Button>
	</section>
</div>

{#if curIndex !== -1}
	<div class="mt-12 flex w-full items-center" class:justify-between={prevComponent && nextComponent} class:justify-end={!prevComponent && nextComponent} class:justify-start={prevComponent && !nextComponent}>
		{#if prevComponent}<Button href={`/docs/components/${prevComponent}`} variant="outlined" class="flex-shrink-0"><ChevronLeft size={16} />{sanitizeComponent(prevComponent)}</Button>{/if}
		{#if prevComponent && nextComponent}<div class="mx-4 w-full rounded-lg border-t"></div>{/if}
		{#if nextComponent}<Button href={`/docs/components/${nextComponent}`} variant="outlined" class="flex-shrink-0">{sanitizeComponent(nextComponent)}<ChevronRight size={16} /></Button>{/if}
	</div>
{/if}

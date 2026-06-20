<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import { Input } from '@silk/ui/components/input';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import Layers from '@lucide/svelte/icons/layers-3';

	const TITLE = 'Input';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/input';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	type Variant = 'secondary' | 'outline';
	let pgVariant = $state<Variant>('outline');
	let pgValue = $state('');
	let pgLabel = $state('Email');
	let pgPlaceholder = $state('you@silk-ui.dev');

	const variantList: { value: Variant; label: string; use: string }[] = [
		{
			value: 'outline',
			label: 'Outline',
			use: 'The default -- neutral border, sits well anywhere.'
		},
		{ value: 'secondary', label: 'Secondary', use: 'Subtle tinted background.' }
	];

	const apiRows = [
		{
			prop: 'variant',
			type: '"outline" | "secondary"',
			default: '"outline"',
			description: 'Visual treatment.'
		},
		{ prop: 'value', type: 'string', default: '--', description: 'Bindable with `bind:value`.' },
		{
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Inline label rendered above the input.'
		},
		{
			prop: 'description',
			type: 'string',
			default: '--',
			description: 'Helper text below the input.'
		},
		{
			prop: 'placeholder',
			type: 'string',
			default: '--',
			description: 'Standard HTML placeholder.'
		},
		{
			prop: 'type',
			type: 'string',
			default: '"text"',
			description: 'Any native input type -- text, email, password, number, search, ...'
		},
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Standard disabled.' },
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Tailwind classes for the inner input.'
		}
	];

	const playgroundCode = $derived(`<Input
  variant="${pgVariant}"
  label="${pgLabel}"
  placeholder="${pgPlaceholder}"
  bind:value
/>`);

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add input';
</script>

<svelte:head>
	<title>Silk · Input</title>
	<meta
		name="description"
		content="Text input with labels, helper text, and two visual variants."
	/>
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]"
				>Component</Badge
			>
			<Badge variant="outline" class="text-[0.66rem]">v0.4.2</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">2 variants</Badge>
		</div>
		<Button
			href={SOURCE}
			variant="outline"
			class="h-auto gap-1.5 px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] text-[0.66rem] leading-[1.2]"
			target="_blank"
			rel="noreferrer noopener"
		>
			View source
			<External size={11} />
		</Button>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1] tracking-[-0.035em] md:text-[3rem]"
			style="font-family: var(--font-header);"
		>
			Input
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			The workhorse of every form. Two variants for different surface densities; bindable value and
			full passthrough to the underlying `&lt;input&gt;`.
		</p>
	</div>

	<div
		class="flex items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
	>
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"
				><Hash size={12} /></span
			><code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code>
		</div>
		<button
			type="button"
			onclick={() => copy(installCommand, 'install')}
			class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
			aria-label="Copy install command"
		>
			{#if copiedSnippet === 'install'}<Check
					size={14}
					class="text-[var(--color-success)]"
				/>{:else}<Copy size={14} />{/if}
		</button>
	</div>
</header>

<!-- Playground -->
<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div
				class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<div class="w-full max-w-[24rem]">
					<Input
						variant={pgVariant}
						label={pgLabel}
						placeholder={pgPlaceholder}
						bind:value={pgValue}
					/>
				</div>
			</div>

			<div class="flex flex-col divide-y divide-border/60">
				<div class="flex flex-col gap-2 px-6 py-4">
					<label
						for="pg-label"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Label</label
					>
					<input
						id="pg-label"
						bind:value={pgLabel}
						class="h-9 w-full max-w-[28rem] rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none transition-[border-color,box-shadow] focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>
				<div class="flex flex-col gap-2 px-6 py-4">
					<label
						for="pg-placeholder"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Placeholder</label
					>
					<input
						id="pg-placeholder"
						bind:value={pgPlaceholder}
						class="h-9 w-full max-w-[28rem] rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none transition-[border-color,box-shadow] focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>

				<div class="flex flex-col gap-2 px-6 py-4">
					<span
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Variant</span
					>
					<div class="flex flex-wrap gap-1.5">
						{#each variantList as v (v.value)}
							<button
								type="button"
								onclick={() => (pgVariant = v.value)}
								class={`rounded-full border px-2.5 py-1 text-[0.74rem] transition-colors ${pgVariant === v.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground-muted hover:border-border-strong'}`}
								>{v.label}</button
							>
						{/each}
					</div>
				</div>
			</div>

			<div
				class="flex items-center justify-between gap-2 border-t border-border/70 bg-secondary/40 px-6 py-2.5"
			>
				<span
					class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Snippet</span
				>
				<button
					type="button"
					onclick={() => copy(playgroundCode, 'playground')}
					class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[0.72rem] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
				>
					{#if copiedSnippet === 'playground'}<Check
							size={11}
							class="text-[var(--color-success)]"
						/>Copied{:else}<Copy size={11} />Copy code{/if}
				</button>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(playgroundCode, 'svelte')}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<!-- VARIANTS -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"
					><Layers size={12} /></span
				>
				<h2
					class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					Variants
				</h2>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
			{#each variantList as v (v.value)}
				<div
					class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
				>
					<Input variant={v.value} label={v.label} placeholder="Placeholder text" />
					<p class="m-0 text-[0.74rem] leading-snug text-foreground-muted">{v.use}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- API -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"
				><Hash size={12} /></span
			>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				API
			</h2>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row, i (i)}
					<li class="grid grid-cols-[1fr_1.6fr_0.5fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<code
							class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]"
							>{row.prop}</code
						>
						<div class="flex flex-col gap-1">
							<code
								class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground"
								>{row.type}</code
							>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">{row.description}</p>
						</div>
						<div class="md:text-right">
							<code
								class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem]"
								>{row.default}</code
							>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section
		class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
	>
		<div class="flex flex-col gap-1">
			<p
				class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Want to make it yours?
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Every Silk component reads from your theme tokens — open the studio to restyle them.
			</p>
		</div>
		<Button href="/themes/studio">Open theme studio<ArrowRight size={14} /></Button>
	</section>
</div>

{#if curIndex !== -1}
	<div
		class="mt-12 flex w-full items-center"
		class:justify-between={prevComponent && nextComponent}
		class:justify-end={!prevComponent && nextComponent}
		class:justify-start={prevComponent && !nextComponent}
	>
		{#if prevComponent}<Button
				href={`/docs/components/${prevComponent}`}
				variant="outline"
				class="flex-shrink-0"><ChevronLeft size={16} />{sanitizeComponent(prevComponent)}</Button
			>{/if}
		{#if prevComponent && nextComponent}<div class="mx-4 w-full rounded-lg border-t"></div>{/if}
		{#if nextComponent}<Button
				href={`/docs/components/${nextComponent}`}
				variant="outline"
				class="flex-shrink-0">{sanitizeComponent(nextComponent)}<ChevronRight size={16} /></Button
			>{/if}
	</div>
{/if}

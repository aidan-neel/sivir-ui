<script lang="ts">
	import { Button } from '$lib/silk/components/button';
	import { Badge } from '$lib/silk/components/badge';
	import { highlight } from '$lib/highlight';
	import * as Combobox from '$lib/silk/components/combobox';
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
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

	const TITLE = 'Combobox';
	const SLUG = 'combobox';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/combobox';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	let selected = $state('next');
	const frameworks = [
		{ value: 'next', label: 'Next.js' },
		{ value: 'sveltekit', label: 'SvelteKit' },
		{ value: 'nuxt', label: 'Nuxt' },
		{ value: 'remix', label: 'Remix' },
		{ value: 'astro', label: 'Astro' },
		{ value: 'solidstart', label: 'SolidStart' },
		{ value: 'qwik', label: 'Qwik City' }
	];

	const apiRows = [
		{ component: 'Root', prop: 'children', type: 'Snippet', default: '—', description: 'Context provider for trigger + content.' },
		{ component: 'Trigger', prop: '…ButtonProps', type: '—', default: '—', description: 'Renders as a Button.' },
		{ component: 'Content', prop: 'children', type: 'Snippet', default: '—', description: 'Floating popover containing search + results.' },
		{ component: 'Search', prop: 'placeholder', type: 'string', default: '"Search…"', description: 'Filter input.' },
		{ component: 'Search', prop: 'threshold', type: 'number', default: '0.4', description: 'Fuzzy-match tolerance (0–1, higher = stricter).' },
		{ component: 'Results', prop: 'children', type: 'Snippet', default: '—', description: 'Scrollable list region.' },
		{ component: 'Label', prop: 'children', type: 'Snippet', default: '—', description: 'Section heading inside Results.' },
		{ component: 'Item', prop: 'value', type: 'string', default: '—', description: 'Internal value passed to callbacks.' },
		{ component: 'Item', prop: 'label', type: 'string', default: '—', description: 'Display string + fuzzy-search target.' },
		{ component: 'Item', prop: 'callback', type: '() => void', default: '—', description: 'Activated on click / Enter.' }
	];

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add combobox';

	const selectedFramework = $derived(frameworks.find((f) => f.value === selected) ?? frameworks[0]);
</script>

<svelte:head>
	<title>Silk · Combobox</title>
	<meta name="description" content="Searchable select for picking one item from a long list." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
		<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">Fuzzy search</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1 class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] leading-[1] tracking-[-0.035em] md:text-[3rem]" style="font-family: var(--font-header);">Combobox</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			A searchable Select. Pick this when the list of options is too long to scroll — typing to
			filter is always faster than scanning.
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

<!-- Preview -->
<section class="pt-10">
	<div class="relative">
		<div class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"></div>
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]">
			<div class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8">
				<Combobox.Root>
					<Combobox.Trigger variant="outlined" class="h-9 w-60 gap-2 px-3 text-[0.82rem]">
						{selectedFramework.label}
					</Combobox.Trigger>
					<Combobox.Content>
						<Combobox.Search placeholder="Search frameworks…" />
						<Combobox.Results>
							{#each frameworks as fw}
								<Combobox.Item value={fw.value} label={fw.label} callback={() => (selected = fw.value)}>
									{fw.label}
								</Combobox.Item>
							{/each}
						</Combobox.Results>
					</Combobox.Content>
				</Combobox.Root>
			</div>
			<pre class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(`<Combobox.Root>
  <Combobox.Trigger>{label}</Combobox.Trigger>
  <Combobox.Content>
    <Combobox.Search placeholder="Search frameworks…" />
    <Combobox.Results>
      {#each frameworks as fw}
        <Combobox.Item value={fw.value} label={fw.label}
          callback={() => (selected = fw.value)}>
          {fw.label}
        </Combobox.Item>
      {/each}
    </Combobox.Results>
  </Combobox.Content>
</Combobox.Root>`, "svelte")}</code></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
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
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted">Combobox.{row.component}</code>
							<code class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)]">{row.prop}</code>
						</div>
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

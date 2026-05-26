<script lang="ts">
	import { Button } from '$lib/silk/components/button';
	import { Badge } from '$lib/silk/components/badge';
	import { Marquee } from '$lib/silk/components/marquee';
	import { highlight } from '$lib/highlight';
	import { components, sanitizeComponent } from '$lib/components';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';

	const TITLE = 'Marquee';
	const SLUG = 'marquee';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const curIndex = components.indexOf(SLUG);
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{ prop: 'direction', type: '"left" | "right"', default: '"left"', description: 'Travel direction along the axis.' },
		{ prop: 'duration', type: 'string', default: '"40s"', description: 'CSS duration for one full loop.' },
		{ prop: 'gap', type: 'string', default: '"2rem"', description: 'Space between items.' },
		{ prop: 'pauseOnHover', type: 'boolean', default: 'false', description: 'Freeze the animation while the cursor is over the marquee.' },
		{ prop: 'vertical', type: 'boolean', default: 'false', description: 'Flip to vertical scroll.' },
		{ prop: 'repeat', type: 'number', default: '2', description: 'Number of times to duplicate the children for a seamless loop.' }
	];

	const logos = ['Linear', 'Vercel', 'Anthropic', 'Cursor', 'Raycast', 'Tailwind', 'GitHub', 'Notion'];

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => { if (copiedSnippet === key) copiedSnippet = null; }, 1600);
	}
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;
</script>

<svelte:head><title>Silk · {TITLE}</title><meta name="description" content="A scrolling row of content that loops seamlessly." /></svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">Magic UI inspiration</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">View source<External size={11} /></a>
	</div>
	<div class="flex flex-col gap-3">
		<h1 class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] leading-[1] tracking-[-0.035em] md:text-[3rem]" style="font-family: var(--font-header);">{TITLE}</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">A CSS-only infinite scroll. Pure transforms, no JavaScript timeline — pauses on hover when you want it to.</p>
	</div>
	<div class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5"><span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"><Hash size={12} /></span><code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code></div>
		<button type="button" onclick={() => copy(installCommand, 'install')} class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground" aria-label="Copy install command">{#if copiedSnippet === 'install'}<Check size={14} class="text-[var(--color-success)]" />{:else}<Copy size={14} />{/if}</button>
	</div>
</header>

<section class="pt-10">
	<div class="relative">
		<div class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"></div>
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]">
			<div class="relative flex min-h-[10rem] items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)]">
				<Marquee pauseOnHover duration="28s" class="py-8">
					{#each logos as logo}
						<span class="rounded-[var(--radius-md)] border border-border bg-card px-4 py-2 text-[0.86rem] [font-weight:var(--font-weight-label,500)] text-foreground">{logo}</span>
					{/each}
				</Marquee>
				<div class="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-card to-transparent"></div>
				<div class="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-card to-transparent"></div>
			</div>
			<pre class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(`<Marquee pauseOnHover duration="28s">
  {#each logos as logo}
    <Badge>{logo}</Badge>
  {/each}
</Marquee>`, 'svelte')}</code></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex items-center gap-2"><span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"><Hash size={12} /></span><h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">API</h2></div>
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row}
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1"><code class="font-mono text-[0.7rem] text-foreground-muted">{TITLE}</code><code class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)]">{row.prop}</code></div>
						<div class="flex flex-col gap-1"><code class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground">{row.type}</code><p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">{row.description}</p></div>
						<div class="md:text-right"><code class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem]">{row.default}</code></div>
					</li>
				{/each}
			</ul>
		</div>
	</section>
	<section class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center">
		<div class="flex flex-col gap-1"><p class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">Want to make it yours?</p><p class="m-0 text-[0.86rem] text-foreground-muted">Every Silk component reads from your theme tokens — open the studio to restyle them.</p></div>
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

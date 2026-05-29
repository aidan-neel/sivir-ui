<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import * as Breadcrumb from '@silk/ui/components/breadcrumb';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import Slash from '@lucide/svelte/icons/slash';
	import Home from '@lucide/svelte/icons/home';

	const TITLE = 'Breadcrumb';
	const SLUG = 'breadcrumb';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/breadcrumb';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{ component: 'Root', prop: 'children', type: 'Snippet', default: '--', description: 'Container -- flexes Items + Separators inline.' },
		{ component: 'Item', prop: 'href', type: 'string', default: '--', description: 'Renders as a link. Omit to render the current page (no link, dimmer text).' },
		{ component: 'Item', prop: 'children', type: 'Snippet', default: '--', description: 'Label.' },
		{ component: 'Separator', prop: 'children', type: 'Snippet', default: '"/"', description: 'Custom separator (swap for an icon like ChevronRight or Slash).' }
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

	const installCommand = 'bunx @aidan-neel/ui add breadcrumb';
</script>

<svelte:head>
	<title>Silk · Breadcrumb</title>
	<meta name="description" content="A trail of links showing the user's position in a hierarchy." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
		<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">3 sub-components</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1 class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1] tracking-[-0.035em] md:text-[3rem]" style="font-family: var(--font-header);">
			Breadcrumb
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			Shows where the user is in a nested hierarchy and lets them jump back up. Keep them short
			— if you need more than five items, your hierarchy is probably the problem.
		</p>
	</div>

	<div class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted">
				<Hash size={12} />
			</span>
			<code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code>
		</div>
		<button
			type="button"
			onclick={() => copy(installCommand, 'install')}
			class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
			aria-label="Copy install command"
		>
			{#if copiedSnippet === 'install'}
				<Check size={14} class="text-[var(--color-success)]" />
			{:else}
				<Copy size={14} />
			{/if}
		</button>
	</div>
</header>

<!-- Playground / preview -->
<section class="pt-10">
	<div class="relative">
		<div class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"></div>
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]">
			<div class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8">
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/docs/introduction">Docs</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
					<Breadcrumb.Item href="/docs/components">Components</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
			<pre class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(`<Breadcrumb.Root>
  <Breadcrumb.Item href="/docs/introduction">Docs</Breadcrumb.Item>
  <Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
  <Breadcrumb.Item href="/docs/components">Components</Breadcrumb.Item>
  <Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
  <Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
</Breadcrumb.Root>`, "svelte")}</code></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<!-- SEPARATORS -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Slash size={12} />
				</span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight" style="font-family: var(--font-header);">
					Separators
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Three common choices. Pick one and use it everywhere — mixing separators in the same app
				looks accidental.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<div class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
				<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted">Chevron</span>
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Page</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
			<div class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
				<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted">Slash</span>
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Separator><Slash size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Page</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
			<div class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
				<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted">Dot</span>
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Separator><span class="text-[1rem] leading-none">·</span></Breadcrumb.Separator>
					<Breadcrumb.Item>Page</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
		</div>
	</section>

	<!-- WITH ICON -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Home size={12} />
				</span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight" style="font-family: var(--font-header);">
					With a home icon
				</h2>
			</div>
		</div>

		<div class="grid gap-3 md:grid-cols-2">
			<div class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-6">
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/">
						<Home size={13} />
					</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Components</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
			<pre class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Breadcrumb.Root>
  <Breadcrumb.Item href="/">
    <Home size={13} />
  </Breadcrumb.Item>
  <Breadcrumb.Separator>
    <ChevronRight size={12} />
  </Breadcrumb.Separator>
  <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
  <Breadcrumb.Separator>
    <ChevronRight size={12} />
  </Breadcrumb.Separator>
  <Breadcrumb.Item>Components</Breadcrumb.Item>
</Breadcrumb.Root>`, "svelte")}</code></pre>
		</div>
	</section>

	<!-- API -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Hash size={12} />
				</span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight" style="font-family: var(--font-header);">
					API
				</h2>
			</div>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row}
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted">Breadcrumb.{row.component}</code>
							<code class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]">{row.prop}</code>
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
			<p class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight" style="font-family: var(--font-header);">Want to make it yours?</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">Every Silk component reads from your theme tokens — open the studio to restyle them.</p>
		</div>
		<Button href="/themes/studio">Open theme studio<ArrowRight size={14} /></Button>
	</section>
</div>

{#if curIndex !== -1}
	<div class="mt-12 flex w-full items-center" class:justify-between={prevComponent && nextComponent} class:justify-end={!prevComponent && nextComponent} class:justify-start={prevComponent && !nextComponent}>
		{#if prevComponent}
			<Button href={`/docs/components/${prevComponent}`} variant="outlined" class="flex-shrink-0">
				<ChevronLeft size={16} />
				{sanitizeComponent(prevComponent)}
			</Button>
		{/if}
		{#if prevComponent && nextComponent}
			<div class="mx-4 w-full rounded-lg border-t"></div>
		{/if}
		{#if nextComponent}
			<Button href={`/docs/components/${nextComponent}`} variant="outlined" class="flex-shrink-0">
				{sanitizeComponent(nextComponent)}
				<ChevronRight size={16} />
			</Button>
		{/if}
	</div>
{/if}

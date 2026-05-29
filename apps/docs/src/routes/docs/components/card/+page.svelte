<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import * as Card from '@silk/ui/components/card';
	import * as Tabs from '@silk/ui/components/tabs';
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
	import Sparkles from '@lucide/svelte/icons/sparkles';

	const TITLE = 'Card';
	const SLUG = 'card';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/card';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{ component: 'Root', prop: 'class', type: 'string', default: '--', description: 'Container -- rounded surface with border + shadow.' },
		{ component: 'Header', prop: 'children', type: 'Snippet', default: '--', description: 'Top section. Hosts Title + Description.' },
		{ component: 'Title', prop: 'children', type: 'Snippet', default: '--', description: 'Short headline. Uses your `--font-header` token.' },
		{ component: 'Description', prop: 'children', type: 'Snippet', default: '--', description: 'Sub-headline. Foreground-muted.' },
		{ component: 'Content', prop: 'children', type: 'Snippet', default: '--', description: 'Main body. Adds the appropriate inner padding.' },
		{ component: 'Footer', prop: 'children', type: 'Snippet', default: '--', description: 'Action row. Right-align CTAs.' }
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

	const installCommand = 'bunx @aidan-neel/ui add card';
</script>

<svelte:head>
	<title>Silk · Card</title>
	<meta name="description" content="Surface container for grouping related content." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
		<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">6 sub-components</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1 class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1] tracking-[-0.035em] md:text-[3rem]" style="font-family: var(--font-header);">
			Card
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			The universal grouping surface. Use it for stat cards, dashboard tiles, settings sections,
			anything that needs to feel like its own thing.
		</p>
	</div>

	<div class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"><Hash size={12} /></span>
			<code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code>
		</div>
		<button
			type="button"
			onclick={() => copy(installCommand, 'install')}
			class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
			aria-label="Copy install command"
		>
			{#if copiedSnippet === 'install'}<Check size={14} class="text-[var(--color-success)]" />{:else}<Copy size={14} />{/if}
		</button>
	</div>
</header>

<!-- Preview -->
<section class="pt-10">
	<div class="relative">
		<div class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"></div>
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]">
			<div class="grid min-h-[14rem] place-items-center bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8">
				<Card.Root class="w-full max-w-[24rem]">
					<Card.Header>
						<Card.Title>Account settings</Card.Title>
						<Card.Description>Manage how your workspace handles invites and seats.</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
							Currently on the Team plan. 12 of 25 seats used.
						</p>
					</Card.Content>
					<Card.Footer>
						<Button variant="outlined" size="sm">Cancel</Button>
						<Button size="sm">Save changes</Button>
					</Card.Footer>
				</Card.Root>
			</div>
			<pre class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(`<Card.Root>
  <Card.Header>
    <Card.Title>Account settings</Card.Title>
    <Card.Description>Manage how your workspace…</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Currently on the Team plan. 12 of 25 seats used.</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="outlined" size="sm">Cancel</Button>
    <Button size="sm">Save changes</Button>
  </Card.Footer>
</Card.Root>`, "svelte")}</code></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<!-- COMPOSITIONS -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"><Layers size={12} /></span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight" style="font-family: var(--font-header);">Compositions</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Cards work best when you only include the pieces you need. Header-only, content-only, or fully composed — Silk doesn't enforce a structure.
			</p>
		</div>

		<Tabs.Root value="stat">
			<Tabs.List>
				<Tabs.Trigger value="stat">Stat card</Tabs.Trigger>
				<Tabs.Trigger value="empty">Empty state</Tabs.Trigger>
				<Tabs.Trigger value="form">Form section</Tabs.Trigger>
			</Tabs.List>

			<div class="mt-3 grid gap-3 md:grid-cols-2">
				<Tabs.Content value="stat" class="contents">
					<div class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-6">
						<Card.Root class="w-full">
							<Card.Header>
								<Card.Description>Monthly revenue</Card.Description>
								<Card.Title class="text-[2rem]">$48,210</Card.Title>
							</Card.Header>
							<Card.Footer>
								<span class="text-[0.78rem] text-[var(--color-success)]">+12% vs last month</span>
							</Card.Footer>
						</Card.Root>
					</div>
					<pre class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Card.Root>
  <Card.Header>
    <Card.Description>Monthly revenue</Card.Description>
    <Card.Title>$48,210</Card.Title>
  </Card.Header>
  <Card.Footer>
    <span>+12% vs last month</span>
  </Card.Footer>
</Card.Root>`, "svelte")}</code></pre>
				</Tabs.Content>

				<Tabs.Content value="empty" class="contents">
					<div class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-6">
						<Card.Root class="w-full">
							<Card.Content class="flex flex-col items-center gap-2 py-10 text-center">
								<Sparkles size={20} class="text-foreground-muted" />
								<p class="m-0 text-[0.94rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">No projects yet</p>
								<p class="m-0 text-[0.78rem] text-foreground-muted">Create your first project to see it here.</p>
								<Button size="sm" class="mt-2">New project</Button>
							</Card.Content>
						</Card.Root>
					</div>
					<pre class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Card.Root>
  <Card.Content class="flex flex-col items-center gap-2 py-10">
    <Sparkles size={20} />
    <p>No projects yet</p>
    <p>Create your first project to see it here.</p>
    <Button size="sm">New project</Button>
  </Card.Content>
</Card.Root>`, "svelte")}</code></pre>
				</Tabs.Content>

				<Tabs.Content value="form" class="contents">
					<div class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-6">
						<Card.Root class="w-full">
							<Card.Header>
								<Card.Title>Notifications</Card.Title>
								<Card.Description>Decide where and when we ping you.</Card.Description>
							</Card.Header>
							<Card.Content>
								<p class="m-0 text-[0.84rem] text-foreground-muted">…form fields here…</p>
							</Card.Content>
							<Card.Footer>
								<Button size="sm">Save</Button>
							</Card.Footer>
						</Card.Root>
					</div>
					<pre class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Card.Root>
  <Card.Header>
    <Card.Title>Notifications</Card.Title>
    <Card.Description>Decide where and when…</Card.Description>
  </Card.Header>
  <Card.Content>…form fields…</Card.Content>
  <Card.Footer>
    <Button size="sm">Save</Button>
  </Card.Footer>
</Card.Root>`, "svelte")}</code></pre>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	</section>

	<!-- API -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"><Hash size={12} /></span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight" style="font-family: var(--font-header);">API</h2>
			</div>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row}
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted">Card.{row.component}</code>
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
		{#if prevComponent}<Button href={`/docs/components/${prevComponent}`} variant="outlined" class="flex-shrink-0"><ChevronLeft size={16} />{sanitizeComponent(prevComponent)}</Button>{/if}
		{#if prevComponent && nextComponent}<div class="mx-4 w-full rounded-lg border-t"></div>{/if}
		{#if nextComponent}<Button href={`/docs/components/${nextComponent}`} variant="outlined" class="flex-shrink-0">{sanitizeComponent(nextComponent)}<ChevronRight size={16} /></Button>{/if}
	</div>
{/if}

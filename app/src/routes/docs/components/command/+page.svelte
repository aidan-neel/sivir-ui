<script lang="ts">
	import { Button } from '$lib/silk/components/button';
	import { Badge } from '$lib/silk/components/badge';
	import { highlight } from '$lib/highlight';
	import * as Command from '$lib/silk/components/command';
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
	import Search from '@lucide/svelte/icons/search';
	import Plus from '@lucide/svelte/icons/plus';
	import Settings from '@lucide/svelte/icons/settings';
	import Users from '@lucide/svelte/icons/users';
	import Palette from '@lucide/svelte/icons/palette';
	import LayoutTemplate from '@lucide/svelte/icons/layout-template';

	const TITLE = 'Command';
	const SLUG = 'command';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/command';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{ component: 'Root', prop: 'children', type: 'Snippet', default: '—', description: 'Context provider. Wraps trigger + content.' },
		{ component: 'Trigger', prop: '…ButtonProps', type: '—', default: '—', description: 'Renders as a Button. Opens the palette.' },
		{ component: 'Content', prop: 'children', type: 'Snippet', default: '—', description: 'Floating modal — portaled, focus-trapped, escape-aware.' },
		{ component: 'Search', prop: 'placeholder', type: 'string', default: '"Search…"', description: 'Search input. Filters Items by fuzzy-matched `name`.' },
		{ component: 'Results', prop: 'children', type: 'Snippet', default: '—', description: 'Scrollable list region.' },
		{ component: 'Group', prop: 'heading', type: 'string', default: '—', description: 'Adds a labelled section.' },
		{ component: 'Item', prop: 'name', type: 'string', default: '—', description: 'String used for fuzzy search (keep keywords here).' },
		{ component: 'Item', prop: 'callback', type: '() => void', default: '—', description: 'Fires on activation. Auto-closes the palette.' },
		{ component: 'Separator', prop: '—', type: '—', default: '—', description: 'Horizontal divider between groups.' }
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

	const installCommand = 'bunx @aidan-neel/ui add command';
</script>

<svelte:head>
	<title>Silk · Command</title>
	<meta name="description" content="Searchable command palette for keyboard-first navigation and actions." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
		<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">Keyboard-first</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">Fuzzy search</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1 class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] leading-[1] tracking-[-0.035em] md:text-[3rem]" style="font-family: var(--font-header);">Command</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			A `⌘K` command palette for jumping between pages, firing actions, or searching across your
			app. Items are matched by their `name` string — pack it with keywords your users will type.
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
				<Command.Root>
					<Command.Trigger variant="outlined" class="h-9 w-72 justify-between gap-2 px-3 text-[0.82rem]">
						<span class="flex items-center gap-2 text-foreground-muted">
							<Search size={13} />
							Search projects, actions, people…
						</span>
						<kbd class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.66rem] text-foreground-muted">⌘K</kbd>
					</Command.Trigger>
					<Command.Content>
						<Command.Search placeholder="Type a command or search…" />
						<Command.Results>
							<Command.Group heading="Quick actions">
								<Command.Item name="new project create" callback={() => {}}>
									<Plus class="text-foreground-muted" />
									<span>New project</span>
								</Command.Item>
								<Command.Item name="invite member team" callback={() => {}}>
									<Users class="text-foreground-muted" />
									<span>Invite member</span>
								</Command.Item>
								<Command.Item name="open settings preferences" callback={() => {}}>
									<Settings class="text-foreground-muted" />
									<span>Open settings</span>
								</Command.Item>
							</Command.Group>
							<Command.Separator />
							<Command.Group heading="Navigation">
								<Command.Item name="themes browse" callback={() => {}}>
									<LayoutTemplate class="text-foreground-muted" />
									<span>Browse themes</span>
								</Command.Item>
								<Command.Item name="theme studio editor" callback={() => {}}>
									<Palette class="text-foreground-muted" />
									<span>Open theme studio</span>
								</Command.Item>
							</Command.Group>
						</Command.Results>
					</Command.Content>
				</Command.Root>
			</div>
			<pre class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(`<Command.Root>
  <Command.Trigger>Search…</Command.Trigger>
  <Command.Content>
    <Command.Search placeholder="Type a command…" />
    <Command.Results>
      <Command.Group heading="Quick actions">
        <Command.Item name="new project" callback={() => goto('/new')}>
          <Plus /> New project
        </Command.Item>
      </Command.Group>
    </Command.Results>
  </Command.Content>
</Command.Root>`, "svelte")}</code></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<!-- USAGE -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"><Layers size={12} /></span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">Anatomy</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Eight pieces. The only required ones are Root, Trigger, Content, and Item — everything
				else exists to organize.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each ['Root', 'Trigger', 'Content', 'Search', 'Results', 'Group', 'Item', 'Separator'] as part}
				<div class="rounded-[var(--radius-md)] border border-border bg-card px-3 py-2 text-center">
					<code class="font-mono text-[0.78rem] text-foreground">Command.{part}</code>
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
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted">Command.{row.component}</code>
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

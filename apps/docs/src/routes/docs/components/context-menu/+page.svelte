<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import * as ContextMenu from '@silk/ui/components/context-menu';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import MousePointer from '@lucide/svelte/icons/mouse-pointer-2';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Image from '@lucide/svelte/icons/image';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Copy2 from '@lucide/svelte/icons/files';
	import Share from '@lucide/svelte/icons/share-2';
	import Trash from '@lucide/svelte/icons/trash-2';
	import Star from '@lucide/svelte/icons/star';
	import Tag from '@lucide/svelte/icons/tag';
	import Download from '@lucide/svelte/icons/download';
	import FolderOpen from '@lucide/svelte/icons/folder-open';
	import FileText from '@lucide/svelte/icons/file-text';

	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/context-menu';

	const curIndex = components.indexOf('context-menu');
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{
			component: 'Root',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Context provider.'
		},
		{
			component: 'Trigger',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'The area that opens the menu on right-click.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Floating surface -- positioned at the cursor.'
		},
		{
			component: 'Item',
			prop: 'callback',
			type: '() => void',
			default: '--',
			description: 'Use `callback`, not `onclick`.'
		},
		{
			component: 'CheckboxItem',
			prop: 'checked',
			type: 'boolean',
			default: 'false',
			description: 'Toggleable item with a check indicator.'
		},
		{
			component: 'Separator',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Horizontal divider.'
		},
		{
			component: 'Sub / SubTrigger / SubContent',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Nested submenu for grouped options.'
		}
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

	const installCommand = 'bunx @aidan-neel/ui add context-menu';
</script>

<svelte:head>
	<title>Silk · Context Menu</title>
	<meta name="description" content="A right-click menu of actions for the element underneath." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]"
				>Component</Badge
			>
			<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">Right-click</Badge>
		</div>
		<a
			href={SOURCE}
			target="_blank"
			rel="noreferrer noopener"
			class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
		>
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1] tracking-[-0.035em] md:text-[3rem]"
			style="font-family: var(--font-header);"
		>
			Context Menu
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			A right-click menu for actions that apply to whatever the user clicked on. Same item grammar
			as DropdownMenu — the only difference is what opens it.
		</p>
	</div>

	<div
		class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
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

<!-- Preview -->
<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div
				class="grid min-h-[14rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						<div
							class="flex h-32 w-72 cursor-default flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-border bg-card text-foreground-muted"
						>
							<MousePointer size={18} />
							<span class="text-[0.82rem]">Right-click anywhere here</span>
						</div>
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Item callback={() => {}}>Open</ContextMenu.Item>
						<ContextMenu.Item callback={() => {}}>Rename</ContextMenu.Item>
						<ContextMenu.Item callback={() => {}}>Duplicate</ContextMenu.Item>
						<ContextMenu.Separator />
						<ContextMenu.Item callback={() => {}}>Move to trash</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div class="card">Right-click me</div>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item callback={open}>Open</ContextMenu.Item>
    <ContextMenu.Item callback={rename}>Rename</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item callback={trash}>Move to trash</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<!-- More realistic examples -->
<section class="pt-12 flex flex-col gap-5">
	<div class="flex flex-col gap-1">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Sparkles size={12} />
			</span>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Real-world examples
			</h2>
		</div>
		<p class="m-0 text-[0.86rem] text-foreground-muted">
			Right-click any of these surfaces. Each one ships a different menu — that's the point.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
		<!-- File row -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
			<span
				class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
			>
				File row
			</span>
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<div
						class="flex items-center gap-3 rounded-[var(--radius-md)] border border-dashed border-border bg-secondary/30 px-3 py-3 cursor-default"
					>
						<FileText size={14} class="text-foreground-muted" />
						<div class="flex flex-col">
							<span
								class="text-[0.84rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
								>brand-guidelines.fig</span
							>
							<span class="text-[0.7rem] text-foreground-muted">Edited 2h ago · 4.2 MB</span>
						</div>
					</div>
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><FolderOpen size={13} /> Open</span>
					</ContextMenu.Item>
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><Pencil size={13} /> Rename</span>
					</ContextMenu.Item>
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><Copy2 size={13} /> Duplicate</span>
					</ContextMenu.Item>
					<ContextMenu.Separator />
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><Star size={13} /> Star</span>
					</ContextMenu.Item>
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><Tag size={13} /> Add label</span>
					</ContextMenu.Item>
					<ContextMenu.Separator />
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2 text-[var(--color-destructive)]"
							><Trash size={13} /> Move to trash</span
						>
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>
		</div>

		<!-- Image -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
			<span
				class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
			>
				Image
			</span>
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<div
						class="grid h-24 place-items-center rounded-[var(--radius-md)] border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_30%,transparent),color-mix(in_srgb,var(--color-info)_30%,transparent))] cursor-default"
					>
						<Image size={20} class="text-foreground" />
					</div>
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><Download size={13} /> Save image</span>
					</ContextMenu.Item>
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><Copy2 size={13} /> Copy image</span>
					</ContextMenu.Item>
					<ContextMenu.Item callback={() => {}}>Copy image address</ContextMenu.Item>
					<ContextMenu.Separator />
					<ContextMenu.Item callback={() => {}}>Open in new tab</ContextMenu.Item>
					<ContextMenu.Item callback={() => {}}>Inspect</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>
		</div>

		<!-- Task card -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
			<span
				class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
			>
				Task card
			</span>
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<div
						class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-3 cursor-default"
					>
						<div class="flex items-center justify-between gap-2">
							<span
								class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted"
								>SLK-482</span
							>
							<span
								class="inline-flex items-center gap-1 text-[0.66rem] text-[var(--color-warning)]"
							>
								<span class="size-1.5 rounded-full bg-[var(--color-warning)]"></span>
								In review
							</span>
						</div>
						<p
							class="m-0 text-[0.84rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-snug"
						>
							Refactor toolbar to share Button primitives
						</p>
					</div>
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item callback={() => {}}
						><span class="flex items-center gap-2"><Pencil size={13} /> Edit task</span
						></ContextMenu.Item
					>
					<ContextMenu.Item callback={() => {}}
						><span class="flex items-center gap-2"><Star size={13} /> Watch</span></ContextMenu.Item
					>
					<ContextMenu.Item callback={() => {}}
						><span class="flex items-center gap-2"><Share size={13} /> Share link</span
						></ContextMenu.Item
					>
					<ContextMenu.Separator />
					<ContextMenu.Item callback={() => {}}>Move to backlog</ContextMenu.Item>
					<ContextMenu.Item callback={() => {}}>Close as complete</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
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
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted"
								>ContextMenu.{row.component}</code
							>
							<code
								class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]"
								>{row.prop}</code
							>
						</div>
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
				variant="outlined"
				class="flex-shrink-0"><ChevronLeft size={16} />{sanitizeComponent(prevComponent)}</Button
			>{/if}
		{#if prevComponent && nextComponent}<div class="mx-4 w-full rounded-lg border-t"></div>{/if}
		{#if nextComponent}<Button
				href={`/docs/components/${nextComponent}`}
				variant="outlined"
				class="flex-shrink-0">{sanitizeComponent(nextComponent)}<ChevronRight size={16} /></Button
			>{/if}
	</div>
{/if}

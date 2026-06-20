<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { ComponentPreview, Steps } from '$lib/components/docs';
	import { highlight } from '$lib/highlight';
	import * as ContextMenu from '@silk/ui/components/context-menu';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import MousePointer from '@lucide/svelte/icons/mouse-pointer-2';
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

	const _TITLE = 'Context Menu';
	const SLUG = 'context-menu';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/context-menu';

	const curIndex = components.indexOf(SLUG);
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
	const heroCode = `<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div>Right-click me</div>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item callback={open}>Open</ContextMenu.Item>
    <ContextMenu.Item callback={rename}>Rename</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item callback={trash}>Move to trash</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`;
</script>

<svelte:head>
	<title>Silk · Context Menu</title>
	<meta
		name="description"
		content="A right-click menu for actions that apply to whatever the user clicked on. Same item grammar as DropdownMenu — the only difference is what opens it."
	/>
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
	<!-- ─── Header ────────────────────────────────────────────────── -->
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				Context Menu
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A right-click menu for actions that apply to whatever the user clicked on. Same item grammar
				as DropdownMenu — the only difference is what opens it.
			</p>
		</div>
	</header>

	<!-- ─── Hero Example ──────────────────────────────────────────── -->
	<section id="hero" class="scroll-mt-20 flex flex-col gap-4">
		<ComponentPreview code={heroCode}>
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
		</ComponentPreview>
	</section>

	<!-- ─── Installation ──────────────────────────────────────────── -->
	<section id="installation" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Installation
		</h2>
		<p class="text-sm text-foreground-muted">Install the Context Menu component with the CLI:</p>
		<Steps
			steps={[
				{
					title: 'Run the CLI',
					description: 'Copy the command below and run it in your terminal.'
				}
			]}
		>
			<div
				class="flex items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
			>
				<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
					<span
						class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"
					>
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
		</Steps>
	</section>

	<!-- ─── Usage ─────────────────────────────────────────────────── -->
	<section id="usage" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Usage
		</h2>
		<p class="text-sm text-foreground-muted">
			Import and compose with Root, Trigger, Content, and Item:
		</p>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 rounded-[var(--radius-md)] border border-border px-4 py-3 font-mono text-[0.85rem] leading-relaxed text-foreground"><code
				>{@html highlight(
					`import * as ContextMenu from '@silk/ui/components/context-menu';\n\n<ContextMenu.Root>\n  <ContextMenu.Trigger>\n    <div>Right-click me</div>\n  </ContextMenu.Trigger>\n  <ContextMenu.Content>\n    <ContextMenu.Item callback={handleAction}>Action</ContextMenu.Item>\n  </ContextMenu.Content>\n</ContextMenu.Root>`,
					'svelte'
				)}</code
			></pre>
	</section>

	<!-- ─── Examples ──────────────────────────────────────────────── -->
	<section id="examples" class="scroll-mt-20 flex flex-col gap-10">
		<div>
			<h2
				class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
			>
				Examples
			</h2>
			<p class="mt-2 text-sm text-foreground-muted">
				Right-click each surface below. Each one ships a different context menu.
			</p>
		</div>

		<!-- File row -->
		<div id="file-row" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				File row
			</h3>
			<ComponentPreview
				code={`<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div class="flex items-center gap-3 rounded px-3 py-3 border border-dashed">
      <FileText size={14} />
      <div>
        <span>brand-guidelines.fig</span>
        <span class="text-sm text-muted">Edited 2h ago · 4.2 MB</span>
      </div>
    </div>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item callback={open}>
      <span class="flex items-center gap-2"><FolderOpen size={13} /> Open</span>
    </ContextMenu.Item>
    <ContextMenu.Item callback={rename}>
      <span class="flex items-center gap-2"><Pencil size={13} /> Rename</span>
    </ContextMenu.Item>
    <ContextMenu.Item callback={duplicate}>
      <span class="flex items-center gap-2"><Copy2 size={13} /> Duplicate</span>
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item callback={star}>
      <span class="flex items-center gap-2"><Star size={13} /> Star</span>
    </ContextMenu.Item>
    <ContextMenu.Item callback={label}>
      <span class="flex items-center gap-2"><Tag size={13} /> Add label</span>
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item callback={trash}>
      <span class="flex items-center gap-2 text-destructive"><Trash size={13} /> Move to trash</span>
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`}
			>
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						<div
							class="flex items-center gap-3 rounded-[var(--radius-md)] border border-dashed border-border bg-secondary/30 px-3 py-3 cursor-default"
						>
							<FileText size={14} class="text-foreground-muted" />
							<div class="flex flex-col">
								<span class="text-[0.84rem] font-[var(--font-weight-label,500)]"
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
			</ComponentPreview>
		</div>

		<!-- Image -->
		<div id="image" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Image
			</h3>
			<ComponentPreview
				code={`<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div class="grid h-24 place-items-center rounded border">
      <Image size={20} />
    </div>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item callback={save}>
      <span class="flex items-center gap-2"><Download size={13} /> Save image</span>
    </ContextMenu.Item>
    <ContextMenu.Item callback={copy}>
      <span class="flex items-center gap-2"><Copy2 size={13} /> Copy image</span>
    </ContextMenu.Item>
    <ContextMenu.Item callback={copyAddr}>Copy image address</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item callback={openNew}>Open in new tab</ContextMenu.Item>
    <ContextMenu.Item callback={inspect}>Inspect</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`}
			>
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
			</ComponentPreview>
		</div>

		<!-- Task card -->
		<div id="task-card" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Task card
			</h3>
			<ComponentPreview
				code={`<ContextMenu.Root>
  <ContextMenu.Trigger>
    <div class="flex flex-col gap-2 rounded border p-3">
      <div class="flex items-center justify-between">
        <span class="text-xs uppercase text-muted">SLK-482</span>
        <span class="text-xs text-warning">In review</span>
      </div>
      <p>Refactor toolbar to share Button primitives</p>
    </div>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item callback={edit}>
      <span class="flex items-center gap-2"><Pencil size={13} /> Edit task</span>
    </ContextMenu.Item>
    <ContextMenu.Item callback={watch}>
      <span class="flex items-center gap-2"><Star size={13} /> Watch</span>
    </ContextMenu.Item>
    <ContextMenu.Item callback={share}>
      <span class="flex items-center gap-2"><Share size={13} /> Share link</span>
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item callback={backlog}>Move to backlog</ContextMenu.Item>
    <ContextMenu.Item callback={close}>Close as complete</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`}
			>
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						<div
							class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-3 cursor-default"
						>
							<div class="flex items-center justify-between gap-2">
								<span
									class="text-[0.7rem] font-[var(--font-weight-label,500)] uppercase text-foreground-muted"
									>SLK-482</span
								>
								<span
									class="inline-flex items-center gap-1 text-[0.66rem] text-[var(--color-warning)]"
								>
									<span class="size-1.5 rounded-full bg-[var(--color-warning)]"></span>
									In review
								</span>
							</div>
							<p class="m-0 text-[0.84rem] font-[var(--font-weight-label,500)] leading-snug">
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
							><span class="flex items-center gap-2"><Star size={13} /> Watch</span
							></ContextMenu.Item
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
			</ComponentPreview>
		</div>
	</section>

	<!-- ─── API Reference ─────────────────────────────────────────── -->
	<section id="api" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			API Reference
		</h2>
		<p class="text-sm text-foreground-muted">
			Compose with Root, Trigger, Content, Item, CheckboxItem, Separator, and Sub components.
		</p>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<div
				class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 border-b border-border bg-secondary/40 px-4 py-2.5 text-[0.7rem] font-[var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted max-md:hidden"
			>
				<span>Prop</span>
				<span>Type</span>
				<span class="text-right">Default</span>
			</div>
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row, i (i)}
					<li class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex items-center gap-2">
							<button
								type="button"
								onclick={() => copy(`ContextMenu.${row.component}`, `prop-${row.component}`)}
								class="group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-secondary/60"
							>
								<code
									class="font-mono text-[0.82rem] font-[var(--font-weight-label,600)] text-foreground"
								>
									ContextMenu.{row.component}
								</code>
								{#if copiedSnippet === `prop-${row.component}`}
									<Check size={11} class="text-[var(--color-success)]" />
								{:else}
									<Copy
										size={11}
										class="text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100"
									/>
								{/if}
							</button>
						</div>
						<div class="flex flex-col gap-1">
							<code
								class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground"
							>
								{row.type}
							</code>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">
								{row.description}
							</p>
						</div>
						<div class="md:text-right">
							<code
								class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem] text-foreground"
							>
								{row.default}
							</code>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- ─── Footer ────────────────────────────────────────────────── -->
	<section
		class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
	>
		<div class="flex flex-col gap-1">
			<p
				class="m-0 text-[1rem] font-[var(--font-weight-label,500)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Want to make it yours?
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Every Silk component reads from your theme tokens — open the studio to restyle them.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Button variant="outline" href={SOURCE}>
				<svg viewBox="0 0 24 24" aria-hidden="true" class="size-3.5 fill-current">
					<path
						d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.79 1.06.79 2.14v3.17c0 .31.21.66.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"
					/>
				</svg>
				View source
				<External size={11} class="text-foreground-muted" />
			</Button>
			<Button href="/themes/studio">
				Open studio
				<ArrowRight size={14} />
			</Button>
		</div>
	</section>

	<!-- ─── Prev / Next ───────────────────────────────────────────── -->
	{#if curIndex !== -1}
		<nav
			class="mt-12 flex w-full items-center"
			class:justify-between={prevComponent && nextComponent}
			class:justify-end={!prevComponent && nextComponent}
			class:justify-start={prevComponent && !nextComponent}
		>
			{#if prevComponent}
				<Button href={`/docs/components/${prevComponent}`} variant="outline" class="flex-shrink-0">
					<ChevronLeft size={16} />
					{sanitizeComponent(prevComponent)}
				</Button>
			{/if}
			{#if prevComponent && nextComponent}
				<div class="mx-4 w-full rounded-lg border-t border-border"></div>
			{/if}
			{#if nextComponent}
				<Button href={`/docs/components/${nextComponent}`} variant="outline" class="flex-shrink-0">
					{sanitizeComponent(nextComponent)}
					<ChevronRight size={16} />
				</Button>
			{/if}
		</nav>
	{/if}
</div>

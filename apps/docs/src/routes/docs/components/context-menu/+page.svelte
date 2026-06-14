<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as ContextMenu from '@silk/ui/components/context-menu';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
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

	const TITLE = 'Context Menu';
	const SLUG = 'context-menu';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

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
</script>

<svelte:head>
	<title>Silk · Context Menu</title>
	<meta name="description" content="A right-click menu of actions for the element underneath." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A right-click menu for actions that apply to whatever the user clicked on. Same item grammar as DropdownMenu — the only difference is what opens it."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Right-click' }]}
/>

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

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={Sparkles}
		title="Real-world examples"
		description="Right-click any of these surfaces. Each one ships a different menu — that's the point."
	>
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
			</div>
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="ContextMenu" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

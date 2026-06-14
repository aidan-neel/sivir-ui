<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as Command from '@silk/ui/components/command';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Layers from '@lucide/svelte/icons/layers-3';
	import Hash from '@lucide/svelte/icons/hash';
	import Search from '@lucide/svelte/icons/search';
	import Plus from '@lucide/svelte/icons/plus';
	import Settings from '@lucide/svelte/icons/settings';
	import Users from '@lucide/svelte/icons/users';
	import Palette from '@lucide/svelte/icons/palette';
	import LayoutTemplate from '@lucide/svelte/icons/layout-template';

	const TITLE = 'Command';
	const SLUG = 'command';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Context provider. Wraps trigger + content.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders as a Button. Opens the palette.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Floating modal -- portaled, focus-trapped, escape-aware.'
		},
		{
			component: 'Search',
			prop: 'placeholder',
			type: 'string',
			default: '"Search..."',
			description: 'Search input. Filters Items by fuzzy-matched `name`.'
		},
		{
			component: 'Results',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Scrollable list region.'
		},
		{
			component: 'Group',
			prop: 'heading',
			type: 'string',
			default: '--',
			description: 'Adds a labelled section.'
		},
		{
			component: 'Item',
			prop: 'name',
			type: 'string',
			default: '--',
			description: 'String used for fuzzy search (keep keywords here).'
		},
		{
			component: 'Item',
			prop: 'callback',
			type: '() => void',
			default: '--',
			description: 'Fires on activation. Auto-closes the palette.'
		},
		{
			component: 'Separator',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Horizontal divider between groups.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Command</title>
	<meta
		name="description"
		content="Searchable command palette for keyboard-first navigation and actions."
	/>
</svelte:head>

<DocHeader
	title={TITLE}
	description="A `⌘K` command palette for jumping between pages, firing actions, or searching across your app. Items are matched by their `name` string — pack it with keywords your users will type."
	source={SOURCE}
	install={installCommand}
	pills={[
		{ label: 'v0.4.2', variant: 'outlined' },
		{ label: 'Keyboard-first' },
		{ label: 'Fuzzy search' }
	]}
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
				class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Command.Root>
					<Command.Trigger
						variant="outlined"
						class="h-9 w-72 justify-between gap-2 px-3 text-[0.82rem]"
					>
						<span class="flex items-center gap-2 text-foreground-muted">
							<Search size={13} />
							Search projects, actions, people…
						</span>
						<kbd
							class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.66rem] text-foreground-muted"
							>⌘K</kbd
						>
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
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Command.Root>
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
</Command.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={Layers}
		title="Anatomy"
		description="Eight pieces. The only required ones are Root, Trigger, Content, and Item — everything else exists to organize."
	>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each ['Root', 'Trigger', 'Content', 'Search', 'Results', 'Group', 'Item', 'Separator'] as part}
				<div class="rounded-[var(--radius-md)] border border-border bg-card px-3 py-2 text-center">
					<code class="font-mono text-[0.78rem] text-foreground">Command.{part}</code>
				</div>
			{/each}
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Command" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

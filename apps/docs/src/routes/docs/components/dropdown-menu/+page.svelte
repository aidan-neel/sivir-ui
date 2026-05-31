<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import * as DropdownMenu from '@silk/ui/components/dropdown-menu';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import User from '@lucide/svelte/icons/user';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import MoreHorizontal from '@lucide/svelte/icons/ellipsis';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Copy2 from '@lucide/svelte/icons/files';
	import Trash from '@lucide/svelte/icons/trash-2';
	import Send from '@lucide/svelte/icons/send';
	import Archive from '@lucide/svelte/icons/archive';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Star from '@lucide/svelte/icons/star';
	import LifeBuoy from '@lucide/svelte/icons/life-buoy';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/dropdown-menu';

	const curIndex = components.indexOf('dropdown-menu');
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{
			component: 'Root',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Context wrapper.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders a Button. Click opens the menu.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Floating menu surface.'
		},
		{
			component: 'Label',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Non-interactive group header.'
		},
		{
			component: 'Item',
			prop: 'callback',
			type: '() => void',
			default: '--',
			description: 'Use `callback`, not `onclick` -- the menu uses its own click handler.'
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
			description: 'Nested submenu -- opens on hover/click on the trigger.'
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

	const installCommand = 'bunx @aidan-neel/ui add dropdown-menu';
</script>

<svelte:head>
	<title>Silk · Dropdown Menu</title>
	<meta name="description" content="A floating menu of actions, anchored to a trigger." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]"
				>Component</Badge
			>
			<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">Nestable</Badge>
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
			Dropdown Menu
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			A list of actions anchored to a button. Use it for user menus, row-level actions, and anywhere
			a `…` button needs to do more than one thing.
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
				class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<DropdownMenu.Root class="" value="">
					<DropdownMenu.Trigger variant="outlined" class="h-9 gap-2 text-[0.82rem]">
						<span
							class="inline-flex size-6 items-center justify-center rounded-full bg-primary/15 text-[0.66rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-primary"
							>AN</span
						>
						<span>Aidan Neel</span>
						<ChevronDown size={12} class="text-foreground-muted" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="min-w-[16rem]">
						<DropdownMenu.Label class="">
							<span class="text-[0.7rem] text-foreground-muted">aidan@silk-ui.dev</span>
						</DropdownMenu.Label>
						<DropdownMenu.Item class="">
							<span class="flex items-center gap-2"><User size={13} /> Profile</span>
							<kbd
								class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
								>⇧⌘P</kbd
							>
						</DropdownMenu.Item>
						<DropdownMenu.Item class="">
							<span class="flex items-center gap-2"><CreditCard size={13} /> Billing</span>
							<kbd
								class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
								>⌘B</kbd
							>
						</DropdownMenu.Item>
						<DropdownMenu.Item class="">
							<span class="flex items-center gap-2"><Settings size={13} /> Settings</span>
							<kbd
								class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
								>⌘,</kbd
							>
						</DropdownMenu.Item>
						<DropdownMenu.Separator class=""></DropdownMenu.Separator>
						<DropdownMenu.Item class="">
							<span class="flex items-center gap-2"><LifeBuoy size={13} /> Help & feedback</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item class="">
							<span class="flex items-center gap-2 text-[var(--color-destructive)]"
								><LogOut size={13} /> Sign out</span
							>
							<kbd
								class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
								>⇧⌘Q</kbd
							>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Avatar fallback="AN" />
    Aidan Neel
    <ChevronDown size={12} />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="min-w-[16rem]">
    <DropdownMenu.Label>
      <span class="text-foreground-muted">aidan@silk-ui.dev</span>
    </DropdownMenu.Label>
    <DropdownMenu.Item callback={openProfile}>
      <span><User /> Profile</span>
      <kbd>⇧⌘P</kbd>
    </DropdownMenu.Item>
    <DropdownMenu.Item callback={openBilling}>
      <span><CreditCard /> Billing</span>
      <kbd>⌘B</kbd>
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item callback={signOut}>
      <span class="text-destructive"><LogOut /> Sign out</span>
      <kbd>⇧⌘Q</kbd>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>`,
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
			Three patterns from real product surfaces.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
		<!-- Row actions -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
			<div class="flex flex-col gap-1">
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
				>
					Row actions
				</span>
				<p class="m-0 text-[0.84rem] text-foreground-muted">The `…` button on a list item.</p>
			</div>
			<div class="grid place-items-center pt-4">
				<DropdownMenu.Root class="" value="">
					<DropdownMenu.Trigger variant="ghost" size="icon" class="size-8" aria-label="Row actions">
						<MoreHorizontal size={14} />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="min-w-[12rem]">
						<DropdownMenu.Item class=""
							><span class="flex items-center gap-2"><Pencil size={13} /> Rename</span
							></DropdownMenu.Item
						>
						<DropdownMenu.Item class=""
							><span class="flex items-center gap-2"><Copy2 size={13} /> Duplicate</span><kbd
								class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
								>⌘D</kbd
							></DropdownMenu.Item
						>
						<DropdownMenu.Item class=""
							><span class="flex items-center gap-2"><Archive size={13} /> Archive</span
							></DropdownMenu.Item
						>
						<DropdownMenu.Separator class=""></DropdownMenu.Separator>
						<DropdownMenu.Item class=""
							><span class="flex items-center gap-2 text-[var(--color-destructive)]"
								><Trash size={13} /> Delete</span
							><kbd
								class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
								>⌫</kbd
							></DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>

		<!-- Share menu -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
			<div class="flex flex-col gap-1">
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
				>
					Share
				</span>
				<p class="m-0 text-[0.84rem] text-foreground-muted">Action button with grouped options.</p>
			</div>
			<div class="grid place-items-center pt-4">
				<DropdownMenu.Root class="" value="">
					<DropdownMenu.Trigger variant="outlined" class="h-9 gap-1.5 text-[0.82rem]">
						<Send size={13} />
						Share
						<ChevronDown size={11} class="text-foreground-muted" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="min-w-[14rem]">
						<DropdownMenu.Label class="">Workspace</DropdownMenu.Label>
						<DropdownMenu.Item class=""
							><span class="flex items-center gap-2"><User size={13} /> Invite collaborator</span
							></DropdownMenu.Item
						>
						<DropdownMenu.Item class=""
							><span class="flex items-center gap-2"><Copy2 size={13} /> Copy link</span><kbd
								class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
								>⇧⌘C</kbd
							></DropdownMenu.Item
						>
						<DropdownMenu.Separator class=""></DropdownMenu.Separator>
						<DropdownMenu.Label class="">Public</DropdownMenu.Label>
						<DropdownMenu.Item class=""
							><span class="flex items-center gap-2"><EyeOff size={13} /> Make private</span
							></DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>

		<!-- Sort -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
			<div class="flex flex-col gap-1">
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
				>
					Sort
				</span>
				<p class="m-0 text-[0.84rem] text-foreground-muted">
					Compact menu with the active choice indicated.
				</p>
			</div>
			<div class="grid place-items-center pt-4">
				<DropdownMenu.Root class="" value="">
					<DropdownMenu.Trigger variant="ghost" class="h-9 gap-1.5 text-[0.82rem]">
						<Star size={13} />
						Most starred
						<ChevronDown size={11} class="text-foreground-muted" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="min-w-[12rem]">
						<DropdownMenu.Item class=""
							><span>Most starred</span><Check size={12} class="text-primary" /></DropdownMenu.Item
						>
						<DropdownMenu.Item class=""><span>Recently updated</span></DropdownMenu.Item>
						<DropdownMenu.Item class=""><span>Alphabetical</span></DropdownMenu.Item>
						<DropdownMenu.Item class=""><span>Oldest first</span></DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
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
				{#each apiRows as row (row.prop)}
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted"
								>DropdownMenu.{row.component}</code
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

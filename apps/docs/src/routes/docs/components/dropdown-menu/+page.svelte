<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as DropdownMenu from '@silk/ui/components/dropdown-menu';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
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
	import Check from '@lucide/svelte/icons/check';
	import LifeBuoy from '@lucide/svelte/icons/life-buoy';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	const TITLE = 'Dropdown Menu';
	const SLUG = 'dropdown-menu';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

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
</script>

<svelte:head>
	<title>Silk · Dropdown Menu</title>
	<meta name="description" content="A floating menu of actions, anchored to a trigger." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A list of actions anchored to a button. Use it for user menus, row-level actions, and anywhere a `…` button needs to do more than one thing."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Nestable' }]}
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

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={Sparkles}
		title="Real-world examples"
		description="Three patterns from real product surfaces."
	>
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
						<DropdownMenu.Trigger
							variant="ghost"
							size="icon"
							class="size-8"
							aria-label="Row actions"
						>
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
					<p class="m-0 text-[0.84rem] text-foreground-muted">
						Action button with grouped options.
					</p>
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
								><span>Most starred</span><Check
									size={12}
									class="text-primary"
								/></DropdownMenu.Item
							>
							<DropdownMenu.Item class=""><span>Recently updated</span></DropdownMenu.Item>
							<DropdownMenu.Item class=""><span>Alphabetical</span></DropdownMenu.Item>
							<DropdownMenu.Item class=""><span>Oldest first</span></DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="DropdownMenu" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

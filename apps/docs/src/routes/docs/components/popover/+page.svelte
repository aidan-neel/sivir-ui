<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { highlight } from '$lib/highlight';
	import * as Popover from '@silk/ui/components/popover';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
	import Bell from '@lucide/svelte/icons/bell';

	const TITLE = 'Popover';
	const SLUG = 'popover';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'placement',
			type: '"top" | "right" | "bottom" | "left"',
			default: '"bottom"',
			description: 'Side the floating panel prefers.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders as a Button. Inherits Button props.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Floating surface positioned via Floating UI.'
		},
		{
			component: 'Content',
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Wraps the inner panel -- set width with `w-[N]`.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Popover</title>
	<meta name="description" content="A floating surface anchored to a trigger element." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="The primitive behind every floating menu in Silk. Pair a trigger with an anchored surface that handles outside-click, escape, focus, and collision-aware placement for you."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Floating UI' }]}
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
				<Popover.Root placement="bottom">
					<Popover.Trigger variant="outlined">
						<Bell size={14} />
						Notifications
					</Popover.Trigger>
					<Popover.Content class="w-72">
						<div class="flex flex-col gap-2 p-3">
							<p
								class="m-0 text-[0.86rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]"
							>
								Notifications
							</p>
							<p class="m-0 text-[0.78rem] text-foreground-muted">
								You have 3 unread messages and 1 new follower.
							</p>
							<Button size="sm" class="mt-2 self-start">Open inbox</Button>
						</div>
					</Popover.Content>
				</Popover.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Popover.Root placement="bottom">
  <Popover.Trigger variant="outlined">
    <Bell size={14} /> Notifications
  </Popover.Trigger>
  <Popover.Content class="w-72">
    <p>You have 3 unread messages…</p>
  </Popover.Content>
</Popover.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Popover" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

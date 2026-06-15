<script lang="ts">
	import * as HoverCard from '@silk/ui/components/hover-card';
	import * as Avatar from '@silk/ui/components/avatar';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Hover Card';
	const SLUG = 'hover-card';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'openDelay',
			type: 'number (ms)',
			default: '200',
			description: 'Time the cursor must rest on the trigger before opening.'
		},
		{
			component: 'Root',
			prop: 'closeDelay',
			type: 'number (ms)',
			default: '150',
			description: 'Time the cursor must leave before closing.'
		},
		{
			component: 'Trigger',
			prop: 'href',
			type: 'string',
			default: '--',
			description: 'Renders as an anchor when set; falls back to a focusable span.'
		},
		{
			component: 'Content',
			prop: 'side / align',
			type: 'placement',
			default: '"bottom" / "center"',
			description: 'Floating-UI placement.'
		}
	];
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A floating preview that opens on hover."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A preview card that opens on hover or keyboard focus. Use it for user mentions, link previews, or definitions."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Hover + Focus triggered' }]}
/>

<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div
				class="flex min-h-[10rem] items-center justify-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<p class="text-[0.92rem] text-foreground-muted">
					Built by
					<HoverCard.Root>
						<HoverCard.Trigger href="https://github.com/aidan-neel">@aidan-neel</HoverCard.Trigger>
						<HoverCard.Content>
							<div class="flex items-start gap-3">
								<Avatar.Root size="md"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
								<div class="flex flex-col gap-1">
									<HoverCard.Title>Aidan Neel</HoverCard.Title>
									<HoverCard.Description
										>Building Silk. Loves type-driven design and animation polish.</HoverCard.Description
									>
								</div>
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
					— hover the username for a preview.
				</p>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<HoverCard.Root>
  <HoverCard.Trigger href="/profile">@aidan-neel</HoverCard.Trigger>
  <HoverCard.Content>
    <HoverCard.Title>Aidan Neel</HoverCard.Title>
    <HoverCard.Description>Building Silk.</HoverCard.Description>
  </HoverCard.Content>
</HoverCard.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="HoverCard" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { highlight } from '$lib/highlight';
	import * as Tooltip from '@silk/ui/components/tooltip';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
	import Info from '@lucide/svelte/icons/info';

	const TITLE = 'Tooltip';
	const SLUG = 'tooltip';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'placement',
			type: '"top" | "right" | "bottom" | "left"',
			default: '"top"',
			description: 'Preferred side.'
		},
		{
			component: 'Root',
			prop: 'delay',
			type: 'number',
			default: '120',
			description: 'Time in ms before the tooltip opens on hover.'
		},
		{
			component: 'Root',
			prop: 'closeDelay',
			type: 'number',
			default: '70',
			description: 'Grace period before closing -- lets the user move into the tooltip.'
		},
		{
			component: 'Trigger',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description:
				'The element the tooltip describes. Wrap a Button/element, do not pass Button props here.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Tooltip body -- keep it to a sentence.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Tooltip</title>
	<meta name="description" content="Brief explanatory text on hover or focus." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A one-line hover hint for icons, abbreviations, and dense affordances. Mobile users won't see it — never put critical info behind a tooltip."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Floating UI' }]}
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
				class="flex min-h-[12rem] flex-wrap items-center justify-center gap-3 border-b border-border/70 bg-secondary/30 p-8"
			>
				<Tooltip.Root placement="top">
					<Tooltip.Trigger>
						<Button variant="outlined">
							<Info size={14} />
							Hover me (top)
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>Auto-flips if there's no room above.</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root placement="right">
					<Tooltip.Trigger>
						<Button variant="outlined">Right</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>Floating UI handles collisions.</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root placement="bottom">
					<Tooltip.Trigger>
						<Button variant="outlined">Bottom</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>Always wrap a real interactive element.</Tooltip.Content>
				</Tooltip.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Tooltip.Root placement="top">
  <Tooltip.Trigger>
    <Button variant="outlined">
      <Info size={14} /> Hover me
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content>Auto-flips if there's no room.</Tooltip.Content>
</Tooltip.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Tooltip" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

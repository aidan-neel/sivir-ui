<script lang="ts">
	import * as ToggleGroup from '@silk/ui/components/toggle-group';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import AlignCenter from '@lucide/svelte/icons/align-center';
	import AlignRight from '@lucide/svelte/icons/align-right';

	const TITLE = 'Toggle Group';
	const SLUG = 'toggle-group';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'type',
			type: '"single" | "multiple"',
			default: '"single"',
			description: 'Single forces exclusive selection; multiple allows any combination.'
		},
		{
			component: 'Root',
			prop: 'value',
			type: 'string | string[]',
			default: '--',
			description: 'Bindable selected value(s).'
		},
		{
			component: 'Root',
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disable all items at once.'
		},
		{
			component: 'Item',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'Identifier used in the group `value`.'
		}
	];

	let alignment = $state<string | string[] | undefined>('center');
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A row of toggles with shared selection state."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A group of toggles that share state. Use single mode for radio-like exclusivity, multiple for independent selections."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Single + Multiple' }]}
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
				class="flex min-h-[10rem] items-center justify-center border-b border-border/70 bg-secondary/30 p-8"
			>
				<ToggleGroup.Root type="single" bind:value={alignment}>
					<ToggleGroup.Item value="left" aria-label="Align left"
						><AlignLeft size={14} /></ToggleGroup.Item
					>
					<ToggleGroup.Item value="center" aria-label="Align center"
						><AlignCenter size={14} /></ToggleGroup.Item
					>
					<ToggleGroup.Item value="right" aria-label="Align right"
						><AlignRight size={14} /></ToggleGroup.Item
					>
				</ToggleGroup.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<ToggleGroup.Root type="single" bind:value>
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="ToggleGroup" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

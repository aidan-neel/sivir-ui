<script lang="ts">
	import * as Accordion from '@silk/ui/components/accordion';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Accordion';
	const SLUG = 'accordion';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'type',
			type: '"single" | "multiple"',
			default: '"single"',
			description: 'Single allows one panel open at a time; multiple allows any combination.'
		},
		{
			component: 'Root',
			prop: 'value',
			type: 'string | string[]',
			default: '--',
			description: 'Bindable open item value(s).'
		},
		{
			component: 'Root',
			prop: 'collapsible',
			type: 'boolean',
			default: 'true',
			description: 'In single mode, allow closing the active panel.'
		},
		{
			component: 'Item',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'Identifier for the item.'
		},
		{
			component: 'Item',
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disable this item.'
		},
		{
			component: 'Trigger / Content',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Header button and the revealed region.'
		}
	];
</script>

<svelte:head>
	<title>Silk · {TITLE}</title>
	<meta name="description" content="Stacked collapsible sections — single or multi-open." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="Stacked Collapsibles with shared state. Single mode acts like a radio; multiple lets users open any combination."
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
				class="flex min-h-[14rem] items-center justify-center border-b border-border/70 bg-secondary/30 p-8"
			>
				<div class="w-full max-w-md">
					<Accordion.Root type="single" value="item-1">
						<Accordion.Item value="item-1">
							<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
							<Accordion.Content
								>Yes — the trigger is a real button with `aria-expanded` and `aria-controls`, and
								the content has `role="region"`.</Accordion.Content
							>
						</Accordion.Item>
						<Accordion.Item value="item-2">
							<Accordion.Trigger>Does it animate?</Accordion.Trigger>
							<Accordion.Content
								>Yes — height is animated via CSS grid-template-rows. No JS measurement, no jank.</Accordion.Content
							>
						</Accordion.Item>
						<Accordion.Item value="item-3">
							<Accordion.Trigger>Does it theme?</Accordion.Trigger>
							<Accordion.Content
								>Yes — open the theme studio and watch the chevron, duration, and colors update
								live.</Accordion.Content
							>
						</Accordion.Item>
					</Accordion.Root>
				</div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Accordion.Root type="single">
  <Accordion.Item value="a">
    <Accordion.Trigger>Section A</Accordion.Trigger>
    <Accordion.Content>…</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Accordion" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

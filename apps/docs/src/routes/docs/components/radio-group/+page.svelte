<script lang="ts">
	import * as RadioGroup from '@silk/ui/components/radio-group';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Radio Group';
	const SLUG = 'radio-group';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'Bindable selected value.'
		},
		{
			component: 'Root',
			prop: 'name',
			type: 'string',
			default: '--',
			description: 'Form field name for the underlying `<input>`s.'
		},
		{
			component: 'Root',
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disable the entire group.'
		},
		{
			component: 'Item',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'Identifier matched against the group value.'
		},
		{
			component: 'Item',
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Visible label rendered next to the radio.'
		},
		{
			component: 'Item',
			prop: 'description',
			type: 'string',
			default: '--',
			description: 'Optional secondary line beneath the label.'
		}
	];

	let plan = $state<string | undefined>('pro');
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A group of mutually-exclusive options."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A themed wrapper around the native radio input. Works inside any form with no extra wiring."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Native radio underneath' }]}
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
				<RadioGroup.Root bind:value={plan} name="plan">
					<RadioGroup.Item value="free" label="Free" description="For solo hobby projects." />
					<RadioGroup.Item
						value="pro"
						label="Pro"
						description="For small teams and side projects."
					/>
					<RadioGroup.Item
						value="team"
						label="Team"
						description="Audit log, SSO, and priority support."
					/>
				</RadioGroup.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<RadioGroup.Root bind:value name="plan">
  <RadioGroup.Item value="free" label="Free" />
  <RadioGroup.Item value="pro" label="Pro" />
</RadioGroup.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="RadioGroup" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

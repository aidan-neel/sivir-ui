<script lang="ts">
	import { highlight } from '$lib/highlight';
	import { Input } from '@silk/ui/components/input';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
	import Layers from '@lucide/svelte/icons/layers-3';

	const TITLE = 'Input';
	const SLUG = 'input';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	type Variant = 'primary' | 'secondary' | 'outlined';

	const variantList: { value: Variant; label: string; use: string }[] = [
		{
			value: 'outlined',
			label: 'Outlined',
			use: 'The default -- neutral border, sits well anywhere.'
		},
		{ value: 'secondary', label: 'Secondary', use: 'Subtle tinted background.' },
		{ value: 'primary', label: 'Primary', use: 'Highest-emphasis field -- uses primary accent.' }
	];

	const apiRows = [
		{
			prop: 'variant',
			type: '"primary" | "secondary" | "outlined"',
			default: '"outlined"',
			description: 'Visual treatment.'
		},
		{ prop: 'value', type: 'string', default: '--', description: 'Bindable with `bind:value`.' },
		{
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Inline label rendered above the input.'
		},
		{
			prop: 'description',
			type: 'string',
			default: '--',
			description: 'Helper text below the input.'
		},
		{
			prop: 'placeholder',
			type: 'string',
			default: '--',
			description: 'Standard HTML placeholder.'
		},
		{
			prop: 'type',
			type: 'string',
			default: '"text"',
			description: 'Any native input type -- text, email, password, number, search, ...'
		},
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Standard disabled.' },
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Tailwind classes for the inner input.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Input</title>
	<meta
		name="description"
		content="Text input with labels, helper text, and three visual variants."
	/>
</svelte:head>

<DocHeader
	title={TITLE}
	description="The workhorse of every form. Three variants for different surface densities; bindable value and full passthrough to the underlying `<input>`."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: '3 variants' }]}
/>

<!-- Preview -->
<section class="pt-10">
	<div
		class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
	>
		<div
			class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-secondary/30 p-8"
		>
			<div class="w-full max-w-[24rem]">
				<Input variant="outlined" label="Email" placeholder="you@silk-ui.dev" />
			</div>
		</div>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
				>{@html highlight(
					`<Input
  label="Email"
  placeholder="you@silk-ui.dev"
  bind:value
/>`,
					'svelte'
				)}</code
			></pre>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Layers} title="Variants">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
			{#each variantList as v}
				<div
					class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
				>
					<Input variant={v.value} label={v.label} placeholder="Placeholder text" />
					<p class="m-0 text-[0.74rem] leading-snug text-foreground-muted">{v.use}</p>
				</div>
			{/each}
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

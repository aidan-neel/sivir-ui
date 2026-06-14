<script lang="ts">
	import { highlight } from '$lib/highlight';
	import { Textarea } from '@silk/ui/components/textarea';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Textarea';
	const SLUG = 'textarea';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	let pgValue = $state(
		"Silk's textarea uses the same field tokens as Input -- labels, descriptions, and focus rings stay consistent."
	);

	const apiRows = [
		{ prop: 'value', type: 'string', default: '--', description: 'Bindable text content.' },
		{ prop: 'label', type: 'string', default: '--', description: 'Label above the field.' },
		{
			prop: 'description',
			type: 'string',
			default: '--',
			description: 'Helper text below the field.'
		},
		{
			prop: 'placeholder',
			type: 'string',
			default: '--',
			description: 'Standard HTML placeholder.'
		},
		{
			prop: 'rows',
			type: 'number',
			default: '4',
			description: 'Initial visible row count -- height grows from there.'
		},
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Standard disabled.' },
		{ prop: 'class', type: 'string', default: '--', description: 'Classes for the inner textarea.' }
	];
</script>

<svelte:head>
	<title>Silk · Textarea</title>
	<meta name="description" content="Multi-line text input that shares Input's grammar." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="Multi-line counterpart to Input. Same focus ring, same label structure — pick this any time you expect more than one line of content."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Bindable' }]}
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
				class="grid min-h-[14rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<div class="w-full max-w-[28rem]">
					<Textarea
						label="Description"
						placeholder="Tell us about your project…"
						bind:value={pgValue}
					/>
				</div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Textarea
  label="Description"
  placeholder="Tell us about your project…"
  bind:value
/>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

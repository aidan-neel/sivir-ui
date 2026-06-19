<script lang="ts">
	import { Slider } from '@silk/ui/components/slider';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Slider';
	const SLUG = 'slider';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{ prop: 'value', type: 'number', default: '0', description: 'Bindable current value.' },
		{ prop: 'min', type: 'number', default: '0', description: 'Lower bound.' },
		{ prop: 'max', type: 'number', default: '100', description: 'Upper bound.' },
		{
			prop: 'step',
			type: 'number',
			default: '1',
			description: 'Increment per keypress / drag step.'
		},
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' },
		{
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Accessible name (set via `aria-label`).'
		},
		{
			prop: 'onValueChange',
			type: '(value) => void',
			default: '--',
			description: 'Fires after each value change.'
		}
	];

	let volume = $state(64);
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A native range input dressed in the theme."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A themed wrapper around the native range input. Keyboard-driven for free, drag-to-set on every device."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Themed range' }]}
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
				<div class="flex w-full max-w-sm flex-col gap-2">
					<div class="flex items-center justify-between text-[0.78rem]">
						<span class="text-foreground-muted">Volume</span><span class="font-mono text-foreground"
							>{volume}</span
						>
					</div>
					<Slider bind:value={volume} label="Volume" />
				</div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(`<Slider bind:value={volume} label="Volume" />`, 'svelte')}</code
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

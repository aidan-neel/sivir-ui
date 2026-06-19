<script lang="ts">
	import { Toggle } from '@silk/ui/components/toggle';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';

	const TITLE = 'Toggle';
	const SLUG = 'toggle';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'pressed',
			type: 'boolean',
			default: 'false',
			description: 'Bindable. Current pressed state.'
		},
		{
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Prevent toggling and dim the visuals.'
		},
		{ prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Hit area preset.' },
		{
			prop: 'variant',
			type: '"default" | "outlined"',
			default: '"default"',
			description: 'Outlined adds a border.'
		},
		{
			prop: 'onPressedChange',
			type: '(pressed) => void',
			default: '--',
			description: 'Fires after `pressed` changes.'
		}
	];

	let bold = $state(true);
	let italic = $state(false);
	let underline = $state(false);
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A two-state button — pressed or unpressed."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A pressable button with an explicit on/off state. Pair multiples in a Toggle Group for radio-like or multi-select behavior."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Pressable' }]}
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
				class="flex min-h-[10rem] items-center justify-center gap-2 border-b border-border/70 bg-secondary/30 p-8"
			>
				<Toggle bind:pressed={bold} aria-label="Bold"><Bold size={14} /></Toggle>
				<Toggle bind:pressed={italic} aria-label="Italic"><Italic size={14} /></Toggle>
				<Toggle bind:pressed={underline} aria-label="Underline"><Underline size={14} /></Toggle>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Toggle bind:pressed={bold} aria-label="Bold">
  <Bold size={14} />
</Toggle>`,
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

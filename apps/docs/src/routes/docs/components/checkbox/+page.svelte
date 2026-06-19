<script lang="ts">
	import { highlight } from '$lib/highlight';
	import { Checkbox } from '@silk/ui/components/checkbox';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Layers from '@lucide/svelte/icons/layers-3';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Checkbox';
	const SLUG = 'checkbox';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'checked',
			type: 'boolean',
			default: 'false',
			description: 'Bindable. Two-way with the user via `bind:checked`.'
		},
		{
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Short label rendered to the right of the box.'
		},
		{
			prop: 'description',
			type: 'string',
			default: '--',
			description: 'Optional second line in foreground-muted.'
		},
		{
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Greys out + blocks pointer/keyboard activation.'
		},
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Tailwind classes appended via cn().'
		}
	];
</script>

<svelte:head>
	<title>Silk · Checkbox</title>
	<meta name="description" content="Single-state toggle for opt-ins and binary choices." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A single binary control. Use it when the choice is yes/no — for one-of-many, reach for radio groups; for system-level toggles, use Switch."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Bindable' }]}
/>

<!-- Preview -->
<section class="pt-10">
	<div
		class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
	>
		<div
			class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-secondary/30 p-8"
		>
			<Checkbox
				variant="default"
				checked
				label="Receive product updates"
				description="Roughly one email per month — opt out anytime."
			/>
		</div>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
				>{@html highlight(
					`<Checkbox
  bind:checked={value}
  label="Receive product updates"
  description="Roughly one email per month — opt out anytime."
/>`,
					'svelte'
				)}</code
			></pre>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Layers} title="States">
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each [{ label: 'Unchecked', value: false }, { label: 'Checked', value: true }, { label: 'Disabled', value: false, disabled: true }, { label: 'Disabled + on', value: true, disabled: true }] as state}
				<div
					class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
				>
					<div class="grid min-h-[3.5rem] place-items-center">
						<Checkbox
							variant="default"
							checked={state.value}
							disabled={state.disabled}
							label={state.label}
						/>
					</div>
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

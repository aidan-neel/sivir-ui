<script lang="ts">
	import { highlight } from '$lib/highlight';
	import { Switch } from '@silk/ui/components/switch';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
	import ToggleRight from '@lucide/svelte/icons/toggle-right';

	const TITLE = 'Switch';
	const SLUG = 'switch';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{ prop: 'switched', type: 'boolean', default: 'false', description: 'Bindable on/off state.' },
		{
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Label rendered to the right of the toggle.'
		},
		{
			prop: 'description',
			type: 'string',
			default: '--',
			description: 'Helper line in foreground-muted.'
		},
		{
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disable pointer + keyboard activation.'
		},
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Classes applied to the track button.'
		}
	];

	const examples: { label: string; node: 'full' | 'label' | 'on' | 'disabled' }[] = [
		{ label: 'Label + description', node: 'full' },
		{ label: 'Label only', node: 'label' },
		{ label: 'Default on', node: 'on' },
		{ label: 'Disabled', node: 'disabled' }
	];
</script>

<svelte:head>
	<title>Silk · Switch</title>
	<meta name="description" content="On/off toggle for system-level settings." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A toggle for things that take effect immediately — notifications, dark mode, auto-save. Pair it with a clear label so users know what they're enabling."
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
			<Switch
				switched
				label="Push notifications"
				description="We'll only ping you for mentions and replies."
			/>
		</div>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
				>{@html highlight(
					`<Switch
  label="Push notifications"
  description="We'll only ping you for mentions and replies."
/>`,
					'svelte'
				)}</code
			></pre>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={ToggleRight}
		title="Examples"
		description="Every switch is independently toggleable — each transition is driven by your theme's motion preset."
		id="examples"
	>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			{#each examples as ex (ex.label)}
				<div
					class="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5"
				>
					<p
						class="m-0 text-[0.82rem] [font-weight:var(--font-weight-header,640)] text-foreground"
						style="font-family: var(--font-header);"
					>
						{ex.label}
					</p>
					{#if ex.node === 'full'}
						<Switch label="Auto-save" description="Save changes as you type." />
					{:else if ex.node === 'label'}
						<Switch label="Wi-Fi" />
					{:else if ex.node === 'on'}
						<Switch switched label="Dark mode" />
					{:else}
						<Switch disabled label="Read receipts" description="Upgrade your plan to enable." />
					{/if}
				</div>
			{/each}
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API" id="api">
		<PropTable rows={apiRows} />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

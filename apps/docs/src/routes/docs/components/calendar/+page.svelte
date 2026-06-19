<script lang="ts">
	import { Calendar } from '@silk/ui/components/calendar';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Calendar';
	const SLUG = 'calendar';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{ prop: 'value', type: 'Date', default: '--', description: 'Bindable selected date.' },
		{ prop: 'min', type: 'Date', default: '--', description: 'Earliest selectable date.' },
		{ prop: 'max', type: 'Date', default: '--', description: 'Latest selectable date.' },
		{
			prop: 'weekStartsOn',
			type: '0 - 6',
			default: '0',
			description: '0 = Sunday, 1 = Monday, ...'
		},
		{
			prop: 'onValueChange',
			type: '(date) => void',
			default: '--',
			description: 'Fires after the user picks a date.'
		}
	];

	let date = $state<Date | undefined>();
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A single-date calendar with locale-aware formatting."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A single-date calendar. Month names and weekday letters use the user's locale via Intl — no date library required."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Locale-aware' }]}
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
				class="flex min-h-[18rem] items-center justify-center border-b border-border/70 bg-secondary/30 p-8"
			>
				<Calendar bind:value={date} weekStartsOn={1} />
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(`<Calendar bind:value={date} weekStartsOn={1} />`, 'svelte')}</code
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

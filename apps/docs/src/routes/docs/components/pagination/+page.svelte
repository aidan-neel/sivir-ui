<script lang="ts">
	import { Pagination } from '@silk/ui/components/pagination';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Pagination';
	const SLUG = 'pagination';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'page',
			type: 'number',
			default: '1',
			description: 'Bindable current page (1-indexed).'
		},
		{ prop: 'total', type: 'number', default: '--', description: 'Total page count.' },
		{
			prop: 'siblings',
			type: 'number',
			default: '1',
			description: 'Adjacent pages shown either side of `page` before truncating with an ellipsis.'
		},
		{
			prop: 'onPageChange',
			type: '(page) => void',
			default: '--',
			description: 'Fires after navigation.'
		}
	];

	let page = $state(4);
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A compact page navigator with ellipsis truncation."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A compact pager that truncates with an ellipsis. Always shows the first and last page so users know how big the data set is."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Ellipsis truncation' }]}
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
				<Pagination bind:page total={20} />
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(`<Pagination bind:page total={20} />`, 'svelte')}</code
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

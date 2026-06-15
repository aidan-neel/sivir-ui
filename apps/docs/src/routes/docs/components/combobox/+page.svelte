<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as Combobox from '@silk/ui/components/combobox';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Combobox';
	const SLUG = 'combobox';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	let selected = $state('next');
	const frameworks = [
		{ value: 'next', label: 'Next.js' },
		{ value: 'sveltekit', label: 'SvelteKit' },
		{ value: 'nuxt', label: 'Nuxt' },
		{ value: 'remix', label: 'Remix' },
		{ value: 'astro', label: 'Astro' },
		{ value: 'solidstart', label: 'SolidStart' },
		{ value: 'qwik', label: 'Qwik City' }
	];

	const apiRows = [
		{
			component: 'Root',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Context provider for trigger + content.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders as a Button.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Floating popover containing search + results.'
		},
		{
			component: 'Search',
			prop: 'placeholder',
			type: 'string',
			default: '"Search..."',
			description: 'Filter input.'
		},
		{
			component: 'Search',
			prop: 'threshold',
			type: 'number',
			default: '0.4',
			description: 'Fuzzy-match tolerance (0-1, higher = stricter).'
		},
		{
			component: 'Results',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Scrollable list region.'
		},
		{
			component: 'Label',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Section heading inside Results.'
		},
		{
			component: 'Item',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'Internal value passed to callbacks.'
		},
		{
			component: 'Item',
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Display string + fuzzy-search target.'
		},
		{
			component: 'Item',
			prop: 'callback',
			type: '() => void',
			default: '--',
			description: 'Activated on click / Enter.'
		}
	];

	const selectedFramework = $derived(frameworks.find((f) => f.value === selected) ?? frameworks[0]);
</script>

<svelte:head>
	<title>Silk · Combobox</title>
	<meta name="description" content="Searchable select for picking one item from a long list." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A searchable Select. Pick this when the list of options is too long to scroll — typing to filter is always faster than scanning."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Fuzzy search' }]}
/>

<!-- Preview -->
<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div
				class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Combobox.Root>
					<Combobox.Trigger variant="outlined" class="h-9 w-60 gap-2 px-3 text-[0.82rem]">
						{selectedFramework.label}
					</Combobox.Trigger>
					<Combobox.Content>
						<Combobox.Search placeholder="Search frameworks…" />
						<Combobox.Results>
							{#each frameworks as fw}
								<Combobox.Item
									value={fw.value}
									label={fw.label}
									callback={() => (selected = fw.value)}
								>
									{fw.label}
								</Combobox.Item>
							{/each}
						</Combobox.Results>
					</Combobox.Content>
				</Combobox.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Combobox.Root>
  <Combobox.Trigger>{label}</Combobox.Trigger>
  <Combobox.Content>
    <Combobox.Search placeholder="Search frameworks…" />
    <Combobox.Results>
      {#each frameworks as fw}
        <Combobox.Item value={fw.value} label={fw.label}
          callback={() => (selected = fw.value)}>
          {fw.label}
        </Combobox.Item>
      {/each}
    </Combobox.Results>
  </Combobox.Content>
</Combobox.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Combobox" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

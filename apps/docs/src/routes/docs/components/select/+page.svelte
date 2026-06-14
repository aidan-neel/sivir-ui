<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as Select from '@silk/ui/components/select';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Select';
	const SLUG = 'select';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	let pgRole = $state('designer');

	const apiRows = [
		{
			component: 'Root',
			prop: 'value',
			type: 'string',
			default: '""',
			description: 'Bindable. Two-way sync with item value.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders as a Button. Children become the display label.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Floating panel -- anchored below the trigger.'
		},
		{
			component: 'Item',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'Stable identifier passed back to Root.value.'
		},
		{
			component: 'Item',
			prop: 'onclick',
			type: '() => void',
			default: '--',
			description: 'Fires when picked. Update bound state here.'
		},
		{
			component: 'Label',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Non-interactive group heading.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Select</title>
	<meta name="description" content="Single-choice dropdown for short, known option lists." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A controlled dropdown for short option lists. Once the list goes past ~10 items, switch to Combobox so users can type to filter."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Bindable' }]}
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
				class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Select.Root value={pgRole} class="">
					<Select.Trigger class="h-9 w-60" variant="outlined">
						{pgRole.charAt(0).toUpperCase() + pgRole.slice(1)}
					</Select.Trigger>
					<Select.Content class="">
						{#each [{ v: 'engineer', l: 'Engineer' }, { v: 'designer', l: 'Designer' }, { v: 'product', l: 'Product manager' }, { v: 'founder', l: 'Founder' }] as r}
							<Select.Item value={r.v} onclick={() => (pgRole = r.v)}>{r.l}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Select.Root value={role}>
  <Select.Trigger>{label}</Select.Trigger>
  <Select.Content>
    <Select.Item value="designer" onclick={() => (role = 'designer')}>
      Designer
    </Select.Item>
    <Select.Item value="engineer" onclick={() => (role = 'engineer')}>
      Engineer
    </Select.Item>
  </Select.Content>
</Select.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Select" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

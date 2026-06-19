<script lang="ts">
	import { Label } from '@silk/ui/components/label';
	import { Input } from '@silk/ui/components/input';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Label';
	const SLUG = 'label';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'for',
			type: 'string',
			default: '--',
			description: 'Standard HTML `for` attribute targeting the input id.'
		},
		{
			prop: '...HTMLLabelAttributes',
			type: '--',
			default: '--',
			description: 'Spread onto the underlying <label>.'
		}
	];
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A form field label, accessible by default."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A theme-aware form label that pairs with any input, fades correctly when the field is disabled via peer-disabled."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Form primitive' }]}
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
				<div class="flex w-64 flex-col gap-1.5">
					<Label for="demo-email">Email address</Label>
					<Input id="demo-email" type="email" placeholder="you@silk-ui.dev" variant="outlined" />
				</div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Label for="email">Email address</Label>
<Input id="email" type="email" />`,
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

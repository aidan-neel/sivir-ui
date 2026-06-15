<script lang="ts">
	import { highlight } from '$lib/highlight';
	import { Skeleton } from '@silk/ui/components/skeleton';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Skeleton';
	const SLUG = 'skeleton';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{ prop: 'w', type: 'number', default: '--', description: 'Width value (paired with `unit`).' },
		{ prop: 'h', type: 'number', default: '--', description: 'Height value (paired with `unit`).' },
		{
			prop: 'unit',
			type: '"px" | "rem" | "%" | "vh" | ...',
			default: '"px"',
			description: 'CSS unit for the dimensions.'
		},
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Tailwind classes for shape -- e.g. `rounded-full`.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Skeleton</title>
	<meta name="description" content="Shimmering placeholder for loading content." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A neutral placeholder rectangle for content that's still loading. Compose any shape by passing Tailwind sizing classes — Skeleton itself has no opinions about dimensions."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }]}
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
				class="flex min-h-[12rem] items-center justify-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<div class="flex w-full max-w-[24rem] items-center gap-4">
					<Skeleton w={48} h={48} unit="px" class="rounded-full"></Skeleton>
					<div class="flex flex-1 flex-col gap-2">
						<Skeleton w={60} h={12} unit="%" class=""></Skeleton>
						<Skeleton w={80} h={12} unit="%" class=""></Skeleton>
						<Skeleton w={45} h={12} unit="%" class=""></Skeleton>
					</div>
				</div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<div class="flex items-center gap-4">
  <Skeleton w={48} h={48} unit="px" class="rounded-full" />
  <div class="flex flex-col gap-2 flex-1">
    <Skeleton w={60} h={12} unit="%" />
    <Skeleton w={80} h={12} unit="%" />
    <Skeleton w={45} h={12} unit="%" />
  </div>
</div>`,
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

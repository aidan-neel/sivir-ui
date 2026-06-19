<script lang="ts">
	import { Marquee } from '@silk/ui/components/marquee';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Marquee';
	const SLUG = 'marquee';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'direction',
			type: '"left" | "right"',
			default: '"left"',
			description: 'Travel direction along the axis.'
		},
		{
			prop: 'duration',
			type: 'string',
			default: '"40s"',
			description: 'CSS duration for one full loop.'
		},
		{ prop: 'gap', type: 'string', default: '"2rem"', description: 'Space between items.' },
		{
			prop: 'pauseOnHover',
			type: 'boolean',
			default: 'false',
			description: 'Freeze the animation while the cursor is over the marquee.'
		},
		{
			prop: 'vertical',
			type: 'boolean',
			default: 'false',
			description: 'Flip to vertical scroll.'
		},
		{
			prop: 'repeat',
			type: 'number',
			default: '2',
			description: 'Number of times to duplicate the children for a seamless loop.'
		}
	];

	const logos = [
		'Linear',
		'Vercel',
		'Anthropic',
		'Cursor',
		'Raycast',
		'Tailwind',
		'GitHub',
		'Notion'
	];
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A scrolling row of content that loops seamlessly."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A CSS-only infinite scroll. Pure transforms, no JavaScript timeline — pauses on hover when you want it to."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Magic UI inspiration' }]}
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
				class="relative flex min-h-[10rem] items-center border-b border-border/70 bg-secondary/30"
			>
				<Marquee pauseOnHover duration="28s" class="py-8">
					{#each logos as logo}
						<span
							class="rounded-[var(--radius-md)] border border-border bg-card px-4 py-2 text-[0.86rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
							>{logo}</span
						>
					{/each}
				</Marquee>
				<div
					class="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-card to-transparent"
				></div>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-card to-transparent"
				></div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Marquee pauseOnHover duration="28s">
  {#each logos as logo}
    <Badge>{logo}</Badge>
  {/each}
</Marquee>`,
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

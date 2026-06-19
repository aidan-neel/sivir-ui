<script lang="ts">
	import { ScrollArea } from '@silk/ui/components/scroll-area';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Scroll Area';
	const SLUG = 'scroll-area';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'orientation',
			type: '"vertical" | "horizontal" | "both"',
			default: '"vertical"',
			description: 'Which axis can scroll.'
		}
	];

	const items = Array.from({ length: 24 }, (_, i) => `Item ${i + 1}`);
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="A scroll container with a themed scrollbar."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A scroll container that styles its scrollbar to match the theme. Pure CSS, no shadow DOM, no measurement loops."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Themed scrollbar' }]}
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
				class="flex min-h-[12rem] items-center justify-center border-b border-border/70 bg-secondary/30 p-8"
			>
				<ScrollArea class="h-48 w-64 rounded-[var(--radius-md)] border border-border bg-background">
					<div class="flex flex-col">
						{#each items as item, i}
							<div
								class="border-b border-border/60 px-3 py-2 text-[0.86rem] text-foreground"
								class:border-b-0={i === items.length - 1}
							>
								{item}
							</div>
						{/each}
					</div>
				</ScrollArea>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<ScrollArea class="h-48 w-64">
  {#each items as item}
    <div>{item}</div>
  {/each}
</ScrollArea>`,
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

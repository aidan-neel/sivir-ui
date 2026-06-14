<script lang="ts">
	import { Separator } from '@silk/ui/components/separator';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Separator';
	const SLUG = 'separator';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'orientation',
			type: '"horizontal" | "vertical"',
			default: '"horizontal"',
			description: 'Axis the rule runs along.'
		},
		{
			prop: 'decorative',
			type: 'boolean',
			default: 'true',
			description: 'When false, the divider is announced to assistive tech as a real separator.'
		}
	];
</script>

<svelte:head>
	<title>Silk · {TITLE}</title>
	<meta name="description" content="A visual or semantic rule between content." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A 1px rule for splitting groups of content. Defaults to horizontal but flips to vertical with one prop."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Horizontal + Vertical' }]}
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
				class="flex min-h-[10rem] flex-col items-center justify-center gap-4 border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<div class="flex flex-col items-center gap-3 text-[0.88rem]">
					<span>Silk UI</span>
					<Separator class="w-40" />
					<span class="text-foreground-muted">A theme-first component library</span>
				</div>
				<div class="flex h-6 items-center gap-3 text-[0.78rem]">
					<span>Docs</span>
					<Separator orientation="vertical" />
					<span>Themes</span>
					<Separator orientation="vertical" />
					<span>Registry</span>
				</div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Separator />
<Separator orientation="vertical" />`,
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

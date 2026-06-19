<script lang="ts">
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import { createCopy } from '$lib/copy.svelte';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Hash from '@lucide/svelte/icons/hash';
	import CircleDot from '@lucide/svelte/icons/circle-dot';

	const TITLE = 'Badge';
	const SLUG = 'badge';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	type Variant =
		| 'primary'
		| 'secondary'
		| 'outlined'
		| 'flat'
		| 'ghost'
		| 'alternate'
		| 'destructive';

	const variantList: { value: Variant; label: string; use: string }[] = [
		{ value: 'primary', label: 'Primary', use: 'Highlight + status -- pair with a hero action.' },
		{ value: 'secondary', label: 'Secondary', use: 'Neutral label or metadata.' },
		{ value: 'outlined', label: 'Outlined', use: 'Quiet container that defers to content.' },
		{ value: 'flat', label: 'Flat', use: 'Soft primary tint -- works inside cards.' },
		{ value: 'ghost', label: 'Ghost', use: 'Invisible chrome -- counts, low-emphasis tags.' },
		{ value: 'alternate', label: 'Alternate', use: 'High-contrast accent for hero placements.' },
		{ value: 'destructive', label: 'Destructive', use: '"Failing", "Blocked", "Past due".' }
	];

	const apiRows = [
		{
			prop: 'variant',
			type: '"primary" | "secondary" | "outlined" | "flat" | "ghost" | "alternate" | "destructive"',
			default: '"primary"',
			description: 'Visual treatment.'
		},
		{
			prop: 'href',
			type: 'string',
			default: '--',
			description: 'Renders as an `<a>` instead of a `<span>`.'
		},
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Tailwind classes appended via cn().'
		},
		{
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Label content (icons supported).'
		}
	];

	const clip = createCopy();
</script>

<svelte:head>
	<title>Silk · {TITLE}</title>
	<meta name="description" content="Small status tags and metadata pills for any UI surface." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A compact label for status, counts, tags, and metadata. Same variant grammar as Button so the two stack naturally."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: '7 variants' }]}
/>

<!-- Preview -->
<section class="pt-10">
	<div
		class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
	>
		<div
			class="flex min-h-[10rem] flex-wrap items-center justify-center gap-2 border-b border-border/70 bg-secondary/30 p-8"
		>
			<Badge>New</Badge>
			<Badge variant="secondary">Beta</Badge>
			<Badge variant="outlined">v0.4.2</Badge>
			<Badge variant="flat">Active</Badge>
		</div>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
				>{@html highlight(`<Badge>New</Badge>`, 'svelte')}</code
			></pre>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={Layers}
		title="Variants"
		description="Match the badge's variant to whatever it's labeling — keep status colors for actual status."
	>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each variantList as v}
				<div
					class="group flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-card p-4"
				>
					<div class="flex h-10 items-center">
						<Badge variant={v.value}>{v.label}</Badge>
					</div>
					<p class="m-0 text-[0.74rem] leading-snug text-foreground-muted">{v.use}</p>
					<button
						type="button"
						onclick={() =>
							clip.copy(
								`<Badge${v.value !== 'primary' ? ` variant="${v.value}"` : ''}>${v.label}</Badge>`,
								`var-${v.value}`
							)}
						class="inline-flex w-fit items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[0.7rem] text-foreground-muted opacity-0 transition-opacity hover:bg-secondary/60 hover:text-foreground group-hover:opacity-100"
					>
						{#if clip.copied(`var-${v.value}`)}
							<Check size={11} class="text-[var(--color-success)]" />
							Copied
						{:else}
							<Copy size={11} />
							Copy
						{/if}
					</button>
				</div>
			{/each}
		</div>
	</DocSection>

	<DocSection icon={CircleDot} title="Patterns" description="Three places Badge earns its keep.">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
			<div
				class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
			>
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Status pill</span
				>
				<Badge variant="flat">
					<span class="mr-1.5 inline-block size-1.5 rounded-full bg-primary"></span>
					Active
				</Badge>
			</div>
			<div
				class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
			>
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Count</span
				>
				<Badge variant="ghost" class="px-1.5 text-[0.66rem]">12 new</Badge>
			</div>
			<div
				class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
			>
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Tag</span
				>
				<Badge variant="outlined">design</Badge>
			</div>
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

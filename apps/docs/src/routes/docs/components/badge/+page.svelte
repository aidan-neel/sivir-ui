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
	let pgVariant = $state<Variant>('primary');
	let pgLabel = $state('New');

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

	const playgroundCode = $derived(
		`<Badge${pgVariant !== 'primary' ? ` variant="${pgVariant}"` : ''}>${pgLabel || 'Badge'}</Badge>`
	);

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

<!-- Playground -->
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
				<Badge variant={pgVariant}>{pgLabel || 'Badge'}</Badge>
			</div>

			<div class="flex flex-col divide-y divide-border/60">
				<div class="flex flex-col gap-2 px-6 py-4">
					<label
						for="pg-label"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Label</label
					>
					<input
						id="pg-label"
						bind:value={pgLabel}
						class="h-9 w-full max-w-[28rem] rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none transition-[border-color,box-shadow] focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>

				<div class="flex flex-col gap-2 px-6 py-4">
					<span
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Variant</span
					>
					<div class="flex flex-wrap gap-1.5">
						{#each variantList as v}
							<button
								type="button"
								onclick={() => (pgVariant = v.value)}
								class={`rounded-full border px-2.5 py-1 text-[0.74rem] transition-colors ${pgVariant === v.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground-muted hover:border-border-strong'}`}
							>
								{v.label}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div
				class="flex items-center justify-between gap-2 border-t border-border/70 bg-secondary/40 px-6 py-2.5"
			>
				<span
					class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Snippet</span
				>
				<button
					type="button"
					onclick={() => clip.copy(playgroundCode, 'playground')}
					class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[0.72rem] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
				>
					{#if clip.copied('playground')}
						<Check size={11} class="text-[var(--color-success)]" />
						Copied
					{:else}
						<Copy size={11} />
						Copy code
					{/if}
				</button>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(playgroundCode, 'svelte')}</code
				></pre>
		</div>
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

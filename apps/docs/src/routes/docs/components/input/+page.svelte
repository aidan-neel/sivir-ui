<script lang="ts">
	import { highlight } from '$lib/highlight';
	import { Input } from '@silk/ui/components/input';
	import { createCopy } from '$lib/copy.svelte';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Hash from '@lucide/svelte/icons/hash';
	import Layers from '@lucide/svelte/icons/layers-3';

	const TITLE = 'Input';
	const SLUG = 'input';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	type Variant = 'primary' | 'secondary' | 'outlined';
	let pgVariant = $state<Variant>('outlined');
	let pgValue = $state('');
	let pgLabel = $state('Email');
	let pgPlaceholder = $state('you@silk-ui.dev');

	const variantList: { value: Variant; label: string; use: string }[] = [
		{
			value: 'outlined',
			label: 'Outlined',
			use: 'The default -- neutral border, sits well anywhere.'
		},
		{ value: 'secondary', label: 'Secondary', use: 'Subtle tinted background.' },
		{ value: 'primary', label: 'Primary', use: 'Highest-emphasis field -- uses primary accent.' }
	];

	const apiRows = [
		{
			prop: 'variant',
			type: '"primary" | "secondary" | "outlined"',
			default: '"outlined"',
			description: 'Visual treatment.'
		},
		{ prop: 'value', type: 'string', default: '--', description: 'Bindable with `bind:value`.' },
		{
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Inline label rendered above the input.'
		},
		{
			prop: 'description',
			type: 'string',
			default: '--',
			description: 'Helper text below the input.'
		},
		{
			prop: 'placeholder',
			type: 'string',
			default: '--',
			description: 'Standard HTML placeholder.'
		},
		{
			prop: 'type',
			type: 'string',
			default: '"text"',
			description: 'Any native input type -- text, email, password, number, search, ...'
		},
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Standard disabled.' },
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Tailwind classes for the inner input.'
		}
	];

	const playgroundCode = $derived(`<Input
  variant="${pgVariant}"
  label="${pgLabel}"
  placeholder="${pgPlaceholder}"
  bind:value
/>`);

	const clip = createCopy();
</script>

<svelte:head>
	<title>Silk · Input</title>
	<meta
		name="description"
		content="Text input with labels, helper text, and three visual variants."
	/>
</svelte:head>

<DocHeader
	title={TITLE}
	description="The workhorse of every form. Three variants for different surface densities; bindable value and full passthrough to the underlying `<input>`."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: '3 variants' }]}
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
				class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-secondary/30 p-8"
			>
				<div class="w-full max-w-[24rem]">
					<Input
						variant={pgVariant}
						label={pgLabel}
						placeholder={pgPlaceholder}
						bind:value={pgValue}
					/>
				</div>
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
					<label
						for="pg-placeholder"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Placeholder</label
					>
					<input
						id="pg-placeholder"
						bind:value={pgPlaceholder}
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
								>{v.label}</button
							>
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
					{#if clip.copied('playground')}<Check
							size={11}
							class="text-[var(--color-success)]"
						/>Copied{:else}<Copy size={11} />Copy code{/if}
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
	<DocSection icon={Layers} title="Variants">
		<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
			{#each variantList as v}
				<div
					class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
				>
					<Input variant={v.value} label={v.label} placeholder="Placeholder text" />
					<p class="m-0 text-[0.74rem] leading-snug text-foreground-muted">{v.use}</p>
				</div>
			{/each}
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

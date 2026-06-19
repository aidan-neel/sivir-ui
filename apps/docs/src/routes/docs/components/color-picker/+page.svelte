<script lang="ts">
	import { highlight } from '$lib/highlight';
	import { ColorPicker, type ColorOption } from '@silk/ui/components/color-picker';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
	import Palette from '@lucide/svelte/icons/palette';

	const TITLE = 'Color Picker';
	const SLUG = 'color-picker';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	let pgValue = $state('#5e6ad2');
	let pgValueWithOptions = $state('#0284c7');

	const presetSwatches: ColorOption[] = [
		{ label: 'Blue', value: '#2563eb' },
		{ label: 'Indigo', value: '#4f46e5' },
		{ label: 'Violet', value: '#7c3aed' },
		{ label: 'Pink', value: '#db2777' },
		{ label: 'Rose', value: '#e11d48' },
		{ label: 'Orange', value: '#ea580c' },
		{ label: 'Amber', value: '#d97706' },
		{ label: 'Emerald', value: '#059669' },
		{ label: 'Teal', value: '#0d9488' },
		{ label: 'Sky', value: '#0284c7' }
	];

	const apiRows = [
		{ prop: 'value', type: 'string', default: '--', description: 'Hex string (e.g. `#5e6ad2`).' },
		{
			prop: 'onValueChange',
			type: '(value: string) => void',
			default: '--',
			description: 'Fires on every committed change (drag, hex, or swatch).'
		},
		{
			prop: 'options',
			type: 'ColorOption[]',
			default: '[]',
			description: 'Optional preset swatches shown under the picker.'
		},
		{
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Renders a label above the trigger.'
		},
		{
			prop: 'variant',
			type: '"outlined" | "secondary" | "ghost"',
			default: '"outlined"',
			description: 'Trigger style -- matches the Button variants.'
		},
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Wraps the trigger container -- set `w-44` for fixed width.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Color Picker</title>
	<meta
		name="description"
		content="Interactive HSV + HSL color picker with hex input and optional preset swatches."
	/>
</svelte:head>

<DocHeader
	title={TITLE}
	description="A compact color picker built around the same primitives the Theme Studio uses. Drag the SB plane, tune the hue, or punch in a hex — every change emits the same event."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'HSV + HSL' }, { label: 'Hex input' }]}
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
				class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-secondary/30 p-8"
			>
				<div class="flex flex-col items-center gap-4">
					<ColorPicker class="w-44" value={pgValue} onValueChange={(v) => (pgValue = v)} />
					<div class="flex items-center gap-2 text-[0.78rem] text-foreground-muted">
						<span
							class="size-4 rounded-md ring-1 ring-inset ring-black/10"
							style={`background:${pgValue};`}
						></span>
						<code class="font-mono text-foreground">{pgValue.toUpperCase()}</code>
					</div>
				</div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<ColorPicker value="#5e6ad2" onValueChange={(v) => (color = v)} />`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Palette} title="With preset swatches">
		<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
			Pass an array of <code class="font-mono text-foreground">ColorOption</code> to surface curated picks
			below the HSV plane.
		</p>

		<div class="grid gap-3 md:grid-cols-2">
			<div
				class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
			>
				<ColorPicker
					class="w-44"
					value={pgValueWithOptions}
					options={presetSwatches}
					onValueChange={(v) => (pgValueWithOptions = v)}
				/>
			</div>
			<pre
				class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
					>{@html highlight(
						`const swatches: ColorOption[] = [
  { label: 'Blue',    value: '#2563eb' },
  { label: 'Violet',  value: '#7c3aed' },
  { label: 'Emerald', value: '#059669' },
  // …
];

<ColorPicker
  value={color}
  options={swatches}
  onValueChange={(v) => (color = v)}
/>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</DocSection>

	<DocSection icon={Palette} title="Trigger variants">
		<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
			Style the trigger the same way as Buttons. Defaults to <code class="font-mono text-foreground"
				>outlined</code
			>.
		</p>

		<div class="grid gap-3 md:grid-cols-3">
			{#each ['outlined', 'secondary', 'ghost'] as v}
				<div
					class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
				>
					<span
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wider text-foreground-muted"
						>{v}</span
					>
					<ColorPicker
						class="w-full"
						variant={v as 'outlined' | 'secondary' | 'ghost'}
						value={pgValue}
						options={presetSwatches}
						onValueChange={(val) => (pgValue = val)}
					/>
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

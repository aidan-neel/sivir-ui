<script lang="ts">
	import { highlight } from '$lib/highlight';
	import Shortcut from '@silk/ui/components/shortcut';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Shortcut';
	const SLUG = 'shortcut';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'shortcut',
			type: 'string',
			default: '--',
			description: 'Key combination to render and listen for (e.g. `"K"`, `"shift+/"`).'
		},
		{
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Optional override display content (defaults to the shortcut text).'
		}
	];
</script>

<svelte:head>
	<title>Silk · Shortcut</title>
	<meta name="description" content="Inline keyboard-shortcut badge." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A small `kbd`-style badge for surfacing keyboard shortcuts inside buttons, menu items, and command triggers."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Inline' }]}
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
				class="flex min-h-[10rem] flex-wrap items-center justify-center gap-4 border-b border-border/70 bg-secondary/30 p-8"
			>
				<Shortcut shortcut="K">⌘K</Shortcut>
				<Shortcut shortcut="/">/</Shortcut>
				<Shortcut shortcut="enter">↵</Shortcut>
				<Shortcut shortcut="esc">esc</Shortcut>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Shortcut shortcut="K">⌘K</Shortcut>
<Shortcut shortcut="/">/</Shortcut>
<Shortcut shortcut="enter">↵</Shortcut>`,
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

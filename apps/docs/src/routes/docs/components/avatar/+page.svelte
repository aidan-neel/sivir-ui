<script lang="ts">
	import * as Avatar from '@silk/ui/components/avatar';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Avatar';
	const SLUG = 'avatar';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'size',
			type: '"sm" | "md" | "lg" | "xl"',
			default: '"md"',
			description: 'Diameter preset.'
		},
		{
			component: 'Root',
			prop: 'shape',
			type: '"circle" | "square"',
			default: '"circle"',
			description: 'Rounded vs. soft square.'
		},
		{
			component: 'Image',
			prop: 'src',
			type: 'string',
			default: '--',
			description: 'Image URL. Hides the fallback once loaded.'
		},
		{
			component: 'Image',
			prop: 'alt',
			type: 'string',
			default: '""',
			description: 'Alt text for screen readers.'
		},
		{
			component: 'Fallback',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Rendered until the image loads (or if it errors).'
		}
	];
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="An image with graceful fallback to initials."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="Render an image with initials as a fallback. Comes in four sizes and two shapes."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Image + Fallback' }]}
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
				class="flex min-h-[10rem] items-center justify-center gap-4 border-b border-border/70 bg-secondary/30 p-8"
			>
				<Avatar.Root size="sm"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
				<Avatar.Root size="md"><Avatar.Fallback>MK</Avatar.Fallback></Avatar.Root>
				<Avatar.Root size="lg"><Avatar.Fallback>SR</Avatar.Fallback></Avatar.Root>
				<Avatar.Root size="xl" shape="square"><Avatar.Fallback>LP</Avatar.Fallback></Avatar.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Avatar.Root>
  <Avatar.Image src="/avatar.jpg" alt="Aidan" />
  <Avatar.Fallback>AN</Avatar.Fallback>
</Avatar.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Avatar" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

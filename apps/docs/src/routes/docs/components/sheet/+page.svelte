<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { highlight } from '$lib/highlight';
	import * as Sheet from '@silk/ui/components/sheet';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
	import Menu from '@lucide/svelte/icons/menu';

	const TITLE = 'Sheet';
	const SLUG = 'sheet';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Bindable controlled open state.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders as a Button.'
		},
		{
			component: 'Content',
			prop: 'side',
			type: '"left" | "right"',
			default: '"right"',
			description: 'Edge to anchor to. Animation flips automatically.'
		},
		{
			component: 'Content',
			prop: 'allowClickOutside',
			type: 'boolean',
			default: 'true',
			description: 'Disable to force explicit close.'
		},
		{
			component: 'Title / Description / Header / Footer',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Layout slots -- same shape as Dialog.'
		},
		{
			component: 'Close',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Closes the sheet on click.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Sheet</title>
	<meta
		name="description"
		content="An edge-anchored drawer for mobile menus, filters, and side panels."
	/>
</svelte:head>

<DocHeader
	title={TITLE}
	description="A modal drawer that slides in from the side. Use it for mobile navigation, filter panels, and anything that wants the full height of the viewport without being a full Dialog."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Left + Right' }]}
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
				class="flex min-h-[10rem] items-center justify-center gap-3 border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Sheet.Root>
					<Sheet.Trigger variant="outlined">
						<Menu size={14} />
						Open left
					</Sheet.Trigger>
					<Sheet.Content side="left">
						<Sheet.Header>
							<Sheet.Title>Menu</Sheet.Title>
							<Sheet.Description>Navigate around the app.</Sheet.Description>
						</Sheet.Header>
						<div class="flex flex-col gap-2 py-4">
							<Button variant="ghost" class="justify-start">Dashboard</Button>
							<Button variant="ghost" class="justify-start">Projects</Button>
							<Button variant="ghost" class="justify-start">Settings</Button>
						</div>
					</Sheet.Content>
				</Sheet.Root>

				<Sheet.Root>
					<Sheet.Trigger variant="outlined">
						<Menu size={14} />
						Open right
					</Sheet.Trigger>
					<Sheet.Content side="right">
						<Sheet.Header>
							<Sheet.Title>Filters</Sheet.Title>
							<Sheet.Description>Narrow down the results.</Sheet.Description>
						</Sheet.Header>
						<div class="py-4 text-[0.86rem] text-foreground-muted">…filter controls…</div>
					</Sheet.Content>
				</Sheet.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content side="left">
    <Sheet.Header>
      <Sheet.Title>Menu</Sheet.Title>
      <Sheet.Description>Navigate around the app.</Sheet.Description>
    </Sheet.Header>
    {/* …content… */}
  </Sheet.Content>
</Sheet.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Sheet" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

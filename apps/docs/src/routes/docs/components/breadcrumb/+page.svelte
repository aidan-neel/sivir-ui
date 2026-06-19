<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as Breadcrumb from '@silk/ui/components/breadcrumb';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
	import Slash from '@lucide/svelte/icons/slash';
	import Home from '@lucide/svelte/icons/home';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const TITLE = 'Breadcrumb';
	const SLUG = 'breadcrumb';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Container -- flexes Items + Separators inline.'
		},
		{
			component: 'Item',
			prop: 'href',
			type: 'string',
			default: '--',
			description: 'Renders as a link. Omit to render the current page (no link, dimmer text).'
		},
		{ component: 'Item', prop: 'children', type: 'Snippet', default: '--', description: 'Label.' },
		{
			component: 'Separator',
			prop: 'children',
			type: 'Snippet',
			default: '"/"',
			description: 'Custom separator (swap for an icon like ChevronRight or Slash).'
		}
	];
</script>

<svelte:head>
	<title>Silk · Breadcrumb</title>
	<meta name="description" content="A trail of links showing the user's position in a hierarchy." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="Shows where the user is in a nested hierarchy and lets them jump back up. Keep them short — if you need more than five items, your hierarchy is probably the problem."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: '3 sub-components' }]}
/>

<!-- Playground / preview -->
<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div
				class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-secondary/30 p-8"
			>
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/docs/introduction">Docs</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
					<Breadcrumb.Item href="/docs/components">Components</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Breadcrumb.Root>
  <Breadcrumb.Item href="/docs/introduction">Docs</Breadcrumb.Item>
  <Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
  <Breadcrumb.Item href="/docs/components">Components</Breadcrumb.Item>
  <Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
  <Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
</Breadcrumb.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={Slash}
		title="Separators"
		description="Three common choices. Pick one and use it everywhere — mixing separators in the same app looks accidental."
	>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<div
				class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
			>
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Chevron</span
				>
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Page</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
			<div
				class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
			>
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Slash</span
				>
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Separator><Slash size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Page</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
			<div
				class="flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
			>
				<span
					class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Dot</span
				>
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
					<Breadcrumb.Separator
						><span class="text-[1rem] leading-none">·</span></Breadcrumb.Separator
					>
					<Breadcrumb.Item>Page</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
		</div>
	</DocSection>

	<DocSection icon={Home} title="With a home icon">
		<div class="grid gap-3 md:grid-cols-2">
			<div
				class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-6"
			>
				<Breadcrumb.Root>
					<Breadcrumb.Item href="/">
						<Home size={13} />
					</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
					<Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Components</Breadcrumb.Item>
				</Breadcrumb.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
					>{@html highlight(
						`<Breadcrumb.Root>
  <Breadcrumb.Item href="/">
    <Home size={13} />
  </Breadcrumb.Item>
  <Breadcrumb.Separator>
    <ChevronRight size={12} />
  </Breadcrumb.Separator>
  <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
  <Breadcrumb.Separator>
    <ChevronRight size={12} />
  </Breadcrumb.Separator>
  <Breadcrumb.Item>Components</Breadcrumb.Item>
</Breadcrumb.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Breadcrumb" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

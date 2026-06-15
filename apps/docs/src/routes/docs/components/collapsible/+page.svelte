<script lang="ts">
	import * as Collapsible from '@silk/ui/components/collapsible';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	const TITLE = 'Collapsible';
	const SLUG = 'collapsible';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Bindable open state.'
		},
		{
			component: 'Root',
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disable the trigger.'
		},
		{
			component: 'Trigger',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Toggles `open`. Renders as a `<button>` you can style.'
		},
		{
			component: 'Content',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Auto-animated via CSS grid-template-rows -- no height measurement.'
		}
	];

	let open = $state(true);
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="Show or hide content with a smooth height transition."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="A single show/hide region. The expand/collapse animation runs on CSS grid-template-rows — no JS height measurement."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'CSS height transition' }]}
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
				class="flex min-h-[12rem] items-center justify-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Collapsible.Root bind:open>
					<div class="w-80 rounded-[var(--radius-md)] border border-border bg-background">
						<Collapsible.Trigger
							class="flex w-full items-center justify-between px-4 py-2.5 text-[0.86rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
						>
							@aidan-neel starred 3 repos
							<ChevronDown size={14} class={`transition-transform ${open ? 'rotate-180' : ''}`} />
						</Collapsible.Trigger>
						<Collapsible.Content>
							<div
								class="flex flex-col gap-1.5 border-t border-border px-4 py-3 text-[0.82rem] text-foreground-muted"
							>
								<span>aidan-neel/silk</span>
								<span>sveltejs/svelte</span>
								<span>shadcn-ui/ui</span>
							</div>
						</Collapsible.Content>
					</div>
				</Collapsible.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Collapsible.Root bind:open>
  <Collapsible.Trigger>Show details</Collapsible.Trigger>
  <Collapsible.Content>
    {/* …content… */}
  </Collapsible.Content>
</Collapsible.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Collapsible" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as Modal from '@silk/ui/components/modal';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Modal';
	const SLUG = 'modal';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Required prop. Bindable for controlled state.'
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
			prop: 'allowClickOutside',
			type: 'boolean',
			default: 'true',
			description: 'Disable to force the user to confirm or close explicitly.'
		},
		{
			component: 'Content',
			prop: 'role',
			type: '"dialog" | "alertdialog"',
			default: '"dialog"',
			description: 'ARIA role.'
		},
		{
			component: 'Title / Description / Header / Footer',
			prop: '--',
			type: '--',
			default: '--',
			description: 'Layout slots.'
		},
		{
			component: 'Close',
			prop: 'onclick',
			type: '() => void',
			default: '--',
			description: 'Closes the modal.'
		},
		{
			component: 'Confirm',
			prop: 'onclick',
			type: '() => void',
			default: '--',
			description: 'Fires action then closes.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Modal</title>
	<meta
		name="description"
		content="The primitive overlay shared by Dialog, AlertDialog, and Sheet."
	/>
</svelte:head>

<DocHeader
	title={TITLE}
	description="The low-level overlay primitive used by Dialog, AlertDialog, and the publish/admin flows. You probably want one of those — reach for Modal directly only when you need a custom surface shape."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Primitive' }]}
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
				class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Modal.Root open={false}>
					<Modal.Trigger>Open modal</Modal.Trigger>
					<Modal.Content class="max-w-[28rem]">
						<Modal.Header>
							<Modal.Title>Custom modal</Modal.Title>
							<Modal.Description>Roll your own structure when Dialog doesn't fit.</Modal.Description
							>
						</Modal.Header>
						<Modal.Footer>
							<Modal.Close>Cancel</Modal.Close>
							<Modal.Confirm>OK</Modal.Confirm>
						</Modal.Footer>
					</Modal.Content>
				</Modal.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Modal.Root open={false}>
  <Modal.Trigger>Open</Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Custom modal</Modal.Title>
      <Modal.Description>…</Modal.Description>
    </Modal.Header>
    <Modal.Footer>
      <Modal.Close>Cancel</Modal.Close>
      <Modal.Confirm>OK</Modal.Confirm>
    </Modal.Footer>
  </Modal.Content>
</Modal.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Modal" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />

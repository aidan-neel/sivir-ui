<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { highlight } from '$lib/highlight';
	import { toast } from '@silk/ui/components/toast';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Toast';
	const SLUG = 'toast';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{ prop: 'title', type: 'string', default: '--', description: 'Required headline.' },
		{ prop: 'description', type: 'string', default: '--', description: 'Optional second line.' },
		{
			prop: 'type',
			type: '"default" | "info" | "success" | "warning" | "error"',
			default: '"default"',
			description: 'Variant -- picks icon + accent.'
		},
		{
			prop: 'duration',
			type: 'number',
			default: '4000',
			description: 'Time in ms before auto-dismiss. Pass `Infinity` to require user dismissal.'
		},
		{
			prop: 'actions',
			type: '{ label, variant, callback }[]',
			default: '[]',
			description: 'Inline action buttons rendered at the end of the toast.'
		}
	];

	function fakeUpload(): Promise<string> {
		return new Promise((resolve) => setTimeout(() => resolve('avatar.png'), 1400));
	}
</script>

<svelte:head>
	<title>Silk · Toast</title>
	<meta name="description" content="Transient notifications fired from anywhere in your app." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="Fire a notification from anywhere — click handlers, server responses, async flows. Toasts stack, auto-dismiss, and can carry actions if recovery is one click away."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Imperative API' }]}
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
				class="flex min-h-[10rem] flex-wrap items-center justify-center gap-2 border-b border-border/70 bg-secondary/30 p-8"
			>
				<Button
					onclick={() =>
						toast({ title: 'Heads up', description: 'A neutral toast.', type: 'default' })}
					>Default</Button
				>
				<Button
					variant="success"
					onclick={() =>
						toast.success('Profile updated', { description: 'Your changes have been saved.' })}
					>Success</Button
				>
				<Button
					variant="error"
					onclick={() =>
						toast.error('Request failed', { description: 'Could not connect to the server.' })}
					>Error</Button
				>
				<Button
					variant="warning"
					onclick={() =>
						toast.warning('Storage almost full', { description: 'You have 200 MB remaining.' })}
					>Warning</Button
				>
				<Button
					variant="outlined"
					onclick={() => toast.info('New version', { description: 'Refresh to update.' })}
					>Info</Button
				>
				<Button
					variant="flat"
					onclick={() =>
						toast.promise(fakeUpload(), {
							loading: 'Uploading…',
							success: (name) => `${name} uploaded`,
							error: (err) => (err instanceof Error ? err.message : 'Upload failed')
						})}>Promise</Button
				>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`import { toast } from '@silk/ui/components/toast';

toast.success('Profile updated', { description: '…' });
toast.error('Request failed', { description: 'Could not connect.' });
toast.promise(uploadFile(), {
  loading: 'Uploading…',
  success: (name) => \`\${name} uploaded\`,
  error: (err) => (err instanceof Error ? err.message : 'Upload failed'),
});`,
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

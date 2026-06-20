<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import { toast } from '@silk/ui/components/toast';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';

	const TITLE = 'Toast';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/toast';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

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

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add toast';

	function fakeUpload(): Promise<string> {
		return new Promise((resolve) => setTimeout(() => resolve('avatar.png'), 1400));
	}
</script>

<svelte:head>
	<title>Silk · Toast</title>
	<meta name="description" content="Transient notifications fired from anywhere in your app." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]"
				>Component</Badge
			>
			<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">Imperative API</Badge>
		</div>
		<Button
			href={SOURCE}
			variant="outline"
			class="h-auto gap-1.5 px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] text-[0.66rem] leading-[1.2]"
			target="_blank"
			rel="noreferrer noopener"
		>
			View source
			<External size={11} />
		</Button>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1] tracking-[-0.035em] md:text-[3rem]"
			style="font-family: var(--font-header);"
		>
			Toast
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			Fire a notification from anywhere — click handlers, server responses, async flows. Toasts
			stack, auto-dismiss, and can carry actions if recovery is one click away.
		</p>
	</div>

	<div
		class="flex items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
	>
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"
				><Hash size={12} /></span
			><code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code>
		</div>
		<button
			type="button"
			onclick={() => copy(installCommand, 'install')}
			class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
			aria-label="Copy install command"
		>
			{#if copiedSnippet === 'install'}<Check
					size={14}
					class="text-[var(--color-success)]"
				/>{:else}<Copy size={14} />{/if}
		</button>
	</div>
</header>

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
				class="flex min-h-[10rem] flex-wrap items-center justify-center gap-2 border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Button
					onclick={() =>
						toast({ title: 'Heads up', description: 'A neutral toast.', type: 'default' })}
					>Default</Button
				>
				<Button
					variant="primary"
					onclick={() =>
						toast.success('Profile updated', { description: 'Your changes have been saved.' })}
					>Success</Button
				>
				<Button
					variant="destructive"
					onclick={() =>
						toast.error('Request failed', { description: 'Could not connect to the server.' })}
					>Error</Button
				>
				<Button
					variant="primary"
					onclick={() =>
						toast.warning('Storage almost full', { description: 'You have 200 MB remaining.' })}
					>Warning</Button
				>
				<Button
					variant="outline"
					onclick={() => toast.info('New version', { description: 'Refresh to update.' })}
					>Info</Button
				>
				<Button
					variant="ghost"
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
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"
				><Hash size={12} /></span
			>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				API
			</h2>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row, i (i)}
					<li class="grid grid-cols-[1fr_1.6fr_0.5fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<code
							class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]"
							>{row.prop}</code
						>
						<div class="flex flex-col gap-1">
							<code
								class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground"
								>{row.type}</code
							>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">{row.description}</p>
						</div>
						<div class="md:text-right">
							<code
								class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem]"
								>{row.default}</code
							>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section
		class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
	>
		<div class="flex flex-col gap-1">
			<p
				class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Want to make it yours?
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Every Silk component reads from your theme tokens — open the studio to restyle them.
			</p>
		</div>
		<Button href="/themes/studio">Open theme studio<ArrowRight size={14} /></Button>
	</section>
</div>

{#if curIndex !== -1}
	<div
		class="mt-12 flex w-full items-center"
		class:justify-between={prevComponent && nextComponent}
		class:justify-end={!prevComponent && nextComponent}
		class:justify-start={prevComponent && !nextComponent}
	>
		{#if prevComponent}<Button
				href={`/docs/components/${prevComponent}`}
				variant="outline"
				class="flex-shrink-0"><ChevronLeft size={16} />{sanitizeComponent(prevComponent)}</Button
			>{/if}
		{#if prevComponent && nextComponent}<div class="mx-4 w-full rounded-lg border-t"></div>{/if}
		{#if nextComponent}<Button
				href={`/docs/components/${nextComponent}`}
				variant="outline"
				class="flex-shrink-0">{sanitizeComponent(nextComponent)}<ChevronRight size={16} /></Button
			>{/if}
	</div>
{/if}

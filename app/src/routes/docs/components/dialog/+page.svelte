<script lang="ts">
	import { Button } from '$lib/silk/components/button';
	import { Badge } from '$lib/silk/components/badge';
	import { highlight } from '$lib/highlight';
	import * as Dialog from '$lib/silk/components/dialog';
	import { Input } from '$lib/silk/components/input';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import Plus from '@lucide/svelte/icons/plus';
	import X from '@lucide/svelte/icons/x';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Send from '@lucide/svelte/icons/send';
	import Lock from '@lucide/svelte/icons/lock';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import { Switch } from '$lib/silk/components/switch';
	import { Checkbox } from '$lib/silk/components/checkbox';

	const TITLE = 'Dialog';
	const SLUG = 'dialog';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/dialog';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	const apiRows = [
		{ component: 'Root', prop: 'open', type: 'boolean', default: 'false', description: 'Bindable controlled state. Pair with `bind:open` for programmatic control.' },
		{ component: 'Trigger', prop: '…ButtonProps', type: '—', default: '—', description: 'Renders as a Silk Button.' },
		{ component: 'Content', prop: 'allowClickOutside', type: 'boolean', default: 'true', description: 'Set false to require explicit Cancel/Confirm.' },
		{ component: 'Header / Footer', prop: 'children', type: 'Snippet', default: '—', description: 'Layout containers — Header for title row, Footer for actions.' },
		{ component: 'Title', prop: 'children', type: 'Snippet', default: '—', description: 'Short headline using --font-header.' },
		{ component: 'Description', prop: 'children', type: 'Snippet', default: '—', description: 'Subtitle in foreground-muted.' },
		{ component: 'Exit', prop: 'onclick', type: '() => void', default: '—', description: 'Closes the dialog. Optional handler runs first.' },
		{ component: 'Confirm', prop: 'onclick', type: '() => void', default: '—', description: 'Fires the primary action, then closes.' }
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

	const installCommand = 'bunx @aidan-neel/ui add dialog';
</script>

<svelte:head>
	<title>Silk · Dialog</title>
	<meta name="description" content="A modal surface for focused tasks and forms." />
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
		<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">Focus-trapped</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">Portaled</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1 class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] leading-[1] tracking-[-0.035em] md:text-[3rem]" style="font-family: var(--font-header);">Dialog</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			A focused modal for forms, editors, and one-off flows. Renders portaled to the document
			body so it always sits above the rest of your app — no z-index gymnastics required.
		</p>
	</div>

	<div class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5"><span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"><Hash size={12} /></span><code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code></div>
		<button type="button" onclick={() => copy(installCommand, 'install')} class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground" aria-label="Copy install command">
			{#if copiedSnippet === 'install'}<Check size={14} class="text-[var(--color-success)]" />{:else}<Copy size={14} />{/if}
		</button>
	</div>
</header>

<!-- Preview -->
<section class="pt-10">
	<div class="relative">
		<div class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"></div>
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]">
			<div class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8">
				<Dialog.Root open={false}>
					<Dialog.Trigger><Plus size={14} /> New project</Dialog.Trigger>
					<Dialog.Content class="w-full max-w-[28rem] gap-0 overflow-hidden p-0">
						<div class="flex shrink-0 items-start justify-between px-5 py-4">
							<div class="flex flex-col gap-1">
								<Dialog.Title>Create a new project</Dialog.Title>
								<Dialog.Description>Give your project a name to get started.</Dialog.Description>
							</div>
							<Dialog.Exit variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close"><X size={14} /></Dialog.Exit>
						</div>
						<div class="flex flex-col gap-3 px-5 py-4">
							<Input label="Project name" variant="outlined" placeholder="e.g. Marketing site" />
						</div>
						<div class="flex shrink-0 items-center justify-end gap-2 px-5 py-3">
							<Dialog.Exit variant="ghost" size="sm">Cancel</Dialog.Exit>
							<Dialog.Confirm size="sm">Create</Dialog.Confirm>
						</div>
					</Dialog.Content>
				</Dialog.Root>
			</div>
			<pre class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(`<Dialog.Root>
  <Dialog.Trigger>New project</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Create a new project</Dialog.Title>
    <Dialog.Description>Give your project a name…</Dialog.Description>
    <Input label="Project name" />
    <Dialog.Footer>
      <Dialog.Exit>Cancel</Dialog.Exit>
      <Dialog.Confirm onclick={create}>Create</Dialog.Confirm>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>`, "svelte")}</code></pre>
		</div>
	</div>
</section>

<!-- Real-world examples -->
<section class="pt-12 flex flex-col gap-5">
	<div class="flex flex-col gap-1">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Sparkles size={12} />
			</span>
			<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">
				Real-world examples
			</h2>
		</div>
		<p class="m-0 text-[0.86rem] text-foreground-muted">
			Four patterns we shipped in production. Click any trigger to open.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<!-- Invite -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
			<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted">Invite collaborator</span>
			<Dialog.Root open={false}>
				<Dialog.Trigger variant="outlined"><Send size={13} /> Invite</Dialog.Trigger>
				<Dialog.Content class="w-full max-w-[28rem] gap-0 overflow-hidden p-0">
					<div class="flex shrink-0 items-start justify-between px-5 py-4">
						<div class="flex flex-col gap-1">
							<Dialog.Title>Invite to workspace</Dialog.Title>
							<Dialog.Description>They'll get an email with a sign-in link.</Dialog.Description>
						</div>
						<Dialog.Exit variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close"><X size={14} /></Dialog.Exit>
					</div>
					<div class="flex flex-col gap-3 px-5 py-4">
						<Input label="Email address" type="email" variant="outlined" placeholder="teammate@silk-ui.dev" />
						<Checkbox variant="default" checked={false} label="Send personal message" description="Add a short note to the invite email." />
					</div>
					<div class="flex shrink-0 items-center justify-end gap-2 px-5 py-3">
						<Dialog.Exit variant="ghost" size="sm">Cancel</Dialog.Exit>
						<Dialog.Confirm size="sm"><Send size={12} /> Send invite</Dialog.Confirm>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>

		<!-- Change password -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
			<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted">Change password</span>
			<Dialog.Root open={false}>
				<Dialog.Trigger variant="outlined"><Lock size={13} /> Change password</Dialog.Trigger>
				<Dialog.Content class="w-full max-w-[28rem] gap-0 overflow-hidden p-0">
					<div class="flex shrink-0 items-start justify-between px-5 py-4">
						<div class="flex flex-col gap-1">
							<Dialog.Title>New password</Dialog.Title>
							<Dialog.Description>You'll be signed out of other devices.</Dialog.Description>
						</div>
						<Dialog.Exit variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close"><X size={14} /></Dialog.Exit>
					</div>
					<div class="flex flex-col gap-3 px-5 py-4">
						<Input label="Current password" type="password" variant="outlined" />
						<Input label="New password" type="password" variant="outlined" />
						<Input label="Confirm new password" type="password" variant="outlined" />
					</div>
					<div class="flex shrink-0 items-center justify-end gap-2 px-5 py-3">
						<Dialog.Exit variant="ghost" size="sm">Cancel</Dialog.Exit>
						<Dialog.Confirm size="sm">Update password</Dialog.Confirm>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>

		<!-- Add payment -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
			<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted">Add payment method</span>
			<Dialog.Root open={false}>
				<Dialog.Trigger variant="primary"><CreditCard size={13} /> Add card</Dialog.Trigger>
				<Dialog.Content class="w-full max-w-[30rem] gap-0 overflow-hidden p-0">
					<div class="flex shrink-0 items-start justify-between px-5 py-4">
						<div class="flex flex-col gap-1">
							<Dialog.Title>Add a payment method</Dialog.Title>
							<Dialog.Description>Card details are processed by Stripe and never stored on our servers.</Dialog.Description>
						</div>
						<Dialog.Exit variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close"><X size={14} /></Dialog.Exit>
					</div>
					<div class="flex flex-col gap-3 px-5 py-4">
						<Input label="Cardholder name" variant="outlined" placeholder="Aidan Neel" />
						<Input label="Card number" variant="outlined" placeholder="4242 4242 4242 4242" />
						<div class="grid grid-cols-2 gap-3">
							<Input label="Expiry" variant="outlined" placeholder="MM/YY" />
							<Input label="CVC" variant="outlined" placeholder="123" />
						</div>
						<Switch label="Make this my default" description="Use for future renewals." />
					</div>
					<div class="flex shrink-0 items-center justify-end gap-2 px-5 py-3">
						<Dialog.Exit variant="ghost" size="sm">Cancel</Dialog.Exit>
						<Dialog.Confirm size="sm">Save card</Dialog.Confirm>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>

		<!-- Submit feedback -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
			<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted">Send feedback</span>
			<Dialog.Root open={false}>
				<Dialog.Trigger variant="ghost">Send feedback</Dialog.Trigger>
				<Dialog.Content class="w-full max-w-[28rem] gap-0 overflow-hidden p-0">
					<div class="flex shrink-0 items-start justify-between px-5 py-4">
						<div class="flex flex-col gap-1">
							<Dialog.Title>What's on your mind?</Dialog.Title>
							<Dialog.Description>Bug, idea, rant — anything goes. We read every one.</Dialog.Description>
						</div>
						<Dialog.Exit variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close"><X size={14} /></Dialog.Exit>
					</div>
					<div class="flex flex-col gap-3 px-5 py-4">
						<label class="flex flex-col gap-1">
							<span class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] text-foreground">Feedback</span>
							<textarea
								rows={4}
								class="resize-none rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 py-2 text-[0.86rem] leading-relaxed text-foreground outline-none transition-[border-color,box-shadow] focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
								placeholder="The Theme Studio is fantastic, but I wish…"
							></textarea>
						</label>
						<Checkbox variant="default" checked={false} label="Email me when you ship a fix" />
					</div>
					<div class="flex shrink-0 items-center justify-end gap-2 px-5 py-3">
						<Dialog.Exit variant="ghost" size="sm">Cancel</Dialog.Exit>
						<Dialog.Confirm size="sm">Send</Dialog.Confirm>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary"><Hash size={12} /></span>
			<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">API</h2>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row}
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted">Dialog.{row.component}</code>
							<code class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)]">{row.prop}</code>
						</div>
						<div class="flex flex-col gap-1">
							<code class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground">{row.type}</code>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">{row.description}</p>
						</div>
						<div class="md:text-right"><code class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem]">{row.default}</code></div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center">
		<div class="flex flex-col gap-1">
			<p class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">Want to make it yours?</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">Every Silk component reads from your theme tokens — open the studio to restyle them.</p>
		</div>
		<Button href="/themes/studio">Open theme studio<ArrowRight size={14} /></Button>
	</section>
</div>

{#if curIndex !== -1}
	<div class="mt-12 flex w-full items-center" class:justify-between={prevComponent && nextComponent} class:justify-end={!prevComponent && nextComponent} class:justify-start={prevComponent && !nextComponent}>
		{#if prevComponent}<Button href={`/docs/components/${prevComponent}`} variant="outlined" class="flex-shrink-0"><ChevronLeft size={16} />{sanitizeComponent(prevComponent)}</Button>{/if}
		{#if prevComponent && nextComponent}<div class="mx-4 w-full rounded-lg border-t"></div>{/if}
		{#if nextComponent}<Button href={`/docs/components/${nextComponent}`} variant="outlined" class="flex-shrink-0">{sanitizeComponent(nextComponent)}<ChevronRight size={16} /></Button>{/if}
	</div>
{/if}

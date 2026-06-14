<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import * as AlertDialog from '@silk/ui/components/alert-dialog';
	import * as Tabs from '@silk/ui/components/tabs';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import Trash from '@lucide/svelte/icons/trash-2';

	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/alert-dialog';

	const curIndex = components.indexOf('alert-dialog');
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	let pgTitle = $state('Delete this workspace?');
	let pgDescription = $state(
		'All projects, comments, and exports will be removed. This action cannot be undone.'
	);

	const apiRows = [
		{
			component: 'Root',
			prop: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Optional bindable open state.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders as a Silk Button. Inherits every Button prop.'
		},
		{
			component: 'Content',
			prop: 'allowClickOutside',
			type: 'boolean',
			default: 'true',
			description: 'Disable to force the user to confirm or exit explicitly.'
		},
		{
			component: 'Content',
			prop: 'variant',
			type: '"default" | "spotlight"',
			default: '"default"',
			description:
				'Surface treatment. "spotlight" is a focused, centered layout with full-width actions.'
		},
		{
			component: 'Header',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Container for Title + Description.'
		},
		{
			component: 'Title',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Short, decisive question or statement.'
		},
		{
			component: 'Description',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'One or two sentences explaining the consequence.'
		},
		{
			component: 'Footer',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Action row -- keep Cancel on the left, Confirm on the right.'
		},
		{
			component: 'Exit',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Closes the dialog without firing the action.'
		},
		{
			component: 'Confirm',
			prop: 'onclick',
			type: '() => void',
			default: '--',
			description: 'Fires the action and closes the dialog.'
		}
	];

	const playgroundCode = $derived(`<AlertDialog.Root>
  <AlertDialog.Trigger variant="destructive">Delete</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>${pgTitle || 'Title'}</AlertDialog.Title>
      <AlertDialog.Description>
        ${pgDescription || 'Description'}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Cancel</AlertDialog.Exit>
      <AlertDialog.Confirm>Continue</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`);

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add alert-dialog';
</script>

<svelte:head>
	<title>Silk · Alert Dialog</title>
	<meta
		name="description"
		content="A modal that interrupts the user to confirm a consequential action."
	/>
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]"
				>Component</Badge
			>
			<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">9 sub-components</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">Composable</Badge>
		</div>
		<a
			href={SOURCE}
			target="_blank"
			rel="noreferrer noopener"
			class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
		>
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1] tracking-[-0.035em] md:text-[3rem]"
			style="font-family: var(--font-header);"
		>
			Alert Dialog
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			A modal that stops everything to ask one question. Reach for it when an action is expensive,
			irreversible, or affects other people. If the user can shrug and undo, use a Toast instead.
		</p>
	</div>

	<div
		class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
	>
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted">
				<Hash size={12} />
			</span>
			<code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code>
		</div>
		<button
			type="button"
			onclick={() => copy(installCommand, 'install')}
			class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
			aria-label="Copy install command"
		>
			{#if copiedSnippet === 'install'}
				<Check size={14} class="text-[var(--color-success)]" />
			{:else}
				<Copy size={14} />
			{/if}
		</button>
	</div>
</header>

<!-- ─── Playground ──────────────────────────────────────────────── -->
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
				<AlertDialog.Root>
					<AlertDialog.Trigger variant="destructive">
						<Trash size={14} />
						Delete workspace
					</AlertDialog.Trigger>
					<AlertDialog.Content class="max-w-[28rem]">
						<AlertDialog.Header>
							<AlertDialog.Title>{pgTitle || 'Title'}</AlertDialog.Title>
							<AlertDialog.Description>{pgDescription || 'Description'}</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Exit>Cancel</AlertDialog.Exit>
							<AlertDialog.Confirm>Delete</AlertDialog.Confirm>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>

			<div class="flex flex-col divide-y divide-border/60">
				<div class="flex flex-col gap-2 px-6 py-4">
					<label
						for="pg-title"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Title</label
					>
					<input
						id="pg-title"
						bind:value={pgTitle}
						class="h-9 w-full max-w-[28rem] rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-muted focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>

				<div class="flex flex-col gap-2 px-6 py-4">
					<label
						for="pg-desc"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Description</label
					>
					<input
						id="pg-desc"
						bind:value={pgDescription}
						class="h-9 w-full rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-muted focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>
			</div>

			<div
				class="flex items-center justify-between gap-2 border-t border-border/70 bg-secondary/40 px-6 py-2.5"
			>
				<span
					class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Snippet</span
				>
				<button
					type="button"
					onclick={() => copy(playgroundCode, 'playground')}
					class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[0.72rem] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
				>
					{#if copiedSnippet === 'playground'}
						<Check size={11} class="text-[var(--color-success)]" />
						Copied
					{:else}
						<Copy size={11} />
						Copy code
					{/if}
				</button>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(playgroundCode, 'svelte')}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<!-- USAGE PATTERNS -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Layers size={12} />
				</span>
				<h2
					class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					Patterns
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Two situations make up 90% of Alert Dialogs in real products.
			</p>
		</div>

		<Tabs.Root value="destructive">
			<Tabs.List>
				<Tabs.Trigger value="destructive">Destructive confirmation</Tabs.Trigger>
				<Tabs.Trigger value="sign-out">Sign out</Tabs.Trigger>
				<Tabs.Trigger value="spotlight">Spotlight</Tabs.Trigger>
			</Tabs.List>

			<div class="mt-3 grid gap-3 md:grid-cols-2">
				<Tabs.Content value="destructive" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<AlertDialog.Root>
							<AlertDialog.Trigger variant="destructive">Delete project</AlertDialog.Trigger>
							<AlertDialog.Content class="max-w-[26rem]">
								<AlertDialog.Header>
									<AlertDialog.Title>Delete this project?</AlertDialog.Title>
									<AlertDialog.Description>
										All branches, issues, and deploy history will be permanently removed.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Exit>Cancel</AlertDialog.Exit>
									<AlertDialog.Confirm>Delete project</AlertDialog.Confirm>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<AlertDialog.Root>
  <AlertDialog.Trigger variant="destructive">
    Delete project
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this project?</AlertDialog.Title>
      <AlertDialog.Description>
        All branches, issues, and deploy history…
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Cancel</AlertDialog.Exit>
      <AlertDialog.Confirm>Delete project</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>

				<Tabs.Content value="sign-out" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<AlertDialog.Root>
							<AlertDialog.Trigger variant="outlined">Sign out</AlertDialog.Trigger>
							<AlertDialog.Content class="max-w-[24rem]">
								<AlertDialog.Header>
									<AlertDialog.Title>Sign out?</AlertDialog.Title>
									<AlertDialog.Description>
										You'll need to sign in again to resume your session.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Exit>Stay</AlertDialog.Exit>
									<AlertDialog.Confirm>Sign out</AlertDialog.Confirm>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<AlertDialog.Root>
  <AlertDialog.Trigger variant="outlined">Sign out</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Sign out?</AlertDialog.Title>
      <AlertDialog.Description>
        You'll need to sign in again to resume your session.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Stay</AlertDialog.Exit>
      <AlertDialog.Confirm>Sign out</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>

				<Tabs.Content value="spotlight" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<AlertDialog.Root>
							<AlertDialog.Trigger>Show spotlight</AlertDialog.Trigger>
							<AlertDialog.Content variant="spotlight">
								<AlertDialog.Header>
									<AlertDialog.Title>Are you sure you want to do this?</AlertDialog.Title>
									<AlertDialog.Description>
										A focused, centered take on the same composable parts — just pass
										<code>variant="spotlight"</code> to Content.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Exit>Cancel</AlertDialog.Exit>
									<AlertDialog.Confirm>Continue</AlertDialog.Confirm>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<AlertDialog.Root>
  <AlertDialog.Trigger>Show spotlight</AlertDialog.Trigger>
  <AlertDialog.Content variant="spotlight">
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure you want to do this?</AlertDialog.Title>
      <AlertDialog.Description>
        A high-contrast, centered take on the same parts.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Cancel</AlertDialog.Exit>
      <AlertDialog.Confirm>Continue</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	</section>

	<!-- API -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Hash size={12} />
				</span>
				<h2
					class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					API
				</h2>
			</div>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row}
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted"
								>AlertDialog.{row.component}</code
							>
							<code
								class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]"
								>{row.prop}</code
							>
						</div>
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
		{#if prevComponent}
			<Button href={`/docs/components/${prevComponent}`} variant="outlined" class="flex-shrink-0">
				<ChevronLeft size={16} />
				{sanitizeComponent(prevComponent)}
			</Button>
		{/if}
		{#if prevComponent && nextComponent}
			<div class="mx-4 w-full rounded-lg border-t"></div>
		{/if}
		{#if nextComponent}
			<Button href={`/docs/components/${nextComponent}`} variant="outlined" class="flex-shrink-0">
				{sanitizeComponent(nextComponent)}
				<ChevronRight size={16} />
			</Button>
		{/if}
	</div>
{/if}

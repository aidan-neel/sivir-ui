<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { ComponentPreview, Steps } from '$lib/components/docs';
	import { highlight } from '$lib/highlight';
	import * as AlertDialog from '@silk/ui/components/alert-dialog';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Hash from '@lucide/svelte/icons/hash';
	import External from '@lucide/svelte/icons/external-link';
	import Trash from '@lucide/svelte/icons/trash-2';

	const TITLE = 'Alert Dialog';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/alert-dialog';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

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

	const heroCode = `<AlertDialog.Root>
  <AlertDialog.Trigger variant="destructive">Delete</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
      <AlertDialog.Description>
        All projects, comments, and exports will be removed. This action cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Cancel</AlertDialog.Exit>
      <AlertDialog.Confirm>Delete</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`;

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

<div data-docs-page class="flex flex-col gap-10">
	<!-- ─── Header ────────────────────────────────────────────────── -->
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				Alert Dialog
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A modal that stops everything to ask one question. Reach for it when an action is expensive,
				irreversible, or affects other people. If the user can shrug and undo, use a Toast instead.
			</p>
		</div>
	</header>

	<!-- ─── Hero Example ──────────────────────────────────────────── -->
	<section id="hero" class="scroll-mt-20 flex flex-col gap-4">
		<ComponentPreview code={heroCode}>
			<div class="grid place-items-center">
				<AlertDialog.Root>
					<AlertDialog.Trigger variant="destructive">
						<Trash size={14} />
						Delete workspace
					</AlertDialog.Trigger>
					<AlertDialog.Content class="max-w-[28rem]">
						<AlertDialog.Header>
							<AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
							<AlertDialog.Description>
								All projects, comments, and exports will be removed. This action cannot be undone.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Exit>Cancel</AlertDialog.Exit>
							<AlertDialog.Confirm>Delete</AlertDialog.Confirm>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</ComponentPreview>
	</section>

	<!-- ─── Installation ──────────────────────────────────────────── -->
	<section id="installation" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Installation
		</h2>
		<p class="text-sm text-foreground-muted">Install the Alert Dialog component with the CLI:</p>
		<Steps
			steps={[
				{
					title: 'Run the CLI',
					description: 'Copy the command below and run it in your terminal.'
				}
			]}
		>
			<div
				class="flex items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
			>
				<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
					<span
						class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted"
					>
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
		</Steps>
	</section>

	<!-- ─── Usage ─────────────────────────────────────────────────── -->
	<section id="usage" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Usage
		</h2>
		<p class="text-sm text-foreground-muted">Import the AlertDialog components and use them:</p>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 rounded-[var(--radius-md)] border border-border px-4 py-3 font-mono text-[0.85rem] leading-relaxed text-foreground"><code
				>{@html highlight(
					`import * as AlertDialog from '@silk/ui/components/alert-dialog';\n\n<AlertDialog.Root>\n  <AlertDialog.Trigger>Delete</AlertDialog.Trigger>\n  <AlertDialog.Content>\n    <AlertDialog.Header>\n      <AlertDialog.Title>Delete?</AlertDialog.Title>\n      <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>\n    </AlertDialog.Header>\n    <AlertDialog.Footer>\n      <AlertDialog.Exit>Cancel</AlertDialog.Exit>\n      <AlertDialog.Confirm>Delete</AlertDialog.Confirm>\n    </AlertDialog.Footer>\n  </AlertDialog.Content>\n</AlertDialog.Root>`,
					'svelte'
				)}</code
			></pre>
	</section>

	<!-- ─── Examples ──────────────────────────────────────────────── -->
	<section id="examples" class="scroll-mt-20 flex flex-col gap-10">
		<div>
			<h2
				class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
			>
				Examples
			</h2>
			<p class="mt-2 text-sm text-foreground-muted">
				Common patterns for destructive actions and sign-out flows.
			</p>
		</div>

		<!-- Destructive confirmation -->
		<div id="destructive" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Destructive confirmation
			</h3>
			<ComponentPreview
				code={`<AlertDialog.Root>
  <AlertDialog.Trigger variant="destructive">Delete project</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this project?</AlertDialog.Title>
      <AlertDialog.Description>All branches and history will be removed.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Cancel</AlertDialog.Exit>
      <AlertDialog.Confirm>Delete project</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`}
			>
				<div class="grid place-items-center">
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
			</ComponentPreview>
		</div>

		<!-- Sign out -->
		<div id="sign-out" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Sign out confirmation
			</h3>
			<ComponentPreview
				code={`<AlertDialog.Root>
  <AlertDialog.Trigger variant="outline">Sign out</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Sign out?</AlertDialog.Title>
      <AlertDialog.Description>You'll need to sign in again to resume your session.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Stay</AlertDialog.Exit>
      <AlertDialog.Confirm>Sign out</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`}
			>
				<div class="grid place-items-center">
					<AlertDialog.Root>
						<AlertDialog.Trigger variant="outline">Sign out</AlertDialog.Trigger>
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
			</ComponentPreview>
		</div>
	</section>

	<!-- ─── API Reference ─────────────────────────────────────────── -->
	<section id="api" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			API Reference
		</h2>
		<p class="text-sm text-foreground-muted">
			<code class="font-mono text-foreground">AlertDialog</code> is a multi-part component. Every part
			accepts standard HTML attributes.
		</p>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row, i (i)}
					<li class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted">
								AlertDialog.{row.component}
							</code>
							<code
								class="font-mono text-[0.82rem] font-[var(--font-weight-label,600)] text-foreground"
							>
								{row.prop}
							</code>
						</div>
						<div class="flex flex-col gap-1">
							<code
								class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground"
							>
								{row.type}
							</code>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">
								{row.description}
							</p>
						</div>
						<div class="md:text-right">
							<code
								class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem] text-foreground"
							>
								{row.default}
							</code>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- ─── Footer ────────────────────────────────────────────────── -->
	<section
		class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
	>
		<div class="flex flex-col gap-1">
			<p
				class="m-0 text-[1rem] font-[var(--font-weight-label,500)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Want to make it yours?
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Every Alert Dialog token lives in the studio — restyle it for your brand in seconds.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Button variant="ghost" href={SOURCE}>
				<svg viewBox="0 0 24 24" aria-hidden="true" class="size-3.5 fill-current">
					<path
						d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.79 1.06.79 2.14v3.17c0 .31.21.66.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"
					/>
				</svg>
				View source
				<External size={11} class="text-foreground-muted" />
			</Button>
			<Button href="/themes/studio">
				Open studio
				<ArrowRight size={14} />
			</Button>
		</div>
	</section>

	<!-- ─── Prev / Next ───────────────────────────────────────────── -->
	{#if curIndex !== -1}
		<nav
			class="mt-12 flex w-full items-center"
			class:justify-between={prevComponent && nextComponent}
			class:justify-end={!prevComponent && nextComponent}
			class:justify-start={prevComponent && !nextComponent}
		>
			{#if prevComponent}
				<Button href={`/docs/components/${prevComponent}`} variant="outline" class="flex-shrink-0">
					<ChevronLeft size={16} />
					{sanitizeComponent(prevComponent)}
				</Button>
			{/if}
			{#if prevComponent && nextComponent}
				<div class="mx-4 w-full rounded-lg border-t border-border"></div>
			{/if}
			{#if nextComponent}
				<Button href={`/docs/components/${nextComponent}`} variant="outline" class="flex-shrink-0">
					{sanitizeComponent(nextComponent)}
					<ChevronRight size={16} />
				</Button>
			{/if}
		</nav>
	{/if}
</div>

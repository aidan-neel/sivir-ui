<script lang="ts">
	import { Button } from '$lib/silk/components/button';
	import { Badge } from '$lib/silk/components/badge';
	import { highlight } from '$lib/highlight';
	import * as Alert from '$lib/silk/components/alert';
	import * as Tooltip from '$lib/silk/components/tooltip';
	import { components, sanitizeComponent } from '$lib/components';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Hash from '@lucide/svelte/icons/hash';
	import Wand from '@lucide/svelte/icons/wand-sparkles';
	import External from '@lucide/svelte/icons/external-link';
	import Bell from '@lucide/svelte/icons/bell';

	const TITLE = 'Alert';
	const SLUG = 'alert';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/alert';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	type Variant = 'info' | 'success' | 'warning' | 'error';
	let pgVariant = $state<Variant>('info');
	let pgTitle = $state('Verify your email');
	let pgDescription = $state(
		"We just sent a verification link. Confirm it to keep using your account."
	);

	const variantList: { value: Variant; label: string; tone: string; use: string }[] = [
		{ value: 'info', label: 'Info', tone: 'Neutral context', use: 'Background facts, tips, walkthrough notes.' },
		{ value: 'success', label: 'Success', tone: 'Positive confirmation', use: 'Saved. Sent. Verified.' },
		{ value: 'warning', label: 'Warning', tone: 'Pay attention', use: 'Reversible problem the user can resolve.' },
		{ value: 'error', label: 'Error', tone: 'Action failed', use: "Something didn't work. Show the why and a retry." }
	];

	const apiRows = [
		{ component: 'Alert.Root', prop: 'variant', type: '"info" | "success" | "warning" | "error"', default: '"info"', description: 'Visual tone — picks the icon, accent strip, and chip color.' },
		{ component: 'Alert.Root', prop: 'class', type: 'string', default: '—', description: 'Tailwind classes appended via cn() — overrides win.' },
		{ component: 'Alert.Title', prop: 'children', type: 'Snippet', default: '—', description: 'Short, scannable headline (one line is ideal).' },
		{ component: 'Alert.Description', prop: 'children', type: 'Snippet', default: '—', description: 'Body copy. Two lines max for inline alerts.' }
	];

	const playgroundCode = $derived(`<Alert.Root${pgVariant !== 'info' ? ` variant="${pgVariant}"` : ''}>
  <Alert.Title>${pgTitle || 'Title'}</Alert.Title>
  <Alert.Description>
    ${pgDescription || 'Description'}
  </Alert.Description>
</Alert.Root>`);

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add alert';
</script>

<svelte:head>
	<title>Silk · Alert</title>
	<meta name="description" content="Tinted callouts for inline status, confirmation, and warnings." />
</svelte:head>

<!-- ─── Hero ─────────────────────────────────────────────────────── -->
<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
		<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">4 variants</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">3 sub-components</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] leading-[1] tracking-[-0.035em] md:text-[3rem]"
			style="font-family: var(--font-header);"
		>
			Alert
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			An inline callout that grabs attention without stealing focus. Drop one above a form, beside
			a setting, or wherever the user needs context they didn't ask for.
		</p>
	</div>

	<div class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
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
		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]">
			<div class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8">
				<div class="w-full max-w-[28rem]">
					<Alert.Root variant={pgVariant}>
						<Alert.Title>{pgTitle || 'Title'}</Alert.Title>
						<Alert.Description>{pgDescription || 'Description'}</Alert.Description>
					</Alert.Root>
				</div>
			</div>

			<div class="flex flex-col divide-y divide-border/60">
				<div class="flex flex-col gap-2 px-6 py-4">
					<label for="pg-title" class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted">Title</label>
					<input
						id="pg-title"
						bind:value={pgTitle}
						class="h-9 w-full max-w-[28rem] rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-muted focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>

				<div class="flex flex-col gap-2 px-6 py-4">
					<label for="pg-desc" class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted">Description</label>
					<input
						id="pg-desc"
						bind:value={pgDescription}
						class="h-9 w-full rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-muted focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>

				<div class="flex flex-col gap-2 px-6 py-4">
					<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted">Variant</span>
					<div class="flex flex-wrap gap-1.5">
						{#each variantList as v}
							<button
								type="button"
								onclick={() => (pgVariant = v.value)}
								class={`rounded-full border px-2.5 py-1 text-[0.74rem] transition-colors ${pgVariant === v.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground-muted hover:border-border-strong'}`}
							>
								{v.label}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="flex items-center justify-between gap-2 border-t border-border/70 bg-secondary/40 px-6 py-2.5">
				<span class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-foreground-muted">Snippet</span>
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
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(playgroundCode, "svelte")}</code></pre>
		</div>
	</div>
</section>

<!-- ─── Body sections ──────────────────────────────────────────── -->
<div class="flex flex-col gap-16 pt-16">
	<!-- VARIANTS -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Layers size={12} />
				</span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">
					Variants
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Variant maps to intent, not severity. Pick the one that matches what the user should
				think when they see it.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			{#each variantList as v}
				<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
					<Alert.Root variant={v.value}>
						<Alert.Title>{v.label}</Alert.Title>
						<Alert.Description>{v.use}</Alert.Description>
					</Alert.Root>
					<div class="flex items-center justify-between pl-1">
						<p class="m-0 text-[0.74rem] [font-weight:var(--font-weight-label,500)] text-foreground-muted">{v.tone}</p>
						<button
							type="button"
							onclick={() => copy(`<Alert.Root${v.value !== 'info' ? ` variant="${v.value}"` : ''}>\n  <Alert.Title>${v.label}</Alert.Title>\n  <Alert.Description>${v.use}</Alert.Description>\n</Alert.Root>`, `var-${v.value}`)}
							class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[0.7rem] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
						>
							{#if copiedSnippet === `var-${v.value}`}
								<Check size={11} class="text-[var(--color-success)]" />
								Copied
							{:else}
								<Copy size={11} />
								Copy
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- ANATOMY -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Component size={12} />
				</span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">
					Anatomy
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Three composable pieces. Skip the description if a title alone says enough.
			</p>
		</div>

		<div class="grid gap-3 md:grid-cols-2">
			<div class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8">
				<div class="w-full">
					<Alert.Root variant="warning">
						<Alert.Title>Title only</Alert.Title>
					</Alert.Root>
				</div>
			</div>
			<pre class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Alert.Root variant="warning">
  <Alert.Title>Title only</Alert.Title>
</Alert.Root>`, "svelte")}</code></pre>
		</div>
	</section>

	<!-- USAGE -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Wand size={12} />
				</span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">
					When to use it
				</h2>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-card p-4">
				<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-[var(--color-success)]">Reach for it</span>
				<ul class="m-0 flex flex-col gap-1.5 pl-4 text-[0.82rem] text-foreground-muted">
					<li>Inline page or form-level status</li>
					<li>Persistent context that should stay on screen</li>
					<li>Validation summaries above a Submit button</li>
				</ul>
			</div>
			<div class="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-card p-4">
				<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] uppercase tracking-wide text-[var(--color-warning)]">Skip it for</span>
				<ul class="m-0 flex flex-col gap-1.5 pl-4 text-[0.82rem] text-foreground-muted">
					<li>Ephemeral confirmations → use <code class="font-mono text-foreground">Toast</code></li>
					<li>Decisions a user must answer → use <code class="font-mono text-foreground">AlertDialog</code></li>
					<li>Per-field validation → use the input's error state</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- API -->
	<section class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Hash size={12} />
				</span>
				<h2 class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">
					API
				</h2>
			</div>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row}
					<li class="grid grid-cols-[1fr_1.4fr_0.6fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex flex-col gap-1">
							<code class="font-mono text-[0.7rem] text-foreground-muted">{row.component}</code>
							<code class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)]">{row.prop}</code>
						</div>
						<div class="flex flex-col gap-1">
							<code class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground">{row.type}</code>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">{row.description}</p>
						</div>
						<div class="md:text-right">
							<code class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem]">{row.default}</code>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- FOOTER -->
	<section class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center">
		<div class="flex flex-col gap-1">
			<p class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] tracking-tight" style="font-family: var(--font-header);">Want to make it yours?</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">Every Silk component reads from your theme tokens — open the studio to restyle them.</p>
		</div>
		<Button href="/themes/studio">Open theme studio<ArrowRight size={14} /></Button>
	</section>
</div>

<!-- ─── Prev / next ─────────────────────────────────────────── -->
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

<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import * as Alert from '@silk/ui/components/alert';
	import { highlight } from '$lib/highlight';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Download from '@lucide/svelte/icons/download';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Terminal from '@lucide/svelte/icons/terminal';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	const steps = [
		{
			id: 1,
			title: 'Create a Svelte project',
			body: 'A fresh SvelteKit project is the cleanest place to start. Pick "Skeleton" and TypeScript when prompted.',
			code: 'bunx sv create my-app',
			lang: 'shell'
		},
		{
			id: 2,
			title: 'Install Tailwind',
			body: 'Silk is built on Tailwind v4. Run the official SvelteKit installer -- it sets up the Vite plugin and CSS file for you.',
			code: 'cd my-app && bunx sv add tailwindcss',
			lang: 'shell'
		},
		{
			id: 3,
			title: 'Initialize Silk',
			body: 'The init command writes your component output directory, base CSS, and Silk-aware tsconfig paths.',
			code: 'bunx @aidan-neel/ui init',
			lang: 'shell'
		},
		{
			id: 4,
			title: 'Add the components you need',
			body: 'Pull in only what you actually use. Each component drops into `src/lib/silk/components/<name>/` -- yours to inspect, fork, or delete.',
			code: 'bunx @aidan-neel/ui add button input dialog',
			lang: 'shell'
		},
		{
			id: 5,
			title: 'Use it anywhere',
			body: 'Import from the path the CLI created. No barrel re-exports, no extra setup.',
			code: `<script>
  import { Button } from '@silk/ui/components/button';
<${'/'}script>

<Button>Get started</Button>`,
			lang: 'svelte'
		}
	];

	let copied = $state<number | null>(null);
	function copy(text: string, id: number) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copied = id;
		setTimeout(() => {
			if (copied === id) copied = null;
		}, 1600);
	}
</script>

<svelte:head>
	<title>Silk · Installation</title>
	<meta
		name="description"
		content="Install Silk UI in a fresh SvelteKit project — five commands."
	/>
</svelte:head>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-center gap-2">
		<Badge variant="outline" class="gap-1.5 text-[0.66rem]">
			<Download size={11} class="text-primary" />
			Installation
		</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">5 steps</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">~5 min</Badge>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1.02] tracking-[-0.04em] md:text-[3rem]"
			style="font-family: var(--font-header);"
		>
			Five commands from zero to shipping.
		</h1>
		<p class="m-0 max-w-[44rem] text-[1.05rem] leading-relaxed text-foreground-muted">
			Silk runs on top of SvelteKit + Tailwind. If you already have both, jump to step 3. If not,
			start at the top — each step takes under a minute.
		</p>
	</div>
</header>

<!-- ─── Steps ──────────────────────────────────────────────────── -->
<section class="pt-10 flex flex-col gap-3">
	{#each steps as step (step.id)}
		<div
			class="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5 md:flex-row md:gap-6"
		>
			<div class="flex shrink-0 items-start gap-3 md:w-48">
				<span
					class="grid size-8 shrink-0 place-items-center rounded-full bg-primary/12 font-mono text-[0.8rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-primary"
				>
					{step.id}
				</span>
				<p
					class="m-0 pt-1 text-[0.94rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-tight tracking-tight"
					style="font-family: var(--font-header);"
				>
					{step.title}
				</p>
			</div>
			<div class="flex flex-1 flex-col gap-3">
				<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">{step.body}</p>
				<div
					class="overflow-hidden rounded-[var(--radius-md)] border border-border bg-secondary/40"
				>
					<div
						class="flex items-center justify-between gap-2 border-b border-border/70 px-3 py-1.5"
					>
						<span
							class="inline-flex items-center gap-1.5 text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>
							<Terminal size={11} />
							{step.lang}
						</span>
						<button
							type="button"
							onclick={() => copy(step.code, step.id)}
							class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-0.5 text-[0.7rem] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
						>
							{#if copied === step.id}
								<Check size={11} class="text-[var(--color-success)]" />
								Copied
							{:else}
								<Copy size={11} />
								Copy
							{/if}
						</button>
					</div>
					<pre
						class="m-0 overflow-x-auto px-4 py-3 font-mono text-[0.82rem] leading-relaxed text-foreground"><code
							>{@html highlight(step.code, step.lang)}</code
						></pre>
				</div>
			</div>
		</div>
	{/each}
</section>

<!-- ─── Notes ──────────────────────────────────────────────────── -->
<section class="pt-10 flex flex-col gap-3">
	<Alert.Root variant="info">
		<Alert.Title>Already on shadcn-style flow?</Alert.Title>
		<Alert.Description>
			Silk's CLI mirrors it. Same <code class="font-mono text-foreground">init</code> →
			<code class="font-mono text-foreground">add</code> contract — but every component is a Svelte 5
			file, not a Radix wrapper.
		</Alert.Description>
	</Alert.Root>

	<Alert.Root variant="warning">
		<Alert.Title>Tailwind v4 only</Alert.Title>
		<Alert.Description>
			Silk uses Tailwind v4 features (CSS-first config, `@theme`, `color-mix`). If your project pins
			Tailwind v3, upgrade first.
		</Alert.Description>
	</Alert.Root>
</section>

<!-- ─── Footer CTA ─────────────────────────────────────────────── -->
<section
	class="mt-10 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
>
	<div class="flex flex-col gap-1">
		<p
			class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
			style="font-family: var(--font-header);"
		>
			You're set. Pick a starting point.
		</p>
		<p class="m-0 text-[0.86rem] text-foreground-muted">
			Browse the component catalog, or open the Theme Studio to make Silk look like your brand.
		</p>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button href="/docs/components" variant="outline">
			<Sparkles size={14} />
			Components
		</Button>
		<Button href="/themes/studio">
			Open theme studio
			<ArrowRight size={14} />
		</Button>
	</div>
</section>

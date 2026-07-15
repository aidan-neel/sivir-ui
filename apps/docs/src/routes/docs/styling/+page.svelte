<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '@sivir/ui/components/button';
	import { Badge } from '@sivir/ui/components/badge';
	import * as Alert from '@sivir/ui/components/alert';
	import { CodeBlock } from '@sivir/ui/components/code-block';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Paintbrush from '@lucide/svelte/icons/paintbrush-vertical';
	import Wand from '@lucide/svelte/icons/wand-sparkles';
	import FileCode from '@lucide/svelte/icons/file-code-2';
	import Tag from '@lucide/svelte/icons/tag';
	import GitFork from '@lucide/svelte/icons/git-fork';

	const layers = [
		{
			id: 'class',
			step: '1',
			icon: Tag,
			label: 'Reach for the `class` prop first',
			body: 'Every Sivir primitive forwards `class`. Combine it with Tailwind utilities or your own classnames -- fastest path for one-off tweaks.',
			lang: 'svelte',
			code: `<Button
  class="w-full justify-between rounded-2xl"
>
  Continue
  <ArrowRight size={14} />
</Button>`
		},
		{
			id: 'tokens',
			step: '2',
			icon: Wand,
			label: 'Tune public theme axes',
			body: 'Use semantic colors, shared control sizes, radius, elevation, typography, and motion when the whole system should move together.',
			lang: 'css',
			code: `@theme {
	--color-primary: #111827;
	--color-primary-hover: #1f2937;
	--size-control-md: 2.75rem;
	--radius-lg: 1rem;
	--radius-xl: 1.25rem;
	--elevation-float: 0 24px 80px rgb(15 23 42 / 0.16);
}`
		},
		{
			id: 'data',
			step: '3',
			icon: FileCode,
			label: 'Target with `data-ui` selectors',
			body: 'Every primitive renders `data-ui` (and often `data-variant`, `data-size`). Use them to scope styles to a specific component family -- cleaner than forking.',
			lang: 'css',
			code: `[data-ui='button'][data-variant='primary'] {
	border-radius: 999px;
	letter-spacing: 0.01em;
}

[data-ui='toast'] {
	--color-border: color-mix(in srgb, var(--color-primary) 22%, var(--color-border));
	padding: 0.25rem;
}

[data-ui='badge'][data-variant='secondary'] {
	text-transform: uppercase;
}`
		},
		{
			id: 'fork',
			step: '4',
			icon: GitFork,
			label: 'Own the file (last resort)',
			body: 'The component lives in `src/lib/sivir/components/<name>/` -- yours to edit. Reach for this only when behavior, not just style, needs to change.',
			lang: 'shell',
			code: `# already there after \`bunx @sivir/ui add button\`
src/lib/sivir/components/button/
├── button.svelte
└── index.ts`
		}
	];
</script>

<svelte:head>
	<title>Sivir · Styling</title>
	<meta
		name="description"
		content="Four ways to style Sivir: Tailwind classes, public theme axes, data attributes, and full ownership."
	/>
</svelte:head>

<div class="flex flex-col gap-10" data-docs-page>
	<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline" class="gap-1.5 text-[0.66rem]">
				<Paintbrush size={11} class="text-primary" />
				Styling
			</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">4 layers</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">No forks needed</Badge>
		</div>

		<div class="flex flex-col gap-3">
			<h1
				class="m-0 max-w-[24ch] text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] leading-tight"
				style="font-family: var(--font-header);"
			>
				Style every Sivir component your way.
			</h1>
			<p
				class="m-0 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
			>
				Four layers, from local to global. Start with the most contained — drop down only when the
				layer above isn't enough. Forking is the last resort, not the first move.
			</p>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<Button href={resolve('/docs/theming')}>
				Token reference
				<ArrowRight size={14} />
			</Button>
			<Button href={resolve('/docs/components')} variant="outline">Browse components</Button>
		</div>
	</header>

	<!-- ─── Layers ────────────────────────────────────────────────── -->
	<section class="pt-10 flex flex-col gap-3">
		{#each layers as layer (layer.id)}
			<div
				class="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5 md:flex-row md:gap-6"
			>
				<div class="flex shrink-0 items-start gap-3 md:w-56">
					<span
						class="grid size-9 shrink-0 place-items-center rounded-full bg-primary/12 font-mono text-[0.84rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-primary"
					>
						{layer.step}
					</span>
					<div class="flex flex-col gap-2 pt-1">
						<p
							class="m-0 text-[0.94rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-tight tracking-tight"
							style="font-family: var(--font-header);"
						>
							{layer.label}
						</p>
						<span
							class="inline-flex w-fit items-center gap-1 rounded-md border border-border bg-secondary/40 px-1.5 py-0.5 text-[0.62rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
						>
							<layer.icon size={10} />
							Layer {layer.step}
						</span>
					</div>
				</div>
				<div class="flex flex-1 flex-col gap-3">
					<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">{layer.body}</p>
					<CodeBlock code={layer.code} lang={layer.lang} copy="overlay" />
				</div>
			</div>
		{/each}
	</section>

	<!-- ─── Quick reference ──────────────────────────────────────── -->
	<section class="pt-12 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Tag size={12} />
			</span>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				When to use which
			</h2>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<table class="w-full border-collapse text-left">
				<thead class="bg-secondary/40">
					<tr
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>
						<th
							class="px-4 py-2.5 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
							>If you want to…</th
						>
						<th
							class="px-4 py-2.5 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
							>Use</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/60 text-[0.84rem]">
					<tr>
						<td class="px-4 py-2.5">Tweak one button instance</td>
						<td class="px-4 py-2.5 font-mono text-foreground-muted">class="…"</td>
					</tr>
					<tr>
						<td class="px-4 py-2.5">Change brand colors site-wide</td>
						<td class="px-4 py-2.5 font-mono text-foreground-muted">--color-* tokens</td>
					</tr>
					<tr>
						<td class="px-4 py-2.5">Restyle one component family</td>
						<td class="px-4 py-2.5 font-mono text-foreground-muted">[data-ui='…']</td>
					</tr>
					<tr>
						<td class="px-4 py-2.5">Change variant-specific styling</td>
						<td class="px-4 py-2.5 font-mono text-foreground-muted">[data-variant='…']</td>
					</tr>
					<tr>
						<td class="px-4 py-2.5">Add new behavior or markup</td>
						<td class="px-4 py-2.5 font-mono text-foreground-muted">edit the file</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<!-- ─── Note ─────────────────────────────────────────────────── -->
	<section class="pt-10">
		<Alert.Root variant="info">
			<Alert.Title>The `class` prop is composed, not overridden</Alert.Title>
			<Alert.Description>
				Sivir uses <code class="font-mono text-foreground">cn()</code> to merge classes, so your
				classes win over defaults without needing
				<code class="font-mono text-foreground">!important</code>. Override
				<code class="font-mono text-foreground">rounded-2xl</code> on a Button and you get a
				<code class="font-mono text-foreground">2xl</code> button — no specificity wars.
			</Alert.Description>
		</Alert.Root>
	</section>

	<!-- ─── Footer CTA ─────────────────────────────────────────────── -->
	<section
		class="mt-12 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
	>
		<div class="flex flex-col gap-1">
			<p
				class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Theming, the layer above
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Styling is local; theming is global. Combine both for a UI that feels intentional
				everywhere.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Button href={resolve('/docs/components')} variant="outline">Components</Button>
			<Button href={resolve('/docs/theming')}>
				Theming guide
				<ArrowRight size={14} />
			</Button>
		</div>
	</section>
</div>

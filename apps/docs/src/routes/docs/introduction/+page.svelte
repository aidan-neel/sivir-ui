<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import * as Alert from '@silk/ui/components/alert';
	import { highlight } from '$lib/highlight';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Palette from '@lucide/svelte/icons/palette';
	import Box from '@lucide/svelte/icons/box';
	import Type from '@lucide/svelte/icons/type';
	import Hash from '@lucide/svelte/icons/hash';
	import Wand from '@lucide/svelte/icons/wand-sparkles';
	import Keyboard from '@lucide/svelte/icons/keyboard';
	import Accessibility from '@lucide/svelte/icons/accessibility';
	import Gauge from '@lucide/svelte/icons/gauge';
	import GitFork from '@lucide/svelte/icons/git-fork';

	const installCommand = 'bunx @aidan-neel/ui init';
	let copied = $state(false);

	function copy(text: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 1600);
	}
</script>

<svelte:head>
	<title>Silk · Introduction</title>
	<meta
		name="description"
		content="A calmer, token-first Svelte 5 component library. Copy-paste, customizable, and built to feel right."
	/>
</svelte:head>

<!-- ─── Hero ─────────────────────────────────────────────────────── -->
<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-center gap-2">
		<Badge variant="outline" class="gap-1.5 text-[0.66rem]">
			<Sparkles size={11} class="text-primary" />
			Introduction
		</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">25 components</Badge>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 max-w-[20ch] text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1.02] tracking-[-0.04em] md:text-[3.2rem]"
			style="font-family: var(--font-header);"
		>
			Svelte components that feel designed, not generated.
		</h1>
		<p class="m-0 max-w-[44rem] text-[1.05rem] leading-relaxed text-foreground-muted">
			Silk is a small, opinionated set of Svelte 5 primitives built around real theming. You copy
			what you need into your app, restyle from a single token sheet, and ship without fighting
			anyone else's choices.
		</p>
	</div>

	<div
		class="flex items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
	>
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted">
				<Hash size={12} />
			</span>
			<code class="flex-1 font-mono text-[0.82rem] text-foreground"
				>{@html highlight(installCommand, 'shell')}</code
			>
		</div>
		<button
			type="button"
			onclick={() => copy(installCommand)}
			class="border-l border-border bg-card px-3 text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
			aria-label="Copy install command"
		>
			{#if copied}<Check size={14} class="text-[var(--color-success)]" />{:else}<Copy
					size={14}
				/>{/if}
		</button>
	</div>
</header>

<!-- ─── Pillars ─────────────────────────────────────────────────── -->
<section class="pt-12 flex flex-col gap-5">
	<div class="flex items-center gap-2">
		<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
			<Layers size={12} />
		</span>
		<h2
			class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
			style="font-family: var(--font-header);"
		>
			Why Silk
		</h2>
	</div>

	<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
		{#each [{ icon: Box, title: 'Copy-paste, not opaque', body: 'Components live in your repo as plain Svelte files. Inspect, fork, or delete — nothing is hidden behind a node_module wall.' }, { icon: Palette, title: 'Token-first theming', body: 'Every visual decision flows from CSS variables. Swap a theme and the whole library re-skins in one frame.' }, { icon: Wand, title: 'Polished defaults', body: 'Focus rings, motion timings, hover states — calibrated so you can ship the first version without revisiting.' }] as pillar (pillar.title)}
			<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
				<span class="grid size-9 place-items-center rounded-md bg-secondary/60 text-foreground">
					<pillar.icon size={15} />
				</span>
				<p
					class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					{pillar.title}
				</p>
				<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">{pillar.body}</p>
			</div>
		{/each}
	</div>
</section>

<!-- ─── What's inside ──────────────────────────────────────────── -->
<section class="pt-12 flex flex-col gap-5">
	<div class="flex items-center gap-2">
		<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
			<GitFork size={12} />
		</span>
		<h2
			class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
			style="font-family: var(--font-header);"
		>
			What's inside
		</h2>
	</div>

	<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
		<div class="grid grid-cols-2 divide-x divide-y divide-border/60 md:grid-cols-4">
			{#each [{ value: '25', label: 'Components', sub: 'Buttons, dialogs, tabs, …' }, { value: '10', label: 'Variants per button', sub: 'Semantic + status + neutral' }, { value: '4', label: 'Token surfaces', sub: 'Color · type · radius · motion' }, { value: '0', label: 'Lock-in', sub: 'You own the files' }] as stat (stat.label)}
				<div class="flex flex-col gap-1 p-5">
					<span
						class="text-[2rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
						style="font-family: var(--font-header);"
					>
						{stat.value}
					</span>
					<p
						class="m-0 text-[0.84rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
					>
						{stat.label}
					</p>
					<p class="m-0 text-[0.72rem] text-foreground-muted">{stat.sub}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Design principles ──────────────────────────────────────── -->
<section class="pt-12 flex flex-col gap-5">
	<div class="flex items-center gap-2">
		<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
			<Sparkles size={12} />
		</span>
		<h2
			class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
			style="font-family: var(--font-header);"
		>
			Principles
		</h2>
	</div>

	<div
		class="flex flex-col divide-y divide-border/60 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
	>
		{#each [{ icon: Gauge, title: 'Fast feels intentional', body: 'Hover transitions cap at 240ms. Motion presets travel through a single CSS variable, so the whole UI changes tone together.' }, { icon: Keyboard, title: 'Keyboard-first', body: 'Tab order, escape handling, focus traps, and arrow-key navigation work out of the box — no extras to install.' }, { icon: Accessibility, title: 'Accessible by default', body: 'ARIA roles, labelled regions, and live-region toasts ship configured. Sensible focus rings even before you customize.' }, { icon: Type, title: 'Typography is a token', body: 'Headers, body, and mono each come from `--font-*` variables. Pair Geist with anything in seconds.' }] as principle (principle.title)}
			<div class="flex items-start gap-4 px-5 py-4">
				<span
					class="grid size-9 shrink-0 place-items-center rounded-md bg-secondary/60 text-foreground"
				>
					<principle.icon size={15} />
				</span>
				<div class="flex flex-col gap-1">
					<p
						class="m-0 text-[0.94rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					>
						{principle.title}
					</p>
					<p class="m-0 text-[0.84rem] leading-relaxed text-foreground-muted">{principle.body}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- ─── Quick note ─────────────────────────────────────────────── -->
<section class="pt-10">
	<Alert.Root variant="info">
		<Alert.Title>Built on tokens, not magic</Alert.Title>
		<Alert.Description>
			Silk reads from CSS variables for color, radius, type, and motion. The Theme Studio at
			<code class="font-mono text-foreground">/themes/studio</code> is just a UI on top of them — change
			a token there, change every page that imported a component.
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
			Ready in five minutes
		</p>
		<p class="m-0 text-[0.86rem] text-foreground-muted">
			A fresh SvelteKit + Tailwind project plus three CLI commands.
		</p>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button href="/docs/installation">
			Install Silk
			<ArrowRight size={14} />
		</Button>
		<Button href="/themes/studio" variant="outline">Open theme studio</Button>
	</div>
</section>

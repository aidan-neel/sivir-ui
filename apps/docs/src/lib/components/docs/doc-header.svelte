<script lang="ts">
	import { Badge } from '@silk/ui/components/badge';
	import Component from '@lucide/svelte/icons/component';
	import External from '@lucide/svelte/icons/external-link';
	import Hash from '@lucide/svelte/icons/hash';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import { createCopy } from '$lib/copy.svelte';

	export type HeaderPill = { label: string; variant?: 'outlined' | 'ghost' };

	/**
	 * The standard component-page hero: a "Component" badge plus optional pills,
	 * a "View source" link, the title and lead paragraph, and a copyable install
	 * command. Every component page opens with this so the framing is identical.
	 */
	let {
		title,
		description,
		source,
		install,
		pills = []
	}: {
		title: string;
		description: string;
		source: string;
		install: string;
		pills?: HeaderPill[];
	} = $props();

	const clip = createCopy();
</script>

<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">
				Component
			</Badge>
			{#each pills as pill}
				<Badge variant={pill.variant ?? 'ghost'} class="text-[0.66rem]">{pill.label}</Badge>
			{/each}
		</div>
		<a
			href={source}
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
			{title}
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			{description}
		</p>
	</div>

	<div
		class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
	>
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted">
				<Hash size={12} />
			</span>
			<code class="flex-1 font-mono text-[0.82rem] text-foreground">{install}</code>
		</div>
		<button
			type="button"
			onclick={() => clip.copy(install, 'install')}
			class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
			aria-label="Copy install command"
		>
			{#if clip.copied('install')}
				<Check size={14} class="text-[var(--color-success)]" />
			{:else}
				<Copy size={14} />
			{/if}
		</button>
	</div>
</header>

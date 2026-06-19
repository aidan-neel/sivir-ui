<script lang="ts">
	import { Badge } from '@silk/ui/components/badge';
	import { Button } from '@silk/ui/components/button';
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
		<Button
			href={source}
			variant="outlined"
			size="sm"
			target="_blank"
			rel="noreferrer noopener"
			class="text-[0.72rem] text-foreground-muted hover:text-foreground"
		>
			View source
			<External size={12} />
		</Button>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 text-[2.05rem] [font-weight:var(--font-weight-header,640)] [letter-spacing:var(--tracking-label,0em)] leading-[1.05] tracking-[-0.035em] md:text-[2.35rem]"
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
		<Button
			variant="ghost"
			onclick={() => clip.copy(install, 'install')}
			aria-label="Copy install command"
			class="h-auto self-stretch rounded-none border-l border-border px-3 text-foreground-muted hover:text-foreground"
		>
			{#if clip.copied('install')}
				<Check size={14} class="text-[var(--color-success)]" />
			{:else}
				<Copy size={14} />
			{/if}
		</Button>
	</div>
</header>

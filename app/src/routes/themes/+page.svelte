<script lang="ts">
	import type { Action } from 'svelte/action';
	import type { PageData } from './$types';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { Badge } from '$lib/silk/components/badge';
	import { Button } from '$lib/silk/components/button';

	const { data }: { data: PageData } = $props();
	const themes = $derived(data.themes);

	const heroHeadline = 'Ultimate theme control, from presets to full-system customization.';
	const heroWords = heroHeadline.split(' ');

	type RevealParams = {
		delay?: number;
		threshold?: number;
		rootMargin?: string;
		once?: boolean;
	};

	const revealOnScroll: Action<HTMLElement, RevealParams> = (node, params = {}) => {
		let observer: IntersectionObserver | undefined;

		const applyConfig = (config: RevealParams) => {
			node.style.setProperty('--reveal-delay', `${config.delay ?? 0}ms`);
			if (typeof window === 'undefined') return;
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				node.dataset.revealed = 'true';
				return;
			}
			if (typeof IntersectionObserver === 'undefined') {
				node.dataset.revealed = 'true';
				return;
			}
			observer?.disconnect();
			observer = new IntersectionObserver(
				([entry]) => {
					if (entry?.isIntersecting) {
						node.dataset.revealed = 'true';
						if (config.once !== false) observer?.disconnect();
					} else if (config.once === false) {
						node.dataset.revealed = 'false';
					}
				},
				{
					threshold: config.threshold ?? 0.2,
					rootMargin: config.rootMargin ?? '0px 0px -10% 0px'
				}
			);
			observer.observe(node);
		};

		applyConfig(params);
		return {
			update(nextParams) {
				applyConfig(nextParams ?? {});
			},
			destroy() {
				observer?.disconnect();
			}
		};
	};
</script>

<svelte:head>
	<title>Silk UI Themes</title>
	<meta
		name="description"
		content="Browse the Silk UI theme catalog, preview each direction, and open the dedicated Theme Studio workspace."
	/>
</svelte:head>

<div class="relative min-h-[calc(100vh-3.5rem)] overflow-clip pb-20 pt-[6.4rem] max-md:pt-[5.8rem]">
	<div class="pointer-events-none absolute inset-0 -z-10">
		<div
			class="absolute left-[-16rem] top-[-3rem] h-[38rem] w-[38rem] rounded-[999px] blur-[130px]"
			style="background: color-mix(in srgb, var(--color-primary) 14%, transparent);"
		></div>
		<div
			class="absolute right-[-12rem] top-[10rem] h-[30rem] w-[30rem] rounded-[999px] blur-[130px]"
			style="background: color-mix(in srgb, var(--color-primary) 10%, transparent);"
		></div>
		<div
			class="absolute inset-0"
			style="background-image:
				linear-gradient(color-mix(in srgb, var(--color-foreground) 3%, transparent) 1px, transparent 1px),
				linear-gradient(90deg, color-mix(in srgb, var(--color-foreground) 3%, transparent) 1px, transparent 1px);
				background-size: 52px 52px;
				mask-image: linear-gradient(180deg, rgb(0 0 0 / 0.44), transparent 90%);"
		></div>
	</div>

	<section class="relative z-[1] mx-auto flex w-full max-w-[1440px] justify-start px-4 md:px-8">
		<div
			class="flex max-w-[82rem] flex-col items-start gap-8 pt-[4.25rem] text-left max-[1100px]:pt-8"
		>
			<div class="fade-up" use:revealOnScroll={{ delay: 70, threshold: 0.9 }}>
				<Badge href="/docs/theming" variant="outlined" class="w-fit gap-2 px-3 text-[0.82rem]">
					Theming docs
					<span class="text-foreground-muted">Tokens, palettes, and component-level overrides</span>
					<ArrowRight size={14} />
				</Badge>
			</div>

			<div class="flex flex-col gap-4">
				<h1
					class="hero-title fade-up m-0 max-w-[72%] text-balance text-[clamp(3rem,5vw,4.35rem)] font-medium leading-[0.95] tracking-[-0.05em] [font-family:var(--font-header),sans-serif] max-[1100px]:max-w-[25ch] max-md:max-w-none max-md:text-[clamp(2.6rem,11vw,4rem)]"
					use:revealOnScroll={{ delay: 110, threshold: 0.85 }}
				>
					{#each heroWords as word, index}
						<span class="hero-word" style={`--word-delay:${index * 46}ms`}>
							{word}{index < heroWords.length - 1 ? '\u00A0' : ''}
						</span>
					{/each}
				</h1>
				<p
					class="fade-up m-0 max-w-[58rem] text-balance text-[1.05rem] leading-7 text-foreground-muted"
					use:revealOnScroll={{ delay: 200, threshold: 0.85 }}
				>
					Start with a strong preset, then shape color, type, motion, and surface tone until the
					entire system feels like your product instead of a borrowed default.
				</p>
			</div>

			<div class="fade-up flex flex-wrap gap-3" use:revealOnScroll={{ delay: 280, threshold: 0.8 }}>
				<Button href="/themes/studio" class="text-sm">Open Theme Studio</Button>
				<Button href="/docs/theming" variant="outlined" class="text-sm">Read Theming Docs</Button>
			</div>

			<div class="grid w-full max-w-[60rem] grid-cols-3 gap-[0.9rem] max-md:grid-cols-1">
				<div
					class="fade-up flex flex-col gap-[0.3rem] border-t border-border-strong/70 pr-4 pt-4"
					use:revealOnScroll={{ delay: 340, threshold: 0.7 }}
				>
					<span class="text-[0.95rem] font-semibold">Preset-first</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted"
						>Start from a direction instead of a blank editor.</span
					>
				</div>
				<div
					class="fade-up flex flex-col gap-[0.3rem] border-t border-border-strong/70 pr-4 pt-4"
					use:revealOnScroll={{ delay: 420, threshold: 0.7 }}
				>
					<span class="text-[0.95rem] font-semibold">Full workspace</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted"
						>The actual editor now lives in its own dedicated route.</span
					>
				</div>
				<div
					class="fade-up flex flex-col gap-[0.3rem] border-t border-border-strong/70 pr-4 pt-4"
					use:revealOnScroll={{ delay: 500, threshold: 0.7 }}
				>
					<span class="text-[0.95rem] font-semibold">CSS-first output</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted"
						>Everything still ends as plain theme CSS you can ship.</span
					>
				</div>
			</div>
		</div>
	</section>

	<section class="relative z-[1] mx-auto mt-[8.5rem] w-full max-w-[1440px] px-4 md:px-8">
		<div class="flex max-w-[44rem] flex-col gap-3">
			<span
				class="fade-up text-[0.8rem] font-medium uppercase tracking-[0.12em] text-foreground-muted"
				use:revealOnScroll={{ delay: 60 }}
			>
				Theme catalog
			</span>
			<h2
				class="fade-up m-0 text-balance text-[clamp(1.7rem,2.6vw,2.3rem)] font-medium leading-[1.06] tracking-[-0.04em] [font-family:var(--font-header),sans-serif]"
				use:revealOnScroll={{ delay: 120 }}
			>
				A few stronger starting moods before you move into the full editing workspace.
			</h2>
		</div>

		<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each themes as preset, index}
				<article
					class="fade-up rounded-lg border border-border bg-[var(--card-bg)] p-5 shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)]"
					use:revealOnScroll={{ delay: 150 + index * 50, threshold: 0.22 }}
				>
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="text-base font-semibold text-foreground">{preset.name}</p>
							<p class="mt-2 text-sm leading-6 text-foreground-muted">{preset.description}</p>
						</div>
						<Badge variant="secondary">{preset.durationPreset}</Badge>
					</div>
					<div class="mt-4 grid grid-cols-6 gap-2">
						<div
							class="h-11 rounded-lg border border-border/55"
							style={`background:${preset.light.primary};`}
						></div>
						<div
							class="h-11 rounded-lg border border-border/55"
							style={`background:${preset.light.background};`}
						></div>
						<div
							class="h-11 rounded-lg border border-border/55"
							style={`background:${preset.light.card};`}
						></div>
						<div
							class="h-11 rounded-lg border border-border/55"
							style={`background:${preset.dark.primary};`}
						></div>
						<div
							class="h-11 rounded-lg border border-border/55"
							style={`background:${preset.dark.background};`}
						></div>
						<div
							class="h-11 rounded-lg border border-border/55"
							style={`background:${preset.dark.card};`}
						></div>
					</div>
					<div class="mt-4 grid gap-2 sm:grid-cols-2">
						<div class="rounded-lg bg-secondary/24 p-3">
							<p
								class="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-foreground-muted"
							>
								Type
							</p>
							<p class="mt-2 text-sm font-medium text-foreground">
								{preset.fontHeader.split(',')[0]?.replaceAll('"', '')}
							</p>
						</div>
						<div class="rounded-lg bg-secondary/24 p-3">
							<p
								class="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-foreground-muted"
							>
								Feel
							</p>
							<p class="mt-2 text-sm font-medium text-foreground">{preset.durationPreset}</p>
						</div>
					</div>
					<p class="mt-4 text-xs text-foreground-muted">
						by {preset.publisher || 'Community'}
					</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="relative z-[1] mx-auto mt-[5.75rem] w-full max-w-[1440px] px-4 md:px-8">
		<div
			class="fade-up flex items-center justify-between gap-4 rounded-lg border border-border bg-[var(--card-bg)] bg-surface/72 p-6 shadow-none max-md:flex-col max-md:items-start"
			use:revealOnScroll={{ delay: 120, threshold: 0.25 }}
		>
			<div>
				<span class="text-[0.8rem] font-medium uppercase tracking-[0.12em] text-foreground-muted">
					Open the dedicated studio
				</span>
				<h2
					class="m-0 mt-[0.35rem] text-balance text-[clamp(1.6rem,2.35vw,2rem)] font-medium leading-[1.08] tracking-[-0.04em] [font-family:var(--font-header),sans-serif]"
				>
					Move into the full editing workspace.
				</h2>
				<p class="m-0 mt-[0.55rem] max-w-[44rem] leading-[1.7] text-foreground-muted">
					The editor now lives on its own route so it can use more of the page, stay calmer while
					you work, and feel more like a real product workspace.
				</p>
			</div>
			<div class="flex flex-wrap gap-3">
				<Button href="/themes/studio">Launch Theme Studio</Button>
				<Button href="/docs/theming" variant="outlined">Learn the token model</Button>
			</div>
		</div>
	</section>
</div>

<style>
	.fade-up {
		opacity: 0;
		transform: translate3d(0, 20px, 0);
		filter: blur(5px);
		transition:
			opacity 820ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 820ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 820ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--reveal-delay, 0ms);
	}

	:global(.fade-up[data-revealed='true']) {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		filter: blur(0);
	}

	.hero-title {
		filter: none;
	}

	.hero-word {
		display: inline-block;
		opacity: 0;
		transform: translate3d(0, 0.9rem, 0);
		filter: blur(3px);
		transition:
			opacity 900ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 900ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--reveal-delay, 0ms) + var(--word-delay, 0ms) + 180ms);
	}

	:global(.hero-title[data-revealed='true'] .hero-word) {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		filter: blur(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.fade-up,
		.hero-word {
			opacity: 1;
			transform: none;
			filter: none;
			transition: none;
		}
	}
</style>

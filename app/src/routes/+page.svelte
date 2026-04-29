<script lang="ts">
	import type { Action } from 'svelte/action';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import Layers from '@lucide/svelte/icons/layers-3';
	import SwatchBook from '@lucide/svelte/icons/swatch-book';
	import { Badge } from '$lib/silk/components/badge';
	import { Button } from '$lib/silk/components/button';

	const heroHeadline =
		'Design-forward Svelte components with calmer defaults and more room to customize.';
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

						if (config.once !== false) {
							observer?.disconnect();
						}
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
	<title>Silk UI</title>
	<meta
		name="description"
		content="Beautiful, customizable Svelte 5 components with a polished theming system and docs experience."
	/>
</svelte:head>

<div
	class="relative min-h-[calc(100vh-3.5rem)] overflow-clip pb-16 gap-16 pt-[6.5rem] max-md:pt-[5.75rem]"
>
	<div
		class="pointer-events-none absolute left-[-6rem] top-[5rem] h-[18rem] w-[18rem] rounded-[999px] bg-[rgb(21_94_239_/_0.12)] opacity-80 blur-[70px]"
	></div>
	<div
		class="pointer-events-none absolute right-[-5rem] top-[10rem] h-[22rem] w-[22rem] rounded-[999px] bg-[rgb(45_212_191_/_0.08)] opacity-80 blur-[70px]"
	></div>
	<div
		class="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgb(16_24_40_/_0.03)_1px,transparent_1px),linear-gradient(90deg,rgb(16_24_40_/_0.03)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(180deg,rgb(0_0_0_/_0.55),transparent_82%)]"
	></div>

	<section class="relative z-[1] mx-auto flex w-full max-w-[1400px] justify-center px-4 md:px-8">
		<div
			class="flex max-w-[82rem] flex-col items-center gap-10 pt-[4.25rem] text-center max-[1100px]:pt-8"
		>
			<div class="fade-up" use:revealOnScroll={{ delay: 80, threshold: 0.9 }}>
				<Badge href="/docs/changelog" variant="outlined" class="w-fit gap-2 px-3 text-[0.82rem]">
					New release
					<span class="text-foreground-muted">Bun-ready, tokenized, and cleaner than ever</span>
					<ArrowRight size={14} />
				</Badge>
			</div>

			<div class="flex flex-col items-center gap-4">
				<h1
					class="hero-title fade-up m-0 w-full text-balance text-[64px] font-medium leading-[0.95] tracking-[-0.05em] [font-family:var(--font-header),sans-serif] max-[1100px]:max-w-[25ch] max-md:max-w-none max-md:text-[clamp(2.7rem,11vw,4rem)]"
					use:revealOnScroll={{ delay: 120, threshold: 0.85 }}
				>
					{#each heroWords as word, index}
						<span class="hero-word" style={`--word-delay:${index * 55}ms`}>
							{word}{index < heroWords.length - 1 ? '\u00A0' : ''}
						</span>
					{/each}
				</h1>
				<p
					class="fade-up m-0 max-w-[48rem] text-balance text-[1.05rem] leading-7 text-foreground-muted"
					use:revealOnScroll={{ delay: 240, threshold: 0.85 }}
				>
					Silk UI gives you customizable Svelte 5 primitives, elegant defaults, and a styling system
					designed to be remixed instead of fought. Fast to adopt, easy to extend, and pleasant to
					live in.
				</p>
			</div>

			<div
				class="fade-up flex flex-wrap items-center justify-center gap-3"
				use:revealOnScroll={{ delay: 320, threshold: 0.8 }}
			>
				<Button href="/docs/components/alert" class="text-sm">Browse Components</Button>
				<Button href="https://github.com/aidan-neel/ui" variant="ghost" class="text-sm">
					View on GitHub
				</Button>
			</div>

			<div class="grid w-full max-w-[60rem] grid-cols-3 gap-[0.9rem] max-md:grid-cols-1">
				<div
					class="fade-up flex flex-col gap-[0.3rem] border-border-strong/70 pt-4 text-center"
					use:revealOnScroll={{ delay: 380, threshold: 0.7 }}
				>
					<span class="text-[0.95rem] font-semibold">Svelte 5</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted"
						>Modern primitives and patterns</span
					>
				</div>
				<div
					class="fade-up flex flex-col gap-[0.3rem] border-border-strong/70 pt-4 text-center"
					use:revealOnScroll={{ delay: 460, threshold: 0.7 }}
				>
					<span class="text-[0.95rem] font-semibold">Token-first</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted"
						>Theme deeply without rewrites</span
					>
				</div>
				<div
					class="fade-up flex flex-col gap-[0.3rem] border-border-strong/70 pt-4 text-center"
					use:revealOnScroll={{ delay: 540, threshold: 0.7 }}
				>
					<span class="text-[0.95rem] font-semibold">Accessible</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted"
						>Sharper focus and interaction states</span
					>
				</div>
			</div>
		</div>
	</section>

	<section class="relative z-[1] mx-auto mt-[9.5rem] w-full max-w-[1400px] px-4 md:px-8">
		<div class="mx-auto flex max-w-[42rem] flex-col items-center gap-[0.85rem] text-center">
			<span
				class="fade-up text-[0.8rem] font-medium uppercase tracking-[0.12em] text-foreground-muted"
				use:revealOnScroll={{ delay: 40 }}>What makes it distinct</span
			>
			<h2
				class="fade-up m-0 text-balance text-[clamp(1.6rem,2.35vw,2rem)] font-medium leading-[1.08] tracking-[-0.04em] [font-family:var(--font-header),sans-serif]"
				use:revealOnScroll={{ delay: 120 }}
			>
				A calmer UI foundation that stays flexible as your product gets more specific.
			</h2>
		</div>

		<div class="mt-6 grid grid-cols-3 gap-4 max-md:grid-cols-1">
			<article
				class="fade-up bg-[var(--card-bg)] border border-border rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] p-[1.35rem]"
				use:revealOnScroll={{ delay: 140, threshold: 0.3 }}
			>
				<div
					class="mb-[0.95rem] grid h-[2.3rem] w-[2.3rem] place-items-center rounded-[0.9rem] bg-primary/10 text-primary"
				>
					<Layers size={18} />
				</div>
				<h3 class="m-0 text-[1rem]">Composable by default</h3>
				<p class="mt-[0.55rem] m-0 leading-[1.7] text-foreground-muted">
					Use the pieces as simple drop-ins or reshape them into product-specific patterns without
					rewriting the entire stack.
				</p>
			</article>

			<article
				class="fade-up bg-[var(--card-bg)] border border-border rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] p-[1.35rem]"
				use:revealOnScroll={{ delay: 220, threshold: 0.3 }}
			>
				<div
					class="mb-[0.95rem] grid h-[2.3rem] w-[2.3rem] place-items-center rounded-[0.9rem] bg-primary/10 text-primary"
				>
					<SwatchBook size={18} />
				</div>
				<h3 class="m-0 text-[1rem]">Real theming system</h3>
				<p class="mt-[0.55rem] m-0 leading-[1.7] text-foreground-muted">
					Semantic tokens, cleaner presets, and enough hooks to make the library feel like your own
					design language.
				</p>
			</article>

			<article
				class="fade-up bg-[var(--card-bg)] border border-border rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] p-[1.35rem]"
				use:revealOnScroll={{ delay: 300, threshold: 0.3 }}
			>
				<div
					class="mb-[0.95rem] grid h-[2.3rem] w-[2.3rem] place-items-center rounded-[0.9rem] bg-primary/10 text-primary"
				>
					<Check size={18} />
				</div>
				<h3 class="m-0 text-[1rem]">Polished interaction states</h3>
				<p class="mt-[0.55rem] m-0 leading-[1.7] text-foreground-muted">
					Focus, motion, borders, and surfaces are tuned to feel quiet and intentional instead of
					flashy or unfinished.
				</p>
			</article>
		</div>
	</section>

	<section class="relative z-[1] mx-auto mt-[5.75rem] w-full max-w-[1400px] px-4 md:px-8">
		<div
			class="fade-up bg-[var(--card-bg)] border border-border rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] flex items-center justify-between gap-4 bg-surface/72 p-6 shadow-none max-md:flex-col max-md:items-start"
			use:revealOnScroll={{ delay: 120, threshold: 0.25 }}
		>
			<div>
				<span class="text-[0.8rem] font-medium uppercase tracking-[0.12em] text-foreground-muted"
					>Start here</span
				>
				<h2
					class="m-0 mt-[0.35rem] text-balance text-[clamp(1.6rem,2.35vw,2rem)] font-medium leading-[1.08] tracking-[-0.04em] [font-family:var(--font-header),sans-serif]"
				>
					Start from a stronger baseline.
				</h2>
				<p class="m-0 mt-[0.55rem] leading-[1.7] text-foreground-muted">
					Open the docs, copy a component, and customize from a better default baseline.
				</p>
			</div>
			<div class="flex flex-wrap gap-3">
				<Button href="/docs/introduction">Read the Docs</Button>
				<Button href="/docs/components/alert-dialog" variant="outlined"
					>See Component Examples</Button
				>
			</div>
		</div>
	</section>

	<footer
		class="fade-up relative z-[1] mx-auto mt-24 flex w-full max-w-[1400px] items-center justify-between gap-4 border-t border-border-strong/60 px-4 pt-5 md:px-8 max-md:flex-col max-md:items-start"
		use:revealOnScroll={{ delay: 80, threshold: 0.01, rootMargin: '0px 0px 12% 0px' }}
	>
		<div>
			<p class="m-0 font-semibold">Silk UI</p>
			<p class="mt-[0.35rem] text-[0.92rem] text-foreground-muted">
				Calmer defaults for teams that still want control.
			</p>
		</div>

		<div class="flex flex-wrap gap-4">
			<a
				href="/docs/introduction"
				class="text-[0.92rem] text-foreground-muted no-underline transition-colors duration-200 hover:text-foreground"
				>Docs</a
			>
			<a
				href="/docs/components"
				class="text-[0.92rem] text-foreground-muted no-underline transition-colors duration-200 hover:text-foreground"
				>Components</a
			>
			<a
				href="/themes"
				class="text-[0.92rem] text-foreground-muted no-underline transition-colors duration-200 hover:text-foreground"
				>Themes</a
			>
			<a
				href="https://github.com/aidan-neel/ui"
				class="text-[0.92rem] text-foreground-muted no-underline transition-colors duration-200 hover:text-foreground"
				>GitHub</a
			>
		</div>
	</footer>
</div>

<!--  -->

<style>
	.fade-up {
		opacity: 0;
		transform: translate3d(0, 26px, 0);
		filter: blur(8px);
		transition:
			opacity 1160ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 1160ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 1160ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--reveal-delay, 0ms);
		will-change: opacity, transform, filter;
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
		transform: translate3d(0, 1.2rem, 0);
		filter: blur(4px);
		transition:
			opacity 1160ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 1160ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 1160ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--reveal-delay, 0ms) + var(--word-delay, 0ms) + 255ms);
		will-change: opacity, transform, filter;
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

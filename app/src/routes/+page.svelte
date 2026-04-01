<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import Layers from '@lucide/svelte/icons/layers-3';
	import SwatchBook from '@lucide/svelte/icons/swatch-book';
	import { Badge } from '$lib/silk/components/badge';
	import { Button } from '$lib/silk/components/button';
</script>

<svelte:head>
	<title>Silk UI</title>
	<meta
		name="description"
		content="Beautiful, customizable Svelte 5 components with a polished theming system and docs experience."
	/>
</svelte:head>

<div class="relative min-h-[calc(100vh-3.5rem)] overflow-clip pb-16 pt-[6.5rem] max-md:pt-[5.75rem]">
	<div class="pointer-events-none absolute left-[-6rem] top-[5rem] h-[18rem] w-[18rem] rounded-[999px] bg-[rgb(21_94_239_/_0.12)] opacity-80 blur-[70px]"></div>
	<div class="pointer-events-none absolute right-[-5rem] top-[10rem] h-[22rem] w-[22rem] rounded-[999px] bg-[rgb(45_212_191_/_0.08)] opacity-80 blur-[70px]"></div>
	<div
		class="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgb(16_24_40_/_0.03)_1px,transparent_1px),linear-gradient(90deg,rgb(16_24_40_/_0.03)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(180deg,rgb(0_0_0_/_0.55),transparent_82%)]"
	></div>

	<section class="relative z-[1] mx-auto flex w-full max-w-[1400px] justify-start px-4 md:px-8">
		<div class="flex max-w-[82rem] flex-col items-start gap-8 pt-[4.25rem] text-left max-[1100px]:pt-8">
			<Badge
				href="/docs/changelog"
				variant="outlined"
				class="w-fit gap-2 px-3 text-[0.82rem]"
			>
				New release
				<span class="text-foreground-muted">Bun-ready, tokenized, and cleaner than ever</span>
				<ArrowRight size={14} />
			</Badge>

			<div class="flex flex-col gap-4">
				<h1 class="m-0 max-w-[18.5ch] text-balance text-[clamp(3.2rem,5vw,4.4rem)] font-medium leading-[0.95] tracking-[-0.05em] [font-family:var(--font-header),sans-serif] max-[1100px]:max-w-[15ch] max-md:max-w-none max-md:text-[clamp(2.7rem,11vw,4rem)]">
					Design-forward Svelte components with calmer defaults and room to make them yours.
				</h1>
				<p class="m-0 max-w-[58rem] text-balance text-[1.05rem] leading-7 text-foreground-muted">
					Silk UI gives you customizable Svelte 5 primitives, elegant defaults, and a styling
					system designed to be remixed instead of fought. Fast to adopt, easy to extend, and
					pleasant to live in.
				</p>
			</div>

			<div class="flex flex-wrap gap-3">
				<Button href="/docs/components/alert" class="text-sm">Browse Components</Button>
				<Button href="/themes" variant="outlined" class="text-sm">Explore Themes</Button>
				<Button href="https://github.com/aidan-neel/ui" variant="ghost" class="text-sm">
					View on GitHub
				</Button>
			</div>

			<div class="grid w-full max-w-[60rem] grid-cols-3 gap-[0.9rem] max-md:grid-cols-1">
				<div class="flex flex-col gap-[0.3rem] border-t border-border-strong/70 pr-4 pt-4">
					<span class="text-[0.95rem] font-semibold">Svelte 5</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted">Modern primitives and patterns</span>
				</div>
				<div class="flex flex-col gap-[0.3rem] border-t border-border-strong/70 pr-4 pt-4">
					<span class="text-[0.95rem] font-semibold">Token-first</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted">Theme deeply without rewrites</span>
				</div>
				<div class="flex flex-col gap-[0.3rem] border-t border-border-strong/70 pr-4 pt-4">
					<span class="text-[0.95rem] font-semibold">Accessible</span>
					<span class="text-[0.88rem] leading-[1.55] text-foreground-muted">Sharper focus and interaction states</span>
				</div>
			</div>
		</div>
	</section>

	<section class="relative z-[1] mx-auto mt-[9.5rem] w-full max-w-[1400px] px-4 md:px-8">
		<div class="flex max-w-[42rem] flex-col gap-[0.85rem]">
			<span class="text-[0.8rem] font-medium uppercase tracking-[0.12em] text-foreground-muted">What makes it distinct</span>
			<h2 class="m-0 text-balance text-[clamp(1.6rem,2.35vw,2rem)] font-medium leading-[1.08] tracking-[-0.04em] [font-family:var(--font-header),sans-serif]">
				A calmer UI foundation that stays flexible as your product gets more specific.
			</h2>
		</div>

		<div class="mt-6 grid grid-cols-3 gap-4 max-md:grid-cols-1">
			<article class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] p-[1.35rem]">
				<div class="mb-[0.95rem] grid h-[2.3rem] w-[2.3rem] place-items-center rounded-[0.9rem] bg-primary/10 text-primary"><Layers size={18} /></div>
				<h3 class="m-0 text-[1rem]">Composable by default</h3>
				<p class="mt-[0.55rem] m-0 leading-[1.7] text-foreground-muted">
					Use the pieces as simple drop-ins or reshape them into product-specific patterns
					without rewriting the entire stack.
				</p>
			</article>

			<article class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] p-[1.35rem]">
				<div class="mb-[0.95rem] grid h-[2.3rem] w-[2.3rem] place-items-center rounded-[0.9rem] bg-primary/10 text-primary"><SwatchBook size={18} /></div>
				<h3 class="m-0 text-[1rem]">Real theming system</h3>
				<p class="mt-[0.55rem] m-0 leading-[1.7] text-foreground-muted">
					Semantic tokens, cleaner presets, and enough hooks to make the library feel like your
					own design language.
				</p>
			</article>

			<article class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] p-[1.35rem]">
				<div class="mb-[0.95rem] grid h-[2.3rem] w-[2.3rem] place-items-center rounded-[0.9rem] bg-primary/10 text-primary"><Check size={18} /></div>
				<h3 class="m-0 text-[1rem]">Polished interaction states</h3>
				<p class="mt-[0.55rem] m-0 leading-[1.7] text-foreground-muted">
					Focus, motion, borders, and surfaces are tuned to feel quiet and intentional instead of
					flashy or unfinished.
				</p>
			</article>
		</div>
	</section>

	<section class="relative z-[1] mx-auto mt-[5.75rem] w-full max-w-[1400px] px-4 md:px-8">
		<div class="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] flex items-center justify-between gap-4 bg-surface/72 p-6 shadow-none max-md:flex-col max-md:items-start">
		<div>
			<span class="text-[0.8rem] font-medium uppercase tracking-[0.12em] text-foreground-muted">Start here</span>
			<h2 class="m-0 mt-[0.35rem] text-balance text-[clamp(1.6rem,2.35vw,2rem)] font-medium leading-[1.08] tracking-[-0.04em] [font-family:var(--font-header),sans-serif]">
				Start from a stronger baseline.
			</h2>
			<p class="m-0 mt-[0.55rem] leading-[1.7] text-foreground-muted">
				Open the docs, copy a component, and customize from a better default baseline.
			</p>
		</div>
		<div class="flex flex-wrap gap-3">
			<Button href="/docs/introduction">Read the Docs</Button>
			<Button href="/docs/components/alert-dialog" variant="outlined">See Component Examples</Button>
		</div>
		</div>
	</section>

	<footer class="relative z-[1] mx-auto mt-24 flex w-full max-w-[1400px] items-center justify-between gap-4 border-t border-border-strong/60 px-4 pt-5 md:px-8 max-md:flex-col max-md:items-start">
		<div>
			<p class="m-0 font-semibold">Silk UI</p>
			<p class="mt-[0.35rem] text-[0.92rem] text-foreground-muted">Calmer defaults for teams that still want control.</p>
		</div>

		<div class="flex flex-wrap gap-4">
			<a href="/docs/introduction" class="text-[0.92rem] text-foreground-muted no-underline transition-colors duration-200 hover:text-foreground">Docs</a>
			<a href="/docs/components" class="text-[0.92rem] text-foreground-muted no-underline transition-colors duration-200 hover:text-foreground">Components</a>
			<a href="/themes" class="text-[0.92rem] text-foreground-muted no-underline transition-colors duration-200 hover:text-foreground">Themes</a>
			<a href="https://github.com/aidan-neel/ui" class="text-[0.92rem] text-foreground-muted no-underline transition-colors duration-200 hover:text-foreground">GitHub</a>
		</div>
	</footer>
</div>

<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { Button } from '@silk/ui/components/button';

	const titleWords = ['Restyle', 'everything', 'from', 'a', 'few', 'tokens.'];
</script>

<svelte:head>
	<title>Silk UI · Themed Svelte components</title>
	<meta
		name="description"
		content="40 Svelte 5 components and a live theme studio. Restyle all of them from a handful of design tokens — no forks, no overrides."
	/>
</svelte:head>

<div class="home-page-bg"></div>

<!-- grid lines (draw in after the hero) -->
<div class="grid-lines" aria-hidden="true">
	<span class="gl gl--v gl--left"></span>
	<span class="gl gl--v gl--right"></span>
	<span class="gl gl--h gl--top" style="--d: 1.05s"></span>
	<span class="gl gl--h gl--bottom" style="--d: 1.25s"></span>
</div>

<section class="hero">
	<h1 class="hero__title">
		{#each titleWords as word, i (word + i)}<span class="word" style="--i: {i}">{word}</span
			>{' '}{/each}
	</h1>

	<p class="hero__subtitle reveal" style="--d: 0.62s">
		40 Svelte components and a live theme studio. Every one of them restyles from the same handful
		of design tokens — no forks, no overrides.
	</p>

	<div class="hero__actions reveal" style="--d: 0.78s">
		<Button href="/docs/introduction" size="lg">
			Get started
			<ArrowRight size={16} />
		</Button>
		<Button href="/docs/components" variant="outline" size="lg">Browse components</Button>
	</div>
</section>

<div class="hero-rule" aria-hidden="true"></div>

<style>
	.hero {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 1.5rem;
		width: 100%;
		max-width: 48rem;
		margin: 0 auto;
		padding: clamp(4rem, 16vh, 9rem) 1.5rem 4rem;
		text-align: center;
	}

	.hero__title {
		margin: 0;
		font-family: var(--font-header), sans-serif;
		font-weight: 600;
		font-size: clamp(2.25rem, 7vw, 3.75rem);
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: var(--color-foreground);
	}

	.word {
		display: inline-block;
	}

	.hero__subtitle {
		margin: 0;
		max-width: 34rem;
		font-size: clamp(0.95rem, 2.4vw, 1.1rem);
		line-height: 1.6;
		color: var(--color-foreground-muted);
	}

	.hero__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	/* Grid lines — absolutely positioned within the home container. */
	.grid-lines {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.gl {
		position: absolute;
		background: var(--color-border);
	}

	.gl--v {
		top: 0;
		bottom: 0;
		width: 1px;
		transform-origin: top;
	}

	.gl--left {
		left: 0;
	}

	.gl--right {
		right: 0;
	}

	.gl--h {
		left: 0;
		right: 0;
		height: 1px;
		transform-origin: left;
	}

	.gl--top {
		top: 0;
	}

	.gl--bottom {
		bottom: 0;
	}

	.hero-rule {
		position: relative;
		z-index: 0;
		width: 100%;
		height: 1px;
		background: var(--color-border);
		transform-origin: left;
	}

	@media (prefers-reduced-motion: no-preference) {
		.word {
			animation: word-rise 0.6s var(--ease-out) calc(var(--i) * 0.07s) both;
		}

		.reveal {
			animation: reveal-rise 0.6s var(--ease-out) var(--d) both;
		}

		.gl--v {
			animation: draw-y 0.7s var(--ease-out) 0.95s both;
		}

		.gl--h,
		.hero-rule {
			animation: draw-x 0.6s var(--ease-out) var(--d, 1.15s) both;
		}
	}

	@keyframes word-rise {
		from {
			opacity: 0;
			transform: translateY(0.6em);
		}
	}

	@keyframes reveal-rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	@keyframes draw-y {
		from {
			transform: scaleY(0);
		}
	}

	@keyframes draw-x {
		from {
			transform: scaleX(0);
		}
	}
</style>

<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Palette from '@lucide/svelte/icons/palette';
	import { Button } from '@silk/ui/components/button';

	const installCommand = 'bunx @aidan-neel/ui add button';
	let copied = $state(false);
	function copyInstall() {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(installCommand);
		copied = true;
		setTimeout(() => (copied = false), 1600);
	}
</script>

<svelte:head>
	<title>Silk UI · Themed Svelte components</title>
	<meta
		name="description"
		content="40 Svelte 5 components, a live theme studio, and tokens that bend instead of break."
	/>
</svelte:head>

<div class="home">
	<div class="grid-bg"></div>
	<div class="glow"></div>

	<section class="lede">
		<div class="lede-inner">
			<span class="eyebrow anim" style="animation-delay: 60ms">
				<span class="eyebrow-dot"></span>
				Silk UI · v1 release candidate
			</span>

			<h1 class="headline anim" style="animation-delay: 140ms">
				Forty Svelte&nbsp;5 components.<br />
				<span class="headline-accent">One theming system.</span>
			</h1>

			<p class="sub anim" style="animation-delay: 240ms">
				Token-first, accessible, source-distributed. Edit the tokens — the whole library follows.
			</p>

			<div class="cta anim" style="animation-delay: 340ms">
				<Button href="/docs/components/accordion" size="lg">
					Browse components
					<ArrowRight size={15} />
				</Button>
				<Button href="/themes/studio" variant="outline" size="lg">
					<Palette size={15} />
					Open theme studio
				</Button>
			</div>

			<div class="foot anim" style="animation-delay: 440ms">
				<button
					class="install"
					type="button"
					onclick={copyInstall}
					aria-label="Copy install command"
				>
					<span class="install-prompt">$</span>
					<span class="install-cmd">{installCommand}</span>
					<span class="install-copy">
						{#if copied}<Check size={12} />{:else}<Copy size={12} />{/if}
					</span>
				</button>
				<nav class="meta">
					<a href="/docs/introduction">Docs</a>
					<span class="meta-dot">·</span>
					<a href="/docs/components">Components</a>
					<span class="meta-dot">·</span>
					<a href="/themes">Themes</a>
					<span class="meta-dot">·</span>
					<a href="https://github.com/aidan-neel/ui">GitHub</a>
				</nav>
			</div>
		</div>
	</section>
</div>

<style>
	.home {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		overflow: hidden;
		background: var(--color-background);
	}

	/* ─── Subtle backdrop ─── */
	.grid-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-image:
			linear-gradient(
				to right,
				color-mix(in srgb, var(--color-foreground) 7%, transparent) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--color-foreground) 7%, transparent) 1px,
				transparent 1px
			);
		background-size: 3.25rem 3.25rem;
		mask-image: radial-gradient(115% 95% at 26% 42%, #000 0%, transparent 72%);
		-webkit-mask-image: radial-gradient(115% 95% at 26% 42%, #000 0%, transparent 72%);
		pointer-events: none;
	}
	.glow {
		position: absolute;
		top: -28%;
		left: -12%;
		width: 62%;
		aspect-ratio: 1;
		z-index: 0;
		border-radius: 50%;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--color-primary) 22%, transparent),
			transparent 72%
		);
		filter: blur(20px);
		pointer-events: none;
	}

	/* ─── Header ─── */
	.lede {
		position: relative;
		z-index: 1;
		width: 100%;
		padding: 0 clamp(1.5rem, 4vw, 4rem);
	}
	.lede-inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.6rem;
		max-width: 62rem;
	}
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0.7rem 0.3rem 0.55rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-card) 80%, transparent);
		font-size: 0.74rem;
		font-weight: var(--font-weight-header, 500);
		letter-spacing: var(--tracking-header, -0.02em);
		color: var(--color-foreground-muted);
	}
	.eyebrow-dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--color-primary);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
	}
	.headline {
		margin: 0;
		font-family: var(--font-header), sans-serif;
		font-size: clamp(2.9rem, 7.4vw, 6.75rem);
		font-weight: var(--font-weight-header, 500);
		line-height: 0.99;
		letter-spacing: var(--tracking-header, -0.025em);
		text-wrap: balance;
	}
	.headline-accent {
		background: linear-gradient(
			94deg,
			var(--color-foreground) 0%,
			color-mix(in srgb, var(--color-foreground) 42%, var(--color-primary)) 58%,
			var(--color-primary) 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.sub {
		margin: 0;
		max-width: 40rem;
		font-size: clamp(1rem, 1.3vw, 1.2rem);
		line-height: 1.6;
		color: var(--color-foreground-muted);
		text-wrap: balance;
	}
	.cta {
		margin-top: 0.5rem;
		display: inline-flex;
		gap: 0.7rem;
		flex-wrap: wrap;
	}
	.foot {
		margin-top: 0.9rem;
		display: flex;
		align-items: center;
		gap: 1.4rem;
		flex-wrap: wrap;
	}
	.install {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0.4rem 0.3rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-card) 70%, transparent);
		font-family: var(--font-mono), monospace;
		font-size: 0.76rem;
		color: var(--color-foreground-muted);
		backdrop-filter: blur(6px);
		cursor: pointer;
		transition:
			border-color 160ms ease,
			background-color 160ms ease;
	}
	.install:hover {
		border-color: color-mix(in srgb, var(--color-foreground) 16%, transparent);
		background: var(--color-card);
	}
	.install-prompt {
		color: color-mix(in srgb, var(--color-foreground-muted) 60%, transparent);
	}
	.install-cmd {
		color: var(--color-foreground);
	}
	.install-copy {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
		color: var(--color-foreground-muted);
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 0.82rem;
	}
	.meta a {
		color: var(--color-foreground-muted);
		text-decoration: none;
		transition: color 160ms ease;
	}
	.meta a:hover {
		color: var(--color-foreground);
	}
	.meta-dot {
		color: color-mix(in srgb, var(--color-foreground-muted) 45%, transparent);
	}

	/* ─── Motion ─── */
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(16px);
			filter: blur(6px);
		}
		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
	.anim {
		opacity: 0;
		animation: rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@media (max-width: 640px) {
		.foot {
			gap: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.anim {
			opacity: 1;
			animation: none;
		}
	}
</style>

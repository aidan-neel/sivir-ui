<script lang="ts">
	import { ComponentPreview, InstallCommand } from '$lib/components/docs';
	import { CodeBlock } from '@sivir/ui/components/code-block';

	import Hero from './examples/hero.svelte';
	import HeroSrc from './examples/hero.svelte?raw';
	import PauseOnHover from './examples/pause-on-hover.svelte';
	import PauseOnHoverSrc from './examples/pause-on-hover.svelte?raw';
	import Vertical from './examples/vertical.svelte';
	import VerticalSrc from './examples/vertical.svelte?raw';
	import CustomDuration from './examples/custom-duration.svelte';
	import CustomDurationSrc from './examples/custom-duration.svelte?raw';

	const installCommand = 'bunx @sivir/ui add marquee';
</script>

<svelte:head>
	<title>Sivir · Marquee</title>
	<meta
		name="description"
		content="A CSS-only infinite scroll. Pure transforms, no JavaScript timeline — pauses on hover when you want it to."
	/>
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
	<!-- ─── Header ────────────────────────────────────────────────── -->
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				Marquee
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A CSS-only scrolling row. Supports vertical direction and pause-on-hover.
			</p>
		</div>
	</header>

	<!-- ─── Hero Example ──────────────────────────────────────────── -->
	<section id="hero" class="scroll-mt-20 flex flex-col gap-4">
		<ComponentPreview code={HeroSrc}>
			<Hero />
		</ComponentPreview>
	</section>

	<!-- ─── Installation ──────────────────────────────────────────── -->
	<section id="installation" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Installation
		</h2>
		<InstallCommand command={installCommand} />
	</section>

	<!-- ─── Usage ─────────────────────────────────────────────────── -->
	<section id="usage" class="scroll-mt-20 flex flex-col gap-4">
		<h2
			class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
		>
			Usage
		</h2>
		<p class="text-sm text-foreground-muted">Import the Marquee and wrap your content:</p>
		<CodeBlock
			code={`import { Marquee } from '$lib/sivir/components/marquee';\n\n<Marquee pauseOnHover>\n  {#each items as item}\n    <span>{item}</span>\n  {/each}\n</Marquee>`}
			lang="svelte"
			copy="overlay"
		/>
	</section>

	<!-- ─── Examples ──────────────────────────────────────────────── -->
	<section id="examples" class="scroll-mt-20 flex flex-col gap-10">
		<div>
			<h2
				class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
			>
				Examples
			</h2>
			<p class="mt-2 text-sm text-foreground-muted">
				Marquee in different configurations and use cases.
			</p>
		</div>

		<!-- Pause on hover -->
		<div id="pause-on-hover" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Pause on hover
			</h3>
			<ComponentPreview code={PauseOnHoverSrc}>
				<PauseOnHover />
			</ComponentPreview>
		</div>

		<!-- Vertical marquee -->
		<div id="vertical-marquee" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Vertical marquee
			</h3>
			<ComponentPreview code={VerticalSrc}>
				<Vertical />
			</ComponentPreview>
		</div>

		<!-- Custom duration -->
		<div id="custom-duration" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Custom duration
			</h3>
			<ComponentPreview code={CustomDurationSrc}>
				<CustomDuration />
			</ComponentPreview>
		</div>
	</section>
</div>

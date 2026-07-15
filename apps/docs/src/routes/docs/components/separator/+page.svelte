<script lang="ts">
	import { ComponentPreview, InstallCommand } from '$lib/components/docs';
	import { CodeBlock } from '@sivir/ui/components/code-block';

	import Hero from './examples/hero.svelte';
	import HeroSrc from './examples/hero.svelte?raw';
	import Horizontal from './examples/horizontal.svelte';
	import HorizontalSrc from './examples/horizontal.svelte?raw';
	import Vertical from './examples/vertical.svelte';
	import VerticalSrc from './examples/vertical.svelte?raw';

	const TITLE = 'Separator';
	const SLUG = 'separator';

	const installCommand = `bunx @sivir/ui add ${SLUG}`;
</script>

<svelte:head>
	<title>Sivir · {TITLE}</title>
	<meta name="description" content="A visual or semantic rule between content." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
	<!-- ─── Header ────────────────────────────────────────────────── -->
	<header class="flex flex-col gap-4">
		<div>
			<h1
				class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
				style="font-family: var(--font-header);"
			>
				{TITLE}
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A thin rule that divides content. Comes in horizontal and vertical orientations.
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
		<p class="text-sm text-foreground-muted">Import Separator and use it to divide content:</p>
		<CodeBlock
			code={`import { Separator } from '$lib/sivir/components/separator';\n\n<Separator />\n<Separator orientation="vertical" />`}
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
				Separator in different orientations and compositions.
			</p>
		</div>

		<!-- Horizontal -->
		<div id="horizontal" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Horizontal
			</h3>
			<ComponentPreview code={HorizontalSrc}>
				<Horizontal />
			</ComponentPreview>
		</div>

		<!-- Vertical -->
		<div id="vertical" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Vertical
			</h3>
			<ComponentPreview code={VerticalSrc}>
				<Vertical />
			</ComponentPreview>
		</div>
	</section>
</div>

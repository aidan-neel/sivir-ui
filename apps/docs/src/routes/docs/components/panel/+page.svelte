<script lang="ts">
	import { ComponentPreview, InstallCommand } from '$lib/components/docs';
	import { CodeBlock } from '@sivir/ui/components/code-block';

	import Hero from './examples/hero.svelte';
	import HeroSrc from './examples/hero.svelte?raw';
	import InsetSurface from './examples/inset-surface.svelte';
	import InsetSurfaceSrc from './examples/inset-surface.svelte?raw';

	const TITLE = 'Panel';
	const SLUG = 'panel';

	const installCommand = `bunx @sivir/ui add ${SLUG}`;
</script>

<svelte:head>
	<title>Sivir · {TITLE}</title>
	<meta
		name="description"
		content="A surface container framed by a concentric double-line border."
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
				{TITLE}
			</h1>
			<p
				class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
			>
				A surface with a concentric double-line border. Wrap any content in it.
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
		<p class="text-sm text-foreground-muted">Import Panel and wrap your content:</p>
		<CodeBlock
			code={`import { Panel } from '$lib/sivir/components/panel';\n\n<Panel>\n\tYour content\n</Panel>`}
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
				The frame on its own, and as a layered inset.
			</p>
		</div>

		<!-- Inset surface -->
		<div id="inset-surface" class="scroll-mt-20 flex flex-col gap-3">
			<h3
				class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
			>
				Inset surface
			</h3>
			<p class="text-sm text-foreground-muted">
				Drop the frame a hair darker than a card-coloured child and the content reads as a distinct
				inset — the pattern the component preview on this site uses.
			</p>
			<ComponentPreview code={InsetSurfaceSrc}>
				<InsetSurface />
			</ComponentPreview>
		</div>
	</section>
</div>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { CodeBlock } from '$lib/components/docs';
</script>

<svelte:head>
	<title>Sivir · Installation</title>
	<meta
		name="description"
		content="Install Sivir UI — a Svelte 5 + Tailwind v4 component library."
	/>
</svelte:head>

<div class="flex flex-col gap-8 pb-16" data-docs-page>
	<header class="flex flex-col gap-3">
		<h1 class="h1 m-0">Installation</h1>
		<p class="m-0 max-w-2xl text-[0.95rem] leading-relaxed text-foreground-muted">
			Sivir is a component library for Svelte 5 and Tailwind v4. You don't install it as a runtime
			dependency — the <code class="font-mono text-foreground">sivir</code> CLI copies each component's
			source straight into your project, so you own the markup and styling and can edit it freely.
		</p>
	</header>

	<section class="flex flex-col gap-3">
		<h2 class="docs-section-heading m-0">Prerequisites</h2>
		<ul
			class="m-0 flex list-disc flex-col gap-1 pl-5 text-[0.92rem] leading-relaxed text-foreground-muted"
		>
			<li>A Svelte 5 or SvelteKit project</li>
			<li>
				Tailwind CSS v4 (Sivir relies on its CSS-first config and <code
					class="font-mono text-foreground">@theme</code
				> tokens)
			</li>
		</ul>
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="docs-section-heading m-0">1. Create a project</h2>
		<p class="m-0 text-[0.92rem] leading-relaxed text-foreground-muted">
			Skip this if you already have a Svelte app. A fresh SvelteKit project is the cleanest place to
			start — choose the Skeleton template and TypeScript when prompted.
		</p>
		<CodeBlock lang="shell" code="bunx sv create my-app" />
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="docs-section-heading m-0">2. Add Tailwind v4</h2>
		<p class="m-0 text-[0.92rem] leading-relaxed text-foreground-muted">
			Use the official SvelteKit installer — it wires up the Vite plugin and your base stylesheet.
		</p>
		<CodeBlock lang="shell" code="cd my-app && bunx sv add tailwindcss" />
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="docs-section-heading m-0">3. Initialize Sivir</h2>
		<p class="m-0 text-[0.92rem] leading-relaxed text-foreground-muted">
			Run <code class="font-mono text-foreground">init</code> once. It scaffolds
			<code class="font-mono text-foreground">src/lib/sivir/</code> with the theme tokens (<code
				class="font-mono text-foreground">ui.css</code
			>) and shared utilities, and writes a
			<code class="font-mono text-foreground">sivir.json</code> config recording your install directory
			and import alias.
		</p>
		<CodeBlock lang="shell" code="bunx @sivir/ui init" />
		<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
			Defaults to <code class="font-mono text-foreground">src/lib/sivir</code> with the
			<code class="font-mono text-foreground">$lib/sivir</code> alias. Pass
			<code class="font-mono text-foreground">-y</code> to accept defaults without prompts.
		</p>
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="docs-section-heading m-0">4. Import the stylesheet</h2>
		<p class="m-0 text-[0.92rem] leading-relaxed text-foreground-muted">
			Import the generated token sheet in your root CSS (usually <code
				class="font-mono text-foreground">src/app.css</code
			>). It defines the Sivir theme tokens every component reads.
		</p>
		<CodeBlock
			lang="css"
			code={`/* src/app.css */
@import './lib/sivir/ui.css';`}
		/>
		<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
			Dark mode is driven by a <code class="font-mono text-foreground">.dark</code> class on the
			<code class="font-mono text-foreground">&lt;html&gt;</code> element.
		</p>
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="docs-section-heading m-0">5. Add a component</h2>
		<p class="m-0 text-[0.92rem] leading-relaxed text-foreground-muted">
			Add components by name. Each one's source is copied into
			<code class="font-mono text-foreground">src/lib/sivir/components/</code>, its imports
			rewritten to your alias, and any dependencies (peer packages, shared internals, other
			components) pulled in automatically.
		</p>
		<CodeBlock lang="shell" code="bunx @sivir/ui add button" />
		<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
			Run <code class="font-mono text-foreground">bunx @sivir/ui list</code> to see every installable
			component and built-in theme.
		</p>
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="docs-section-heading m-0">6. Use it</h2>
		<p class="m-0 text-[0.92rem] leading-relaxed text-foreground-muted">
			Import from your alias — the component now lives in your own source tree.
		</p>
		<CodeBlock
			lang="svelte"
			code={`<script>
  import { Button } from '$lib/sivir/components/button';
<${'/'}script>

<Button>Get started</Button>`}
		/>
	</section>

	<section class="flex flex-col gap-2">
		<h2 class="docs-section-heading m-0">Tailwind v4 only</h2>
		<p class="m-0 text-[0.92rem] leading-relaxed text-foreground-muted">
			Sivir uses Tailwind v4 features (CSS-first config, <code class="font-mono text-foreground"
				>@theme</code
			>, <code class="font-mono text-foreground">color-mix</code>). If your project is still on
			Tailwind v3, upgrade before installing.
		</p>
	</section>

	<section class="flex flex-col gap-2">
		<h2 class="docs-section-heading m-0">Next steps</h2>
		<p class="m-0 text-[0.92rem] leading-relaxed text-foreground-muted">
			Browse the <a
				class="text-foreground underline underline-offset-2"
				href={resolve('/docs/components')}>component catalog</a
			>, or read the
			<a class="text-foreground underline underline-offset-2" href={resolve('/docs/theming')}
				>theming guide</a
			>
			to match Sivir to your brand.
		</p>
	</section>
</div>

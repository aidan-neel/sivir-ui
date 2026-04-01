<script lang="ts">
	import CodeBlock from '$lib/components/docs/code-block.svelte';
	import PageHeader from '$lib/components/docs/page-header.svelte';
</script>

<main class="flex w-full flex-col pb-12">
	<PageHeader title="Styling" description="Tokens first, component overrides second" compact={true} />

	<section class="flex flex-col gap-2 pt-6">
		<p class="text-base">
			The styling system is built around three layers:
		</p>
		<p class="text-base">
			1. Core semantic tokens like `--color-background`, `--color-primary`, and `--radius-lg`
		</p>
		<p class="text-base">
			2. Component tokens like `--button-primary-bg`, `--panel-radius`, and `--field-height`
		</p>
		<p class="text-base">
			3. Slot hooks via `data-ui` and `data-variant` attributes on the rendered components
		</p>
	</section>

	<section class="flex flex-col gap-2 pt-8">
		<p class="text-2xl font-semibold">Theme File</p>
		<p class="text-base">
			The fastest way to customize the whole system is to override the semantic tokens in a theme
			file under <span class="bg-secondary p-0.5 text-sm border px-2 font-mono">ui/themes</span>.
		</p>

		<CodeBlock
			lang="css"
			class="mt-3 p-3 max-h-[30rem]"
			code={`@theme {
	--font-sans: 'Geist';
	--color-background: #fbfaf6;
	--color-border: #ddd8cf;
	--color-input: #d7d0c3;
	--color-primary: #8f3d2e;
	--color-foreground: #211c18;
	--color-foreground-btn: #fffaf3;
	--color-secondary: #efe8dc;
	--color-popover: #fffdf8;
	--color-card: #f7f1e7;
	--radius-lg: 0.8rem;
	--color-ring: rgb(143 61 46 / 0.24);
}

.dark {
	--color-background: #171311;
	--color-border: #2b2421;
	--color-input: #342d29;
	--color-primary: #f08d69;
	--color-foreground: #f4ece6;
	--color-foreground-btn: #1a1613;
	--color-secondary: #201a18;
	--color-popover: #1e1816;
	--color-card: #1b1614;
	--color-ring: rgb(240 141 105 / 0.3);
}`}
		/>
	</section>

	<section class="flex flex-col gap-2 pt-8">
		<p class="text-2xl font-semibold">Component Tokens</p>
		<p class="text-base">
			When you need more control, override component variables instead of rewriting the component.
			These live in <span class="bg-secondary p-0.5 text-sm border px-2 font-mono">ui/ui.css</span>.
		</p>

		<CodeBlock
			lang="css"
			class="mt-3 p-3 max-h-[30rem]"
			code={`:root {
	--button-radius: 999px;
	--button-height: 2.75rem;
	--button-primary-bg: #111827;
	--button-primary-hover-bg: #1f2937;

	--field-radius: 1rem;
	--field-height: 3rem;

	--panel-radius: 1.25rem;
	--panel-shadow: 0 24px 80px rgb(15 23 42 / 0.16);

	--menu-item-radius: 0.85rem;
	--toast-radius: 1rem;
}`}
		/>
	</section>

	<section class="flex flex-col gap-2 pt-8">
		<p class="text-2xl font-semibold">Per-Component Overrides</p>
		<p class="text-base">
			Every major primitive exposes `data-ui`, and many controls also expose `data-variant` and
			`data-size`. That gives you a clean way to target one family of components without
			forking the library.
		</p>

		<CodeBlock
			lang="css"
			class="mt-3 p-3 max-h-[30rem]"
			code={`[data-ui='button'][data-variant='primary'] {
	letter-spacing: 0.01em;
}

[data-ui='dialog-content'] {
	--panel-radius: 1.5rem;
	--panel-padding-lg: 1.75rem;
}

[data-ui='toast'] {
	--toast-border: color-mix(in srgb, var(--color-primary) 22%, var(--color-border));
}

[data-ui='badge'][data-variant='secondary'] {
	text-transform: uppercase;
}`}
		/>
	</section>
</main>

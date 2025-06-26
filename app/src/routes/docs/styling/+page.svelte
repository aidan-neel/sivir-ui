<script lang="ts">
	import CodeBlock from '$lib/components/docs/code-block.svelte';
</script>

<main class="flex flex-col w-full h-screen pb-12">
	<header class="flex flex-col gap-1 pb-6 border-b rounded-none">
		<h1 class="text-4xl font-bold">Styling</h1>
		<p class="text-lg text-foreground-muted">Learn how to style @aidan-neel/ui</p>
	</header>

	<p class="text-base pt-6">
		Styling for each component is designed to be as straight forward and customizable as possible
		with a basic css file. Themes are located in the <span
			class="bg-secondary p-0.5 text-sm border px-2 font-mono">ui/themes</span
		>
		directory.
		<br /><br />
		To create a new theme, create a new CSS file and place it into the
		<span class="bg-secondary p-0.5 text-sm border px-2 font-mono">ui/themes</span>
		directory. Then, import it in
		<span class="bg-secondary p-0.5 text-sm border px-2 font-mono">ui/ui.css</span>.
	</p>

	<p class="text-xl font-semibold pt-5 rounded-none">Default theme</p>
	<p class="pt-1 pb-5 text-base">Use this as a base for customizing your own theme.</p>

	<CodeBlock
		lang="css"
		class="mb-6 p-3 max-h-[35rem]"
		code={`@layer base {
	:root {
		/* Fonts */
		--font-sans: 'Geist';
		--font-mono: 'Geist Mono';

		/* Colors */
		--color-background: #ffffff;
		--color-border: #dedede;
		--color-primary: #2685d9;
		--color-foreground-opposite: #ffffff;
		--color-foreground: #171717;
		--color-foreground-muted: #525252;
		--color-foreground-btn: #ffffff;
		--color-secondary: #e9e9e9;
		--color-accent: #0d1a40;
		--color-alternate: #2c2c2c;
		--color-success: #46ab61;
		--color-warning: #ff9800;
		--color-error: #ef5350;
		--color-destructive: #fa4234;

		/* Border radius */
		--radius-sm: 0.2rem;
		--radius-md: 0.3rem;
		--radius-lg: 0.5rem;
		--radius-xl: 0.7rem;
	}

	.dark {
		/* Fonts */
		--font-sans: 'Geist' !important;
		--font-mono: 'Geist Mono' !important;

		/* Colors */
		--color-background: #0a0a0a !important;
		--color-border: #1c1c1c !important;
		--color-primary: #0b7bde !important;
		--color-foreground-opposite: #0d0d0d !important;
		--color-foreground: #ffffff !important;
		--color-foreground-muted: #9c9c9c !important;
		--color-foreground-btn: #ffffff !important;
		--color-secondary: #171717 !important;
		--color-accent: #0d1a40 !important;
		--color-alternate: #2c2c2c !important;
		--color-success: #46ab61 !important;
		--color-warning: #ff9800 !important;
		--color-error: #ef5350 !important;
		--color-destructive: #b50003 !important;

		/* Border radius */
		--radius-sm: 0.2rem !important;
		--radius-md: 0.3rem !important;
		--radius-lg: 0.5rem !important;
		--radius-xl: 0.7rem !important;

		/* Sizes */
		--height-btn: 2.25rem !important;
		--padding-x-btn: 1rem !important;
	}
}
`}
	/>
</main>

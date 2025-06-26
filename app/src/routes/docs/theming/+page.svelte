<script lang="ts">
    import CodeBlock from "$lib/components/docs/code-block.svelte";
</script>

<main class="flex flex-col w-full h-screen">
	<header class="flex flex-col gap-1 pb-6 border-b rounded-none">
		<h1 class="text-4xl font-bold">Custom Theming</h1>
		<p class="text-lg text-foreground-muted">Create and install custom themes from the registry</p>
	</header>

    <section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">Create a theme</p>
        <p class="text-base py-4">
            Customize a theme to your liking using Tailwind. See more <a href="https://tailwindcss.com/docs/theme" class="underline font-medium">here.</a>
            Below is an example theme called 'Neon'.
        </p>
        <CodeBlock code={`@theme {
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
`} class="p-3 max-h-[35rem]" lang="css" />
	</section>

	<section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">Install a theme</p>
        <p class="text-base py-4">
            Use the CLI to install a theme to your project. A list of themes with previews are available <a href="/themes" class="underline font-medium">here.</a>
        </p>
        <CodeBlock code={"npx @aidan-neel/ui theme install [name]"} class="p-3" lang="shell" />
        <p class="text-base py-4">
            After installing, make sure to import your chosen theme in the main css file.
        </p>
        <CodeBlock code={`/* Chosen Theme */
@import './themes/default.css';
`} class="p-3" lang="css" />
        <p class="text-base py-4">
            Alternatively, use the themes URL to use it without having to download it.
        </p>
        <CodeBlock code={`/* Chosen Theme */
@import 'https://ui.aidan-neel.com/themes/default.css';
`} class="p-3" lang="css" />
	</section>

    <section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">Publish a theme</p>
        <p class="text-base py-4">
            Use the CLI to publish a theme to the registry.
        </p>
        <CodeBlock code={"npx @aidan-neel/ui theme publish [name].css"} class="p-3" lang="shell" />
        <p class="text-base py-4">
            Assuming a theme by the same name does not already exist, it will take the CSS file name and publish the theme.
        </p>
	</section>
</main>

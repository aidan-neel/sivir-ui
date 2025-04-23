<script lang="ts">
	import CodeBlock from '$lib/components/docs/code-block.svelte';
</script>

<main class="flex flex-col w-full h-screen pb-12">
	<header class="flex flex-col gap-1 pb-6 border-b rounded-none">
		<p class="text-4xl font-bold">Styling</p>
		<p class="text-lg text-foreground-muted">Learn how to style aidan-neel/ui</p>
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
		class="mb-6"
		code={`@theme {
    /* Fonts */
    --font-sans: 'Geist';
    --font-mono: 'Geist Mono';

    /* Colors */
    --color-background: #ffffff;
    --color-border: #dedede;
    --color-primary: #2685d9;
    --color-primary-alternate: #0077e0;
    --color-primary-hovered: #0061b5;
    --color-flat: #b7d4f0;
    --color-flat-foreground: #3c99e0;
    --color-flat-hovered: #99c3ea;
    --color-foreground-opposite: #ffffff;
    --color-foreground: #171717;
    --color-foreground-muted: #525252;
    --color-secondary: #f2f2f2;
    --color-secondary-hovered: #f7f7f7;
    --color-ghost-hovered: #f7f7f7;
    --color-accent: #0d1a40;
    --color-alternate: #2c2c2c;
    --color-alternate-hovered: #1a1a1a;
    --color-outlined-hovered: #dedede;
    --color-success: #46ab61;
    --color-warning: #ff9800;
    --color-error: #ef5350;
    --color-destructive: #fa4234;
    --color-destructive-hovered: #781d17;
    --color-primary-active: #004c8a;
    --color-flat-active: #80afd5;
    --color-secondary-active: #e6e6e6;
    --color-ghost-active: #e6e6e6;
    --color-alternate-active: #0f0f0f;
    --color-outlined-active: #bfbfbf;
    --color-destructive-active: #5c1612;

    /* Disabled Colors */
    --color-primary-disabled: #bbdcff;
    --color-primary-alternate-disabled: #a8d5ff;
    --color-primary-hovered-disabled: #8ea6c4;
    --color-flat-disabled: #ddeaf7;
    --color-flat-foreground-disabled: #89b6de;
    --color-flat-hovered-disabled: #c8e0f5;
    --color-secondary-disabled: #f0f0f0;
    --color-secondary-hovered-disabled: #d1d1d1;
    --color-ghost-hovered-disabled: #e0e0e0;
    --color-alternate-disabled: #737373;
    --color-alternate-hovered-disabled: #4d4d4d;
    --color-outlined-hovered-disabled: #e1e1e1;
    --color-border-disabled: #e1e1e1;
    --color-text-disabled: #a3a3a3;
    --color-background-disabled: #f5f5f5;
    --color-destructive-disabled: #541511;

    /* Border radius */
    --radius-sm: 0.2rem;
    --radius-md: 0.3rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.7rem;

    /* Sizes */
    --height-btn: 2.25rem;
    --padding-x-btn: 1rem;
}
`}
	/>
</main>

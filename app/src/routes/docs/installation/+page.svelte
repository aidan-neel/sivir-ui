<script lang="ts">
    import CodeBlock from "$lib/components/docs/code-block.svelte";
</script>

<main class="flex flex-col w-full h-screen">
	<header class="flex flex-col gap-1 pb-6 border-b rounded-none">
		<h1 class="text-4xl font-bold">Installation</h1>
		<p class="text-lg text-foreground-muted">How to initialize and install @aidan-neel/ui</p>
	</header>

	<section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">1. Create a Svelte project</p>
        <p class="text-base py-4">
            Use the SvelteKit CLI to create a new project.
        </p>
        <CodeBlock code={"npx sv create"} class="p-3" lang="shell" />
	</section>

    <section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">2. Install TailwindCSS</p>
        <p class="text-base py-4">
            Use the Svelte CLI to install Tailwind, or use <a class="font-medium underline" href="https://tailwindcss.com/docs/installation/framework-guides/sveltekit">this</a> guide.
        </p>
        <CodeBlock code={"npx sv@0.6.18 add tailwindcss"} class="p-3" lang="shell" />
	</section>

    <section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">3. Initialize the CLI</p>
        <p class="text-base py-2">
            
        </p>
        <CodeBlock code={"npx @aidan-neel/ui init"} class="p-3" lang="shell" />
	</section>

    <section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">4. Add components using the CLI</p>
        <p class="text-base py-2">
            
        </p>
        <CodeBlock code={"npx @aidan-neel/ui add button"} class="p-3" lang="shell" />
	</section>

    <section class="flex flex-col gap-1 mt-6">
		<p class="text-2xl font-semibold">5. All set!</p>
        <p class="text-base py-4">
            You can now start importing and using components.
        </p>
        <CodeBlock code={`<script>
    import { Button } from '$lib/ui/components/button';
</script>\n
<Button>Primary</Button>`} class="p-3" lang="svelte" />
	</section>
</main>

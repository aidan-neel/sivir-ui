<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/ui/components/button';
	import { Input } from '$lib/ui/components/input';
	import Logo from './logo.svelte';
	import Navbutton from './navbutton.svelte';
    import Moon from '@lucide/svelte/icons/moon'
    import Sun from '@lucide/svelte/icons/sun'
	import { toggleMode, mode } from "mode-watcher";
</script>

<nav
	class="w-full z-20 top-0 rounded-none px-6 flex-shrink-0 fixed {$page.url.pathname === '/'
		? ' border-transpar'
		: ''} bg-background/50 backdrop-blur-sm h-14 flex items-center justify-between"
>
	<div class="flex w-96 flex-row gap-2 items-center">
		<a href="/" class="font-bold text-lg mr-2 flex flex-row items-center gap-2"><Logo /></a>
        <Navbutton href="/">Home</Navbutton>
        <Navbutton href="/docs/introduction">Docs</Navbutton>
        <Navbutton href="/docs/components">Components</Navbutton>
        <Navbutton href="/themes">Themes</Navbutton>
	</div>

	<div class="flex flex-row gap-2 items-center">
		<Input variant="outlined" class="w-80" placeholder="Search docs..." />
        <Button onclick={() => {
            toggleMode();
        }} size="icon" variant="outlined">
            {#if mode.current === "dark"}
                <Moon size="16" />
            {:else}
                <Sun size="16" />
            {/if}
        </Button>
	</div>
</nav>

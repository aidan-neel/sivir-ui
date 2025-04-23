<script lang="ts">
	import { page } from '$app/stores';
	import { Input } from '$lib/ui/components/input';
	import Logo from './logo.svelte';
	import Navbutton from './navbutton.svelte';
</script>

<nav
	class="w-full z-20 top-0 rounded-none px-6 flex-shrink-0 fixed {$page.url.pathname === '/'
		? 'border-b border-transpar'
		: 'border-b'} bg-background/50 backdrop-blur-sm h-14 flex items-center justify-between"
>
	<div class="flex w-96 flex-row gap-8 items-center">
		<a href="/" class="font-bold text-lg flex flex-row items-center gap-2"><Logo />aidan-neel/ui</a>
	</div>

	<div class="flex flex-row gap-2 lg:flex hidden">
        <Navbutton href="/">Home</Navbutton>
        <Navbutton href="/docs/introduction">Docs</Navbutton>
        <Navbutton href="/docs/components">Components</Navbutton>
        <Navbutton href="/themes">Themes</Navbutton>
	</div>

	<div class="flex w-80 flex-row gap-8 items-center">
		<Input variant="secondary" class="w-80" placeholder="Search docs..." />
	</div>
</nav>

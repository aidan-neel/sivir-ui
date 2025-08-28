<script lang="ts">
	import { cubicOut } from "svelte/easing";
	import { fly } from "svelte/transition";
    import ArrowRight from "@lucide/svelte/icons/arrow-right";
	import { Button } from '$lib/ui/components/button';    
    
</script>

<div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
<div class="h-screen pt-32 w-screen fixed top-0 left-0 flex flex-col items-center">
    <header class="flex flex-col text-center items-center justify-center gap-4" in:fly={{ duration: 800, y: 20, easing: cubicOut }}>
        <a href="/docs/changelog" class="border bg-background hover:bg-secondary duration-200 w-fit rounded-lg p-0.5 px-3 text-sm font-medium gap-1 flex flex-row items-center">
            <span class="text-xs">🎉</span> Neel UI has been released!
            <ArrowRight class="size-4 text-foreground-muted" />
        </a>
        <h1 class="text-[48px] w-full text-balance tracking-tighter max-w-[56rem] font-medium leading-14">
            Fast, clean Svelte 5 components for effortless development.
        </h1>   
        <p class="text-[18px] text-foreground-muted w-full max-w-[42rem]">
            A flexible, accessible component library and distribution platform for Svelte.
            Built for developers who want complete control over their UI.
        </p>
        <div class="flex flex-row gap-2">
			<Button href={'/docs/components/alert'} class="text-sm">Get Started</Button>
			<Button href={'https://github.com/aidan-neel/ui'} class="text-sm" variant="ghost"
				>View on GitHub</Button
			>
        </div>
    </header>
</div>
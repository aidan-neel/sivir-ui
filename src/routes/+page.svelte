<script>
	import { Button } from '$lib/ui/components/button';
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let ready = $state(false);
	$effect(() => {
		ready = true;
	});
</script>

{#if ready}
	<div
		class="z-10 pb-40 absolute w-full flex items-center text-center flex-col pt-40 gap-4 justify-start"
	>
		<a
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			href="/docs/changelog"
			class="rounded-lg-full border shadow-sm px-4 py-1 text-sm font-medium">🎉 New 1.0 Release!</a
		>
		<p
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			class="text-[72px] font-display font-bold leading-20"
		>
			A better way to<br />build UI with Svelte 5
		</p>
		<p
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			class="text-[18px] text-foreground-muted"
		>
			A flexible component library for Svelte, designed for<br /> developers who want full control over
			their UI.
		</p>
		<div in:fly={{ duration: 800, y: 20, easing: cubicOut }} class="flex flex-row gap-5">
			<Button href={'/docs/components/alert'} class="text-sm">Browse Components</Button>
			<Button href={'https://github.com/aidan-neel/ui'} class="text-sm" variant="outlined"
				>View on GitHub</Button
			>
		</div>

		<div
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			class="w-1/2 h-[45rem] mt-40 border rounded-lg"
		></div>
	</div>
{/if}

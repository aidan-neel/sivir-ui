<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/ui/components/button';

	let { href, children } = $props();
	const docLanding = [
		'/docs/introduction',
		'/docs/installation',
		'/docs/styling',
		'/docs/themes',
		'/docs/changelog'
	];

	let isActive = $state(false);
</script>

<Button
	{href}
	variant="ghost"
	class={isActive
		? 'bg-secondary rounded-lg-full px-4 font-semibold'
		: 'rounded-lg-full px-4'}
>
	{@render children?.()}
</Button>

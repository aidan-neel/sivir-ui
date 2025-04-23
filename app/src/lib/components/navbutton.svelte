<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/ui/components/button';

	let { href, children } = $props();
</script>

<Button
	{href}
	variant="ghost"
	class={$page.url.pathname === href
		? 'bg-secondary rounded-lg-full px-4 font-semibold'
		: 'rounded-lg-full px-4'}
>
	{@render children?.()}
</Button>

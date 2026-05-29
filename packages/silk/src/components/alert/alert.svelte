<script lang="ts">
	import type { Snippet } from 'svelte';
	import { alert, alertAccent, alertChip } from './variants';
	import { cn } from '@silk/ui/utils';
	import Check from '@lucide/svelte/icons/circle-check';
	import X from '@lucide/svelte/icons/circle-x';
	import Warning from '@lucide/svelte/icons/triangle-alert';
	import Info from '@lucide/svelte/icons/info';

	type Variant = 'info' | 'error' | 'success' | 'warning';

	let {
		variant = 'info',
		children,
		class: classProp,
		...rest
	}: {
		variant?: Variant;
		children: Snippet;
		class?: string;
	} = $props();

	const Icon = $derived(
		variant === 'success' ? Check : variant === 'error' ? X : variant === 'warning' ? Warning : Info
	);
</script>

<div role="alert" {...rest} class={cn(classProp, alert())}>
	<span class={alertAccent({ variant })} aria-hidden="true"></span>
	<span class={alertChip({ variant })} aria-hidden="true">
		<Icon size={13} strokeWidth={2.25} />
	</span>
	<div class="flex min-w-0 flex-1 flex-col gap-0.5 pt-px">
		{@render children?.()}
	</div>
</div>

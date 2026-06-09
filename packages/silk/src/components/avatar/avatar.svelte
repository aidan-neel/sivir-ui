<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { setContext } from 'svelte';
	import type { AvatarProps } from '.';

	let {
		class: className,
		size = 'md',
		shape = 'circle',
		children,
		...rest
	}: AvatarProps = $props();

	const sizes: Record<string, string> = {
		sm: 'size-7 [font-size:calc(var(--font-size-body,16px)*0.7)]',
		md: 'size-9 [font-size:calc(var(--font-size-body,16px)*0.78)]',
		lg: 'size-12 [font-size:calc(var(--font-size-body,16px)*0.95)]',
		xl: 'size-16 [font-size:calc(var(--font-size-body,16px)*1.1)]'
	};

	// Shared state lets <Avatar.Image> hide the fallback when its image loads.
	const ctx = $state({ imageLoaded: false });
	setContext('avatar-state', ctx);
</script>

<span
	data-ui="avatar"
	class={cn(
		'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-secondary text-foreground-muted [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)]',
		shape === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-md)]',
		sizes[size] ?? sizes.md,
		className
	)}
	{...rest}
>
	{@render children?.()}
</span>

<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import * as Tabs from '@sivir/ui/components/tabs';
	import type { CodeBlockListProps } from '.';

	let { children, class: className, ...rest }: CodeBlockListProps = $props();
</script>

<!-- Delegates the active-underline indicator + keyboard nav to Sivir's Tabs. -->
<Tabs.List class={cn(className, 'border-0 bg-transparent p-0')} {...rest}>
	{@render children?.()}
</Tabs.List>

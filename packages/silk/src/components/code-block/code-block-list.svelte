<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import * as Tabs from '@silk/ui/components/tabs';
	import type { CodeBlockListProps } from '.';

	let { children, class: className, ...rest }: CodeBlockListProps = $props();
</script>

<!-- Delegates the active-underline indicator + keyboard nav to Silk's Tabs. -->
<Tabs.List class={cn(className, 'border-0 bg-transparent p-0')} {...rest}>
	{@render children?.()}
</Tabs.List>

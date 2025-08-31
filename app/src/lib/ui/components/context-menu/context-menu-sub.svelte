<script lang="ts">
	import { getContext, setContext, type Snippet } from 'svelte';
    import * as Popover from "$lib/ui/components/popover";
	import type { ContextMenuSubProps } from ".";

    const key = Math.random().toString(36).substring(2);
    setContext('parent', getContext('key'));

    let { children, class: className, ...rest }: ContextMenuSubProps = $props();
</script>

<Popover.Root {...rest} state_key={key} hoverable={true} placement="right">
    {@render children?.()}
</Popover.Root> 
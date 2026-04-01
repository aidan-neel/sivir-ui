<script lang="ts">
    import { Button, type ButtonProps } from "$lib/silk/components/button";
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';
	import { getContext, setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from "svelte/elements";
    import Check from "@lucide/svelte/icons/check";

    import * as Popover from "$lib/silk/components/popover";
    import { ChevronRight } from "@lucide/svelte";

    const key = Math.random().toString(36).substring(2);
    setContext('parent', getContext('key'));

    type Props = {
        class: string;
        children?: Snippet;
    } & ButtonProps;

    let { children, class: className, ...rest }: Props = $props();
</script>

<Popover.Root state_key={key} hoverable={true} placement="right">
	{@render children?.()}
</Popover.Root>

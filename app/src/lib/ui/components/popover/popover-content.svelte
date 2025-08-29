<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
	import { clickOutside, cn } from '$lib/ui/utils';
	import { flyAndScale } from '$lib/ui/internals/transition';
    import { getContext } from 'svelte';
	import { computePosition, flip } from '@floating-ui/dom';

	const {
		children,
		class: classProp,
		allowClickOutside = true,
		...rest
	}: {
		children: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	} = $props();

    const key = getContext("key") as string;
    const uiState = states[key];

	let popover = $state<HTMLElement | undefined>();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			uiState.data.open = false;
		}
	}

    function handleScroll() {
        if (uiState.data && popover) {
            computePosition(uiState.data.buttonRef, popover, {
                placement: uiState.data.placement,
                middleware: [flip()]
            }).then(({ x, y }) => {
                Object.assign(popover!.style, {
                    left: `${x}px`,
                    top: `${y}px`
                });
            });
        }
    }

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
        document.addEventListener('scroll', handleScroll);
        
		uiState.data.popoverRef = popover;

        if (uiState.data.open && popover) {
            computePosition(uiState.data.buttonRef, popover, {
                placement: uiState.data.placement,
                middleware: [flip()]
            }).then(({ x, y }) => {
                Object.assign(popover!.style, { left: `${x}px`, top: `${y}px` });
            });
        }

		if (allowClickOutside && popover) {
			clickOutside(popover, () => {
				uiState.data.open = false;
			});
		}

        onDestroy(() => {
            document.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('scroll', handleScroll);
        });
	});

    function cancelClose() {
		if (uiState.data?.closeTimeout) {
			if (uiState.data?.hoverable) {
                clearTimeout(uiState.data.closeTimeout);
                uiState.data.closeTimeout = null;
            }
		}
	}

    $effect(() => {
        if(document) {
            if (popover && popover.contains(document.activeElement)) {
                return;
            }
            if (!uiState.data.hovering) {
                return;
            }
            cancelClose();
        }
    })
</script>

<div
	{...rest}
	class={cn('flex items-center py-2 justify-center floating')}
	bind:this={popover as HTMLElement}
    role="dialog"
    id={`${String(key)}-content`}
    aria-modal="false"
    aria-labelledby={`${String(key)}-title`}
    onmouseenter={cancelClose}
    onmouseleave={() => {
        if (uiState.data?.hoverable) {
            if (popover && popover.contains(document.activeElement)) {
                return;
            }
            uiState.data.open = false;
        }
    }}
>
	{#if uiState.data?.open}
		<div
			{...rest}
			transition:flyAndScale={{ duration: 200 }}
			class={cn(classProp, `p-4 text-sm rounded-xl border m-auto shadow-sm bg-popover`)}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
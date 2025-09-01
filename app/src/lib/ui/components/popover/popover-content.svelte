<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
	import { clickOutside, cn } from '$lib/ui/utils';
	import { flyAndScale } from '$lib/ui/internals/transition';
    import { getContext } from 'svelte';
	import { computePosition, flip, type ReferenceElement } from '@floating-ui/dom';
	import type { PopoverContentProps, PopoverState } from '.';
    import { page } from '$app/state';

	const {
		children,
		class: classProp,
		allowClickOutside = true,
        portal = true,
        refElement,
		...rest
	}: PopoverContentProps = $props();

    const key = getContext("key") as string;
    const uiState = states[key].data as PopoverState;

	let popover = $state<HTMLElement | undefined>();
    let lastOpen = $state<boolean>();
    let scrollY = $state<number>();
    let lastPath = $state<string>(page.url.pathname);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			uiState.open = false;
		}
	}

    function updatePosition() {
        if (uiState && popover) {
            computePosition(refElement ?? uiState.buttonRef as ReferenceElement, popover, {
                placement: refElement ? 'right-start' : uiState.placement,
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
        document.addEventListener('scroll', updatePosition);

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        
		uiState.popoverRef = popover;

        if (portal && document && popover) {
            document.body.appendChild(popover);
        }

		if (allowClickOutside && popover) {
			clickOutside(popover, () => {
				uiState.open = false;
			});
		}
        
        const ro = new ResizeObserver(updatePosition);
        if (uiState?.buttonRef) ro.observe(uiState.buttonRef);
        if (popover) ro.observe(popover);

        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const openPopovers = Array.from(document.body.children).filter(
                el => el.id.startsWith('popover-') && !el.id.includes('controls')
            );
            uiState.focusedInside = openPopovers.some(el => el.contains(target));
        };

        const handleFocusOut = () => {
            uiState.focusedInside = false;
        };

        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);

        onDestroy(() => {
            document.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('scroll', updatePosition);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
            ro.disconnect();

            uiState.open = false;
            uiState.popoverRef?.remove();
            popover?.remove();
        });
	});

    function cancelClose() {
		if (uiState?.closeTimeout) {
			if (uiState?.hoverable) {
                clearTimeout(uiState.closeTimeout);
                uiState.closeTimeout = undefined;
            }
		}
	}

    $effect(() => {
        if (!document) return;

        const bodyChildren = Array.from(document.body.children) as HTMLElement[];

        // Pointer-events lock
        if (uiState.open) {
            document.body.style.overflow = 'hidden';
            for (const el of bodyChildren) {
                if (!el.id.startsWith('popover-') || el.id.includes('controls')) {
                    el.classList.add('pointer-events-none');
                }
            }
        } else {
            document.body.style.overflow = '';
            for (const el of bodyChildren) {
                el.classList.remove('pointer-events-none');
            }
        }

        if (!uiState.hovering && !uiState.focusedInside) {
            cancelClose();
        }
    });
</script>

<div
	{...rest}
	class={cn('flex items-center py-2 justify-center floating')}
	bind:this={popover as HTMLElement}
    role="dialog"
    id={`popover-${String(key)}-content`}
    aria-modal="false"
    aria-labelledby={`popover-${String(key)}-title`}
    onmouseenter={cancelClose}
    onmouseleave={() => {
        if (uiState?.hoverable) {
            if (popover && popover.contains(document.activeElement)) {
                return;
            }
            uiState.open = false;
        }
    }}
>
	{#if uiState?.open}
		<div
			{...rest}
			transition:flyAndScale={{ duration: 200 }}
			class={cn(classProp, `p-4 text-sm rounded-xl border border-input m-auto shadow-sm bg-popover`)}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
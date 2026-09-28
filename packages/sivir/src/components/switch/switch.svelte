<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import type { SwitchProps } from '.';
    import { SwitchSpring } from './switch-spring.svelte';

    let {
        switched = $bindable<boolean | undefined>(undefined),
        checked = $bindable<boolean | undefined>(undefined),
        label,
        description,
        disabled = false,
        class: className,
        element = $bindable<HTMLButtonElement>(),
        onclick: userOnclick,
        ...rest
    }: SwitchProps & { onclick?: (e: MouseEvent) => void } = $props();

    type DragSession = {
        id: number;
        startX: number;
        startPosition: number;
        moved: boolean;
    };

    const TRACK_WIDTH = 40;
    const INSET = 3;
    const THUMB = 18;
    const TRAVEL = TRACK_WIDTH - INSET * 2 - THUMB;
    const PRESS_STRETCH = 5;
    const DRAG_THRESHOLD = 3;
    const TAP_SLOP = 6;
    const MOTION_STRETCH = 0.45;
    const MOTION_STRETCH_LIMIT = 6;
    const RUBBER_BAND = 2;
    const TOGGLE = {
        stiffness: 560,
        damping: 28
    };
    const FOLLOW = {
        stiffness: 3000,
        damping: 110
    };
    const PRESS = {
        stiffness: 900,
        damping: 42
    };

    const isOn = $derived(checked ?? switched ?? false);

    const id = $props.id();
    const buttonId = $derived((rest as HTMLButtonAttributes).id ?? `${id}-switch`);
    const labelId = `${id}-label`;
    const descriptionId = `${id}-description`;

    const position = new SwitchSpring(untrack(() => (isOn ? 1 : 0)));
    const stretch = new SwitchSpring(0);

    let session: DragSession | null = null;
    let suppressClick = false;

    const motionStretch = $derived(
        Math.min(MOTION_STRETCH_LIMIT, Math.abs(position.velocity) * MOTION_STRETCH)
    );
    const thumbStretch = $derived(Math.min(TRAVEL, stretch.current + motionStretch));
    const thumbWidth = $derived(THUMB + thumbStretch);
    const thumbOffset = $derived(INSET + position.current * (TRAVEL - thumbStretch));
    const fill = $derived(Math.min(1, Math.max(0, position.current)));

    $effect(() => {
        const target = isOn ? 1 : 0;

        untrack(() => {
            if (!session) {
                position.set(target, TOGGLE);
            }
        });
    });

    $effect(() => {
        return () => {
            position.stop();
            stretch.stop();
        };
    });

    function setOn(next: boolean, event: Event) {
        if (next !== isOn) {
            if (checked !== undefined || switched === undefined) {
                checked = next;
            }
            if (switched !== undefined || checked === undefined) {
                switched = next;
            }
        }

        position.set(next ? 1 : 0, TOGGLE);
        userOnclick?.(event as MouseEvent);
    }

    function press() {
        stretch.set(PRESS_STRETCH, PRESS);
    }

    function release() {
        stretch.set(0, PRESS);
    }

    function rubberBand(raw: number) {
        if (raw >= 0 && raw <= 1) {
            return raw;
        }

        const over = raw < 0 ? raw : raw - 1;
        const eased = (RUBBER_BAND / TRAVEL) * (1 - Math.exp((-Math.abs(over) * TRAVEL) / 12));

        return raw < 0 ? -eased : 1 + eased;
    }

    function handlePointerDown(event: PointerEvent & { currentTarget: HTMLButtonElement }) {
        if (disabled || event.button !== 0) {
            return;
        }

        suppressClick = false;
        session = {
            id: event.pointerId,
            startX: event.clientX,
            startPosition: isOn ? 1 : 0,
            moved: false
        };
        event.currentTarget.setPointerCapture?.(event.pointerId);
        press();
    }

    function handlePointerMove(event: PointerEvent) {
        if (!session || event.pointerId !== session.id) {
            return;
        }

        const delta = event.clientX - session.startX;

        if (!session.moved && Math.abs(delta) < DRAG_THRESHOLD) {
            return;
        }

        session.moved = true;
        position.set(rubberBand(session.startPosition + delta / TRAVEL), FOLLOW);
    }

    function handlePointerUp(event: PointerEvent) {
        if (!session || event.pointerId !== session.id) {
            return;
        }

        const dragged = session.moved && Math.abs(event.clientX - session.startX) >= TAP_SLOP;

        session = null;
        release();

        if (dragged) {
            suppressClick = true;
            setOn(position.target > 0.5, event);
            setTimeout(() => {
                suppressClick = false;
            });
        }
    }

    function handlePointerCancel(event: PointerEvent) {
        if (!session || event.pointerId !== session.id) {
            return;
        }

        session = null;
        release();
        position.set(isOn ? 1 : 0, TOGGLE);
    }

    function handleClick(event: MouseEvent) {
        if (suppressClick) {
            suppressClick = false;
            event.preventDefault();
            return;
        }

        if (disabled) {
            return;
        }

        setOn(!isOn, event);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === ' ' && !event.repeat && !disabled) {
            press();
        }
    }

    function handleKeyUp(event: KeyboardEvent) {
        if (event.key === ' ') {
            release();
        }
    }
</script>

<div
    data-disabled={disabled ? '' : undefined}
    class="group/switch flex min-h-[var(--size-touch)] flex-row items-start gap-3 md:min-h-0"
>
    <button
        bind:this={element}
        {...rest as HTMLButtonAttributes}
        id={buttonId}
        type={(rest as HTMLButtonAttributes).type ?? 'button'}
        role="switch"
        aria-label={!label ? (rest as HTMLButtonAttributes)['aria-label'] : undefined}
        aria-checked={isOn}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        data-ui="switch"
        data-state={isOn ? 'checked' : 'unchecked'}
        {disabled}
        class={cn(
            className,
            'relative isolate inline-flex h-[24px] w-[40px] shrink-0 cursor-[var(--ui-cursor-interactive)] touch-pan-y select-none rounded-full bg-foreground/[0.12] transition-[background-color,box-shadow] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] group-hover/switch:bg-foreground/[0.16] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] group-hover/switch:disabled:bg-foreground/[0.12] motion-reduce:transition-none'
        )}
        onpointerdown={handlePointerDown}
        onpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointercancel={handlePointerCancel}
        onlostpointercapture={handlePointerCancel}
        onclick={handleClick}
        onkeydown={handleKeyDown}
        onkeyup={handleKeyUp}
        onblur={release}
    >
        <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 rounded-[inherit] bg-primary transition-[background-color] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] group-hover/switch:bg-[var(--color-primary-hover)] group-hover/switch:group-data-disabled/switch:bg-primary motion-reduce:transition-none"
            style:opacity={fill}
        ></span>
        <span
            aria-hidden="true"
            data-state={isOn ? 'checked' : 'unchecked'}
            class="pointer-events-none absolute top-[3px] left-0 h-[18px] rounded-full bg-[var(--color-on-primary)] shadow-[0_1px_2px_rgb(0_0_0/0.18),0_2px_6px_rgb(0_0_0/0.08),0_0_0_0.5px_rgb(0_0_0/0.06)]"
            style:width={`${thumbWidth}px`}
            style:transform={`translateX(${thumbOffset}px)`}
        ></span>
    </button>

    {#if label || description}
        <label
            for={buttonId}
            onpointerdown={(event) => {
                if (!disabled && event.button === 0) {
                    press();
                }
            }}
            onpointerup={release}
            onpointerleave={release}
            onpointercancel={release}
            class={cn(
                'flex min-w-0 flex-col gap-0.5 select-none',
                disabled
                    ? 'cursor-not-allowed opacity-[var(--opacity-disabled)]'
                    : 'cursor-[var(--ui-cursor-interactive)]'
            )}
        >
            {#if label}
                <span
                    id={labelId}
                    class="leading-[24px] [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] text-foreground"
                >
                    {label}
                </span>
            {/if}
            {#if description}
                <span
                    id={descriptionId}
                    class="leading-body [font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] text-foreground-muted"
                >
                    {description}
                </span>
            {/if}
        </label>
    {/if}
</div>

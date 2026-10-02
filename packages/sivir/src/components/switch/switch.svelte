<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import type { SwitchProps } from '.';
    import { SwitchSpring, type SwitchSpringConfig } from './switch-spring.svelte';

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

    const TRACK_WIDTH = 32;
    const INSET = 3;
    const THUMB = 14;
    const TRAVEL = TRACK_WIDTH - INSET * 2 - THUMB;
    const PRESS_STRETCH = 4;
    const DRAG_THRESHOLD = 3;
    const TAP_SLOP = 6;
    const MOTION_STRETCH = 0.45;
    const MOTION_STRETCH_LIMIT = 5;
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
    const BASE_DURATION = 280;

    type SwitchMotion = {
        speed: number;
        stretch: number;
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
    let stretchScale = $state(1);

    const motionStretch = $derived(
        Math.min(
            MOTION_STRETCH_LIMIT * stretchScale,
            Math.abs(position.velocity) * MOTION_STRETCH * stretchScale
        )
    );
    const thumbStretch = $derived(Math.min(TRAVEL, stretch.current + motionStretch));
    const thumbWidth = $derived(THUMB + thumbStretch);
    const thumbOffset = $derived(INSET + position.current * (TRAVEL - thumbStretch));
    const fill = $derived(Math.min(1, Math.max(0, position.current)));

    $effect(() => {
        const target = isOn ? 1 : 0;

        untrack(() => {
            if (!session) {
                animate(position, target, TOGGLE);
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

        animate(position, next ? 1 : 0, TOGGLE);
        userOnclick?.(event as MouseEvent);
    }

    function parseDuration(value: string) {
        const amount = Number.parseFloat(value);

        if (!Number.isFinite(amount)) {
            return BASE_DURATION;
        }

        return value.trim().endsWith('ms') ? amount : amount * 1000;
    }

    function readMotion(): SwitchMotion {
        if (!element || typeof getComputedStyle !== 'function') {
            return {
                speed: 1,
                stretch: 1
            };
        }

        const style = getComputedStyle(element);
        const duration = parseDuration(style.getPropertyValue('--motion-duration-switch'));
        const stretchValue = Number.parseFloat(style.getPropertyValue('--motion-switch-stretch'));

        return {
            speed: duration > 0 ? BASE_DURATION / duration : 0,
            stretch: Number.isFinite(stretchValue) ? Math.max(0, stretchValue) : 1
        };
    }

    function animate(spring: SwitchSpring, target: number, config: SwitchSpringConfig) {
        const motion = readMotion();

        stretchScale = motion.stretch;

        if (motion.speed === 0) {
            spring.jump(target);
            return;
        }

        spring.set(target, {
            stiffness: config.stiffness * motion.speed * motion.speed,
            damping: config.damping * motion.speed
        });
    }

    function press() {
        animate(stretch, PRESS_STRETCH * readMotion().stretch, PRESS);
    }

    function release() {
        animate(stretch, 0, PRESS);
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
        animate(position, isOn ? 1 : 0, TOGGLE);
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
    const thumbClass =
        // token-lint-disable-next-line no-literal-length: switch track and thumb geometry
        'pointer-events-none absolute top-[3px] left-0 h-[14px] rounded-full bg-[var(--color-on-primary)] transition-[background-color] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] data-[state=unchecked]:bg-card dark:data-[state=unchecked]:bg-foreground motion-reduce:transition-none shadow-[0_1px_2px_rgb(0_0_0/0.18),0_2px_6px_rgb(0_0_0/0.08),0_0_0_0.5px_rgb(0_0_0/0.06)]';
    const labelClass =
        // token-lint-disable-next-line no-literal-length: label line height matches the track
        'leading-[20px] [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] text-foreground';
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
            // token-lint-disable-next-line no-literal-length: switch track and thumb geometry
            'relative isolate inline-flex h-[20px] w-[32px] shrink-0 cursor-[var(--ui-cursor-interactive)] touch-pan-y select-none rounded-full bg-foreground/[0.12] transition-[background-color,box-shadow] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] group-hover/switch:bg-foreground/[0.16] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] group-hover/switch:disabled:bg-foreground/[0.12] motion-reduce:transition-none'
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
            class={thumbClass}
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
                <span id={labelId} class={labelClass}>
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

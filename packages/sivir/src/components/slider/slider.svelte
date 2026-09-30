<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { SliderProps } from '.';
    import { setSliderContext } from './context.svelte';
    import Label from './slider-label.svelte';
    import Range from './slider-range.svelte';
    import { SliderSpring } from './slider-spring.svelte';
    import Thumb from './slider-thumb.svelte';
    import Value from './slider-value.svelte';

    let {
        children,
        class: className,
        value = $bindable(0),
        min = 0,
        max = 100,
        step = 1,
        disabled = false,
        label,
        name,
        format,
        onValueChange,
        onValueCommit,
        ...rest
    }: SliderProps = $props();

    type PointerSession = {
        id: number;
        startX: number;
        startValue: number;
        rect: DOMRect;
        moved: boolean;
    };

    const SETTLE = {
        stiffness: 520,
        damping: 46
    };
    const TRACK = {
        stiffness: 3000,
        damping: 110
    };
    const RELEASE = {
        stiffness: 380,
        damping: 28
    };
    const STRETCH_LIMIT = 8;
    const STRETCH_FALLOFF = 64;
    const STRETCH_SQUASH = 0.25;
    const EDGE_KICK = 150;
    const DRAG_THRESHOLD = 4;
    const SHIFT_MULTIPLIER = 10;

    let root = $state<HTMLLabelElement>();
    let input = $state<HTMLInputElement>();
    let dragging = $state(false);
    let tracking = $state(false);
    let focusVisible = $state(false);
    let session: PointerSession | null = null;

    const percent = $derived(toPercent(value));
    const formatted = $derived(format ? format(value) : String(value));
    const fill = new SliderSpring(untrack(() => percent));
    const stretch = new SliderSpring(0);
    const stretchScale = $derived.by(() => {
        const amount = Math.abs(stretch.current);

        if (amount === 0 || !root) {
            return undefined;
        }

        const scaleX = 1 + amount / root.offsetWidth;
        const scaleY = 1 - (amount / root.offsetHeight) * STRETCH_SQUASH;

        return `${scaleX} ${scaleY}`;
    });

    setSliderContext({
        get fill() {
            return fill.current;
        },
        get formatted() {
            return formatted;
        },
        get dragging() {
            return dragging;
        },
        get focusVisible() {
            return focusVisible;
        },
        get disabled() {
            return disabled;
        }
    });

    $effect(() => {
        const next = percent;

        untrack(() => {
            fill.set(next, tracking ? TRACK : SETTLE);
        });
    });

    $effect(() => {
        return () => {
            fill.stop();
            stretch.stop();
        };
    });

    function clamp(next: number, lower: number, upper: number) {
        return Math.min(Math.max(next, lower), upper);
    }

    function decimals(next: number) {
        const text = String(next);
        const point = text.indexOf('.');

        if (point === -1) {
            return 0;
        }

        return text.length - point - 1;
    }

    function toPercent(next: number) {
        if (max <= min) {
            return 0;
        }

        return clamp(((next - min) / (max - min)) * 100, 0, 100);
    }

    function snap(raw: number) {
        if (max <= min) {
            return min;
        }

        if (!(step > 0) || !Number.isFinite(step)) {
            return clamp(raw, min, max);
        }

        const precision = Math.max(decimals(step), decimals(min));
        const snapped = min + Math.round((raw - min) / step) * step;

        return clamp(Number(snapped.toFixed(precision)), min, max);
    }

    function valueAt(clientX: number, rect: DOMRect) {
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);

        return snap(min + ratio * (max - min));
    }

    function overshoot(clientX: number, rect: DOMRect) {
        const distance =
            clientX < rect.left ? clientX - rect.left : Math.max(clientX - rect.right, 0);
        const eased = STRETCH_LIMIT * (1 - Math.exp(-Math.abs(distance) / STRETCH_FALLOFF));

        return Math.sign(distance) * eased;
    }

    function setValue(next: number) {
        if (next === value) {
            return;
        }

        value = next;
        onValueChange?.(next);
    }

    function focusInput() {
        focusVisible = false;
        input?.focus({
            preventScroll: true
        });
    }

    function startTracking() {
        if (!session) {
            return;
        }

        session.moved = true;
        tracking = true;
        dragging = true;
        focusInput();
    }

    function finish(event: PointerEvent) {
        if (!session || event.pointerId !== session.id) {
            return;
        }

        const { startValue } = session;

        session = null;
        tracking = false;
        dragging = false;
        stretch.set(0, RELEASE);

        if (value !== startValue) {
            onValueCommit?.(value);
        }
    }

    function handlePointerDown(event: PointerEvent) {
        if (disabled || event.button !== 0 || !root) {
            return;
        }

        const rect = root.getBoundingClientRect();

        session = {
            id: event.pointerId,
            startX: event.clientX,
            startValue: value,
            rect,
            moved: false
        };
        root.setPointerCapture(event.pointerId);

        if (event.pointerType === 'mouse') {
            event.preventDefault();
            dragging = true;
            focusInput();
            setValue(valueAt(event.clientX, rect));
        }
    }

    function handlePointerMove(event: PointerEvent) {
        if (!session || event.pointerId !== session.id) {
            return;
        }

        if (!session.moved) {
            if (Math.abs(event.clientX - session.startX) < DRAG_THRESHOLD) {
                return;
            }

            startTracking();
        }

        setValue(valueAt(event.clientX, session.rect));
        stretch.set(overshoot(event.clientX, session.rect), TRACK);
    }

    function handlePointerUp(event: PointerEvent) {
        if (session && !session.moved && event.pointerType !== 'mouse') {
            focusInput();
            setValue(valueAt(event.clientX, session.rect));
        }

        finish(event);
    }

    function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
        setValue(Number(event.currentTarget.value));
    }

    function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        focusVisible = !session && event.currentTarget.matches(':focus-visible');
    }

    function handleBlur() {
        focusVisible = false;
    }

    function handleChange() {
        onValueCommit?.(value);
    }

    function keyDirection(key: string) {
        if (key === 'ArrowRight' || key === 'ArrowUp' || key === 'PageUp' || key === 'End') {
            return 1;
        }

        if (key === 'ArrowLeft' || key === 'ArrowDown' || key === 'PageDown' || key === 'Home') {
            return -1;
        }

        return 0;
    }

    function handleKeyDown(event: KeyboardEvent) {
        const direction = keyDirection(event.key);

        focusVisible = true;

        if (direction === 0) {
            return;
        }

        const atEdge = direction < 0 ? value <= min : value >= max;

        if (atEdge) {
            stretch.kick(direction * EDGE_KICK, RELEASE);
            return;
        }

        if (event.shiftKey && event.key.startsWith('Arrow')) {
            event.preventDefault();
            setValue(snap(value + direction * step * SHIFT_MULTIPLIER));
            onValueCommit?.(value);
        }
    }
</script>

<label
    bind:this={root}
    data-ui="slider"
    data-dragging={dragging ? '' : undefined}
    data-disabled={disabled ? '' : undefined}
    class={cn(
        className,
        'group/slider relative isolate flex min-h-[var(--size-control-lg)] w-full cursor-ew-resize touch-pan-y select-none items-center justify-between gap-3 overflow-hidden rounded-[var(--radius-lg)] border-[length:var(--border-size)] bg-[var(--color-field)] px-3 text-sm text-[var(--color-field-foreground)] transition-[border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none',
        focusVisible ? 'border-primary shadow-[var(--focus-ring)]' : 'border-input',
        disabled && 'cursor-not-allowed opacity-[var(--opacity-disabled)]'
    )}
    style:scale={stretchScale}
    style:transform-origin={stretch.current < 0 ? 'right center' : 'left center'}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={finish}
    {...rest}
>
    <input
        bind:this={input}
        type="range"
        {name}
        {min}
        {max}
        {step}
        {disabled}
        {value}
        aria-label={label}
        aria-valuetext={format ? formatted : undefined}
        oninput={handleInput}
        onchange={handleChange}
        onfocus={handleFocus}
        onblur={handleBlur}
        onkeydown={handleKeyDown}
        class="pointer-events-none absolute inset-0 m-0 size-full appearance-none opacity-0"
    />
    {#if children}
        {@render children()}
    {:else}
        <Range />
        <Thumb />
        {#if label}
            <Label>{label}</Label>
        {/if}
        <Value />
    {/if}
</label>

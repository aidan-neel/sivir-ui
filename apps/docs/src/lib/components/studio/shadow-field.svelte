<script lang="ts">
    import Plus from '@lucide/svelte/icons/plus';
    import X from '@lucide/svelte/icons/x';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Slider from '@sivir-ui/svelte/components/slider';
    import { Toggle } from '@sivir-ui/svelte/components/toggle';
    import { cn } from '@sivir-ui/svelte/utils';
    import { formatCssColor, parseCssColor } from '$lib/studio-advanced-tokens';
    import ColorAlphaField from './color-alpha-field.svelte';
    import { defaultShadowLayer, parseShadow, type ShadowLayer, serializeShadow } from './shadow';

    type ShadowFieldProps = {
        label: string;
        value: string;
        resolveVar: (name: string) => string;
        onChange: (value: string) => void;
        class?: string;
    };

    type LengthKey = 'x' | 'y' | 'blur' | 'spread';

    type LengthControl = {
        key: LengthKey;
        label: string;
        min: number;
        max: number;
    };

    let { label, value, resolveVar, onChange, class: className }: ShadowFieldProps = $props();

    const lengthControls: LengthControl[] = [
        {
            key: 'x',
            label: 'X',
            min: -32,
            max: 32
        },
        {
            key: 'y',
            label: 'Y',
            min: -32,
            max: 48
        },
        {
            key: 'blur',
            label: 'Blur',
            min: 0,
            max: 80
        },
        {
            key: 'spread',
            label: 'Spread',
            min: -32,
            max: 32
        }
    ];

    let editingCss = $state(false);

    const layers = $derived(parseShadow(value));
    const showCss = $derived(editingCss || layers === null);

    function formatPx(next: number) {
        return `${next}px`;
    }

    function commit(next: ShadowLayer[]) {
        onChange(serializeShadow(next));
    }

    function updateLayer(index: number, patch: Partial<ShadowLayer>) {
        if (!layers) {
            return;
        }

        const next = layers.map((layer, layerIndex) => {
            if (layerIndex !== index) {
                return layer;
            }

            return {
                ...layer,
                ...patch
            };
        });

        commit(next);
    }

    function updateLength(index: number, key: LengthKey, next: number) {
        const patch: Partial<ShadowLayer> = {};

        patch[key] = next;
        updateLayer(index, patch);
    }

    function removeLayer(index: number) {
        if (!layers) {
            return;
        }

        commit(layers.filter((_, layerIndex) => layerIndex !== index));
    }

    function addLayer() {
        if (!layers) {
            return;
        }

        commit([...layers, defaultShadowLayer]);
    }

    function layerColor(layer: ShadowLayer) {
        const parsed = parseCssColor(layer.color, resolveVar);

        if (parsed) {
            return parsed;
        }

        return {
            hex: '#000000',
            alpha: 1
        };
    }

    function commitCss(event: Event & { currentTarget: HTMLInputElement }) {
        const next = event.currentTarget.value.replace(/\s+/g, ' ').trim();

        onChange(next || 'none');
    }
</script>

<div class={cn('flex min-w-0 flex-col gap-4', className)} role="group" aria-label={label}>
    {#if layers && !editingCss}
        {#each layers as layer, index (index)}
            {@const color = layerColor(layer)}
            {@const layerName = `Layer ${index + 1}`}
            <div
                class="flex min-w-0 flex-col gap-1.5"
                role="group"
                aria-label={`${label} ${layerName}`}
            >
                <div class="flex min-h-7 items-center justify-between gap-2">
                    <span class="text-xs text-foreground-muted">{layerName}</span>
                    <div class="flex items-center gap-1">
                        <Toggle
                            size="sm"
                            pressed={layer.inset}
                            onPressedChange={(inset) => {
                                updateLayer(index, {
                                    inset,
                                });
                            }}
                            class="h-7 px-2 text-xs"
                        >
                            Inset
                        </Toggle>
                        <Button
                            variant="ghost"
                            size="icon"
                            class="size-7 text-foreground-muted"
                            aria-label={`Remove ${layerName.toLowerCase()}`}
                            onclick={() => {
                                removeLayer(index);
                            }}
                        >
                            <X size={13} />
                        </Button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-1.5">
                    {#each lengthControls as control (control.key)}
                        {@const current = layer[control.key]}
                        <Slider.Root
                            value={current}
                            min={Math.min(control.min, Math.floor(current))}
                            max={Math.max(control.max, Math.ceil(current))}
                            step={1}
                            label={`${layerName} ${control.label}`}
                            format={formatPx}
                            onValueChange={(next) => {
                                updateLength(index, control.key, next);
                            }}
                            class="min-h-[34px] gap-2 px-2.5 text-[13px]"
                        >
                            <Slider.Range />
                            <Slider.Thumb />
                            <Slider.Label>{control.label}</Slider.Label>
                            <Slider.Value />
                        </Slider.Root>
                    {/each}
                </div>
                <ColorAlphaField
                    label="Color"
                    hex={color.hex}
                    alpha={color.alpha}
                    onChange={(hex, alpha) => {
                        updateLayer(index, {
                            color: formatCssColor(hex, alpha),
                        });
                    }}
                />
            </div>
        {/each}
    {/if}

    {#if showCss}
        <Input
            {value}
            class="font-mono"
            aria-label={`${label} CSS`}
            spellcheck={false}
            onchange={commitCss}
        />
        {#if layers === null}
            <p class="m-0 text-xs text-foreground-muted">
                Uses variables for its size, so edit it as CSS.
            </p>
        {/if}
    {/if}

    <div class="flex items-center justify-between gap-2">
        {#if layers && !editingCss}
            <Button variant="ghost" size="sm" class="h-7 gap-1.5 px-2 text-xs" onclick={addLayer}>
                <Plus size={13} />
                Add layer
            </Button>
        {:else}
            <span></span>
        {/if}
        {#if layers}
            <Button
                variant="ghost"
                size="sm"
                class="h-7 px-2 text-xs text-foreground-muted"
                aria-pressed={editingCss}
                onclick={() => {
                    editingCss = !editingCss;
                }}
            >
                {editingCss ? 'Edit layers' : 'Edit CSS'}
            </Button>
        {/if}
    </div>
</div>

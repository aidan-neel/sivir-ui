<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

    type LineItem = {
        name: string;
        detail: string;
        price: number;
    };

    const items: LineItem[] = [
        {
            name: 'Linen overshirt',
            detail: 'Sand, size M',
            price: 88
        },
        {
            name: 'Merino crew socks',
            detail: 'Charcoal, 2 pack',
            price: 24
        },
        {
            name: 'Canvas tote',
            detail: 'Natural',
            price: 32
        }
    ];

    const currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const total = items.reduce((sum, item) => {
        return sum + item.price;
    }, 0);

    let open = $state(false);
</script>

<div class="w-full max-w-96">
    <Collapsible.Root bind:open>
        <Collapsible.Trigger
            class="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-[var(--radius-md)] px-2 py-2 text-left text-foreground transition-colors hover:bg-secondary"
        >
            <span class="flex min-w-0 flex-1 items-baseline gap-2">
                <span class="[font-weight:var(--font-weight-label,500)]">Order summary</span>
                <span class="text-sm text-foreground-muted">{items.length} items</span>
            </span>
            <span class="tabular-nums [font-weight:var(--font-weight-label,500)]">
                {currency.format(total)}
            </span>
            <ChevronDown
                size={16}
                aria-hidden="true"
                class="shrink-0 text-foreground-muted transition-transform duration-200 {open
                    ? 'rotate-180'
                    : ''}"
            />
        </Collapsible.Trigger>
        <Collapsible.Content class="mt-2 flex flex-col gap-3">
            <ul class="m-0 flex list-none flex-col gap-3 p-0">
                {#each items as item (item.name)}
                    <li class="flex items-baseline justify-between gap-4 text-sm">
                        <span class="flex min-w-0 flex-col">
                            <span class="text-foreground">{item.name}</span>
                            <span class="text-foreground-muted">{item.detail}</span>
                        </span>
                        <span class="tabular-nums text-foreground">
                            {currency.format(item.price)}
                        </span>
                    </li>
                {/each}
            </ul>
            <div
                class="flex justify-between border-t-[length:var(--border-size)] border-border pt-3 text-sm"
            >
                <span class="text-foreground-muted">Shipping</span>
                <span class="text-foreground">Free</span>
            </div>
        </Collapsible.Content>
    </Collapsible.Root>
</div>

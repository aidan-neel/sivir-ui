<script lang="ts">
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as HoverCard from '@sivir-ui/svelte/components/hover-card';
</script>

<div class="flex items-center justify-center">
    <div class="text-[0.92rem] text-foreground-muted">
        Reviewed by
        <HoverCard.Root>
            <HoverCard.Trigger href="https://github.com/aidan-neel">@aidan-neel</HoverCard.Trigger>
            <HoverCard.Content>
                <div class="flex flex-col gap-3">
                    <div class="flex items-start justify-between gap-3">
                        <Avatar.Root size="lg">
                            <Avatar.Fallback>AN</Avatar.Fallback>
                        </Avatar.Root>
                        <Button size="sm">Follow</Button>
                    </div>

                    <div class="flex flex-col gap-0.5">
                        <HoverCard.Title>Aidan Neel</HoverCard.Title>
                        <p class="text-sm text-foreground-muted">@aidan-neel · Seattle, WA</p>
                    </div>

                    <HoverCard.Description>
                        Building Sivir, a themeable Svelte component library.
                    </HoverCard.Description>

                    <p class="flex gap-4 text-sm text-foreground-muted">
                        <span>
                            <span class="font-medium tabular-nums text-foreground">1.2k</span>
                            followers
                        </span>
                        <span>
                            <span class="font-medium tabular-nums text-foreground">89</span>
                            following
                        </span>
                    </p>
                </div>
            </HoverCard.Content>
        </HoverCard.Root>
        3 days ago.
    </div>
</div>

<script lang="ts">
    import Tag from '@lucide/svelte/icons/tag';
    import { Badge, type BadgeVariant } from '@sivir-ui/svelte/components/badge';

    let {
        variant = 'secondary',
        label = 'Draft',
        dot = false,
        withIcon = false,
        asLink = false
    }: {
        variant?: BadgeVariant;
        label?: string;
        dot?: boolean;
        withIcon?: boolean;
        asLink?: boolean;
    } = $props();
</script>

<Badge {variant} {dot} icon={withIcon ? Tag : undefined} href={asLink ? '#' : undefined}>
    {label}
</Badge>

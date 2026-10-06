import type { BadgeVariant } from '@sivir-ui/svelte/components/badge';

export type BadgeSettings = {
    variant: BadgeVariant;
    dot: boolean;
    withIcon: boolean;
    asLink: boolean;
};

export const badgeDefaults: BadgeSettings = {
    variant: 'secondary',
    dot: false,
    withIcon: false,
    asLink: false
};

export const badgeVariants: {
    value: BadgeVariant;
    label: string;
    text: string;
}[] = [
    {
        value: 'primary',
        label: 'Primary',
        text: 'Featured'
    },
    {
        value: 'secondary',
        label: 'Secondary',
        text: 'Draft'
    },
    {
        value: 'ghost',
        label: 'Ghost',
        text: 'Archived'
    },
    {
        value: 'outline',
        label: 'Outline',
        text: 'Pending'
    },
    {
        value: 'destructive',
        label: 'Destructive',
        text: 'Blocked'
    },
    {
        value: 'info',
        label: 'Info',
        text: 'Updated'
    },
    {
        value: 'success',
        label: 'Success',
        text: 'Active'
    },
    {
        value: 'warning',
        label: 'Warning',
        text: 'Deprecated'
    },
    {
        value: 'error',
        label: 'Error',
        text: 'Failed'
    }
];

export function badgeText(variant: BadgeVariant) {
    const match = badgeVariants.find((option) => {
        return option.value === variant;
    });

    return match?.text ?? 'Draft';
}

function badgeProps(settings: BadgeSettings) {
    const props: string[] = [];

    if (settings.asLink) {
        props.push('href="#"');
    }
    if (settings.variant !== 'secondary') {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.withIcon) {
        props.push('icon={Tag}');
    }
    if (settings.dot) {
        props.push('dot');
    }
    if (props.length === 0) {
        return '';
    }
    return ` ${props.join(' ')}`;
}

export function badgeCode(settings: BadgeSettings) {
    const imports = ["    import { Badge } from '@sivir-ui/svelte/components/badge';"];

    if (settings.withIcon) {
        imports.unshift("    import Tag from '@lucide/svelte/icons/tag';");
    }

    return `<script lang="ts">
${imports.join('\n')}
</script>

<Badge${badgeProps(settings)}>${badgeText(settings.variant)}</Badge>
`;
}

export function changedBadgeProps(settings: BadgeSettings) {
    const changes = [settings.dot, settings.withIcon, settings.asLink];

    return changes.filter(Boolean).length;
}

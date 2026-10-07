export type NavigationMenuOpenDelay = '0' | '150' | '400';

export type NavigationMenuCloseDelay = '0' | '200' | '500';

export type NavigationMenuSettings = {
    openDelay: NavigationMenuOpenDelay;
    closeDelay: NavigationMenuCloseDelay;
    activePricing: boolean;
};

export type NavigationMenuEntry = {
    title: string;
    description: string;
    href: string;
};

export const navigationMenuDefaults: NavigationMenuSettings = {
    openDelay: '150',
    closeDelay: '200',
    activePricing: false
};

export const products: NavigationMenuEntry[] = [
    {
        title: 'Analytics',
        description: 'Dashboards and funnels for every release.',
        href: '#analytics'
    },
    {
        title: 'Feature flags',
        description: 'Ship behind a flag and roll out by segment.',
        href: '#flags'
    },
    {
        title: 'Session replay',
        description: 'Watch the sessions behind a bug report.',
        href: '#replay'
    },
    {
        title: 'Experiments',
        description: 'Test two versions and keep the winner.',
        href: '#experiments'
    }
];

export const resources: NavigationMenuEntry[] = [
    {
        title: 'Documentation',
        description: 'Guides and API reference.',
        href: '#docs'
    },
    {
        title: 'Changelog',
        description: 'What shipped this week.',
        href: '#changelog'
    },
    {
        title: 'Community',
        description: 'Questions and answers from other teams.',
        href: '#community'
    }
];

function entryLiteral(entry: NavigationMenuEntry) {
    return `        {
            title: '${entry.title}',
            description: '${entry.description}',
            href: '${entry.href}'
        }`;
}

function arrayLiteral(name: string, entries: NavigationMenuEntry[]) {
    const items = entries.map(entryLiteral).join(',\n');

    return `    const ${name} = [
${items}
    ];`;
}

function rootTag(settings: NavigationMenuSettings) {
    const props = ['aria-label="Main"'];

    if (settings.openDelay !== navigationMenuDefaults.openDelay) {
        props.push(`openDelay={${settings.openDelay}}`);
    }
    if (settings.closeDelay !== navigationMenuDefaults.closeDelay) {
        props.push(`closeDelay={${settings.closeDelay}}`);
    }
    return `<NavigationMenu.Root ${props.join(' ')}>`;
}

function pricingTag(settings: NavigationMenuSettings) {
    if (settings.activePricing) {
        return '<NavigationMenu.Link href="#pricing" active>Pricing</NavigationMenu.Link>';
    }
    return '<NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>';
}

export function navigationMenuCode(settings: NavigationMenuSettings) {
    return `<script lang="ts">
    import * as NavigationMenu from '@sivir-ui/svelte/components/navigation-menu';

${arrayLiteral('products', products)}

${arrayLiteral('resources', resources)}
</script>

<div class="flex w-full justify-center">
    ${rootTag(settings)}
        <NavigationMenu.List>
            <NavigationMenu.Item value="products">
                <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
                <NavigationMenu.Content class="grid w-120 gap-0.5 sm:grid-cols-2">
                    {#each products as product (product.href)}
                        <NavigationMenu.Link href={product.href}>
                            <NavigationMenu.LinkTitle>{product.title}</NavigationMenu.LinkTitle>
                            <NavigationMenu.LinkDescription>
                                {product.description}
                            </NavigationMenu.LinkDescription>
                        </NavigationMenu.Link>
                    {/each}
                </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="resources">
                <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                <NavigationMenu.Content class="w-72">
                    {#each resources as resource (resource.href)}
                        <NavigationMenu.Link href={resource.href}>
                            <NavigationMenu.LinkTitle>{resource.title}</NavigationMenu.LinkTitle>
                            <NavigationMenu.LinkDescription>
                                {resource.description}
                            </NavigationMenu.LinkDescription>
                        </NavigationMenu.Link>
                    {/each}
                </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
                ${pricingTag(settings)}
            </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
    </NavigationMenu.Root>
</div>
`;
}

export function changedNavigationMenuProps(settings: NavigationMenuSettings) {
    const keys = Object.keys(navigationMenuDefaults) as (keyof NavigationMenuSettings)[];

    return keys.filter((key) => {
        return settings[key] !== navigationMenuDefaults[key];
    }).length;
}

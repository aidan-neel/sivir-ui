<script lang="ts">
    import * as NavigationMenu from '@sivir-ui/svelte/components/navigation-menu';

    const products = [
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

    const resources = [
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
</script>

<div class="flex w-full justify-center">
    <NavigationMenu.Root aria-label="Main">
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
                <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
    </NavigationMenu.Root>
</div>

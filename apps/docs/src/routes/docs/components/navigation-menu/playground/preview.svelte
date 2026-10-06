<script lang="ts">
    import * as NavigationMenu from '@sivir-ui/svelte/components/navigation-menu';
    import { type NavigationMenuSettings, products, resources } from './playground';

    let {
        settings
    }: {
        settings: NavigationMenuSettings;
    } = $props();
</script>

<div class="flex w-full justify-center">
    <NavigationMenu.Root
        aria-label="Main"
        openDelay={Number(settings.openDelay)}
        closeDelay={Number(settings.closeDelay)}
    >
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
                <NavigationMenu.Link href="#pricing" active={settings.activePricing}>
                    Pricing
                </NavigationMenu.Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
    </NavigationMenu.Root>
</div>

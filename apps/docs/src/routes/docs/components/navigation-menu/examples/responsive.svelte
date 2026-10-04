<script lang="ts">
    import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';
    import * as NavigationMenu from '@sivir-ui/svelte/components/navigation-menu';
</script>

<div class="flex w-full flex-col">
    <header class="flex items-center justify-between gap-4 border-b border-border pb-3">
        <span class="[font-weight:var(--font-weight-header)]">Acme</span>
        <NavigationMenu.Root aria-label="Main" class="hidden md:block">
            <NavigationMenu.List>
                <NavigationMenu.Item value="product">
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content class="w-48">
                        <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                        <NavigationMenu.Link href="#security">Security</NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Viewport />
        </NavigationMenu.Root>
        <div class="md:hidden">
            <FullscreenNav.Root>
                <FullscreenNav.Trigger aria-label="Open navigation" />
                <FullscreenNav.Content label="Main">
                    <header class="flex items-center justify-between py-1">
                        <span class="[font-weight:var(--font-weight-header)]">Acme</span>
                        <FullscreenNav.Close />
                    </header>
                    <div class="mt-12 flex flex-col gap-10">
                        <FullscreenNav.Group heading="Product">
                            <FullscreenNav.Link href="#features">Features</FullscreenNav.Link>
                            <FullscreenNav.Link href="#security">Security</FullscreenNav.Link>
                        </FullscreenNav.Group>
                        <FullscreenNav.Link href="#pricing">Pricing</FullscreenNav.Link>
                    </div>
                </FullscreenNav.Content>
            </FullscreenNav.Root>
        </div>
    </header>
</div>

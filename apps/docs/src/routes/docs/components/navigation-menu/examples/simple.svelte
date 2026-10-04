<script lang="ts">
    import * as NavigationMenu from '@sivir-ui/svelte/components/navigation-menu';
</script>

<div class="flex w-full justify-center">
    <NavigationMenu.Root aria-label="Docs">
        <NavigationMenu.List>
            <NavigationMenu.Item value="guides">
                <NavigationMenu.Trigger>Guides</NavigationMenu.Trigger>
                <NavigationMenu.Content class="w-48">
                    <NavigationMenu.Link href="#install">Installation</NavigationMenu.Link>
                    <NavigationMenu.Link href="#theming">Theming</NavigationMenu.Link>
                    <NavigationMenu.Link href="#forms">Forms</NavigationMenu.Link>
                </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="reference">
                <NavigationMenu.Trigger>Reference</NavigationMenu.Trigger>
                <NavigationMenu.Content class="w-56">
                    <NavigationMenu.Link href="#components">Components</NavigationMenu.Link>
                    <NavigationMenu.Link href="#tokens">Design tokens</NavigationMenu.Link>
                    <NavigationMenu.Link href="#cli">Command line</NavigationMenu.Link>
                    <NavigationMenu.Link href="#utilities">Utilities</NavigationMenu.Link>
                </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
                <NavigationMenu.Link href="#blog">Blog</NavigationMenu.Link>
            </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
    </NavigationMenu.Root>
</div>

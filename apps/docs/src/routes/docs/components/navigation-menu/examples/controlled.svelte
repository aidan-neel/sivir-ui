<script lang="ts">
    import * as NavigationMenu from '@sivir-ui/svelte/components/navigation-menu';
    import * as Typography from '@sivir-ui/svelte/components/typography';

    let value = $state('');
</script>

<div class="flex w-full flex-col items-center gap-3">
    <Typography.Metadata class="tabular-nums">
        Open item: {value === '' ? 'none' : value}
    </Typography.Metadata>
    <NavigationMenu.Root bind:value aria-label="Company">
        <NavigationMenu.List>
            <NavigationMenu.Item value="company">
                <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
                <NavigationMenu.Content class="w-48">
                    <NavigationMenu.Link href="#about">About</NavigationMenu.Link>
                    <NavigationMenu.Link href="#careers">Careers</NavigationMenu.Link>
                    <NavigationMenu.Link href="#press">Press</NavigationMenu.Link>
                </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="legal">
                <NavigationMenu.Trigger>Legal</NavigationMenu.Trigger>
                <NavigationMenu.Content class="w-48">
                    <NavigationMenu.Link href="#terms">Terms</NavigationMenu.Link>
                    <NavigationMenu.Link href="#privacy">Privacy</NavigationMenu.Link>
                </NavigationMenu.Content>
            </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
    </NavigationMenu.Root>
</div>

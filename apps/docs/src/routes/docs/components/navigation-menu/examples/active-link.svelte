<script lang="ts">
    import * as NavigationMenu from '@sivir-ui/svelte/components/navigation-menu';

    const pages = ['Overview', 'Integrations', 'Pricing'];
    let current = $state('Overview');
</script>

<div class="flex w-full justify-center">
    <NavigationMenu.Root aria-label="Product">
        <NavigationMenu.List>
            {#each pages as page (page)}
                <NavigationMenu.Item>
                    <NavigationMenu.Link
                        href="#{page.toLowerCase()}"
                        active={current === page}
                        onclick={(event) => {
                            event.preventDefault();
                            current = page;
                        }}
                    >
                        {page}
                    </NavigationMenu.Link>
                </NavigationMenu.Item>
            {/each}
        </NavigationMenu.List>
    </NavigationMenu.Root>
</div>

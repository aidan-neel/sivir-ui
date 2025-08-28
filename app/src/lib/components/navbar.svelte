<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/ui/components/button';
	import { Input } from '$lib/ui/components/input';
	import Shortcut from '$lib/ui/components/shortcut';
	import Logo from './logo.svelte';
	import Navbutton from './navbutton.svelte';
    import Moon from '@lucide/svelte/icons/moon'
    import Sun from '@lucide/svelte/icons/sun'
	import { toggleMode, mode } from "mode-watcher";
    import * as Command from "$lib/ui/components/command";
    import Calendar from "@lucide/svelte/icons/calendar";
    import Rocket from "@lucide/svelte/icons/rocket";
    import Mail from "@lucide/svelte/icons/mail";
    import User from "@lucide/svelte/icons/user";
    import GitHub from "@lucide/svelte/icons/github";
    import Settings from "@lucide/svelte/icons/settings";
</script>

<nav
	class="w-full z-20 top-0 rounded-none px-6 flex-shrink-0 fixed {$page.url.pathname === '/'
		? ' border-transpar bg-transparent'
		: ''} bg-background h-14 flex items-center justify-between"
>
	<div class="flex w-96 flex-row gap-2 items-center">
		<a href="/" class="font-bold text-lg mr-2 p-2 rounded-lg hover:bg-secondary duration-150 flex flex-row items-center gap-2"><Logo /></a>
        <Navbutton href="/">Home</Navbutton>
        <Navbutton href="/docs/introduction">Docs</Navbutton>
        <Navbutton href="/docs/components">Components</Navbutton>
        <Navbutton href="/themes">Themes</Navbutton>
	</div>

	<div class="flex flex-row gap-2 items-center">
        <Command.Root>
            <Command.Trigger class="w-80 text-foreground-muted justify-between px-3" variant="outlined">
                Search docs...
                <Shortcut shortcut="/">
                    /
                </Shortcut>
            </Command.Trigger>
            <Command.Content>
                <Command.Search />
                <Command.Results>
                    <Command.Group heading="Suggestions">
                        <Command.Item name="calendar">
                            <Calendar class="text-foreground-muted" />
                            Calendar
                        </Command.Item>
                        <Command.Item name="launch">
                            <Rocket class="text-foreground-muted" />
                            Launch
                        </Command.Item>
                        <Command.Item name="mail">
                            <Mail class="text-foreground-muted" />
                            Mail
                        </Command.Item>
                    </Command.Group>
                    <Command.Separator />
                    <Command.Group heading="Settings">
                        <Command.Item name="settings">
                            <User class="text-foreground-muted" />
                            Profile
                        </Command.Item>
                        <Command.Item name="github">
                            <GitHub class="text-foreground-muted" />
                            GitHub
                        </Command.Item>
                        <Command.Item name="settings">
                            <Settings class="text-foreground-muted" />
                            Settings
                        </Command.Item>
                    </Command.Group>
                </Command.Results>
            </Command.Content>
        </Command.Root>
        <Button class="size-9" onclick={() => {
            toggleMode();
        }} size="icon" variant="ghost">
            {#if mode.current === "dark"}
                <Moon size="16" />
            {:else}
                <Sun size="16" />
            {/if}
        </Button>
	</div>
</nav>

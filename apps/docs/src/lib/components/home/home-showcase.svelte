<script lang="ts">
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
    import {
        applyLiveThemeCss,
        clearLiveThemeCss,
        getStoredLiveThemeCss
    } from '@sivir-ui/svelte/themes/live';
    import { themeToCss } from '@sivir-ui/svelte/themes/theme';
    import { onMount } from 'svelte';
    import { resolve } from '$app/paths';
    import { DEFAULT_FONT, fonts, selectedFont } from '$lib/fonts.svelte';
    import HomeChatDemo from './home-chat-demo.svelte';
    import HomeCommandDemo from './home-command-demo.svelte';
    import HomeDemo from './home-demo.svelte';
    import HomeFrame from './home-frame.svelte';
    import HomeIssueDemo from './home-issue-demo.svelte';

    const DEFAULT_PRESET = 'default';

    let selection = $state<string | undefined>(DEFAULT_PRESET);
    let appliedSelection: string | undefined = DEFAULT_PRESET;

    onMount(() => {
        const storedCss = getStoredLiveThemeCss();

        if (storedCss) {
            const storedPreset = builtInThemePresets.find((preset) => {
                return themeToCss(preset) === storedCss;
            });

            selection = storedPreset?.slug;
            appliedSelection = selection;
        }

        return () => {
            if (!getStoredLiveThemeCss()) {
                restorePageFont();
            }
        };
    });

    function selectTheme(value: string | string[] | undefined) {
        if (typeof value !== 'string' || value === '') {
            selection = appliedSelection;
            return;
        }

        appliedSelection = value;

        const preset = builtInThemePresets.find((option) => {
            return option.slug === value;
        });

        if (!preset || preset.slug === DEFAULT_PRESET) {
            clearLiveThemeCss();
            restorePageFont();
            return;
        }

        document.documentElement.style.removeProperty('--font-sans');
        applyLiveThemeCss(themeToCss(preset));
    }

    function restorePageFont() {
        const font =
            fonts.find((entry) => {
                return entry.name === selectedFont.current;
            }) ??
            fonts.find((entry) => {
                return entry.name === DEFAULT_FONT;
            });

        if (font) {
            document.documentElement.style.setProperty('--font-sans', font.family);
        }
    }
</script>

<section aria-label="Live examples" class="flex flex-col gap-8">
    <div
        role="group"
        aria-label="Theme"
        class="-mx-4 flex min-w-0 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-10 sm:px-10"
    >
        <ToggleGroup.Root
            type="single"
            bind:value={selection}
            onValueChange={selectTheme}
            class="mx-auto w-max"
        >
            {#each builtInThemePresets as preset (preset.slug)}
                <ToggleGroup.Item value={preset.slug}>{preset.name}</ToggleGroup.Item>
            {/each}
        </ToggleGroup.Root>
    </div>

    <div class="grid grid-cols-1 gap-x-4 gap-y-10 lg:grid-cols-12">
        <HomeFrame
            title="Coding agent"
            description="Threads, diffs, checks, and a composer"
            href={resolve('/docs/components/conversation')}
            class="lg:col-span-12"
            stageClass="items-stretch p-2 sm:p-4"
        >
            <div class="w-full min-w-0">
                <HomeDemo themePicker={false} />
            </div>
        </HomeFrame>

        <HomeFrame
            title="Chat"
            description="Reasoning and a streamed reply"
            href={resolve('/docs/components/response-stream')}
            class="lg:col-span-7 lg:row-span-2"
            stageClass="items-stretch p-2 sm:p-4"
        >
            <HomeChatDemo />
        </HomeFrame>

        <HomeFrame
            title="Issue"
            description="Select, combobox, tags, and a switch"
            href={resolve('/docs/components/select')}
            class="lg:col-span-5"
        >
            <HomeIssueDemo />
        </HomeFrame>

        <HomeFrame
            title="Command palette"
            description="Groups, shortcuts, and a footer"
            href={resolve('/docs/components/command')}
            class="lg:col-span-5"
            stageClass="min-h-56"
        >
            <HomeCommandDemo />
        </HomeFrame>
    </div>
</section>

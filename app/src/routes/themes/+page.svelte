<script lang="ts">
	import { Button } from '$lib/ui/components/button';
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import * as Card from '$lib/ui/components/card';
	import { Input } from '$lib/ui/components/input';
	import * as Alert from '$lib/ui/components/alert';
	import * as AlertDialog from '$lib/ui/components/alert-dialog';
	import { Checkbox } from '$lib/ui/components/checkbox';
	import { mode } from "mode-watcher";
	import ThemeCard from '$lib/components/theme-card.svelte';

    import CalTheme from '$lib/ui/themes/cal.css?raw'
    import DefaultTheme from '$lib/ui/themes/default.css?raw'
    import SlateTheme from '$lib/ui/themes/slate.css?raw'
    import SupabaseTheme from '$lib/ui/themes/supabase.css?raw'

	let ready = $state(false);
    let styleTag: HTMLStyleElement | undefined = $state<HTMLStyleElement | undefined>();
	$effect(() => { 
		ready = true;
	});

    type Theme = {
        css: string;
        name: string;
    }

    let selectedTheme: Theme = $state<Theme>({
        css: DefaultTheme,
        name: 'default'
    })
    let themes: Theme[] = $state<Theme[]>([]);

    function load_themes() {
        themes.push({ css: DefaultTheme, name: "Default" })
        themes.push({ css: CalTheme, name: "Cal" })
        themes.push({ css: SlateTheme, name: "Slate" })
        themes.push({ css: SupabaseTheme, name: "Supabase" })

    }

    $effect(() => {
        if (!styleTag) {
            styleTag = document.createElement('style');
		    document.head.appendChild(styleTag);
        }

        if (themes.length === 0) {
            load_themes();
        }
    })
</script>

{#if ready}
	<div
		class="z-10 pb-40 absolute w-full flex items-center text-center flex-col pt-40 gap-4 justify-start"
	>
		<p
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			class="text-[72px] font-display font-bold leading-20"
		>
			Unique customization
		</p>
		<p
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			class="text-[18px] text-foreground-muted"
		>
			Customize your own custom theme and publish it for others to use
		</p>
        <div in:fly={{ duration: 800, y: 20, easing: cubicOut }} class="w-[47%] grid gap-4 grid-cols-4 mt-4">
            {#each themes as theme}
                <ThemeCard clicked={() => {
                    selectedTheme = theme;
                    if (styleTag) {
                        styleTag.textContent = theme.css.replace("@theme", ":root");
                    }
                }} css={theme.css} name={theme.name} />
            {/each}
        </div>
    </div>
{/if}

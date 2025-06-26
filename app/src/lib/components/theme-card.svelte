<script lang="ts">
	import Button from "$lib/ui/components/button";
    import Copy from '@lucide/svelte/icons/copy'
    import { mode } from "mode-watcher";

	const { name, css, clicked }: { name: string; css: string, clicked: () => any } = $props();

	let background = $state('');
	let primary = $state('');
	let foreground = $state('');
    let border = $state('');

    $effect(() => {
        if (!css) return;

        const { background: bg, primary: pr, foreground: fg, border: bordr } = extractThemeVars(css);
        background = bg;
        primary = pr;
        foreground = fg;
        border = bordr;
    });

    function extractThemeVars(css: string) {
        const result = {
            background: '',
            primary: '',
            foreground: '',
            border: '',
        };

        const isDark = mode.current === 'dark';
        const themeRegex = isDark
            ? /\.dark\s*\{([^}]*)\}/s // <-- no @theme inside dark
            : /@theme\s*{([^}]*)}/s;

        const match = css.match(themeRegex);
        if (!match) return result;

        const body = match[1];

        const get = (varName: string) => {
            const varRegex = new RegExp(`--${varName}\\s*:\\s*([^;]+);`);
            const varMatch = body.match(varRegex);
            return varMatch ? varMatch[1].trim() : '';
        };

        result.background = get('color-background');
        result.primary = get('color-primary');
        result.foreground = get('color-foreground');
        result.border = get('color-border');

        return result;
    }

    function copyCode() {
        navigator.clipboard.writeText(css);
    }
</script>

<button class="flex p-4 border relative rounded-lg flex-col gap-3">
	<h3 class="text-lg text-left font-semibold">{name}</h3>
	<div class="flex flex-row gap-2">
        <div class={`h-8 w-full rounded-lg border`} style={`background:${primary}; border-color:${border};`}></div>
        <div class={`h-8 w-full rounded-lg border`} style={`background:${foreground}; border-color:${border};`}></div>
        <div class={`h-8 w-full rounded-lg border`} style={`background:${background}; border-color:${border};`}></div>
    </div>
    <div class="flex flex-row gap-3">
        <Button onclick={clicked} variant="primary" class="w-full">
            Preview
        </Button>
        <Button onclick={copyCode} variant="outlined" class="w-full">
            Copy Code
        </Button>
    </div>
</button>

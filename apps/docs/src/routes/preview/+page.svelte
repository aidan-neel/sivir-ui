<script lang="ts">
    import ButtonDock from './button-dock.svelte';
    import TagInputDock from './tag-input-dock.svelte';
</script>

<svelte:head>
    <title>Dock preview · Sivir</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto flex w-full max-w-[960px] flex-col gap-16 py-10 sm:py-14">
    <header class="flex max-w-[38rem] flex-col gap-2">
        <h1 class="text-2xl font-semibold tracking-tight text-foreground">Dock preview</h1>
        <p class="text-[0.9375rem] leading-relaxed text-foreground-muted">
            One card per component. Examples and the most-used prop sit in the bar; everything else
            lives under Props, which counts what you have changed.
        </p>
    </header>

    <section class="flex flex-col gap-4">
        <div class="flex max-w-[38rem] flex-col gap-1">
            <h2 class="text-base font-semibold text-foreground">Button</h2>
            <p class="text-sm leading-relaxed text-foreground-muted">
                A small surface: two props fit inline, so there is no Props menu.
            </p>
        </div>
        <ButtonDock />
    </section>

    <section class="flex flex-col gap-4">
        <div class="flex max-w-[38rem] flex-col gap-1">
            <h2 class="text-base font-semibold text-foreground">Tag input</h2>
            <p class="text-sm leading-relaxed text-foreground-muted">
                The stress test: eleven props across content, state, and behavior. Visual props
                morph the demo; behavior props apply live so your tags survive.
            </p>
        </div>
        <TagInputDock />
    </section>
</div>

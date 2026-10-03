<script lang="ts">
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { resolve } from '$app/paths';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import InstallCommand from '$lib/components/install-command.svelte';

    const install = 'npx skills add aidan-neel/sivir-ui --skill sivir';

    const prompts = [
        'Build a support chat with Sivir, with streamed replies and a composer.',
        'Add a settings page using Sivir components that match this app.',
        'Turn this sidebar into a Sivir command palette.',
        'Review this form against the Sivir design language.'
    ];

    const linkClass = 'text-foreground underline underline-offset-2';
    const listClass =
        'm-0 flex list-disc flex-col gap-1.5 pl-5 [font-size:var(--font-size-body)] text-foreground leading-relaxed';
</script>

<svelte:head>
    <title>Sivir · Agent skill</title>
    <meta
        name="description"
        content="Install the Sivir skill so your coding agent builds from the current component APIs."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1 class="m-0">Agent skill</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Teach your coding agent to build with Sivir. The skill reads the current component
                APIs before writing code, so the agent uses real props and imports instead of
                guessing.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="install" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Install</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Run this in your project to add the skill for coding agents that support skills.
        </Typography.Text>
        <InstallCommand
            command={install}
            source="skill"
            class="bg-card shadow-[inset_0_0_0_var(--border-size)_var(--color-border)]"
        />
    </section>

    <section id="what-it-does" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">What it does</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            When you ask for Sivir work, the agent follows the same steps every time:
        </Typography.Text>
        <ul class={listClass}>
            <li>
                Checks whether the project uses the package or copied source, and which Sivir
                version it has.
            </li>
            <li>
                Reads
                <a class={linkClass} href="/llms.txt">llms.txt</a>
                and each component's page before using that component.
            </li>
            <li>
                Picks components with the
                <a class={linkClass} href="/docs/component-selection.md">component selection</a>
                guide, and installs them the way the project already does.
            </li>
            <li>
                Follows the
                <a class={linkClass} href="/docs/design-language.md">design language</a>, or your
                app's own visual system when it has one.
            </li>
            <li>
                Checks the result in light and dark mode, at desktop and phone widths, before
                reporting back.
            </li>
        </ul>
    </section>

    <section id="try-it" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Try it</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Mention Sivir in your request and the agent loads the skill. For example:
        </Typography.Text>
        <ul class={listClass}>
            {#each prompts as prompt (prompt)}
                <li>{prompt}</li>
            {/each}
        </ul>
    </section>

    <section id="without-the-skill" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Without the skill</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            If your agent does not support skills, point it at
            <a class={linkClass} href="/llms.txt">llms.txt</a>. It indexes every guide and component
            page in Markdown and includes the same workflow. The skill itself is also published as
            <a class={linkClass} href="/docs/skill.md">skill.md</a>.
        </Typography.Text>
    </section>

    <section id="next" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Next</Typography.H2>
        <Typography.Text variant="body" class="m-0">
            <a class={linkClass} href={resolve('/docs/components')}>Components</a>
            ·
            <a class={linkClass} href={resolve('/docs/changelog')}>Changelog</a>
        </Typography.Text>
    </section>
</div>

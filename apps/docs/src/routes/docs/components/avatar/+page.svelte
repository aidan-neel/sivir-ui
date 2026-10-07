<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PropGroup,
        PropRow,
        PropSegmented,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import Shapes from './examples/shapes.svelte';
    import ShapesSrc from './examples/shapes.svelte?raw';
    import Sizes from './examples/sizes.svelte';
    import SizesSrc from './examples/sizes.svelte?raw';
    import WithImage from './examples/with-image.svelte';
    import WithImageSrc from './examples/with-image.svelte?raw';
    import {
        type AvatarSettings,
        type AvatarShape,
        type AvatarSize,
        avatarCode,
        avatarDefaults,
        changedAvatarProps
    } from './playground/playground';

    const TITLE = 'Avatar';
    const SLUG = 'avatar';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    const sizeOptions: {
        value: AvatarSize;
        label: string;
    }[] = [
        {
            value: 'sm',
            label: 'Small'
        },
        {
            value: 'md',
            label: 'Medium'
        },
        {
            value: 'lg',
            label: 'Large'
        },
        {
            value: 'xl',
            label: 'XL'
        }
    ];

    const shapeOptions: {
        value: AvatarShape;
        label: string;
    }[] = [
        {
            value: 'circle',
            label: 'Circle'
        },
        {
            value: 'square',
            label: 'Square'
        }
    ];

    let settings = $state<AvatarSettings>({
        ...avatarDefaults
    });

    const heroCode = $derived(avatarCode(settings));
    const changed = $derived(changedAvatarProps(settings));
    const morphKey = $derived(`${settings.size}-${settings.shape}-${settings.image}`);
</script>

{#snippet heroProps()}
    <PropGroup title="Appearance">
        <PropRow label="Size">
            <PropSegmented
                label="Size"
                size="sm"
                options={sizeOptions}
                bind:value={settings.size}
            />
        </PropRow>
        <PropRow label="Shape">
            <PropSegmented
                label="Shape"
                size="sm"
                options={shapeOptions}
                bind:value={settings.shape}
            />
        </PropRow>
    </PropGroup>
    <PropGroup title="Content">
        <PropSwitch label="Image" bind:checked={settings.image} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A profile image that shows fallback content, such as initials, until it loads or if it fails."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Avatar.Fallback renders until Avatar.Image finishes loading and stays if the image
                fails. Set size to sm, md, lg, or xl and shape to circle or square.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed}>
            <PreviewMorph key={morphKey}>
                <Hero size={settings.size} shape={settings.shape} image={settings.image} />
            </PreviewMorph>
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            size defaults to md and shape to circle. alt defaults to an empty string; set it to the
            person's name unless the name already appears next to the avatar.
        </Typography.Text>
        <CodeBlock
            code={`import * as Avatar from '@sivir-ui/svelte/components/avatar';\n\n<Avatar.Root>\n  <Avatar.Image src="/avatars/maya-chen.jpg" alt="Maya Chen" />\n  <Avatar.Fallback>MC</Avatar.Fallback>\n</Avatar.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="sizes" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Sizes </Typography.H3>
            <ComponentPreview code={SizesSrc}>
                <Sizes />
            </ComponentPreview>
        </div>

        <div id="shapes" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Shapes </Typography.H3>
            <ComponentPreview code={ShapesSrc}>
                <Shapes />
            </ComponentPreview>
        </div>

        <div id="with-image" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With image </Typography.H3>
            <ComponentPreview code={WithImageSrc}>
                <WithImage />
            </ComponentPreview>
        </div>
    </section>
</div>

<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { CodeBlock, type CodeBlockTab } from '@sivir-ui/svelte/components/code-block';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { trackEvent } from '$lib/analytics';
    import { cssChanges } from '$lib/studio/studio-chrome';

    type Props = {
        open: boolean;
        name: string;
        baseName: string;
        baseSlug: string;
        css: string;
        baseCss: string;
        json: string;
        savePresetName: string | null;
        onSavePreset: () => Promise<void>;
    };

    let {
        open = $bindable(),
        name,
        baseName,
        baseSlug,
        css,
        baseCss,
        json,
        savePresetName,
        onSavePreset
    }: Props = $props();

    let saving = $state(false);

    async function savePreset() {
        saving = true;

        try {
            await onSavePreset();
        } finally {
            saving = false;
        }
    }

    let tab = $state('changes');

    const changes = $derived(cssChanges(css, baseCss));
    const cliCommand = $derived(`bunx sivir add theme ${baseSlug}`);
    const tabs = $derived.by(() => {
        const list: CodeBlockTab[] = [];
        if (changes.count > 0) {
            list.push({
                label: 'Changes',
                lang: 'css',
                value: 'changes',
                code: `/* ${name} · ${changes.count} ${changes.count === 1 ? 'change' : 'changes'} from ${baseName} */\n${changes.css}`
            });
        }
        list.push(
            {
                label: 'CSS',
                lang: 'css',
                value: 'css',
                code: css
            },
            {
                label: 'JSON',
                lang: 'json',
                value: 'json',
                code: json
            },
            {
                label: 'CLI',
                lang: 'bash',
                value: 'cli',
                code: cliCommand
            }
        );

        return list;
    });

    $effect(() => {
        if (open) {
            tab = changes.count > 0 ? 'changes' : 'css';
        }
    });
</script>

<Sheet.Root bind:open>
    <Sheet.Content side="right" class="max-w-[42rem]">
        <Sheet.Header>
            <Sheet.Title>Export {name}</Sheet.Title>
            <Sheet.Description>
                Copy the theme into your project's CSS, or keep the JSON to load it again later.
            </Sheet.Description>
        </Sheet.Header>
        <div class="flex min-h-0 flex-1 flex-col gap-3">
            <CodeBlock
                bind:value={tab}
                {tabs}
                class="min-h-0 flex-1 [--code-block-max-height:none]"
            />
            {#if tab === 'cli'}
                <Typography.Metadata>
                    {#if changes.count > 0}
                        The CLI installs built-in presets by slug. It adds {baseName}, not your
                        {changes.count}
                        {changes.count === 1 ? 'change' : 'changes'}. Copy the CSS to keep them.
                    {:else}
                        Writes {baseName} to your theme.css.
                    {/if}
                </Typography.Metadata>
            {/if}
        </div>
        <Sheet.Footer class="flex-row justify-end">
            {#if savePresetName}
                <Button
                    variant="ghost"
                    size="md"
                    class="mr-auto"
                    status={saving ? 'loading' : 'idle'}
                    loadingLabel="Saving…"
                    onclick={savePreset}
                >
                    Save to {savePresetName}
                </Button>
            {/if}
            <CopyButton
                text={json}
                label="Copy theme JSON"
                variant="outline"
                size="md"
                oncopy={() => trackEvent('theme_exported', { format: 'json', source: 'studio' })}
            >
                Copy JSON
            </CopyButton>
            <CopyButton
                text={css}
                label="Copy theme CSS"
                variant="primary"
                size="md"
                oncopy={() => trackEvent('theme_exported', { format: 'css', source: 'studio' })}
            >
                Copy CSS
            </CopyButton>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>

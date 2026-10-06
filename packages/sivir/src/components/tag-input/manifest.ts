import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * TagInput.
 *
 * 1.0.0 -- initial. Compound field for tokenized string entry: Root owns
 *        tags + draft state, List renders the tokens, Tag renders one token
 *        with its remove control, Input handles entry, delimiters, paste
 *        splitting, and Backspace removal.
 * 1.1.0 -- chips read a per-variant surface instead of the input stroke, so
 *        they stay legible on the secondary tray and in dark mode. Default
 *        List animates tags in and out, keyed by value.
 */
export const manifest: Manifest = {
    name: 'tag-input',
    version: '1.1.0',
    visibility: 'public',
    description:
        'Tokenized tag entry field with keyboard, paste, and validation support. Compound: Root / List / Tag / Input.',
    files: [
        'components/tag-input/tag-input.svelte',
        'components/tag-input/tag-input-list.svelte',
        'components/tag-input/tag-input-tag.svelte',
        'components/tag-input/tag-input-input.svelte',
        'components/tag-input/context.svelte.ts',
        'components/tag-input/index.ts',
        'components/tag-input/manifest.ts'
    ],
    components: ['button'],
    shared: ['utils.cn', 'utils.createContext', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

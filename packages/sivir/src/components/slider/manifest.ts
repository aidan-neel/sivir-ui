import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Version history:
 *   2.0.0:
 *           - Slider is now the labeled scrub field: the label and formatted value
 *             sit inside the control, the fill springs to the pressed point, and
 *             the field stretches against its limits. Adds `format`, `name`, and
 *             `onValueCommit`, and Root, Range, Thumb, Label, and Value parts.
 *           - Remove the plain range-track slider.
 */
export const manifest: Manifest = {
    name: 'slider',
    version: '2.0.0',
    visibility: 'public',
    description:
        'Labeled scrub slider with a bindable value, min/max/step, formatted value text, and spring motion. The label and value sit inside the field; compose Range, Thumb, Label, and Value to omit, reorder, or restyle them.',
    role: 'slider',
    files: [
        'components/slider/slider.svelte',
        'components/slider/slider-range.svelte',
        'components/slider/slider-thumb.svelte',
        'components/slider/slider-label.svelte',
        'components/slider/slider-value.svelte',
        'components/slider/context.svelte.ts',
        'components/slider/slider-spring.svelte.ts',
        'components/slider/index.ts',
        'components/slider/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
import type {
    PlaygroundExample,
    PlaygroundSize
} from '../docs/components/button/playground/playground';

export type ConceptOption<T extends string> = {
    value: T;
    label: string;
};

export const variantOptions: ConceptOption<ButtonVariant>[] = [
    {
        value: 'primary',
        label: 'Primary'
    },
    {
        value: 'secondary',
        label: 'Secondary'
    },
    {
        value: 'outline',
        label: 'Outline'
    },
    {
        value: 'ghost',
        label: 'Ghost'
    },
    {
        value: 'quiet',
        label: 'Quiet'
    },
    {
        value: 'panel',
        label: 'Panel'
    },
    {
        value: 'destructive',
        label: 'Destructive'
    }
];

export const sizeOptions: ConceptOption<PlaygroundSize>[] = [
    {
        value: 'sm',
        label: 'Small'
    },
    {
        value: 'md',
        label: 'Default'
    },
    {
        value: 'lg',
        label: 'Large'
    }
];

export const exampleOptions: ConceptOption<PlaygroundExample>[] = [
    {
        value: 'default',
        label: 'Default'
    },
    {
        value: 'leading',
        label: 'Leading icon'
    },
    {
        value: 'trailing',
        label: 'Trailing icon'
    },
    {
        value: 'status',
        label: 'Status'
    },
    {
        value: 'link',
        label: 'As link'
    },
    {
        value: 'disabled',
        label: 'Disabled'
    }
];

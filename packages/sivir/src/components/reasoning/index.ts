import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type {
    HTMLAttributes,
    HTMLButtonAttributes,
    HTMLLiAttributes,
    HTMLOlAttributes
} from 'svelte/elements';
import Root from './reasoning.svelte';
import Content from './reasoning-content.svelte';
import Orb from './reasoning-orb.svelte';
import Step from './reasoning-step.svelte';
import Steps from './reasoning-steps.svelte';
import Trigger from './reasoning-trigger.svelte';

export type ReasoningRootProps = {
    /** While true, the orb fills and elapsed time counts up. Turning it on opens the trace; turning it off leaves the trace as it is and settles the trigger label. */
    streaming?: boolean;
    /** Whether the reasoning content is visible. Defaults to `false`, and opens when `streaming` turns on. */
    open?: boolean;
    /** Elapsed seconds to show instead of the measured time, such as for a restored transcript. */
    duration?: number;
    onOpenChange?: (open: boolean) => void;
    onOpenChangeComplete?: (open: boolean) => void;
    children?: Snippet;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type ReasoningTriggerProps = {
    /** The live activity label while streaming, such as Searching the web. Defaults to Thinking. */
    status?: string;
    /** The settled label once streaming ends. Defaults to Worked for and the elapsed time. */
    summary?: string;
    /** Rendered before the label, such as `Reasoning.Orb`. The trigger shows no icon by default. */
    icon?: Snippet<[ReasoningTriggerState]>;
    children?: Snippet<[ReasoningTriggerState]>;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLButtonAttributes, 'children' | 'onclick' | 'title'>;

export type ReasoningTriggerState = Readonly<{
    open: boolean;
    streaming: boolean;
    seconds: number;
}>;

export type ReasoningOrbProps = {
    /** Runs the orb's wave while the model works. */
    active?: boolean;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export type ReasoningContentProps = DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>;

export type ReasoningStepsProps = DefaultProps & Omit<HTMLOlAttributes, 'children'>;

export type ReasoningStepStatus = 'active' | 'complete';

export type ReasoningStepProps = {
    title: string;
    /** An active step shimmers its title. Defaults to `complete`. */
    status?: ReasoningStepStatus;
    /** Turns the title into a toggle for the step body. */
    collapsible?: boolean;
    /** Whether a collapsible step shows its body. Defaults to `true`. */
    open?: boolean;
    icon?: Snippet;
    children?: Snippet;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLLiAttributes, 'children' | 'title'>;

export { Content, Orb, Root, Step, Steps, Trigger };

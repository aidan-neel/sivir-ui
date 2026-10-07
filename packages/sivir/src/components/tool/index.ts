import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type {
    HTMLAttributes,
    HTMLButtonAttributes,
    HTMLLiAttributes,
    HTMLOlAttributes
} from 'svelte/elements';
import Root from './tool.svelte';
import Call from './tool-call.svelte';
import Content from './tool-content.svelte';
import Input from './tool-input.svelte';
import Output from './tool-output.svelte';
import Trigger from './tool-trigger.svelte';

export type ToolState = 'running' | 'complete' | 'error';

export type ToolRootProps = {
    /** While true, elapsed time counts up and the trigger label shimmers. Turning it on opens the calls; turning it off leaves them as they are and settles the trigger label. */
    running?: boolean;
    /** Whether the tool calls are visible. Defaults to `false`, and opens when `running` turns on. */
    open?: boolean;
    /** Elapsed seconds to show instead of the measured time, such as for a restored transcript. */
    duration?: number;
    onOpenChange?: (open: boolean) => void;
    onOpenChangeComplete?: (open: boolean) => void;
    children?: Snippet;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type ToolTriggerState = Readonly<{
    open: boolean;
    running: boolean;
    seconds: number;
}>;

export type ToolTriggerProps = {
    /** The live label while running, such as Running tests. Defaults to Working. */
    status?: string;
    /** The settled label once running ends, such as Edited 2 files, ran tests. Defaults to Worked for and the elapsed time. */
    summary?: string;
    /** Rendered before the label. The trigger shows no icon by default. */
    icon?: Snippet<[ToolTriggerState]>;
    children?: Snippet<[ToolTriggerState]>;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLButtonAttributes, 'children' | 'onclick' | 'title'>;

export type ToolContentProps = DefaultProps & Omit<HTMLOlAttributes, 'children' | 'id'>;

export type ToolCallProps = {
    /** What the call does, such as Read, or Reading while it runs. */
    action: string;
    /** What the call acts on, such as a path, query, or command. */
    target?: string;
    /** A running call shimmers its action. Defaults to `complete`. */
    state?: ToolState;
    /** Whether the call details are visible. Only applies when the call has children. */
    open?: boolean;
    /** Rendered on the rail before the action. Defaults to a dot. */
    icon?: Snippet;
    children?: Snippet;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLLiAttributes, 'children'>;

export type ToolInputProps = {
    label?: string;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type ToolOutputProps = {
    label?: string;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export { Call, Content, Input, Output, Root, Trigger };

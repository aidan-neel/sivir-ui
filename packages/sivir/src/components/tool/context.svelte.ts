import { createContext } from '@sivir-ui/svelte/utils';
import type { ToolState } from '.';

export type ToolContext = {
    id: string;
    get open(): boolean;
    set open(value: boolean);
    get state(): ToolState;
    registerContent: () => () => void;
    settle: (open: boolean) => void;
};

const { set: setToolContext, get: getToolContext } = createContext<ToolContext>('tool');

export { getToolContext, setToolContext };

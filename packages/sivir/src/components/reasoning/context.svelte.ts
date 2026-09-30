import { createContext } from '@sivir-ui/svelte/utils';

export type ReasoningContext = {
    id: string;
    get open(): boolean;
    set open(value: boolean);
    get streaming(): boolean;
    registerContent: () => () => void;
    settle: (open: boolean) => void;
};

const { set: setReasoningContext, get: getReasoningContext } =
    createContext<ReasoningContext>('reasoning');

export { getReasoningContext, setReasoningContext };

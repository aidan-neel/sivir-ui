import { createContext } from '@sivir-ui/svelte/utils';

export type ReasoningContext = {
    id: string;
    get open(): boolean;
    set open(value: boolean);
    get streaming(): boolean;
    get seconds(): number;
    registerContent: () => () => void;
    settle: (open: boolean) => void;
};

const { set: setReasoningContext, get: getReasoningContext } =
    createContext<ReasoningContext>('reasoning');

function formatSeconds(seconds: number) {
    const whole = Math.max(0, Math.floor(seconds));

    if (whole < 60) {
        return `${whole}s`;
    }

    const minutes = Math.floor(whole / 60);
    const remainder = whole % 60;

    if (remainder === 0) {
        return `${minutes}m`;
    }

    return `${minutes}m ${remainder}s`;
}

export { formatSeconds, getReasoningContext, setReasoningContext };

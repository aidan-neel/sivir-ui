import { createContext } from '@sivir-ui/svelte/utils';

export type SourceContext = {
    get count(): number;
};

const { set: setSourceContext, get: getSourceContext } = createContext<SourceContext>('source');

export { getSourceContext, setSourceContext };

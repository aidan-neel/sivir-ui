import { createContext } from '@sivir-ui/svelte/utils';

export type SliderContext = {
    readonly fill: number;
    readonly formatted: string;
    readonly dragging: boolean;
    readonly focusVisible: boolean;
    readonly disabled: boolean;
};

const { set: setSliderContext, get: getSliderContext } = createContext<SliderContext>('slider');

export { getSliderContext, setSliderContext };

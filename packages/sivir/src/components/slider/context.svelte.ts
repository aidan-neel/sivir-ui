import { createContext } from '@sivir-ui/svelte/utils';

export type SliderContext = {
    readonly fill: number;
    readonly formatted: string;
    readonly dragging: boolean;
    readonly focusVisible: boolean;
    readonly disabled: boolean;
    readonly editable: boolean;
    readonly editing: boolean;
    readonly label: string | undefined;
    readonly rawValue: string;
    beginEdit: () => void;
    commitEdit: (text: string) => void;
    cancelEdit: () => void;
};

const { set: setSliderContext, get: getSliderContext } = createContext<SliderContext>('slider');

export { getSliderContext, setSliderContext };

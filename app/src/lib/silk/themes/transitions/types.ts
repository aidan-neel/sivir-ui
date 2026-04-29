export type ThemeTransitionPresetSlug = string;

export type ThemeMotion = {
	hoverDuration: string;
	menuDuration: string;
	panelDuration: string;
	sheetDuration: string;
	overlayDuration: string;
	tooltipDuration: string;
	toastInDuration: string;
	toastOutDuration: string;
	panelX: number;
	panelY: number;
	panelBlur: number;
	panelScaleStart: number;
	sheetOffset: number;
	overlayBlur: number;
};

export type ThemeTransitionPreset = {
	slug: ThemeTransitionPresetSlug;
	name: string;
	description: string;
	motion: ThemeMotion;
};

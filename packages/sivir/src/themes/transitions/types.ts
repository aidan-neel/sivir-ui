export type ThemeTransitionPresetSlug = string;

export type ThemeMotion = {
	hoverDuration: string;
	menuDuration: string;
	panelDuration: string;
	sheetDuration: string;
	overlayDuration: string;
	toastInDuration: string;
	toastOutDuration: string;
	panelY: number;
	panelScaleStart: number;
};

export type ThemeTransitionPreset = {
	slug: ThemeTransitionPresetSlug;
	name: string;
	description: string;
	motion: ThemeMotion;
};

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
	/** Optional 3D depth — perspective in px. 0 disables (default). */
	panelPerspective?: number;
	/** Tilt on entry, in degrees (negative = top tilts away). Only applied when panelPerspective > 0. */
	panelRotateX?: number;
	/** Opacity at the start of the enter transition (0–1). Defaults to 0. */
	panelOpacityStart?: number;
	/** CSS easing function for panel transitions. Defaults to a soft ease-out. */
	panelEasing?: string;
};

export type ThemeTransitionPreset = {
	slug: ThemeTransitionPresetSlug;
	name: string;
	description: string;
	motion: ThemeMotion;
};

/**
 * A Feel is the *timing* half of motion -- durations and easings only, with no
 * shape. It is fully decoupled from the Animation (the shape/keyframes), so any
 * feel composes with any animation (e.g. an "Instant" feel with a "Cascade"
 * animation). Feels drive the `--motion-duration-*` and easing CSS variables the
 * components already consume; the Animation picks which keyframes run.
 */
export type FeelDurations = {
	/** Control hover/press transitions (buttons, inputs, switches). */
	hover: string;
	/** Menu item hover/active transitions. */
	menu: string;
	/** Floating panel enter/exit (popover, dropdown, select, modal panel). */
	panel: string;
	/** Sheet (edge drawer) enter/exit. */
	sheet: string;
	/** Overlay backdrop fade (modal/sheet scrim). */
	overlay: string;
	/** Tooltip enter/exit. */
	tooltip: string;
	/** Toast enter. */
	toastIn: string;
	/** Toast exit. */
	toastOut: string;
};

export type Feel = {
	slug: string;
	name: string;
	description: string;
	durations: FeelDurations;
	/** Easing for panel/overlay/sheet enter-exit. */
	easing: string;
	/** Easing for control hover/press. */
	easingHover: string;
};

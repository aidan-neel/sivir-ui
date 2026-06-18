/**
 * An Animation is the *shape* half of motion -- which `@keyframes` run on each
 * surface, with no timing. It is fully decoupled from the Feel (durations and
 * easings), so any animation composes with any feel. Animations are CSS-only:
 * each surface maps to a keyframe name (shipped in `ui.css`), selected at theme
 * time via `--silk-anim-*` variables. `none` disables motion for that surface.
 *
 * Tooltips reuse the panel keyframes (with the tooltip duration), so the
 * controlled surfaces are: panel, overlay (backdrop), and sheet. Toasts keep a
 * fixed, feel-timed slide-fade (their stacked list exit can't be a single
 * presence), so they are intentionally not part of the animation axis.
 */
export type AnimationKeyframes = {
	panelIn: string;
	panelOut: string;
	overlayIn: string;
	overlayOut: string;
	sheetIn: string;
	sheetOut: string;
};

export type Animation = {
	slug: string;
	name: string;
	description: string;
	keyframes: AnimationKeyframes;
	/**
	 * When true, an opening panel's direct children stagger in (the landing-page
	 * "cascade"). Enter-only; emitted as extra CSS by `themeToCss` so it is
	 * active only for cascade themes.
	 */
	cascade?: boolean;
};

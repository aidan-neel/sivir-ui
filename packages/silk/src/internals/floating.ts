/**
 * Silk's built-in floating-element positioning engine.
 *
 * A small, dependency-free replacement for the subset of `@floating-ui/dom`
 * that Silk uses: `computePosition` plus the `offset`, `flip`, `shift` and
 * `size` middleware. The public shapes (placements, the middleware factory
 * signatures, the `computePosition` return) mirror floating-ui so existing
 * call sites keep working unchanged.
 *
 * Model: middleware run in **viewport** coordinates (so overflow detection is
 * straightforward), then the final coordinates are converted into the floating
 * element's containing block for the `absolute` strategy. For `fixed`, viewport
 * coordinates are returned as-is.
 */

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Alignment = 'start' | 'end';
export type Placement = Side | `${Side}-${Alignment}`;
export type Strategy = 'absolute' | 'fixed';
export type Axis = 'x' | 'y';

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface VirtualElement {
	getBoundingClientRect: () => DOMRect | Rect;
	contextElement?: Element;
}

export type ReferenceElement = Element | VirtualElement;
export type FloatingElement = HTMLElement;

export interface MiddlewareState {
	x: number;
	y: number;
	initialPlacement: Placement;
	placement: Placement;
	strategy: Strategy;
	rects: { reference: Rect; floating: Rect };
	elements: { reference: ReferenceElement; floating: FloatingElement };
	middlewareData: MiddlewareData;
}

export interface MiddlewareReturn {
	x?: number;
	y?: number;
	data?: Record<string, unknown>;
	reset?: boolean | { placement?: Placement };
}

export interface Middleware {
	name: string;
	fn: (state: MiddlewareState) => MiddlewareReturn | void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MiddlewareData = Record<string, any>;

export interface ComputePositionConfig {
	placement?: Placement;
	strategy?: Strategy;
	middleware?: Array<Middleware | null | undefined | false>;
}

export interface ComputePositionReturn {
	x: number;
	y: number;
	placement: Placement;
	strategy: Strategy;
	middlewareData: MiddlewareData;
}

type SideObject = { top: number; right: number; bottom: number; left: number };

const sides: Side[] = ['top', 'right', 'bottom', 'left'];

function getSide(placement: Placement): Side {
	return placement.split('-')[0] as Side;
}

function getAlignment(placement: Placement): Alignment | undefined {
	return placement.split('-')[1] as Alignment | undefined;
}

/** The axis a side lives on: top/bottom → y, left/right → x. */
function getSideAxis(placement: Placement): Axis {
	return getSide(placement) === 'top' || getSide(placement) === 'bottom' ? 'y' : 'x';
}

const oppositeSide: Record<Side, Side> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left'
};

function getOppositePlacement(placement: Placement): Placement {
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	return (alignment ? `${oppositeSide[side]}-${alignment}` : oppositeSide[side]) as Placement;
}

function clamp(min: number, value: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}

function getViewportRect(reference: ReferenceElement): Rect {
	const r = reference.getBoundingClientRect();
	return { x: r.x, y: r.y, width: r.width, height: r.height };
}

/** Base coordinates (viewport space) for a placement, before middleware. */
function computeCoordsFromPlacement(
	reference: Rect,
	floating: Rect,
	placement: Placement
): { x: number; y: number } {
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const side = getSide(placement);
	const alignment = getAlignment(placement);

	let coords: { x: number; y: number };
	switch (side) {
		case 'top':
			coords = { x: commonX, y: reference.y - floating.height };
			break;
		case 'bottom':
			coords = { x: commonX, y: reference.y + reference.height };
			break;
		case 'right':
			coords = { x: reference.x + reference.width, y: commonY };
			break;
		case 'left':
		default:
			coords = { x: reference.x - floating.width, y: commonY };
			break;
	}

	if (alignment) {
		// Alignment shifts along the axis perpendicular to the side.
		const alignmentAxis: Axis = getSideAxis(placement) === 'y' ? 'x' : 'y';
		const len = alignmentAxis === 'y' ? 'height' : 'width';
		const diff = reference[len] / 2 - floating[len] / 2;
		if (alignment === 'start') coords[alignmentAxis] -= diff;
		else coords[alignmentAxis] += diff;
	}

	return coords;
}

/**
 * How far the floating rect (at the given viewport coords) spills past the
 * viewport, inset by `padding`. Positive on a side = overflowing that side.
 */
function detectOverflow(state: MiddlewareState, padding: number): SideObject {
	const { x, y, rects } = state;
	const floating = {
		top: y,
		left: x,
		right: x + rects.floating.width,
		bottom: y + rects.floating.height
	};
	const clip = {
		top: padding,
		left: padding,
		right: window.innerWidth - padding,
		bottom: window.innerHeight - padding
	};
	return {
		top: clip.top - floating.top,
		bottom: floating.bottom - clip.bottom,
		left: clip.left - floating.left,
		right: floating.right - clip.right
	};
}

export interface OffsetOptions {
	mainAxis?: number;
}

/** Displaces the floating element away from the reference along the side axis. */
export function offset(value: number | OffsetOptions = 0): Middleware {
	const mainAxis = typeof value === 'number' ? value : (value.mainAxis ?? 0);
	return {
		name: 'offset',
		fn(state) {
			const { x, y, placement } = state;
			switch (getSide(placement)) {
				case 'top':
					return { y: y - mainAxis };
				case 'bottom':
					return { y: y + mainAxis };
				case 'left':
					return { x: x - mainAxis };
				case 'right':
					return { x: x + mainAxis };
				default:
					return {};
			}
		}
	};
}

export interface FlipOptions {
	padding?: number;
	crossAxis?: boolean;
	fallbackPlacements?: Placement[];
	fallbackAxisSideDirection?: 'none' | 'start' | 'end';
}

function getOppositeAxisPlacements(placement: Placement, direction: 'start' | 'end'): Placement[] {
	const alignment = getAlignment(placement);
	let list: Side[] = getSideAxis(placement) === 'y' ? ['left', 'right'] : ['top', 'bottom'];
	if (direction === 'end') list = [...list].reverse();
	return list.map((s) => (alignment ? (`${s}-${alignment}` as Placement) : (s as Placement)));
}

/** Swaps to the opposite (or a fallback) placement when the current one overflows. */
export function flip(options: FlipOptions = {}): Middleware {
	const { padding = 0, fallbackPlacements, fallbackAxisSideDirection = 'none' } = options;

	return {
		name: 'flip',
		fn(state) {
			const { placement, initialPlacement, middlewareData } = state;
			const data = middlewareData.flip ?? {};

			const placements: Placement[] = data.placements ?? [
				initialPlacement,
				...(fallbackPlacements ?? [
					getOppositePlacement(initialPlacement),
					...(fallbackAxisSideDirection !== 'none'
						? getOppositeAxisPlacements(initialPlacement, fallbackAxisSideDirection)
						: [])
				])
			];

			const overflow = detectOverflow(state, padding);
			const side = getSide(placement);
			const mainOverflow = overflow[side];
			const overflows = [...(data.overflows ?? []), { placement, overflow: mainOverflow }];

			// Only the main (side) axis decides a flip. Cross-axis (alignment)
			// overflow is left to shift(), so a panel anchored near a viewport
			// edge slides into view instead of flipping to a perpendicular side.
			if (mainOverflow > 0) {
				const nextIndex = (data.index ?? 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					return {
						data: { index: nextIndex, overflows, placements },
						reset: { placement: nextPlacement }
					};
				}
				// Exhausted: keep whichever placement overflowed its side the least.
				const best = [...overflows].sort((p, q) => p.overflow - q.overflow)[0]?.placement;
				if (best && best !== placement) {
					return { data: { placements }, reset: { placement: best } };
				}
			}

			return {};
		}
	};
}

export interface ShiftOptions {
	padding?: number;
	crossAxis?: boolean;
	mainAxis?: boolean;
}

/** Slides the floating element to keep it within the viewport. */
export function shift(options: ShiftOptions = {}): Middleware {
	const { padding = 0, crossAxis = false, mainAxis = true } = options;
	return {
		name: 'shift',
		fn(state) {
			const { x, y, placement } = state;
			const overflow = detectOverflow(state, padding);
			const coords = { x, y };

			// The "main" shift axis is perpendicular to the side axis.
			const mainShiftAxis: Axis = getSideAxis(placement) === 'y' ? 'x' : 'y';

			const apply = (axis: Axis) => {
				const minSide: Side = axis === 'x' ? 'left' : 'top';
				const maxSide: Side = axis === 'x' ? 'right' : 'bottom';
				const min = coords[axis] + overflow[minSide];
				const max = coords[axis] - overflow[maxSide];
				coords[axis] = clamp(min, coords[axis], max);
			};

			if (mainAxis) apply(mainShiftAxis);
			if (crossAxis) apply(mainShiftAxis === 'x' ? 'y' : 'x');

			return { x: coords.x, y: coords.y };
		}
	};
}

export interface SizeApplyArgs {
	availableWidth: number;
	availableHeight: number;
	elements: { reference: ReferenceElement; floating: FloatingElement };
	rects: { reference: Rect; floating: Rect };
	placement: Placement;
}

export interface SizeOptions {
	padding?: number;
	apply?: (args: SizeApplyArgs) => void;
}

/** Reports the space available to the floating element so callers can cap its size. */
export function size(options: SizeOptions = {}): Middleware {
	const { padding = 0, apply } = options;
	return {
		name: 'size',
		fn(state) {
			const { placement, rects, elements } = state;
			const overflow = detectOverflow(state, padding);

			const availableWidth = Math.max(
				0,
				rects.floating.width - Math.max(0, overflow.left) - Math.max(0, overflow.right)
			);
			const availableHeight = Math.max(
				0,
				rects.floating.height - Math.max(0, overflow.top) - Math.max(0, overflow.bottom)
			);

			apply?.({ availableWidth, availableHeight, elements, rects, placement });
			return {};
		}
	};
}

/** The floating element's offset parent (containing block) for `absolute` strategy. */
function getOffsetParent(element: FloatingElement): HTMLElement {
	const parent = element.offsetParent;
	if (parent instanceof HTMLElement) return parent;
	return element.ownerDocument.documentElement;
}

/**
 * Positions `floating` relative to `reference`, running the configured
 * middleware. Async to match `@floating-ui/dom`'s signature.
 */
export function computePosition(
	reference: ReferenceElement,
	floating: FloatingElement,
	config: ComputePositionConfig = {}
): Promise<ComputePositionReturn> {
	const { placement = 'bottom', strategy = 'absolute', middleware = [] } = config;

	const referenceRect = getViewportRect(reference);
	const floatingClientRect = floating.getBoundingClientRect();
	const floatingRect: Rect = {
		x: 0,
		y: 0,
		width: floatingClientRect.width,
		height: floatingClientRect.height
	};

	const validMiddleware = middleware.filter(Boolean) as Middleware[];
	const middlewareData: MiddlewareData = {};

	let statePlacement = placement;
	let { x, y } = computeCoordsFromPlacement(referenceRect, floatingRect, statePlacement);

	let i = 0;
	let resets = 0;
	while (i < validMiddleware.length) {
		const mw = validMiddleware[i];
		const result =
			mw.fn({
				x,
				y,
				initialPlacement: placement,
				placement: statePlacement,
				strategy,
				rects: { reference: referenceRect, floating: floatingRect },
				elements: { reference, floating },
				middlewareData
			}) ?? {};

		if (result.x != null) x = result.x;
		if (result.y != null) y = result.y;
		if (result.data) {
			middlewareData[mw.name] = { ...middlewareData[mw.name], ...result.data };
		}

		if (result.reset && resets < 50) {
			resets++;
			if (typeof result.reset === 'object' && result.reset.placement) {
				statePlacement = result.reset.placement;
			}
			({ x, y } = computeCoordsFromPlacement(referenceRect, floatingRect, statePlacement));
			i = 0;
			continue;
		}

		i++;
	}

	if (strategy === 'absolute') {
		const offsetParent = getOffsetParent(floating);
		const opRect = offsetParent.getBoundingClientRect();
		x = x - opRect.left - offsetParent.clientLeft + offsetParent.scrollLeft;
		y = y - opRect.top - offsetParent.clientTop + offsetParent.scrollTop;
	}

	return Promise.resolve({ x, y, placement: statePlacement, strategy, middlewareData });
}

export { sides };

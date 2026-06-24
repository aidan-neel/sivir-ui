import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
	computePosition,
	offset,
	flip,
	shift,
	size,
	type Placement,
	type VirtualElement
} from '@silk/ui/internals/floating';

// jsdom does no layout, so we stub the two geometry inputs the engine reads:
// the reference's bounding rect (via a virtual element) and the floating
// element's bounding rect + offsetParent. window.innerWidth/Height default to
// 1024x768 in jsdom, which we treat as the viewport.

function virtualRef(x: number, y: number, width: number, height: number): VirtualElement {
	return {
		getBoundingClientRect: () =>
			({
				x,
				y,
				top: y,
				left: x,
				right: x + width,
				bottom: y + height,
				width,
				height,
				toJSON: () => ({})
			}) as DOMRect
	};
}

function makeFloating(width: number, height: number): HTMLElement {
	const el = document.createElement('div');
	document.body.appendChild(el);
	el.getBoundingClientRect = () =>
		({
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			right: width,
			bottom: height,
			width,
			height,
			toJSON: () => ({})
		}) as DOMRect;
	// In the app the floating element is position:absolute in <body>; body sits
	// at the viewport origin in jsdom, so the absolute-strategy conversion is a
	// no-op here (which keeps these assertions in viewport coordinates).
	Object.defineProperty(el, 'offsetParent', { get: () => document.body, configurable: true });
	return el;
}

beforeEach(() => {
	(window as unknown as { innerWidth: number }).innerWidth = 1024;
	(window as unknown as { innerHeight: number }).innerHeight = 768;
});

afterEach(() => {
	document.body.innerHTML = '';
});

describe('computePosition — base placements', () => {
	it('centers along the cross axis for a bare side placement', async () => {
		const ref = virtualRef(100, 100, 50, 20);
		const floating = makeFloating(100, 40);
		const { x, y, placement } = await computePosition(ref, floating, { placement: 'bottom' });
		// bottom: y = ref.bottom (120); x centered = 100 + 25 - 50 = 75
		expect(x).toBe(75);
		expect(y).toBe(120);
		expect(placement).toBe('bottom');
	});

	it('aligns to the start edge for "-start"', async () => {
		const ref = virtualRef(100, 100, 50, 20);
		const floating = makeFloating(100, 40);
		const { x, y } = await computePosition(ref, floating, { placement: 'bottom-start' });
		expect(x).toBe(100); // start aligns floating's left with the reference's left
		expect(y).toBe(120);
	});

	it('aligns to the end edge for "-end"', async () => {
		const ref = virtualRef(100, 100, 50, 20);
		const floating = makeFloating(100, 40);
		const { x } = await computePosition(ref, floating, { placement: 'bottom-end' });
		// end: ref.right - floating.width = 150 - 100 = 50
		expect(x).toBe(50);
	});

	it('places to the left/right along the x axis', async () => {
		const ref = virtualRef(200, 200, 40, 40);
		const floating = makeFloating(60, 30);
		const right = await computePosition(ref, floating, { placement: 'right' });
		expect(right.x).toBe(240); // ref.right
		const left = await computePosition(ref, floating, { placement: 'left' });
		expect(left.x).toBe(140); // ref.left - floating.width = 200 - 60
	});
});

describe('computePosition — middleware', () => {
	it('offset() pushes the floating element away from the reference', async () => {
		const ref = virtualRef(100, 100, 50, 20);
		const floating = makeFloating(100, 40);
		const { y } = await computePosition(ref, floating, {
			placement: 'bottom',
			middleware: [offset(8)]
		});
		expect(y).toBe(128); // 120 + 8
	});

	it('flip() swaps to the opposite side when the preferred side overflows', async () => {
		// Reference near the bottom edge: a 600px-tall panel can't fit below.
		const ref = virtualRef(100, 740, 50, 20);
		const floating = makeFloating(100, 600);
		const { y, placement } = await computePosition(ref, floating, {
			placement: 'bottom',
			middleware: [flip({ padding: 8 })]
		});
		expect(placement).toBe('top');
		// top: ref.top - floating.height = 740 - 600 = 140
		expect(y).toBe(140);
	});

	it('flip() keeps the preferred side when it fits', async () => {
		const ref = virtualRef(100, 100, 50, 20);
		const floating = makeFloating(100, 40);
		const { placement } = await computePosition(ref, floating, {
			placement: 'bottom',
			middleware: [flip({ padding: 8 })]
		});
		expect(placement).toBe('bottom');
	});

	it('flip() does NOT flip when only the cross axis overflows (shift handles it)', async () => {
		// A bottom-start panel anchored near the right edge hangs off the right
		// (cross axis), but there is room below -- it must stay on bottom, not
		// jump to a perpendicular/opposite side. Regression test for the dropdown
		// that collapsed to a thin strip at the wrong spot.
		const ref = virtualRef(980, 100, 20, 20); // viewport width is 1024
		const floating = makeFloating(200, 100);
		const { placement } = await computePosition(ref, floating, {
			placement: 'bottom-start',
			middleware: [flip({ padding: 8, crossAxis: true, fallbackAxisSideDirection: 'start' })]
		});
		expect(placement).toBe('bottom-start');
	});

	it('shift() slides the panel back inside the viewport', async () => {
		// bottom-start would push a wide panel past the right edge; shift pulls it in.
		const ref = virtualRef(1000, 100, 20, 20);
		const floating = makeFloating(200, 40);
		const { x } = await computePosition(ref, floating, {
			placement: 'bottom-start',
			middleware: [shift({ padding: 8 })]
		});
		// right clip = 1024 - 8 = 1016; max left = 1016 - 200 = 816
		expect(x).toBe(816);
	});

	it('size() reports the available space to apply()', async () => {
		const ref = virtualRef(100, 100, 50, 20);
		const floating = makeFloating(100, 40);
		let reported: { availableWidth: number; availableHeight: number } | undefined;
		await computePosition(ref, floating, {
			placement: 'bottom',
			middleware: [
				size({
					padding: 8,
					apply({ availableWidth, availableHeight }) {
						reported = { availableWidth, availableHeight };
					}
				})
			]
		});
		// Fully on-screen → available space equals the panel's own size.
		expect(reported).toEqual({ availableWidth: 100, availableHeight: 40 });
	});
});

describe('computePosition — strategy', () => {
	it('returns the resolved placement and strategy', async () => {
		const ref = virtualRef(100, 100, 50, 20);
		const floating = makeFloating(100, 40);
		const result = await computePosition(ref, floating, {
			placement: 'top-end' as Placement,
			strategy: 'fixed'
		});
		expect(result.strategy).toBe('fixed');
		expect(result.placement).toBe('top-end');
	});
});

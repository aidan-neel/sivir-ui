# Button status morph

A `Button` with `status`, `loading`, or any of the status labels no longer reserves the width of its widest label. It sizes to the face that is showing and animates its width over twice `--motion-duration-swap` when the status changes, so siblings in a toolbar or form row move with it. If a layout needs a stable footprint, such as a fixed action bar, reserve it at the call site with a `min-w-*` class or a fixed-width wrapper. Do not rely on Button to hold the space.

Success and error now replace every variant's fill with a solid fill: the theme's success or error color deepened for contrast, with white text and a darker inset edge. Before this release the status colors were silently overridden, so a `status="success"` primary button stayed primary. Do not add your own green or red classes to fake the state. If a consumer `class` sets a background, it still wins over the status fill.

Status labels animate per letter. Pass them as plain strings. The idle face renders `children` as given and swaps as a whole.

# Collapsible default styling

`Collapsible.Trigger` and `Collapsible.Content` are no longer unstyled primitives. The exported API is unchanged, but the defaults now do the visual work, so call sites written for the old primitive will double up.

Trigger renders a full-width row with its own leading chevron that rotates 90 degrees when open, body-size button weight text, a hover underline, the focus ring, and a disabled state. Do not pass a chevron or other disclosure icon as a child, and do not add `w-full`, padding, or hover classes to reproduce these. Pass the label only.

Content now wraps its children in an inner element with bottom padding and a start indent equal to the chevron plus the trigger gap, so the content's left edge lines up with the trigger label. It also sets supporting-text typography (body size, muted color, relaxed leading). Do not add `pt-*`, `pl-*`, or text color classes to compensate. Pass plain text or your own markup. Content is now a `role="region"` labelled by its trigger.

Root still renders no element. To divide or space a list of collapsibles, wrap each Root in a `div` and put `divide-y` or `gap-*` on the wrapper's parent. Putting `divide-y` directly on the parent of several Roots divides triggers from their own content.

# Gauge compound API

`Gauge` is now a namespace. `import { Gauge } from '@sivir-ui/svelte/components/gauge'` followed by `<Gauge value={72} />` no longer resolves, because the module exports `Root`, `Track`, `Indicator`, and `Value`. Import it with `import * as Gauge from '@sivir-ui/svelte/components/gauge'`. From the package root, `Gauge` is the same namespace.

`Gauge.Root` takes `value`, `max`, `label`, `tone`, and `size`. With no children it renders Track, Indicator, and Value, so `<Gauge.Root value={72} label="Context used" />` is the short form. At `size="sm"` the default leaves Value out, because the number is unreadable at 20px. Put the reading in text beside it instead. Pass children only to restyle, reorder, or omit a part. Once you pass children, you must include `Gauge.Track` and `Gauge.Indicator` yourself.

`size` is now `'sm' | 'md' | 'lg'` (20, 32, and 56px; default `md`). A numeric `size` such as `size={56}` fails type checking and throws at render, so map old pixel sizes to the nearest variant. `strokeWidth` is gone because stroke follows size.

The center used to show the raw clamped value; it now shows the whole percent, which only matches when `max` is 100. The old children slot put text in the center. That text now goes in `Gauge.Value`'s snippet: `<Gauge.Value>{#snippet children({ percent })}{percent}%{/snippet}</Gauge.Value>`. Read `value`, `max`, and `percent` from the snippet. Do not compute them from the prop: the snippet values animate with the arc, and `percent` never reads 0 or 100 unless the value is at a bound. `aria-valuenow` always reflects the real value, not the animated one.

Gauge animates value changes only. The first render shows the real value, so there is no fill-from-zero on mount and no SSR flash. Do not wrap Gauge in your own tween or CSS transition to get a sweep. Tune the timing with `--motion-duration-gauge`, which reads `0ms` under reduced motion and the None movement preset. Tone is not automatic. To warn near a limit, derive `tone` from the value at the call site.

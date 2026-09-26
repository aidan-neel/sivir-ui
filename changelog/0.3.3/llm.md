## Reasoning: collapsed by default, content stays mounted

`Reasoning.Root` now defaults `open` to `false`. A call site that relied on the
old `true` default still type-checks but renders collapsed. Pass `open` (or
`bind:open`) when the trace should be visible on first render, such as a live
stream the user is watching.

`Reasoning.Content` mounts its children on the first open and keeps them
mounted when closed; the panel stays in the DOM, is `inert` while closed, and
animates with a CSS grid-rows transition. Do not wrap it in `{#if open}` or
re-key it on toggle; that brings back the remount and loses streamed state. A
streaming child (Markdown, ResponseStream) can keep updating while collapsed.
`class` and other attributes on `Reasoning.Content` apply to the indented body,
not the animated panel. `onOpenChangeComplete` fires when the height transition
ends, or on the next microtask when motion is reduced.

`Reasoning.Trigger` shows `duration` while `streaming` too. Tick it from the
consumer (for example every 100 ms) for a live "Thinking 3.2s" timer that
freezes into "Thought for 3.2s" when `streaming` flips to `false`. Keep the
same Root mounted across that flip so the label can crossfade. `title` no
longer defaults to "Draft"; omit it for a label-only trigger.

## Question: step transitions live in Question.Content

`Question.Content` accepts `step?: number`. Pass the current step index and the
component animates the change itself: the outgoing step stays mounted briefly
with its old content, is made `inert` and `aria-hidden`, and blurs out while the
next step slides in; the content frame tweens its height between the two. A
higher `step` travels forward, a lower one travels back. Without `step`, content
changes in place as before.

Stop wrapping Question parts in your own `{#key}` or `in:`/`out:` transitions to
fake step motion, and stop setting a fixed `min-h-*` on `Question.Content` to
hide height jumps. Keep one `Question.Root` mounted across steps and drive it
with `step` plus the per-step bound answer, as in the docs hero. Motion reads
`--motion-duration-step-in`, `--motion-duration-step-out`, `--motion-step-x`,
and `--motion-step-blur`; override those tokens rather than restyling the
transition.

`Question.Submit` now renders both its label face and a hidden submitting face
in one grid cell, so the button is as wide as the wider of `label` and
`loadingLabel`. Keep the two labels similar in length.

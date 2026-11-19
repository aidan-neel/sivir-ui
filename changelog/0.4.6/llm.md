# Surface recipes

Every control, field, card, and overlay now draws its edge and lift from one box-shadow recipe instead of a CSS border plus an elevation. Read the recipe; do not rebuild it. The recipes are `--shadow-raised` (secondary buttons, segmented pills, the active page), `--shadow-edge` (outline buttons, including the Select trigger, outline badges, tag chips), `--shadow-field` (inputs, textareas, tag inputs, and the input-style Combobox trigger; a button-style Combobox trigger reads its Button variant's recipe), `--shadow-well` (sunken tracks such as the segmented tab list and secondary fields), `--shadow-card`, `--shadow-menu` (popovers, menus, sheets), `--shadow-modal`, `--shadow-composer`, and `--shadow-primary`. Most have `-hover`, and fields add `-focus` and `-invalid`. In dark themes each recipe includes a 1px black outline (`--color-edge-outline`) and a top highlight (`--color-edge-highlight`), which is the Mac-style edge. Both are transparent in light themes.

Because the edge is a shadow, a `border-*` class on these components no longer changes their edge, and adding one draws a second line inside it. To restyle an edge, override the shadow, for example `shadow-[var(--shadow-edge)]`. To add a focus ring to a custom control built on a recipe, compose it in front of the recipe, `focus-visible:shadow-[var(--focus-ring),var(--shadow-field)]`, never `shadow-[var(--focus-ring)]` alone, which drops the edge while focused.

Button reads a private custom property, `--sivir-button-shadow`, that each variant sets to its recipe, and its focus ring is composed over it. To give one button a different lift, set `[--sivir-button-shadow:var(--shadow-edge)]` rather than a `shadow-*` class, which would also replace the focus ring. The secondary and outline variants set the property again on hover and while open, and panel on hover, so repeat the override for those states: `[--sivir-button-shadow:var(--shadow-edge)] hover:[--sivir-button-shadow:var(--shadow-edge)] data-[state=open]:[--sivir-button-shadow:var(--shadow-edge)]`.

Raised and primary fills are gradients in `background-image` (`--fill-raised`, `--fill-raised-hover`, `--fill-raised-press`, `--fill-primary`, `--fill-primary-hover`). A `bg-red-500` class on a secondary or primary Button only changes the colour under the gradient. To give one a flat colour, remove the gradient in every state it sets one: `bg-none hover:bg-none data-[state=open]:bg-none` with the colour, plus `active:bg-none` on a secondary Button, whose press is a gradient too.

When you write your own lift into a recipe value, use `0 0 #0000` for no shadow. `none` is not valid inside a comma-separated shadow list and silently drops the whole recipe. The chrome switches in `themes/theme.ts` already do this.

Fields show the invalid state from `aria-invalid="true"`, which Input, Textarea, and the adorned control read. Stop adding an error border class; set `aria-invalid` instead.

`--elevation-control` and `--elevation-button-outline` still exist for themes but no component reads them. A theme that changed them to tune button or card depth should change `--elevation-contact`, `--elevation-float`, `--elevation-primary`, or the recipes instead. `--color-edge-focus` is the primary colour, so focused fields draw a primary edge; the composer's focus edge is a neutral hairline on purpose.

Buttons no longer scale on press. The secondary and primary fills darken instead, so do not add `active:scale-*` or `sivir-press` to a Button.

# Modal

Modals are one surface with no inner panel: a `--radius-modal` corner (the large radius times 1.2), a 20px inset, the close button aligned to the title, and a full-width footer with a hairline above it. Footer actions sit together at the end in source order, so put the dismissing action before the confirming one: `<Modal.Close />` then `<Modal.Confirm />`. `Modal.Close` and `AlertDialog.Exit` no longer push themselves to the left, and `Modal.Confirm` no longer pushes to the right. Code that relied on that split now shows both buttons on the right.

For content that belongs at the start of the footer, such as a "Don't ask again" checkbox or a keyboard hint, pass the `start` snippet to `Modal.Footer` or `AlertDialog.Footer`. Do not insert a spacer or `mr-auto` element yourself.

For a breadcrumb such as "Project › New issue", pass the parent as the `context` snippet on `Modal.Title` and keep the current step as the title's children. Title renders the separator hidden from assistive technology, so do not add a chevron or slash. The accessible name stays the full text of the title.

# Menu origins and reduced motion

Floating panels set `data-placement` and `--sivir-placement-origin` from the side that faces their trigger once they are positioned, so menus, submenus, selects, comboboxes, hover cards, and tooltips grow out of the trigger and follow a flip. `--motion-menu-origin` is now only the fallback before the first position. Do not set `transform-origin` on these panels yourself.

Under `prefers-reduced-motion`, menus, popovers, tooltips, modals, and sheets still fade but no longer move, scale, or blur. Do not zero their durations to make them instant.

The dropdown trigger focuses the first item on Enter, Space, or the Down arrow, and the arrow, Home, and End keys move between items. The right arrow, Enter, or Space on a submenu trigger opens the submenu and focuses its first item, and the left arrow closes the submenu and returns focus to its trigger. Items that are disabled or not rendered are skipped. Do not add your own key handling for that. A Select returns focus to its trigger on Escape.

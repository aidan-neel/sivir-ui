/**
 * A Style is a coherent, named bundle of token overrides applied on top of the
 * active theme -- the "Flat / Soft / Sharp" design-language layer. Each style
 * ships as its own module (see the sibling files) so the CLI can install a
 * subset independently of the rest of the library.
 *
 * A style is *primarily* a token preset. Where a style genuinely needs
 * structural/markup variation a component may read `data-style`, but the token
 * bundle is the mechanism's backbone and is enough for the reference set.
 */
export type StylePreset = {
	slug: string;
	name: string;
	description: string;
	/** CSS custom-property overrides, applied after the theme in `:root, .dark`. */
	tokens: Record<string, string>;
};

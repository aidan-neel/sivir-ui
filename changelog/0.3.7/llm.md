## Sivir theme is the default for new projects

`ui.css` and `DEFAULT_THEME` are unchanged, so existing installs, package upgrades, and `sivir add --overwrite` keep the original look. The new `sivir` preset (first in `builtInThemePresets`) is applied only by `sivir init`, which writes `theme.css` next to `ui.css` and imports it after `ui.css`. Do not edit the baked values in `ui.css` to restyle a project. Import a theme after it instead. The original defaults are available as the `Legacy` preset (slug `legacy`; `sivir add theme default` still resolves to it).

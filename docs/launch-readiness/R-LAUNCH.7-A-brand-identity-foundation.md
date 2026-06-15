# R-LAUNCH.7-A Brand Identity Foundation

## Scope

This milestone adds the first controlled brand identity foundation for the SpecBridge AI launch website.

Included:

- Header logo placement
- Footer brand consistency
- SVG favicon
- SVG app icon
- SVG social preview image
- Web manifest
- Color token refinement
- Typography token refinement
- Open Graph and Twitter metadata
- Client-side metadata synchronization using the existing language dictionaries

## Non-goals

This milestone does not introduce a new internationalization architecture.

The website continues to use the existing `assets/i18n.js` dictionary model.

## Language behavior

The selected website language continues to drive:

- HTML `lang`
- HTML `dir`
- `document.title`
- meta description
- Open Graph title and description
- Twitter title and description

Static crawler metadata remains available in the default Turkish source HTML.

## Future language rule

Any future content change that introduces a new visible text key should preserve key parity across all active website languages.

## Report language rule

Report output language should remain a separate application/report contract.

The website language can be used as a preferred language signal, but generated report packages must explicitly carry an output_language value.

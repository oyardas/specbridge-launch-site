# R-LAUNCH.7-C Approved Brand Asset Alignment

## Scope

Milestone: R-LAUNCH.7-C Approved Brand Asset Alignment

This milestone aligns the public launch website with the approved SpecBridge AI branding asset package.

## Repository Boundary

- Working repo: `C:\Dev\specbridge-launch-site`
- Branch: `main`
- Domain: `https://specbridge.co/`
- Forbidden core repo: `C:\Dev\specbridge-ai-clean`

The core product repository is not touched.

## Approved Brand Sources

Approved incoming assets were staged under:

- `_incoming/brand-assets-approved`

The `_incoming/` folder is local staging input only and is excluded from commits through `.gitignore`.

The source package includes:

- `specbridge_ai_primary_color.png`
- `specbridge_ai_primary_navy.png`
- `specbridge_ai_wordmark_color.png`
- `specbridge_ai_primary_white.png`
- `specbridge_ai_vertical_color.png`
- `specbridge_ai_icon_color.png`
- `SpecBridge_AI_Branding_and_Logo_Usage_Guide.pdf`
- `README.md`

## Runtime Asset Mapping

Website runtime assets are stored under:

- `assets/brand/`

Applied mapping:

| Use case | Runtime asset |
|---|---|
| Website header / light surface | `specbridge_ai_primary_color.png` |
| Footer / dark surface | `specbridge_ai_primary_white.png` |
| Favicon / app icon / manifest icon | `specbridge_ai_icon_color.png` |
| Alternate navy lockup | `specbridge_ai_primary_navy.png` |
| Wordmark-only use | `specbridge_ai_wordmark_color.png` |
| Vertical or square placements | `specbridge_ai_vertical_color.png` |

## Documentation Asset Storage

Brand usage guide and branding README are stored under:

- `docs/branding/SpecBridge_AI_Branding_and_Logo_Usage_Guide.pdf`
- `docs/branding/SpecBridge_AI_Branding_README.md`

## Website Updates

Updated:

- `.gitignore`
- `index.html`
- `assets/styles.css`
- `assets/brand/site.webmanifest`

Added:

- `assets/brand/specbridge_ai_primary_color.png`
- `assets/brand/specbridge_ai_primary_navy.png`
- `assets/brand/specbridge_ai_wordmark_color.png`
- `assets/brand/specbridge_ai_primary_white.png`
- `assets/brand/specbridge_ai_vertical_color.png`
- `assets/brand/specbridge_ai_icon_color.png`
- `docs/branding/SpecBridge_AI_Branding_and_Logo_Usage_Guide.pdf`
- `docs/branding/SpecBridge_AI_Branding_README.md`

The previous generated SVG references are no longer used from `index.html`.

Existing legacy SVG files are not deleted in this patch to avoid destructive cleanup during brand migration.

## Brand Governance

Applied principles:

- primary color logo on light website surfaces
- white logo on dark/footer surfaces
- icon-only asset for favicon/app/manifest use
- approved flat brand colors only
- no new gradient, shadow, 3D or unsupported color treatment introduced
- no external font, tracking, script or build pipeline added

## Validation Evidence

Completed validation markers:

- `R-LAUNCH.7-C_CONTINUE_APPROVED_BRAND_ASSET_PATCH_OK`
- `R-LAUNCH.7-C_LOCAL_STATIC_VALIDATION_OK`
- `R-LAUNCH.7-C_LOCAL_BROWSER_VISUAL_SMOKE_OK`
- `R-LAUNCH.7-C_LOCAL_BROWSER_DOM_AND_LANGUAGE_BEHAVIOR_SMOKE_OK`

## Local Static Validation

Validated:

- required files present
- approved PNG assets have valid PNG signatures
- text files are UTF-8 without BOM
- old generated SVG references are absent from `index.html`
- approved PNG references are present in `index.html`
- Open Graph and manifest surfaces remain present
- CSS approved brand tokens and logo sizing rules are present
- `assets/i18n.js` passes `node --check`
- local static server returns HTTP 200 for home, CSS, JS, manifest, approved PNG assets and legal pages
- controlled pilot / not-production-SaaS governance wording remains present

## Local Browser Visual Smoke

Validated screenshot cases:

- desktop home approved brand
- tablet home approved brand
- mobile home approved brand
- desktop privacy approved brand
- mobile KVKK approved brand

Screenshots were written only to `%TEMP%`.

## Local Browser DOM and Language Behavior Smoke

Validated through Chrome DevTools Protocol against local static server:

- document ready state complete
- page title includes `SpecBridge`
- favicon uses `specbridge_ai_icon_color.png`
- apple touch icon uses `specbridge_ai_icon_color.png`
- Open Graph image uses `specbridge_ai_primary_color.png`
- approved logo images detected in DOM
- primary color header logo detected
- primary white footer logo detected
- old generated SVG references absent from DOM
- footer legal links detected

Language switch checks:

- `tr`: title populated, `htmlLang='tr'`, `dir='ltr'`
- `en`: title populated, `htmlLang='en'`, `dir='ltr'`
- `zh`: title populated, `htmlLang='zh-Hans'`, `dir='ltr'`
- `ru`: title populated, `htmlLang='ru'`, `dir='ltr'`
- `ar`: title populated, `htmlLang='ar'`, `dir='rtl'`

Chrome internal `PHONE_REGISTRATION_ERROR` messages were observed during headless execution but did not affect assertions or validation markers.

## Commit Boundary

The following must be committed:

- `.gitignore`
- `index.html`
- `assets/styles.css`
- `assets/brand/site.webmanifest`
- approved PNG assets under `assets/brand/`
- approved brand documentation under `docs/branding/`
- this readiness document

The following must not be committed:

- `_incoming/`

## Status

R-LAUNCH.7-C is ready for final diff review and commit.

No push is included in this step.
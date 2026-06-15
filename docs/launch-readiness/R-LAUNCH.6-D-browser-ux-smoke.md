# R-LAUNCH.6-D Browser UX Smoke / Language Switch Verification

Status: validation artifact added
Scope: live browser UX smoke for multilingual landing page
Repository: specbridge-launch-site
Branch: main
Baseline commit: 0c31a2ca352eb8c299907085b6bea0b72bfe4604

## Purpose

R-LAUNCH.6-D verifies that the live multilingual landing page behaves correctly at browser level.

## Covered checks

- Live https://specbridge.co/ render.
- Default Turkish landing.
- Query parameter language switching: ?lang=tr, ?lang=en, ?lang=zh, ?lang=ru, ?lang=ar.
- localStorage language persistence.
- Arabic rtl document direction.
- Language selector button labels and active state.
- Sample report anchor, ZIP package and HTML sample link behavior.
- Post-validation repository integrity.

## Validation command

Run from PowerShell:

Set-Location "C:\Dev\specbridge-launch-site"
$ErrorActionPreference = "Stop"
Clear-Host
node .\tools\live-browser-ux-smoke.cjs

## Expected final marker

R-LAUNCH.6-D_NODE_CDP_LIVE_BROWSER_UX_SMOKE_OK

## Manual validation evidence before artifact creation

Observed final marker:

R-LAUNCH.6-D_LIVE_BROWSER_UX_SMOKE_WITH_LIVE_I18N_OK

Observed successful checks:

- Default Turkish landing rendered correctly.
- ?lang=tr, ?lang=en, ?lang=zh, ?lang=ru and ?lang=ar rendered correctly.
- Arabic rendered with htmlDir=rtl.
- Russian persisted from localStorage when returning to the base URL.
- Sample anchor, ZIP package and HTML sample path returned HTTP 200.
- Working tree remained clean during validation.
- HEAD remained unchanged.

## Implementation note

The permanent smoke script reads expected language values from live assets/i18n.js. This avoids hard-coded translation drift in browser smoke validation.

The script does not modify website behavior, does not write production assets, does not require Playwright, and does not touch the main SpecBridge AI technical product repository.

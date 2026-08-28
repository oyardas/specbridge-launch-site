# KAYAS 3D EXPERIENCE DESIGN STANDARD — V1

**Status:** DESIGN LOCK / GOLDEN BASELINE  
**Standard ID:** KAYAS-3D-DS1  
**Baseline date:** 2026-08-28  
**Prepared / metadata author:** Önder Yardaş  
**Project brand:** KAYAS  
**Canonical public experience path:** `/kayas/3d/`  
**Canonical deployed file:** `/kayas/3d/experience.html`  
**Golden master SHA256:** `b5b69d67e8cf5aa2aaace34ed352d486561a8e1770dce28a112da0ed8f473bba`  
**Golden master size:** `22886353` bytes  

---

## 1. Purpose

This document locks the approved KAYAS multilingual 3D experience as the design standard for future revisions.

Future work must evolve this baseline. It must not restart from an older KAYAS HTML, an alternate theme, a generic dashboard template, a prior 206-cabinet prototype, or another experimental layout unless Önder Yardaş explicitly approves a new design baseline.

The approved HTML identified by the SHA256 above is the visual and interaction reference.

**Scope precedence:** For the KAYAS 3D experience, this Design Standard V1 and its machine-readable baseline supersede older 3D/prototype values where they conflict, including the earlier 206-cabinet visual baseline. This does not silently rewrite unrelated commercial or engineering documents; those remain subject to their own controlled revision process.

---

## 2. Core design character — LOCKED

The following visual character is mandatory:

- Premium dark data-center / investor interface.
- Deep navy / charcoal base.
- Restrained cyan interaction accent.
- Compact, high-information UI without visual clutter.
- Full-screen 3D canvas as the primary experience.
- Floating translucent panels with moderate blur and thin borders.
- Responsive desktop/mobile behavior.
- No visible build numbers, developer notes, local-preview labels, TTS diagnostics or internal QA text.
- No redesign into a light-theme portal, generic SaaS dashboard, marketing landing page or card-heavy portal without explicit approval.

### Approved color tokens

- Background: `#0b1219`
- Panel: `#101b25`
- Secondary panel: `#152431`
- Structural line: `#2d4050`
- Primary text: `#edf5fa`
- Muted text: `#9fb4c2`
- Accent: `#5ec7ff`
- Glass: `rgba(255,255,255,.07)`

### Typography

Primary stack:

`Inter, Segoe UI, Arial, sans-serif`

Do not replace the primary typography family globally without baseline approval.

---

## 3. Application composition — STRUCTURE LOCK

The application structure must remain recognizable and stable.

### Header / top bar

- Floating top bar.
- KAYAS brand at left.
- Main navigation in the center.
- TR / EN / 中文 language switch.
- Compact icon controls on the right.
- Build/version/debug information must never be visible to the customer.

### Primary 3D area

- Full-viewport interactive canvas remains the core visual.
- 3D must not be reduced to a decorative background behind a conventional website layout.

### Left scene panel

- Main scene / tour navigation remains on the left.
- Desktop nominal width: approximately 300 px.
- Contains current metrics, scene list, view controls and layer controls.
- The panel must support hide/unhide.
- Approved hide/unhide behavior:
  - edge handle `‹` hides,
  - `›` restores,
  - `Alt+M` toggles.
- A future revision may improve animation, accessibility or responsive behavior but must not remove the ability to fully hide and restore the panel.

### Right-side contextual UI

- Mini-map / top-plan context remains in the upper-right area where screen width permits.
- Selected-zone/context card remains in the right/lower context area where screen width permits.
- Scene visual preview may remain on the right when appropriate.
- On small screens these can collapse/hide according to responsive rules.

### Guided-tour card

- Guided/cinematic narrative remains a distinct overlay/card, not mixed into the scene list.
- Audio controls, progress and scene narration remain associated with the guided-tour experience.

### Full-screen overlays

The existing navigation architecture may open:

- Visual Gallery
- Reports & Presentations
- Investment Guide

These are overlays/sections of the same experience. Their styling must stay consistent with the base design system.

---

## 4. Responsive rules — LOCKED PRINCIPLE

Current responsive breakpoints form the reference:

- 1650 px
- 1380 px
- 1120 px
- 1050 px
- 760 px

Exact pixel values may be tuned to fix a real usability defect, but responsive behavior must retain:

- a usable top bar,
- accessible language controls,
- usable scene selection,
- no horizontal page overflow,
- no obstruction of the primary 3D view,
- touch-compatible controls on mobile.

Any change to the overall responsive composition requires an explicit change note.

---

## 5. Multilingual experience — LOCKED

Supported languages:

- Turkish — `tr`
- English — `en`
- Simplified Chinese — `zh`

Language switching applies to customer-facing UI and guided narration.

Do not remove a supported language without explicit approval.

---

## 6. Audio and tour behavior — LOCKED

Approved professional narration baseline:

- 14 Turkish scenes
- 14 English scenes
- 14 Chinese scenes
- 42 embedded native-language audio clips total

Approved voices used for the current production build:

- TR: `tr-TR-EmelNeural`
- EN: `en-US-JennyNeural`
- ZH: `zh-CN-XiaoxiaoNeural`

The final viewer must not require:

- Python,
- edge-tts,
- an API key,
- an OS-specific Turkish voice pack,
- separate MP3 distribution.

Tour/camera duration must remain synchronized to the effective professional audio duration.

Browser `speechSynthesis` may remain only as an internal technical fallback. Browser voice selectors and technical diagnostic text must not be customer-visible.

---

## 7. Current KAYAS 3D content baseline

Current approved Phase-1 3D narrative baseline:

- 200 IT cabinets total.
- 190 standard cabinets.
- 10 AI cabinets.
- Current visual geometry: 10 IC8000 pods.
- AI cabinet final pod/row allocation remains subject to detailed design unless explicitly approved later.
- Do not reintroduce the superseded 206-cabinet / 196+10 baseline into this 3D experience.
- Do not reintroduce six groundwater-related system/CDU cabinets as part of the active 200 IT-cabinet baseline.
- Groundwater must not be portrayed as the currently approved liquid-cooling operating method unless a later explicit project decision changes this.

---

## 8. Information and branding rules

- Global project spelling: `KAYAS`.
- Location: Kahramanmaraş / Türkoğlu / Ceceli, Kayas Ambalaj.
- Never show the project as Ankara.
- H3C branding must not be overused on generic architecture.
- H3C red transparent logo is appropriate on light/open backgrounds.
- White H3C logo is appropriate on dark equipment/backgrounds where required.
- SpecBridge AI is positioned only as the digital presentation / production partner.
- H3C `Secret/机密` material must not be exposed in the customer experience.

---

## 9. Allowed changes without redefining the design baseline

The following are normal controlled revisions if the general structure is preserved:

- Correcting project data.
- Revising scene text and narration.
- Replacing or improving images.
- Updating room/zone descriptions.
- Correcting 3D geometry against an approved source.
- Adding validated equipment.
- Improving performance.
- Fixing browser compatibility.
- Improving accessibility.
- Improving mobile behavior.
- Minor spacing, sizing and legibility adjustments.
- Improving panel hide/unhide behavior.
- Adding new report/document links.
- Updating language translations.
- Updating audio assets while preserving the professional multilingual audio architecture.

---

## 10. Changes requiring explicit DESIGN BASELINE approval

Do not perform these silently:

- Changing the dark premium theme.
- Replacing the overall color system.
- Moving the primary navigation to a fundamentally different structure.
- Removing the left scene panel.
- Converting the 3D experience into a conventional landing page.
- Replacing the full-screen canvas composition.
- Removing multilingual support.
- Removing professional embedded narration.
- Replacing the general panel/card geometry with a different UI system.
- Changing global typography.
- Reworking desktop/mobile composition from scratch.
- Reintroducing an older KAYAS layout.
- Changing the approved cabinet baseline from 200 without a new authoritative project decision.

---

## 11. Change-control workflow

Every future change must follow this order:

1. Start from the current canonical master, never from an older prototype.
2. State the requested change.
3. Classify it as DATA / CONTENT / GEOMETRY / AUDIO / UI-MINOR / PERFORMANCE / DESIGN-BASELINE.
4. Confirm whether the design standard is affected.
5. Implement only the requested scope.
6. Validate page load, TR/EN/ZH, professional audio, guided-tour sync, left panel hide/unhide, Alt+M, navigation, fullscreen, desktop/mobile layout and absence of developer/debug/version text.
7. Record the revision in Git history and the release manifest.
8. Promote to the stable deployed filename only after validation.

---

## 12. File and repository convention

### Design standard

`kayas/_master/KAYAS_3D_EXPERIENCE_STANDARD_V1.md`

This document is the human-readable design lock.

### Machine-readable baseline

`kayas/_master/KAYAS_3D_EXPERIENCE_BASELINE_V1.json`

This stores the approved hash, paths, baseline identifiers and validation rules.

### Live deployed experience

`kayas/3d/experience.html`

This filename remains stable. Do not put visible revision numbers in the live filename or customer UI.

### Entry point

`kayas/3d/index.html`

This remains the stable entry/loader for the 3D experience.

### Historical versions

Use Git commits/tags/branches rather than proliferating public versioned HTML filenames.

Recommended internal release ID:

`KAYAS-3D-DS1-R###`

Initial release:

`KAYAS-3D-DS1-R001`

---

## 13. Golden-baseline rule

The HTML with SHA256:

`b5b69d67e8cf5aa2aaace34ed352d486561a8e1770dce28a112da0ed8f473bba`

is the initial golden reference for Design Standard V1.

If a later validated revision becomes the new canonical implementation while preserving Design Standard V1, update only the machine-readable baseline revision/hash and Git history. Do not rewrite the design principles unless the user explicitly changes the standard.

If the overall design itself is intentionally changed, create:

`KAYAS_3D_EXPERIENCE_STANDARD_V2.md`

Do not silently redefine V1.

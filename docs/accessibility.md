# Accessibility — WCAG 2.1 AA (Issue #98)

Phase 5 gate. Backend repository can enforce only the machine-checkable
portions of WCAG. The human review (contrast, keyboard flow, screen
reader narration) is a HITL activity owned by the FE team and the
accessibility consultant. This document captures the CI plumbing.

## Machine-enforced items in CI

- **Label extraction completeness (#35):** every interactive element
  in the frontend source tree must reference a label key that exists
  in the catalogue. `localisation.catalogue.scan_source_for_labels`
  produces the keyset; `tools/check_labels.py` (to be authored on the
  FE side) diffs against the catalogue.
- **RTL direction attribute:** when the active locale is `ar-AE`, the
  HTML root must render `dir="rtl"`. See `localisation.locales.direction`.
- **Focus trap + tab order:** every dialog must include a focus trap;
  the FE lint rule `a11y/focus-trap` catches violations.

## HITL items

- Colour contrast audit.
- Screen reader compatibility (NVDA + VoiceOver).
- Keyboard-only navigation of the demand + execution half.

## Merge-blocking CI check

```yaml
- name: Accessibility lint
  run: |
    npm run lint:a11y       # ESLint + jsx-a11y rules
    python tools/check_labels.py --strict
```

The merge gate exists once the FE lint config lands; backend tests in
this repo cover the label catalogue integrity and RTL metadata today
(issue #35 localisation readiness).

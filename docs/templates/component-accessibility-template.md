# Component Accessibility Contract Template

Use this template when writing or updating the accessibility section of any component documentation page. Keep statements accurate to the current implementation and tests.

## Pattern
Describe the widget pattern (for example: dialog, accordion, combobox, tabs, menu, grid, tooltip, or disclosure) and cite the adopted WAI-ARIA APG pattern URL. If implementation intentionally deviates from APG guidance, document each deviation and the reason.

### Semantics
List the rendered semantic structure and accessibility contract, including roles, states, properties, and ID-based relationships. Document required relationships such as `aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-activedescendant`, and ownership/grouping semantics where applicable. Reference SSR-safe RizzyUI primitives and any `rz:` event contracts involved in semantic state changes.

### Keyboard Interaction
Document every supported key and modified key combination with exact behavior, scope, and edge cases. Include default browser behavior that is preserved, behavior that is prevented, and exceptions for nested controls or text-editing contexts.

### Focus Management
Document focus lifecycle behavior: initial focus target, roving focus strategy (if used), trap behavior (if used), inert/outside region handling, and where focus is restored on close/dismiss/navigation. Identify how focus behaves during dynamic state changes and after enhanced navigation or partial updates.

### Screen-Reader Behaviour
Describe what assistive technologies should announce for initial render and user-driven state changes. Specify when announcements are intentionally suppressed to reduce noise, and explain how labels/descriptions are exposed.

### Live Announcements
If live regions are used, document trigger conditions, region role/attributes, and whether each announcement is `polite` or `assertive`. Explain deduping/debouncing rules and when announcements are intentionally skipped.

### Disabled/Readonly Behaviour
Document how disabled and readonly states are expressed semantically and behaviorally. Clarify keyboard and pointer behavior, tab-stop behavior, and whether child interactive content remains reachable.

### SSR/Enhanced Navigation Behaviour
Document SSR-first behavior and client enhancement details using Phase 1 primitives (Alpine/HTMX patterns) only. Include hydration-free initialization expectations, re-initialization after partial page updates, and any CSP-safe constraints.

### Known Assistive-Technology Quirks
List verified quirks by platform/AT/browser combination (for example NVDA + Firefox, VoiceOver + Safari). Include impact, temporary mitigation, and whether the issue is tracked.

### Accessibility Tests
Link to the specific tests that verify semantics, keyboard interaction, focus behavior, and announcement behavior. State what is covered by automated tests versus manual AT validation.

## Accuracy and Verification Reminder
Do not claim behavior that is not implemented and verified. If behavior is planned but not yet shipped, mark it as planned and out of current contract scope. Cross-check this section against AGENTS accessibility contract requirements and Phase 1 interaction primitives before publishing.

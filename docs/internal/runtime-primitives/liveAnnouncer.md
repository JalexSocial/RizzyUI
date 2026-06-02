## Summary

`liveAnnouncer.js` provides shared polite/assertive live-region announcement utilities for screen reader updates.

Use it for concise async status changes that are not already communicated via native semantics.

## API

```js
ensureLiveRegions(): { politeRegion: HTMLElement, assertiveRegion: HTMLElement }
announce(message: string, politeness?: 'polite' | 'assertive', options?): void
clearLiveRegions(): void
getAnnouncementHistory(): Array<{ message: string; politeness: string; tag?: string; timestamp: number }>
clearAnnouncementHistory(): void
destroyLiveAnnouncer(): void
```

## Examples

```js
import { announce } from './liveAnnouncer.js';

announce('5 results available', 'polite', { tag: 'combobox-results' });
announce('Dialog closed', 'assertive', { dedupe: true });
```

## Caveats

- Avoid noisy over-announcement. Prefer semantic markup first; announce only important state transitions.
- Polite queueing and dedupe are helpful defaults, but tune options per component behavior.
- Clear/destroy regions in integration tests to avoid cross-test state leakage.

## Related resources

- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [APG: Alerts Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)

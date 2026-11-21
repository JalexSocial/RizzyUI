// Code-behind for SheetFocus.razor (SF-074): moves focus into a sheet panel when it opens.

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** @type {import('rizzyui').AlpineCodeBehind} */
export default () => ({
  init() {
    this.observer = new MutationObserver((records) => {
      for (const record of records) {
        const panel = record.target;
        if (!(panel instanceof HTMLElement) || !panel.hasAttribute('data-rz-sheet-panel')) continue;
        if (panel.getAttribute('aria-hidden') !== 'false' || panel.contains(document.activeElement)) continue;
        // Wait for x-show to make the panel visible, then focus its first visible control.
        requestAnimationFrame(() => {
          if (panel.contains(document.activeElement)) return;
          const target = [...panel.querySelectorAll(FOCUSABLE)].find((el) => el.getClientRects().length > 0);
          (target ?? panel).focus();
        });
      }
    });
    this.observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-hidden'] });
  },

  destroy() {
    this.observer?.disconnect();
  },
});

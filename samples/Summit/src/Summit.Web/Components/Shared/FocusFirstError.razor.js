// @ts-check
// Code-behind for FocusFirstError.razor: focus the first invalid field of the enclosing form.

/** @type {import('rizzyui').AlpineCodeBehind<{}>} */
export default () => ({
  init() {
    const form = this.$el.closest('form');
    if (!form) return;
    // After the other components in the swapped form have started (comboboxes build their own control).
    this.$nextTick(() => {
      const invalid = form.querySelector('[aria-invalid="true"]');
      if (!(invalid instanceof HTMLElement)) return;
      // Some controls hide the native element (Tom Select, visually hidden checkboxes): focus the first
      // visible focusable element of the same field instead.
      const field = invalid.closest('[data-slot="field"]') ?? invalid.parentElement;
      const visible = invalid.checkVisibility() ? invalid
        : field?.querySelector('input:not([type=hidden]), select, textarea, button, [tabindex="0"]');
      (visible instanceof HTMLElement ? visible : invalid).focus();
    });
  },
});

// Code-behind for CheckInForm.razor: puts focus in the badge input when the form appears (page load,
// or the empty form after a check-in), unless a validation error is shown (FocusFirstError handles
// that). SF-064: the input cannot take autofocus.

/** @type {import('rizzyui').AlpineCodeBehind} */
export default () => ({
  init() {
    if (this.$el.querySelector('[aria-invalid="true"]')) return;
    this.$nextTick(() => this.$el.querySelector('[data-otp-input]')?.focus());
  },
});

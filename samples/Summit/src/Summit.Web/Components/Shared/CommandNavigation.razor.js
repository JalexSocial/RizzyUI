// @ts-check
// Code-behind for CommandNavigation.razor: a command item whose value is a path navigates there.

/** @type {import('rizzyui').AlpineCodeBehind<{}>} */
export default () => ({
  init() {
    this.onExecute = (/** @type {CustomEvent} */ event) => {
      const value = event.detail?.value;
      if (typeof value !== 'string' || !value.startsWith('/')) return;

      // Close the palette's dialog, then navigate like a boosted link.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      window.htmx.ajax('GET', value, { target: 'body', swap: 'innerHTML', push: 'true' });
    };
    // Command palettes live in teleported dialogs, outside this element: listen on the document.
    document.addEventListener('rz:command:execute', this.onExecute);
  },

  destroy() {
    document.removeEventListener('rz:command:execute', this.onExecute);
  },
});

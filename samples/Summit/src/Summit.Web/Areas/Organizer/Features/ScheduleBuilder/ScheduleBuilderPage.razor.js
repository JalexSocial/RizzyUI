// Code-behind for ScheduleBuilderPage.razor: applies the View menu's options to the page.
//
// SF-067: RzMenubar's checkbox and radio items toggle their own aria-checked in a click handler and
// dispatch nothing. A delegated click listener reads their state after that handler has run (a
// microtask later) and copies it to data attributes on the root, which the list's classes use. The
// menu content is teleported to <body>, so the listener is on the document.

/** @type {import('rizzyui').AlpineCodeBehind} */
export default () => ({
  init() {
    this.onClick = (event) => {
      const item = event.target.closest?.('[data-view-option], [data-view-density]');
      if (!item) return;
      queueMicrotask(() => {
        if (item.dataset.viewOption === 'drafts-only')
          this.$root.dataset.draftsOnly = item.getAttribute('aria-checked') === 'true' ? 'true' : 'false';
        if (item.dataset.viewDensity && item.getAttribute('aria-checked') === 'true')
          this.$root.dataset.density = item.dataset.viewDensity;
      });
    };
    document.addEventListener('click', this.onClick);
  },

  destroy() {
    document.removeEventListener('click', this.onClick);
  },
});

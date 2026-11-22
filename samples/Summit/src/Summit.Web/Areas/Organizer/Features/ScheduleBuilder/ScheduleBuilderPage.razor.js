// Code-behind for ScheduleBuilderPage.razor: applies the View menu's options to the page, through the
// menubar's rz:menubar:checked-change event (dispatched on the menubar too, although the menu content
// is teleported to <body>). The list's classes read the data attributes on the root.

/** @type {import('rizzyui').AlpineCodeBehind} */
export default () => ({
  init() {
    this.onChange = (/** @type {CustomEvent<{ type: string, value: string, checked: boolean, group: string | null }>} */ event) => {
      const { value, checked, group } = event.detail;
      if (value === 'drafts-only') this.$root.dataset.draftsOnly = checked ? 'true' : 'false';
      if (group === 'density' && checked) this.$root.dataset.density = value;
    };
    this.$root.addEventListener('rz:menubar:checked-change', this.onChange);
  },

  destroy() {
    this.$root.removeEventListener('rz:menubar:checked-change', this.onChange);
  },
});

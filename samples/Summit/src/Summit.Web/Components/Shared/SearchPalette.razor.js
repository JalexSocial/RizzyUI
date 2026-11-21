// @ts-check
// Code-behind for SearchPalette.razor.
//
// Works around summit-findings.md SF-040: RzCommand renders data-template-id before its
// CommandItemTemplate child has set it, so the attribute is always missing and items from ItemsUrl are
// never rendered ("No data template found"). The template's id is predictable
// ({command id}-data-item-template), so set the attribute before the command initializes. The command
// lives in the dialog's teleport <template>, so patch the template's content, which Alpine clones
// when the dialog opens.

/** @type {import('rizzyui').AlpineCodeBehind<{ CommandId: string }>} */
export default () => ({
  init() {
    const id = this.$props.CommandId;
    const fix = (/** @type {ParentNode} */ root) => {
      const command = root.querySelector(`[data-slot="command"]#${CSS.escape(id)}`);
      if (command instanceof HTMLElement && !command.dataset.templateId) command.dataset.templateId = `${id}-data-item-template`;
    };
    fix(this.$el);
    for (const template of this.$el.querySelectorAll('template')) fix(template.content);
  },
});

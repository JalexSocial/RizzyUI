// @ts-check
// Code-behind for TicketEstimate.razor: estimated total from the checked ticket, quantity and add-ons.

/** @type {import('rizzyui').AlpineCodeBehind<{ Culture: string }>} */
export default () => ({
  formatted: '',

  init() {
    this.money = new Intl.NumberFormat(this.$props.Culture, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    this.recalculate();
  },

  recalculate() {
    const root = this.$el;
    /** @param {Element | null | undefined} el */
    const price = el => Number(el?.querySelector('[data-price]')?.getAttribute('data-price') ?? 0);

    const ticket = root.querySelector('input[type=radio]:checked')?.closest('label');
    const quantityInput = /** @type {HTMLInputElement | null} */ (root.querySelector('[data-quantity]'));
    const quantity = Math.min(5, Math.max(1, Number(quantityInput?.value) || 1));

    let total = price(ticket) * quantity;
    for (const box of root.querySelectorAll('input[type=checkbox]:checked')) {
      const option = box.closest('label')?.querySelector('[data-price]');
      if (!option) continue;
      const amount = Number(option.getAttribute('data-price'));
      total += option.getAttribute('data-per-ticket') === 'true' ? amount * quantity : amount;
    }

    this.formatted = this.money.format(total);
  },
});

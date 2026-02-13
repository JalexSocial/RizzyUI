import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function (Alpine, $data) {
  Alpine.data('rzNavigationMenu', () => ({
    activeItemId : null,
    open         : false,
    closeTimeout : null,
    prevIndex    : null,
    list         : null,
    isClosing    : false,

    /* ---------- helpers ---------- */
    _triggerIndex(id) {
      if (!this.list) return -1;
      const triggers = Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]'));
      return triggers.findIndex(t => t.getAttribute('x-ref') === `trigger_${id}`);
    },
    _contentEl(id)   { return document.getElementById(`${id}-content`); },

    /* ---------- lifecycle ---------- */
    init() {
      // Hide all content panels immediately on initialization to prevent them
      // from being visible by default. this.$el is available synchronously.
      const contentEls = this.$el.querySelectorAll('[data-popover]');
      contentEls.forEach(el => {
        el.style.display = 'none';
      });

      // Defer ref assignment until the DOM is fully patched by Alpine.
      this.$nextTick(() => {
        this.list = this.$refs.list;
      });
    },

    /* ---------- event handlers (from events with no params) ---------- */
    toggleActive(e) {
      const id = e.currentTarget.getAttribute('x-ref').replace('trigger_', '');
      (this.activeItemId === id && this.open) ? this.closeMenu() : this.openMenu(id);
    },

    /**
     * Executes the `handleTriggerEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleTriggerEnter` when applicable.
     */
    handleTriggerEnter(e) {
      const id = e.currentTarget.getAttribute('x-ref').replace('trigger_', '');
      this.cancelClose();
      if (this.activeItemId !== id && !this.isClosing) {
        requestAnimationFrame(() => this.openMenu(id));
      }
    },

    /**
     * Executes the `handleItemEnter` operation.
     * @param {any} e Input value for this method.
     * @returns {any} Returns the result of `handleItemEnter` when applicable.
     */
    handleItemEnter(e) {
      const item = e.currentTarget;
      if (!item) return;

      this.cancelClose();

      const trigger = item.querySelector('[x-ref^="trigger_"]');
      if (trigger) {
        const id = trigger.getAttribute('x-ref').replace('trigger_', '');
        if (this.activeItemId !== id && !this.isClosing) {
          requestAnimationFrame(() => this.openMenu(id));
        }
      } else {
        if (this.open && !this.isClosing) {
          this.closeMenu();
        }
      }
    },

    /**
     * Executes the `handleContentEnter` operation.
     * @returns {any} Returns the result of `handleContentEnter` when applicable.
     */
    handleContentEnter() {
      this.cancelClose();
    },

    /**
     * Executes the `scheduleClose` operation.
     * @returns {any} Returns the result of `scheduleClose` when applicable.
     */
    scheduleClose() {
      if (this.isClosing || this.closeTimeout) return;
      this.closeTimeout = setTimeout(() => this.closeMenu(), 150);
    },

    /**
     * Executes the `cancelClose` operation.
     * @returns {any} Returns the result of `cancelClose` when applicable.
     */
    cancelClose() {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      this.isClosing = false;
    },

    /* ---------- open / close logic with direct DOM manipulation ---------- */
    openMenu(id) {
      this.cancelClose();
      this.isClosing = false;

      const newIdx = this._triggerIndex(id);
      const dir = newIdx > (this.prevIndex ?? newIdx) ? 'end' : 'start';
      const isFirstOpen = this.prevIndex === null;

      // --- Handle outgoing content ---
      if (this.open && this.activeItemId && this.activeItemId !== id) {
        const oldTrig = this.$refs[`trigger_${this.activeItemId}`];
        if (oldTrig) delete oldTrig.dataset.state;

        const oldEl = this._contentEl(this.activeItemId);
        if (oldEl) {
          const outgoingDirection = dir === 'end' ? 'start' : 'end';
          oldEl.setAttribute('data-motion', `to-${outgoingDirection}`);
          setTimeout(() => {
            oldEl.style.display = 'none';
          }, 150); // Match animation duration
        }
      }

      // --- Handle incoming content ---
      this.activeItemId = id;
      this.open = true;
      this.prevIndex = newIdx;

      const newTrig = this.$refs[`trigger_${id}`];
      const newContentEl = this._contentEl(id);

      if (!newTrig || !newContentEl) return;

      // Position first
      computePosition(newTrig, newContentEl, {
        placement: 'bottom-start',
        middleware: [offset(6), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        Object.assign(newContentEl.style, { left: `${x}px`, top: `${y}px` });
      });

      // Then make visible and animate
      newContentEl.style.display = 'block';
      if (isFirstOpen) {
        newContentEl.setAttribute('data-motion', 'fade-in');
      } else {
        newContentEl.setAttribute('data-motion', `from-${dir}`);
      }

      this.$nextTick(() => {
        // Trigger state
        newTrig.setAttribute('aria-expanded', 'true');
        newTrig.dataset.state = 'open';
      });
    },

    /**
     * Executes the `closeMenu` operation.
     * @returns {any} Returns the result of `closeMenu` when applicable.
     */
    closeMenu() {
      if (!this.open || this.isClosing) return;

      this.isClosing = true;
      this.cancelClose();

      const activeId = this.activeItemId;
      if (!activeId) {
        this.isClosing = false;
        return;
      }

      const trig = this.$refs[`trigger_${activeId}`];
      if (trig) {
        trig.setAttribute('aria-expanded', 'false');
        delete trig.dataset.state;
      }

      const contentEl = this._contentEl(activeId);
      if (contentEl) {
        contentEl.setAttribute('data-motion', 'fade-out');
        setTimeout(() => {
          contentEl.style.display = 'none';
        }, 150); // Match animation duration
      }

      this.open = false;
      this.activeItemId = null;
      this.prevIndex = null;

      // Use timeout to prevent re-opening immediately on mouse-out -> mouse-in
      setTimeout(() => {
        this.isClosing = false;
      }, 150);
    },
  }));
}

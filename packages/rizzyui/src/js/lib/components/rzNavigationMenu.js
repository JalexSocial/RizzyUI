import { computePosition, offset, flip, shift } from '@floating-ui/dom';
import { focusFirst } from '../../runtime/a11y/focusable.js';

export default function rzNavigationMenu() {
    return {
    activeItemId : null,
    open         : false,
    closeTimeout : null,
    prevIndex    : null,
    list         : null,
    isClosing    : false,

    /* ---------- helpers ---------- */
    _topLevelItems() {
      if (!this.list) return [];
      return Array.from(this.list.querySelectorAll('[data-slot="navigation-menu-item"]'))
        .filter(item => item.parentElement === this.list);
    },

    _contentForItem(item) {
      if (!item) return null;
      return Array.from(item.children ?? [])
        .find(child => child.getAttribute?.('data-slot') === 'navigation-menu-content') ?? null;
    },

    _topLevelControlForItem(item) {
      const content = this._contentForItem(item);
      const candidates = Array.from(item.querySelectorAll('[data-slot="navigation-menu-trigger"], [data-slot="navigation-menu-link"]'));
      return candidates.find(candidate => !content?.contains(candidate)) ?? null;
    },

    _topLevelControls() {
      return this._topLevelItems()
        .map(item => this._topLevelControlForItem(item))
        .filter(Boolean);
    },

    _triggerIndex(id) {
      const content = this._contentEl(id);
      if (!content) return -1;
      const control = this._topLevelControlForItem(content.closest('[data-slot="navigation-menu-item"]'));
      return this._topLevelControls().findIndex(item => item === control);
    },

    _controlEl(id) {
      return this.$refs[`trigger_${id}`] ?? this._topLevelControlForItem(this._contentEl(id)?.closest('[data-slot="navigation-menu-item"]'));
    },

    _contentEl(id)   { return document.getElementById(`${id}-content`); },

    _isEditableTarget(target) {
      if (!target || target.nodeType !== 1) return false;
      const tagName = target.tagName?.toLowerCase();
      return target.isContentEditable || ['input', 'select', 'textarea'].includes(tagName);
    },

    _contextFromTarget(target) {
      if (!target || !this.list || this._isEditableTarget(target)) return null;
      if (target.closest?.('[data-slot="navigation-menu-content"]')) return null;

      const control = target.closest?.('[data-slot="navigation-menu-trigger"], [data-slot="navigation-menu-link"]');
      if (!control || !this.list.contains(control)) return null;

      const items = this._topLevelItems();
      const item = items.find(candidate => candidate.contains(control));
      if (!item) return null;

      const content = this._contentForItem(item);
      if (content?.contains(control)) return null;

      const controls = this._topLevelControls();
      const index = controls.findIndex(candidate => candidate === control);
      if (index < 0) return null;

      return { control, item, content, controls, index };
    },

    _focusContent(content) {
      if (!content) return;
      const focused = focusFirst(content);
      if (focused) return;

      if (!content.hasAttribute('tabindex')) {
        content.setAttribute('tabindex', '-1');
      }
      content.focus?.();
    },

    /* ---------- lifecycle ---------- */
    init() {
      // Hide all content panels immediately on initialization to prevent them
      // from being visible by default. this.$el is available synchronously.
      const contentEls = this.$el.querySelectorAll('[data-popover]');
      contentEls.forEach(el => {
        el.style.display = 'none';
      });

      // Defer ref assignment until the DOM is fully patched by window.Alpine.
      this.$nextTick(() => {
        this.list = this.$refs.list;
      });
    },

    /* ---------- event handlers (from events with no params) ---------- */
    toggleActive(e) {
      const id = e.currentTarget.getAttribute('x-ref').replace('trigger_', '');
      (this.activeItemId === id && this.open) ? this.closeMenu() : this.openMenu(id);
    },

    handleKeydown(e) {
      if (!e || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowDown')) return;

      const target = e.target ?? document.activeElement;
      const context = this._contextFromTarget(target);
      if (!context) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        const nextIndex = (context.index + direction + context.controls.length) % context.controls.length;
        context.controls[nextIndex]?.focus?.();
        return;
      }

      if (!context.content) return;

      const id = context.content.getAttribute('data-item-id');
      if (!id) return;

      e.preventDefault();
      this.openMenu(id);
      this.$nextTick(() => {
        requestAnimationFrame(() => this._focusContent(context.content));
      });
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
        if (oldTrig) {
          oldTrig.setAttribute('aria-expanded', 'false');
          oldTrig.dataset.state = 'closed';
        }

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
      const newControl = this._controlEl(id);
      const newContentEl = this._contentEl(id);

      if (!newControl || !newContentEl) return;

      // Position first
      computePosition(newControl, newContentEl, {
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
        if (newTrig) {
          newTrig.setAttribute('aria-expanded', 'true');
          newTrig.dataset.state = 'open';
        }
      });
    },

    /**
     * Executes the `closeMenu` operation.
     * @returns {any} Returns the result of `closeMenu` when applicable.
     */
    closeMenu(e = null) {
      if (!this.open || this.isClosing) return;

      this.isClosing = true;
      this.cancelClose();

      const activeId = this.activeItemId;

      const shouldRestoreFocus = !!(e && e.type === 'keydown' && e.key === 'Escape');
      if (!activeId) {
        this.isClosing = false;
        return;
      }

      const trig = this.$refs[`trigger_${activeId}`];
      if (trig) {
        trig.setAttribute('aria-expanded', 'false');
        trig.dataset.state = 'closed';
      }

      const contentEl = this._contentEl(activeId);
      if (contentEl) {
        contentEl.setAttribute('data-motion', 'fade-out');
        setTimeout(() => {
          contentEl.style.display = 'none';
        }, 150); // Match animation duration
      }

      if (shouldRestoreFocus && trig && document.activeElement && contentEl && contentEl.contains(document.activeElement)) {
        trig.focus();
      }

      this.open = false;
      this.activeItemId = null;
      this.prevIndex = null;

      // Use timeout to prevent re-opening immediately on mouse-out -> mouse-in
      setTimeout(() => {
        this.isClosing = false;
      }, 150);
    },
  };
}

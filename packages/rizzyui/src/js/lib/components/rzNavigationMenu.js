// packages/rizzyui/src/js/lib/components/rzNavigationMenu.js
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function (Alpine, $data) {
  Alpine.data('rzNavigationMenu', () => ({
    /* ---------------- state ---------------- */
    activeItemId  : null,
    open          : false,
    closeTimeout  : null,
    closeDelay    : 150,
    prevIndex     : null,
    lastDirection : null,
    rafId         : null,
    list          : null,
    viewport      : null,
    indicator     : null,

    /* ---------------- helpers ---------------- */
    _triggerIndex(id) {
      if (!this.list) return -1;
      const triggers = Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]'));
      return triggers.findIndex(t => t.id.replace('-trigger', '') === id);
    },

    _getContentEl(id) {
      /* Works even when the panel is tele-ported away from the root */
      return document.getElementById(`${id}-content`);
    },

    _measureSize(el) {
      if (!el) return { w: 0, h: 0 };
      /* try getBoundingClientRect first – works even when parent width is 0 */
      let { width: w, height: h } = el.getBoundingClientRect();
      if (!w || !h) {
        /* fall back to scroll dims */
        w = el.scrollWidth;
        h = el.scrollHeight;
      }
      return { w, h };
    },

    _resizeAndPosition(panelEl, attempt = 0) {
      /* Stop after a few frames to avoid an infinite loop in a pathological case */
      if (attempt > 4 || !this.open || !this.viewport) return;

      const { w, h } = this._measureSize(panelEl);
      if (w && h) {
        /* ---- 1.  Resize viewport ---- */
        this.viewport.style.width  = `${w}px`;
        this.viewport.style.height = `${h}px`;

        /* ---- 2.  Position it under the trigger list ---- */
        if (this.list) {
          computePosition(this.list, this.viewport, {
            placement : 'bottom',
            middleware: [
              offset(parseInt(this.$el.dataset.viewportOffset) || 0),
              flip(),
              shift({ padding: 8 }),
            ],
          }).then(({ y }) => {
            if (!this.open) return;
            Object.assign(this.viewport.style, {
              left      : '50%',
              top       : `${y}px`,
              transform : 'translateX(-50%)',
            });
          });
        }
      } else {
        /* Panel is still reporting 0×0 – try again on the next frame */
        requestAnimationFrame(() => this._resizeAndPosition(panelEl, attempt + 1));
      }
    },

    _clearAnimations(el) {
      if (!el) return;
      el.classList.remove(
          'animate-in', 'fade-in', 'zoom-in-90', 'slide-in-from-left', 'slide-in-from-right',
          'animate-out', 'fade-out', 'zoom-out-95', 'slide-out-to-left', 'slide-out-to-right'
      );
    },

    _playEnter(dir) {
      if (!this.viewport) return;
      this._clearAnimations(this.viewport);
      this.viewport.classList.add('animate-in', 'fade-in');
      if (this.prevIndex === null) {
        this.viewport.classList.add('zoom-in-90');
      } else {
        this.viewport.classList.add(dir === 'right' ? 'slide-in-from-right' : 'slide-in-from-left');
      }
    },

    _playExit(dir) {
      if (!this.viewport || this.viewport.classList.contains('animate-out')) return;
      this._clearAnimations(this.viewport);
      this.viewport.classList.add('animate-out', 'fade-out');
      if (dir === 'zoom') {
        this.viewport.classList.add('zoom-out-95');
      } else {
        this.viewport.classList.add(dir === 'right' ? 'slide-out-to-left' : 'slide-out-to-right');
      }
      setTimeout(() => this._clearAnimations(this.viewport), 150);
    },

    /* ---------------- Alpine lifecycle ---------------- */
    init() {
      this.$nextTick(() => {
        this.list      = this.$refs.list;
        this.viewport  = this.$refs.viewport;
        this.indicator = this.$refs.indicator;
        this.indicator?.setAttribute('data-state', 'hidden');
      });
    },

    /* ---------------- public API ---------------- */
    toggleActive(e) {
      const id = e.currentTarget.id.replace('-trigger', '');
      (this.activeItemId === id && this.open) ? this.closeMenu()
          : this.openMenu(id);
    },

    handleTriggerEnter(e) {
      const id = e.currentTarget.id.replace('-trigger', '');
      this.clearCloseTimeout();
      if (this.activeItemId !== id) {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => this.openMenu(id));
      }
    },

    scheduleClose() { this.closeTimeout = setTimeout(() => this.closeMenu(), this.closeDelay); },
    cancelClose()   { this.clearCloseTimeout(); },
    clearCloseTimeout() {
      if (this.closeTimeout) { clearTimeout(this.closeTimeout); this.closeTimeout = null; }
    },

    /* ---------------- open / close ---------------- */
    openMenu(id) {
      this.clearCloseTimeout();

      const newIdx = this._triggerIndex(id);
      const oldIdx = this.prevIndex ?? newIdx;
      const dir    = newIdx > oldIdx ? 'right' : 'left';
      this.lastDirection = dir;

      /* play exit animation for the previous panel, if any */
      if (this.open && this.activeItemId) {
        const oldContentData = $data(`${this.activeItemId}-content`);
        if (oldContentData) oldContentData.visible = false;
        this._playExit(dir);
      }

      /* delay the actual switch when the menu is already open so the exit animation can finish */
      setTimeout(() => {
        if (!this.viewport) return;

        this.activeItemId = id;
        this.open         = true;
        this.prevIndex    = newIdx;

        const newContentData = $data(`${id}-content`);
        if (newContentData) newContentData.visible = true;

        this.$nextTick(() => {
          const trigger = this.$refs[`trigger_${id}`];
          if (!trigger) return;

          /* -------- indicator under the active trigger -------- */
          if (this.indicator) {
            this.indicator.setAttribute('data-state', 'visible');
            this.indicator.style.width = `${trigger.offsetWidth}px`;
            this.indicator.style.left  = `${trigger.offsetLeft}px`;
          }

          /* -------- viewport -------- */
          this.viewport.setAttribute('data-state', 'open');
          this.viewport.setAttribute('aria-hidden', 'false');
          this._playEnter(dir);

          const panelEl = (this._getContentEl(id) || {}).firstElementChild || this._getContentEl(id);
          if (panelEl) {
            /* start with min-sizes so we have something to animate from */
            const { w: initialW, h: initialH } = this._measureSize(panelEl);
            this.viewport.style.minWidth  = `${Math.max(this.viewport.offsetWidth,  initialW)}px`;
            this.viewport.style.minHeight = `${Math.max(this.viewport.offsetHeight, initialH)}px`;

            /* now grow / shrink once real dimensions are available */
            requestAnimationFrame(() => this._resizeAndPosition(panelEl));
          }

          trigger.setAttribute('aria-expanded', 'true');
          trigger.dataset.state = 'open';
        });
      }, this.open ? 150 : 0);
    },

    closeMenu() {
      if (!this.open) return;

      this._playExit('zoom');

      const currentTrigger = this.activeItemId && this.$refs[`trigger_${this.activeItemId}`];
      if (currentTrigger) {
        currentTrigger.setAttribute('aria-expanded', 'false');
        delete currentTrigger.dataset.state;
      }

      this.indicator?.setAttribute('data-state', 'hidden');

      setTimeout(() => {
        if (this.viewport) {
          this.viewport.setAttribute('data-state', 'closed');
          this.viewport.setAttribute('aria-hidden', 'true');
          this.viewport.style.minWidth  = '';
          this.viewport.style.minHeight = '';
        }
        if (this.activeItemId) {
          const contentData = $data(`${this.activeItemId}-content`);
          if (contentData) contentData.visible = false;
        }
        this.open           = false;
        this.activeItemId   = null;
        this.prevIndex      = null;
        this.lastDirection  = null;
      }, 150);
    },
  }));

  /* State holder for teleported panel elements */
  Alpine.data('rzNavigationMenuContent', () => ({ visible: false }));
}

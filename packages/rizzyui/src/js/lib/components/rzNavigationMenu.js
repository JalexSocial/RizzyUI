/* RzNavigationMenu – Radix-style behaviour, CSP-safe */
import { computePosition, offset, flip, shift } from '@floating-ui/dom';

export default function (Alpine, $data) {
  Alpine.data('rzNavigationMenu', () => ({
    activeItemId : null,
    open         : false,
    closeTimeout : null,
    prevIndex    : null,
    list         : null,
    viewport     : null,
    indicator    : null,

    /* ---------- helpers ---------- */
    _triggerIndex(id) {
      if (!this.list) return -1;
      const triggers = Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]'));
      return triggers.findIndex(t => t.id.replace('-trigger', '') === id);
    },
    _content(id)     { return document.getElementById(`${id}-content`); },
    _contentData(id) { return $data(`${id}-content`); },

    _positionViewport() {
      if (!this.list || !this.viewport) return;
      computePosition(this.list, this.viewport, {
        placement : 'bottom',
        middleware: [
          offset(parseInt(this.$el.dataset.viewportOffset) || 0),
          flip(),
          shift({ padding: 8 }),
        ],
      }).then(({ y }) => {
        Object.assign(this.viewport.style, {
          left      : '50%',
          top       : `${y}px`,
          transform : 'translateX(-50%)',
        });
      });
    },

    /* ---------- life-cycle ---------- */
    init() {
      this.$nextTick(() => {
        this.list      = this.$refs.list;
        this.viewport  = this.$refs.viewport;
        this.indicator = this.$refs.indicator;
      });
    },

    /* ---------- trigger handlers ---------- */
    toggleActive(e) {
      const id = e.currentTarget.id.replace('-trigger', '');
      (this.activeItemId === id && this.open) ? this.closeMenu() : this.openMenu(id);
    },
    handleTriggerEnter(e) {
      const id = e.currentTarget.id.replace('-trigger', '');
      this.clearCloseTimeout();
      if (this.activeItemId !== id) requestAnimationFrame(() => this.openMenu(id));
    },

    /* ---------- timers ---------- */
    scheduleClose() { this.closeTimeout = setTimeout(() => this.closeMenu(), 150); },
    clearCloseTimeout() {
      if (this.closeTimeout) { clearTimeout(this.closeTimeout); this.closeTimeout = null; }
    },

    /* ---------- open / close ---------- */
    openMenu(id) {
      this.clearCloseTimeout();

      const newIdx   = this._triggerIndex(id);
      const dir      = newIdx > (this.prevIndex ?? newIdx) ? 'end' : 'start';
      const firstPop = this.prevIndex === null;

      /* ① Clean up previous trigger & content -------------------------------- */
      if (this.open && this.activeItemId) {
        /* remove accent from previous trigger */
        const prevTrig = this.$refs[`trigger_${this.activeItemId}`];
        if (prevTrig) delete prevTrig.dataset.state;

        /* animate previous content out */
        const prevEl   = this._content(this.activeItemId);
        if (prevEl)    prevEl.setAttribute('data-motion', `to-${dir}`);
        const prevData = this._contentData(this.activeItemId);
        if (prevData)  prevData.visible = false;
      }

      /* ② Show new content ---------------------------------------------------- */
      this.activeItemId = id;
      this.open         = true;
      this.prevIndex    = newIdx;

      const cd = this._contentData(id);
      if (cd) cd.visible = true;

      this.$nextTick(() => {
        const trig = this.$refs[`trigger_${id}`];
        if (!trig || !this.viewport) return;

        /* indicator bar */
        if (this.indicator) {
          this.indicator.style.width = `${trig.offsetWidth}px`;
          this.indicator.style.left  = `${trig.offsetLeft}px`;
          this.indicator.setAttribute('data-state', 'visible');
        }

        /* viewport animation flags */
        this.viewport.setAttribute('data-state', 'open');
        this.viewport.setAttribute('data-motion', firstPop ? 'zoom-in' : 'none');

        /* new content motion flag (slide-in only when switching) */
        const newEl = this._content(id);
        if (newEl) {
          newEl.setAttribute(
              'data-motion',
              firstPop ? 'fade-in' : `from-${dir}`
          );
        }

        /* place viewport */
        this._positionViewport();

        /* accent on active trigger */
        trig.setAttribute('aria-expanded', 'true');
        trig.dataset.state = 'open';
      });
    },

    closeMenu() {
      if (!this.open) return;

      /* animate viewport zoom-out */
      if (this.viewport) {
        this.viewport.setAttribute('data-motion', 'zoom-out');
        this.viewport.setAttribute('data-state', 'closed');
      }

      /* remove accent from current trigger */
      const tr = this.activeItemId && this.$refs[`trigger_${this.activeItemId}`];
      if (tr) {
        tr.setAttribute('aria-expanded', 'false');
        delete tr.dataset.state;
      }
      this.indicator?.setAttribute('data-state', 'hidden');

      /* fade current content out */
      const curEl = this.activeItemId && this._content(this.activeItemId);
      if (curEl) curEl.setAttribute('data-motion', 'fade-out');

      setTimeout(() => {
        if (this.activeItemId) {
          const cd = this._contentData(this.activeItemId);
          if (cd) cd.visible = false;
        }
        this.open         = false;
        this.activeItemId = null;
        this.prevIndex    = null;
      }, 200); // tailwind-animate duration
    },
  }));

  /* Panels stay mounted; visibility toggled */
  Alpine.data('rzNavigationMenuContent', () => ({ visible: false }));
}

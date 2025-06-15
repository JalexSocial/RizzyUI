/* RzNavigationMenu – mirrors shadcn/ui, CSP-safe */
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
    _contentData(id) { return $data(`${id}-content`); },
    _contentEl(id)   { return document.getElementById(`${id}-content`); },

    _positionViewport() {
      if (!this.viewport || !this.activeItemId) return;
      
      // Use the active trigger as the reference element, not the list
      const activeTrigger = this.$refs[`trigger_${this.activeItemId}`];
      if (!activeTrigger) return;
      
      computePosition(activeTrigger, this.viewport, {
        placement: 'bottom-start',
        middleware: [
          offset(parseInt(this.$el.dataset.viewportOffset) || 0),
          flip(),
          shift({ padding: 8 }),
        ],
      }).then(({ x, y }) => {
        Object.assign(this.viewport.style, {
          left: `${x}px`,
          top: `${y}px`,
          transform: '',           // remove translate(-50%)
        });
      });
    },

    /* ---------- lifecycle ---------- */
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
      this.cancelClose();
      if (this.activeItemId !== id) requestAnimationFrame(() => this.openMenu(id));
    },

    /* ---------- timers ---------- */
    scheduleClose() { this.closeTimeout = setTimeout(() => this.closeMenu(), 150); },
    cancelClose()   { if (this.closeTimeout) { clearTimeout(this.closeTimeout); this.closeTimeout = null; } },

    /* ---------- open / close ---------- */
    openMenu(id) {
      this.cancelClose();

      const newIdx   = this._triggerIndex(id);
      const dir      = newIdx > (this.prevIndex ?? newIdx) ? 'end' : 'start';
      const firstPop = this.prevIndex === null;

      /* outgoing content ---------------------------------------------------- */
      if (this.open && this.activeItemId) {
        const oldTrig = this.$refs[`trigger_${this.activeItemId}`];
        if (oldTrig) delete oldTrig.dataset.state;

        const oldEl   = this._contentEl(this.activeItemId);
        if (oldEl)    oldEl.setAttribute('data-motion', `to-${dir}`);

        const oldData = this._contentData(this.activeItemId);
        if (oldData) {
          // Delay hiding old content to allow animation to complete
          setTimeout(() => {
            oldData.visible = false;
          }, 200); // Match duration with CSS animations (200ms)
        }
      }

      /* incoming content ---------------------------------------------------- */
      this.activeItemId = id;
      this.open         = true;
      this.prevIndex    = newIdx;

      const newData = this._contentData(id);
      if (newData) newData.visible = true;

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

        /* content motion */
        const newEl = this._contentEl(id);
        if (newEl) newEl.setAttribute(
            'data-motion',
            firstPop ? 'fade-in' : `from-${dir}`
        );

        /* place viewport */
        requestAnimationFrame(() => this._positionViewport());

        /* accent on active trigger */
        trig.setAttribute('aria-expanded', 'true');
        trig.dataset.state = 'open';
      });
    },

    closeMenu() {
      if (!this.open) return;

      if (this.viewport) {
        this.viewport.setAttribute('data-motion', 'zoom-out');
        this.viewport.setAttribute('data-state', 'closed');
      }

      const trig = this.activeItemId && this.$refs[`trigger_${this.activeItemId}`];
      if (trig) {
        trig.setAttribute('aria-expanded', 'false');
        delete trig.dataset.state;
      }
      this.indicator?.setAttribute('data-state', 'hidden');

      const curEl = this.activeItemId && this._contentEl(this.activeItemId);
      if (curEl) curEl.setAttribute('data-motion', 'fade-out');

      setTimeout(() => {
        if (this.activeItemId) {
          const cd = this._contentData(this.activeItemId);
          if (cd) cd.visible = false;
        }
        this.open         = false;
        this.activeItemId = null;
        this.prevIndex    = null;
      }, 200);
    },
  }));

  /* Panels stay mounted – we only toggle visibility */
  Alpine.data('rzNavigationMenuContent', () => ({ visible: false }));
}

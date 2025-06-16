export default function (Alpine, $data) {
  Alpine.data('rzNavigationMenu', () => ({
    activeItemId : null,
    open         : false,
    closeTimeout : null,
    prevIndex    : null,
    list         : null,
    viewport     : null,
    indicator    : null,
    isClosing    : false,

    /* ---------- helpers ---------- */
    _triggerIndex(id) {
      if (!this.list) return -1;
      const triggers = Array.from(this.list.querySelectorAll('[x-ref^="trigger_"]'));
      return triggers.findIndex(t => t.id.replace('-trigger', '') === id);
    },
    _contentData(id) { return $data(`${id}-content`); },
    _contentEl(id)   { return document.getElementById(`${id}-content`); },

    _setupViewport() {
      if (!this.viewport) return;
      this.viewport.style.overflow = 'visible';
    },

    _positionContentForTrigger(id) {
      const activeTrigger = this.$refs[`trigger_${id}`];
      const contentEl = this._contentEl(id);

      if (!activeTrigger || !contentEl || !this.list) return;

      // Calculate the offset of the trigger relative to the list
      const listRect = this.list.getBoundingClientRect();
      const triggerRect = activeTrigger.getBoundingClientRect();
      const offsetX = triggerRect.left - listRect.left;

      // Position content to align with its trigger (this is the base position)
      contentEl.style.transform = `translateX(${offsetX}px)`;
    },

    /* ---------- lifecycle ---------- */
    init() {
      this.$nextTick(() => {
        this.list      = this.$refs.list;
        this.viewport  = this.$refs.viewport;
        this.indicator = this.$refs.indicator;

        this._setupViewport();

        window.addEventListener('resize', () => {
          if (this.activeItemId) {
            this._positionContentForTrigger(this.activeItemId);
          }
        });
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
      if (this.activeItemId !== id && !this.isClosing) {
        requestAnimationFrame(() => this.openMenu(id));
      }
    },

    handleItemEnter(e) {
      const item = e.currentTarget.closest('[role="menuitem"], li');
      if (!item) return;

      const trigger = item.querySelector('[x-ref^="trigger_"]');

      this.cancelClose();

      if (trigger) {
        const id = trigger.id.replace('-trigger', '');
        if (this.activeItemId !== id && !this.isClosing) {
          requestAnimationFrame(() => this.openMenu(id));
        }
      } else {
        if (this.open && !this.isClosing) {
          this.scheduleClose();
        }
      }
    },

    /* ---------- timers ---------- */
    scheduleClose() {
      if (this.isClosing || this.closeTimeout) return;
      this.closeTimeout = setTimeout(() => this.closeMenu(), 150);
    },
    cancelClose() {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      this.isClosing = false;
    },

    /* ---------- open / close ---------- */
    openMenu(id) {
      this.cancelClose();
      this.isClosing = false;

      const newIdx = this._triggerIndex(id);
      const dir = newIdx > (this.prevIndex ?? newIdx) ? 'end' : 'start';
      const isFirstOpen = this.prevIndex === null;

      /* outgoing content ---------------------------------------------------- */
      if (this.open && this.activeItemId && this.activeItemId !== id) {
        const oldTrig = this.$refs[`trigger_${this.activeItemId}`];
        if (oldTrig) delete oldTrig.dataset.state;

        const oldEl = this._contentEl(this.activeItemId);
        const oldData = this._contentData(this.activeItemId);

        if (oldEl && oldData) {
          const outgoingDirection = dir === 'end' ? 'start' : 'end';
          oldEl.setAttribute('data-motion', `to-${outgoingDirection}`);

          setTimeout(() => {
            oldData.visible = false;
            oldEl.style.transform = '';
          }, 250);
        }
      }

      /* incoming content ---------------------------------------------------- */
      this.activeItemId = id;
      this.open = true;
      this.prevIndex = newIdx;

      const newData = this._contentData(id);
      if (newData) newData.visible = true;

      this.$nextTick(() => {
        const trig = this.$refs[`trigger_${id}`];
        if (!trig || !this.viewport) return;

        /* indicator positioning */
        if (this.indicator) {
          this.indicator.style.width = `${trig.offsetWidth}px`;
          this.indicator.style.left = `${trig.offsetLeft}px`;
          this.indicator.setAttribute('data-state', 'visible');
        }

        /* trigger state */
        trig.setAttribute('aria-expanded', 'true');
        trig.dataset.state = 'open';

        /* viewport state - just show/hide, no animations */
        this.viewport.setAttribute('data-state', 'open');

        const newEl = this._contentEl(id);
        if (!newEl) return;

        // Position content for its trigger first
        this._positionContentForTrigger(id);

        if (isFirstOpen) {
          // First open - content fades in
          newEl.setAttribute('data-motion', 'fade-in');
        } else {
          // Subsequent opens - content slides in from direction
          newEl.setAttribute('data-motion', `from-${dir}`);
        }
      });
    },

    closeMenu() {
      if (!this.open || this.isClosing) return;

      this.isClosing = true;
      this.cancelClose();

      /* viewport state - just hide, no animations */
      if (this.viewport) {
        this.viewport.setAttribute('data-state', 'closed');
      }

      const trig = this.activeItemId && this.$refs[`trigger_${this.activeItemId}`];
      if (trig) {
        trig.setAttribute('aria-expanded', 'false');
        delete trig.dataset.state;
      }

      if (this.indicator) {
        this.indicator.setAttribute('data-state', 'hidden');
      }

      /* content handles its own fade-out animation */
      const curEl = this.activeItemId && this._contentEl(this.activeItemId);
      if (curEl) {
        curEl.setAttribute('data-motion', 'fade-out');
      }

      setTimeout(() => {
        if (this.activeItemId) {
          const cd = this._contentData(this.activeItemId);
          if (cd) cd.visible = false;
        }

        if (curEl) {
          curEl.style.transform = '';
        }

        this.open = false;
        this.activeItemId = null;
        this.prevIndex = null;
        this.isClosing = false;
      }, 250);
    },
  }));

  Alpine.data('rzNavigationMenuContent', () => ({ visible: false }));
}
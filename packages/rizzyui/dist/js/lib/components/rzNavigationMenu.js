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

      const listRect = this.list.getBoundingClientRect();
      const triggerRect = activeTrigger.getBoundingClientRect();
      const offsetX = triggerRect.left - listRect.left;

      contentEl.style.transform = `translateX(${offsetX}px)`;
    },

    _showContentWithAnimation(id, motionType) {
      const contentData = this._contentData(id);
      const contentEl = this._contentEl(id);

      if (!contentData || !contentEl) return;

      // Make content visible immediately (needed for animations)
      contentData.visible = true;

      this.$nextTick(() => {
        // Position content
        this._positionContentForTrigger(id);

        // Start animation
        requestAnimationFrame(() => {
          contentEl.setAttribute('data-motion', motionType);
        });
      });
    },

    _hideContentWithAnimation(id, motionType) {
      const contentEl = this._contentEl(id);

      if (!contentEl) return;

      // Start fade-out animation but keep Alpine visible=true during animation
      contentEl.setAttribute('data-motion', motionType);

      // Only hide via Alpine AFTER animation completes
      setTimeout(() => {
        const contentData = this._contentData(id);
        if (contentData) contentData.visible = false;
        contentEl.style.transform = '';
      }, 250); // Give extra buffer for animation completion
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
      // DON'T reset isClosing here - let close animation complete
    },

    /* ---------- open / close ---------- */
    openMenu(id) {
      // If we're in the middle of closing, wait for it to finish
      if (this.isClosing) return;

      this.cancelClose();

      const newIdx = this._triggerIndex(id);
      const dir = newIdx > (this.prevIndex ?? newIdx) ? 'end' : 'start';
      const isFirstOpen = this.prevIndex === null;

      /* outgoing content ---------------------------------------------------- */
      if (this.open && this.activeItemId && this.activeItemId !== id) {
        const oldTrig = this.$refs[`trigger_${this.activeItemId}`];
        if (oldTrig) delete oldTrig.dataset.state;

        const outgoingDirection = dir === 'end' ? 'start' : 'end';
        this._hideContentWithAnimation(this.activeItemId, `to-${outgoingDirection}`);
      }

      /* incoming content ---------------------------------------------------- */
      this.activeItemId = id;
      this.open = true;
      this.prevIndex = newIdx;

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

      /* viewport state */
      this.viewport.setAttribute('data-state', 'open');

      /* show new content with animation */
      if (isFirstOpen) {
        this._showContentWithAnimation(id, 'fade-in');
      } else {
        this._showContentWithAnimation(id, `from-${dir}`);
      }
    },

    closeMenu() {
      if (!this.open || this.isClosing) return;

      this.isClosing = true;
      this.cancelClose();

      /* viewport state */
      if (this.viewport) {
        this.viewport.setAttribute('data-state', 'closed');
      }

      /* trigger cleanup */
      const trig = this.activeItemId && this.$refs[`trigger_${this.activeItemId}`];
      if (trig) {
        trig.setAttribute('aria-expanded', 'false');
        delete trig.dataset.state;
      }

      /* indicator hide */
      if (this.indicator) {
        this.indicator.setAttribute('data-state', 'hidden');
      }

      /* content fade-out */
      if (this.activeItemId) {
        this._hideContentWithAnimation(this.activeItemId, 'fade-out');
      }

      /* reset state after animation */
      setTimeout(() => {
        this.open = false;
        this.activeItemId = null;
        this.prevIndex = null;
        this.isClosing = false;
      }, 250);
    },
  }));

  Alpine.data('rzNavigationMenuContent', () => ({ visible: false }));
}
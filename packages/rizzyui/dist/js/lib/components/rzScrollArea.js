export default function registerRzScrollArea(Alpine) {
    Alpine.data('rzScrollArea', () => ({
        hideTimer: null,
        type: 'hover',
        orientation: 'vertical',
        scrollHideDelay: 600,
        _roViewport: null,
        _roContent: null,
        _dragAxis: null,
        _dragPointerOffset: 0,
        _viewport: null,

        /**
         * Executes the `init` operation.
         * @returns {any} Returns the result of `init` when applicable.
         */
        init() {
            this.type = this.$el.dataset.type || 'hover';
            this.orientation = this.$el.dataset.orientation || 'vertical';
            this.scrollHideDelay = Number(this.$el.dataset.scrollHideDelay || 600);

            const viewport = this.$refs.viewport;
            if (!viewport) return;
            this._viewport = viewport;

            this.onScroll = this.onScroll.bind(this);
            this.onPointerMove = this.onPointerMove.bind(this);
            this.onPointerUp = this.onPointerUp.bind(this);

            viewport.addEventListener('scroll', this.onScroll, { passive: true });

            const update = () => this.update();
            this._roViewport = new ResizeObserver(update);
            this._roContent = new ResizeObserver(update);
            this._roViewport.observe(viewport);
            if (this.$refs.content) this._roContent.observe(this.$refs.content);

            this.setState(this.type === 'always' ? 'visible' : 'hidden');
            this.update();

        },

        /**
         * Executes the `destroy` operation.
         * @returns {any} Returns the result of `destroy` when applicable.
         */
        destroy() {
            if (this._viewport) this._viewport.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('pointermove', this.onPointerMove);
            window.removeEventListener('pointerup', this.onPointerUp);
            this._roViewport?.disconnect();
            this._roContent?.disconnect();
            if (this.hideTimer) window.clearTimeout(this.hideTimer);
        },

        /**
         * Executes the `setState` operation.
         * @param {any} state Input value for this method.
         * @returns {any} Returns the result of `setState` when applicable.
         */
        setState(state) {
            if (this.$refs.scrollbarX) this.$refs.scrollbarX.dataset.state = state;
            if (this.$refs.scrollbarY) this.$refs.scrollbarY.dataset.state = state;
        },

        /**
         * Executes the `setBarMounted` operation.
         * @param {any} axis Input value for this method.
         * @param {any} mounted Input value for this method.
         * @returns {any} Returns the result of `setBarMounted` when applicable.
         */
        setBarMounted(axis, mounted) {
            const bar = this.$refs[`scrollbar${axis === 'vertical' ? 'Y' : 'X'}`];
            if (!bar) return;
            bar.hidden = !mounted;
        },

        /**
         * Executes the `update` operation.
         * @returns {any} Returns the result of `update` when applicable.
         */
        update() {
            const viewport = this.$refs.viewport;
            if (!viewport) return;
            this._viewport = viewport;

            const showX = viewport.scrollWidth > viewport.clientWidth;
            const showY = viewport.scrollHeight > viewport.clientHeight;

            this.setBarMounted('horizontal', showX);
            this.setBarMounted('vertical', showY);

            this.updateThumbSizes();
            this.updateThumbPositions();
            this.updateCorner();

            if (this.type === 'always') this.setState('visible');
            if (this.type === 'auto') this.setState(showX || showY ? 'visible' : 'hidden');
        },

        /**
         * Executes the `updateThumbSizes` operation.
         * @returns {any} Returns the result of `updateThumbSizes` when applicable.
         */
        updateThumbSizes() {
            const viewport = this.$refs.viewport;
            if (!viewport) return;
            this._viewport = viewport;

            if (this.$refs.thumbY && this.$refs.scrollbarY && viewport.scrollHeight > 0) {
                const ratio = viewport.clientHeight / viewport.scrollHeight;
                const size = Math.max(this.$refs.scrollbarY.clientHeight * ratio, 18);
                this.$refs.thumbY.style.height = `${size}px`;
            }

            if (this.$refs.thumbX && this.$refs.scrollbarX && viewport.scrollWidth > 0) {
                const ratio = viewport.clientWidth / viewport.scrollWidth;
                const size = Math.max(this.$refs.scrollbarX.clientWidth * ratio, 18);
                this.$refs.thumbX.style.width = `${size}px`;
            }
        },

        /**
         * Executes the `updateThumbPositions` operation.
         * @returns {any} Returns the result of `updateThumbPositions` when applicable.
         */
        updateThumbPositions() {
            const viewport = this.$refs.viewport;
            if (!viewport) return;
            this._viewport = viewport;

            if (this.$refs.thumbY && this.$refs.scrollbarY && viewport.scrollHeight > viewport.clientHeight) {
                const maxScroll = viewport.scrollHeight - viewport.clientHeight;
                const track = this.$refs.scrollbarY.clientHeight - this.$refs.thumbY.offsetHeight;
                const pos = (viewport.scrollTop / maxScroll) * Math.max(track, 0);
                this.$refs.thumbY.style.transform = `translate3d(0, ${pos}px, 0)`;
            }

            if (this.$refs.thumbX && this.$refs.scrollbarX && viewport.scrollWidth > viewport.clientWidth) {
                const maxScroll = viewport.scrollWidth - viewport.clientWidth;
                const track = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth;
                const pos = (viewport.scrollLeft / maxScroll) * Math.max(track, 0);
                this.$refs.thumbX.style.transform = `translate3d(${pos}px, 0, 0)`;
            }
        },

        /**
         * Executes the `updateCorner` operation.
         * @returns {any} Returns the result of `updateCorner` when applicable.
         */
        updateCorner() {
            if (!this.$refs.corner) return;
            const showCorner = !this.$refs.scrollbarX?.hidden && !this.$refs.scrollbarY?.hidden;
            if (showCorner) {
                this.$refs.corner.hidden = false;
                this.$refs.corner.style.width = `${this.$refs.scrollbarY?.offsetWidth || 0}px`;
                this.$refs.corner.style.height = `${this.$refs.scrollbarX?.offsetHeight || 0}px`;
            } else {
                this.$refs.corner.hidden = true;
            }
        },

        /**
         * Executes the `onScroll` operation.
         * @returns {any} Returns the result of `onScroll` when applicable.
         */
        onScroll() {
            this.updateThumbPositions();
            if (this.type === 'scroll') {
                this.setState('visible');
                if (this.hideTimer) window.clearTimeout(this.hideTimer);
                this.hideTimer = window.setTimeout(() => this.setState('hidden'), this.scrollHideDelay);
            }
        },

        /**
         * Executes the `onPointerEnter` operation.
         * @returns {any} Returns the result of `onPointerEnter` when applicable.
         */
        onPointerEnter() {
            if (this.type === 'hover') {
                if (this.hideTimer) window.clearTimeout(this.hideTimer);
                this.setState('visible');
            }
        },

        /**
         * Executes the `onPointerLeave` operation.
         * @returns {any} Returns the result of `onPointerLeave` when applicable.
         */
        onPointerLeave() {
            if (this.type === 'hover') {
                if (this.hideTimer) window.clearTimeout(this.hideTimer);
                this.hideTimer = window.setTimeout(() => this.setState('hidden'), this.scrollHideDelay);
            }
        },

        /**
         * Executes the `onTrackPointerDown` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `onTrackPointerDown` when applicable.
         */
        onTrackPointerDown(event) {
            const axis = event.currentTarget?.dataset.orientation || 'vertical';
            const scrollbar = this.$refs[`scrollbar${axis === 'vertical' ? 'Y' : 'X'}`];
            if (!scrollbar || scrollbar.hidden) return;
            if (event.target === this.$refs[`thumb${axis === 'vertical' ? 'Y' : 'X'}`]) return;

            const viewport = this.$refs.viewport;
            const thumb = this.$refs[`thumb${axis === 'vertical' ? 'Y' : 'X'}`];
            if (!viewport || !thumb) return;

            const rect = scrollbar.getBoundingClientRect();
            if (axis === 'vertical') {
                const clickPos = event.clientY - rect.top - thumb.offsetHeight / 2;
                const track = scrollbar.clientHeight - thumb.offsetHeight;
                const maxScroll = viewport.scrollHeight - viewport.clientHeight;
                viewport.scrollTop = (clickPos / Math.max(track, 1)) * maxScroll;
            } else {
                const clickPos = event.clientX - rect.left - thumb.offsetWidth / 2;
                const track = scrollbar.clientWidth - thumb.offsetWidth;
                const maxScroll = viewport.scrollWidth - viewport.clientWidth;
                viewport.scrollLeft = (clickPos / Math.max(track, 1)) * maxScroll;
            }
        },

        /**
         * Executes the `onThumbPointerDown` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
         */
        onThumbPointerDown(event) {
            const axis = event.currentTarget?.dataset.orientation || 'vertical';
            const thumb = this.$refs[`thumb${axis === 'vertical' ? 'Y' : 'X'}`];
            const scrollbar = this.$refs[`scrollbar${axis === 'vertical' ? 'Y' : 'X'}`];
            if (!thumb || !scrollbar || scrollbar.hidden) return;

            const rect = thumb.getBoundingClientRect();
            this._dragAxis = axis;
            this._dragPointerOffset = axis === 'vertical' ? (event.clientY - rect.top) : (event.clientX - rect.left);
            window.addEventListener('pointermove', this.onPointerMove);
            window.addEventListener('pointerup', this.onPointerUp, { once: true });
        },

        /**
         * Executes the `onPointerMove` operation.
         * @param {any} event Input value for this method.
         * @returns {any} Returns the result of `onPointerMove` when applicable.
         */
        onPointerMove(event) {
            const axis = this._dragAxis;
            const viewport = this.$refs.viewport;
            const scrollbar = this.$refs[`scrollbar${axis === 'vertical' ? 'Y' : 'X'}`];
            const thumb = this.$refs[`thumb${axis === 'vertical' ? 'Y' : 'X'}`];
            if (!axis || !viewport || !scrollbar || !thumb || scrollbar.hidden) return;

            const rect = scrollbar.getBoundingClientRect();
            if (axis === 'vertical') {
                const pointer = event.clientY - rect.top;
                const track = scrollbar.clientHeight - thumb.offsetHeight;
                const maxScroll = viewport.scrollHeight - viewport.clientHeight;
                viewport.scrollTop = ((pointer - this._dragPointerOffset) / Math.max(track, 1)) * maxScroll;
            } else {
                const pointer = event.clientX - rect.left;
                const track = scrollbar.clientWidth - thumb.offsetWidth;
                const maxScroll = viewport.scrollWidth - viewport.clientWidth;
                viewport.scrollLeft = ((pointer - this._dragPointerOffset) / Math.max(track, 1)) * maxScroll;
            }
        },

        /**
         * Executes the `onPointerUp` operation.
         * @returns {any} Returns the result of `onPointerUp` when applicable.
         */
        onPointerUp() {
            this._dragAxis = null;
            window.removeEventListener('pointermove', this.onPointerMove);
        },
    }));
}

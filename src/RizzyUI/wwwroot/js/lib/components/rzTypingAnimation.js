export default function (Alpine) {
    Alpine.data('rzTypingAnimation', () => ({
        config: null,
        words: [],
        segmentedWords: [],
        displayText: '',
        currentWordIndex: 0,
        currentCharIndex: 0,
        phase: 'typing',
        started: false,
        completed: false,
        cursorVisible: false,
        cursorChar: '|',
        cursorBlinkClass: '',
        timerId: null,
        observer: null,
        supportsIntersectionObserver: typeof window !== 'undefined' && typeof window.IntersectionObserver !== 'undefined',

        init() {
            this.readConfig();
            this.resolveWords();
            this.updateCursorState();

            if (this.words.length === 0) {
                this.complete();
                return;
            }

            this.observeIfNeeded();
        },

        readConfig() {
            try {
                const serialized = this.$el.dataset.config || '{}';
                const parsed = JSON.parse(serialized);
                const typeSpeed = this.clampPositive(parsed.typeSpeed ?? parsed.duration ?? 100);
                const deleteSpeed = this.clampPositive(parsed.deleteSpeed ?? Math.max(Math.floor(typeSpeed / 2), 1));

                this.config = {
                    words: Array.isArray(parsed.words) ? parsed.words : null,
                    duration: this.clampPositive(parsed.duration ?? 100),
                    typeSpeed,
                    deleteSpeed,
                    delay: this.clampZeroOrGreater(parsed.delay ?? 0),
                    pauseDelay: this.clampZeroOrGreater(parsed.pauseDelay ?? 1000),
                    loop: Boolean(parsed.loop),
                    startOnView: parsed.startOnView !== false,
                    showCursor: parsed.showCursor !== false,
                    blinkCursor: parsed.blinkCursor !== false,
                    cursorStyle: parsed.cursorStyle || 'line'
                };
            } catch {
                this.config = {
                    words: null,
                    duration: 100,
                    typeSpeed: 100,
                    deleteSpeed: 50,
                    delay: 0,
                    pauseDelay: 1000,
                    loop: false,
                    startOnView: true,
                    showCursor: true,
                    blinkCursor: true,
                    cursorStyle: 'line'
                };
            }

            this.cursorChar = this.getCursorChar(this.config.cursorStyle);
            this.cursorBlinkClass = this.config.blinkCursor ? 'animate-blink-cursor' : '';
        },

        resolveWords() {
            const explicitWords = Array.isArray(this.config.words)
                ? this.config.words.filter((word) => typeof word === 'string')
                : [];

            if (explicitWords.length > 0) {
                this.words = explicitWords;
            } else if (this.$refs.source) {
                const sourceText = (this.$refs.source.textContent || '').trim();
                this.words = sourceText ? [sourceText] : [];
            } else {
                this.words = [];
            }

            this.segmentedWords = this.words.map((word) => this.segmentText(word));
        },

        observeIfNeeded() {
            if (!this.config.startOnView || !this.supportsIntersectionObserver) {
                this.start();
                return;
            }

            this.observer = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if (!entry || !entry.isIntersecting) {
                    return;
                }

                this.start();

                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }
            }, { threshold: 0.3 });

            this.observer.observe(this.$el);
        },

        start() {
            if (this.started) {
                return;
            }

            this.started = true;
            this.updateCursorState();
            this.scheduleTick(this.config.delay);
        },

        scheduleTick(delay) {
            this.clearTimer();
            this.timerId = window.setTimeout(() => {
                this.tick();
            }, delay);
        },

        tick() {
            if (this.completed || this.words.length === 0) {
                this.complete();
                return;
            }

            if (this.phase === 'typing') {
                this.typeNextCharacter();
                return;
            }

            if (this.phase === 'pause') {
                this.pauseBeforeDelete();
                return;
            }

            this.deletePreviousCharacter();
        },

        typeNextCharacter() {
            const graphemes = this.segmentedWords[this.currentWordIndex] || [];
            const hasMultipleWords = this.words.length > 1;

            if (this.currentCharIndex < graphemes.length) {
                this.currentCharIndex += 1;
                this.displayText = graphemes.slice(0, this.currentCharIndex).join('');
                this.updateCursorState();
                this.scheduleTick(this.config.typeSpeed);
                return;
            }

            const isLastWord = this.currentWordIndex === this.words.length - 1;
            if (!this.config.loop && isLastWord) {
                this.complete();
                return;
            }

            if (hasMultipleWords || this.config.loop) {
                this.phase = 'pause';
                this.scheduleTick(this.config.pauseDelay);
            }
        },

        pauseBeforeDelete() {
            this.phase = 'deleting';
            this.scheduleTick(this.config.deleteSpeed);
        },

        deletePreviousCharacter() {
            const graphemes = this.segmentedWords[this.currentWordIndex] || [];

            if (this.currentCharIndex > 0) {
                this.currentCharIndex -= 1;
                this.displayText = graphemes.slice(0, this.currentCharIndex).join('');
                this.updateCursorState();
                this.scheduleTick(this.config.deleteSpeed);
                return;
            }

            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            this.phase = 'typing';
            this.scheduleTick(this.config.typeSpeed);
        },

        complete() {
            this.completed = true;
            this.clearTimer();
            this.updateCursorState();
        },

        updateCursorState() {
            this.cursorVisible = Boolean(this.config?.showCursor) && !this.completed && this.words.length > 0;
        },

        segmentText(value) {
            if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
                return Array.from(segmenter.segment(value), (segment) => segment.segment);
            }

            return Array.from(value);
        },

        clampPositive(value) {
            const number = Number(value);
            if (!Number.isFinite(number)) {
                return 1;
            }

            return Math.max(Math.round(number), 1);
        },

        clampZeroOrGreater(value) {
            const number = Number(value);
            if (!Number.isFinite(number)) {
                return 0;
            }

            return Math.max(Math.round(number), 0);
        },

        getCursorChar(style) {
            if (style === 'block') {
                return '▌';
            }

            if (style === 'underscore') {
                return '_';
            }

            return '|';
        },

        clearTimer() {
            if (this.timerId !== null) {
                window.clearTimeout(this.timerId);
                this.timerId = null;
            }
        },

        destroy() {
            this.clearTimer();

            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    }));
}

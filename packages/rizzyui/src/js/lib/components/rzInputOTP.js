export default function (Alpine) {
    Alpine.data('rzInputOTP', () => ({
        value: '',
        length: 0,
        activeIndex: 0,
        isFocused: false,
        isInvalid: false,
        otpType: 'numeric',
        textTransform: 'none',
        slots: [],
        slotElements: [],
        selectedIndexes: [],

        /**
         * Initializes OTP behavior and hydrates visual slots.
         */
        init() {
            if (this.$el.dataset.rzOtpInitialized === 'true') {
                this.syncFromInput();
                return;
            }

            this.$el.dataset.rzOtpInitialized = 'true';
            this.slotElements = [];
            this.selectedIndexes = [];
            this.length = Number(this.$el.dataset.length || '0');
            this.otpType = this.$el.dataset.otpType || 'numeric';
            this.textTransform = this.$el.dataset.textTransform || 'none';
            this.isInvalid = this.$el.dataset.invalid === 'true';
            this.syncFromInput();
        },

        /**
         * Returns the current OTP value.
         * @returns {string}
         */
        getValue() {
            return this.value;
        },

        /**
         * Sets the current OTP value.
         * @param {string} newValue
         */
        setValue(newValue) {
            const nextValue = this.sanitizeValue(newValue || '');
            const previousValue = this.value;

            this.clearSelection();
            this.value = nextValue;
            this.activeIndex = this.getMaxFocusableIndex();
            this.applyValueToInput();
            this.refreshSlots();
            this.dispatchInputEvent(previousValue);
            this.dispatchChangeEvent(previousValue);
        },

        /**
         * Handles input typing updates.
         * @param {InputEvent} event
         */
        onInput(event) {
            this.clearSelection();
            this.syncFromInput(event?.target);
        },

        /**
         * Handles paste behavior for OTP values.
         * @param {ClipboardEvent} event
         */
        onPaste(event) {
            event.preventDefault();
            const text = event.clipboardData ? event.clipboardData.getData('text') : '';
            const filtered = this.sanitizeValue(text);
            const previousValue = this.value;

            this.clearSelection();
            this.value = filtered;
            this.activeIndex = this.getMaxFocusableIndex();
            this.applyValueToInput();
            this.refreshSlots();
            this.dispatchInputEvent(previousValue);
            this.dispatchChangeEvent(previousValue);
        },

        /**
         * Handles keyboard navigation and deletion.
         * @param {KeyboardEvent} event
         */
        onKeyDown(event) {
            if (this.hasSelection() && (event.key === 'Backspace' || event.key === 'Delete')) {
                event.preventDefault();
                this.clearAllSlots();
                return;
            }

            if (this.hasSelection() && this.selectedIndexes.length > 1 && this.isAcceptableInputChar(event.key)) {
                event.preventDefault();
                this.replaceSelectionWithKey(event.key);
                return;
            }

            if (this.isAcceptableInputChar(event.key)) {
                event.preventDefault();
                this.replaceActiveSlotWithKey(event.key);
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                this.clearSelection();
                this.moveLeft();
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                this.clearSelection();
                this.moveRight();
                return;
            }

            if (event.key === 'Home') {
                event.preventDefault();
                this.clearSelection();
                this.moveHome();
                return;
            }

            if (event.key === 'End') {
                event.preventDefault();
                this.clearSelection();
                this.moveEnd();
                return;
            }

            if (event.key === 'Backspace') {
                this.handleBackspace();
            }
        },

        /**
         * Sets focus state to true.
         */
        onFocus() {
            this.isFocused = true;
            this.setActiveFromCaret();
            this.refreshSlots();
        },

        /**
         * Sets focus state to false.
         */
        onBlur() {
            this.isFocused = false;
            this.clearSelection();
            this.refreshSlots();
        },

        /**
         * Prevents slot mousedown default so input keeps control.
         * @param {MouseEvent} event
         */
        preventMouseDown(event) {
            event.preventDefault();
        },

        /**
         * Focuses the native input and updates active slot from clicked index.
         * @param {MouseEvent} event
         */
        focusSlot(event) {
            const target = event.currentTarget;
            const index = Number(target.dataset.index || '0');
            if (!this.canFocusIndex(index)) {
                return;
            }

            this.clearSelection();
            this.activeIndex = this.normalizeIndex(index);
            this.focusInput();
            this.setCaretToActiveIndex();
            this.refreshSlots();
        },

        /**
         * Selects all currently filled slots from a double click gesture.
         */
        selectFilledSlots() {
            const filledIndexes = this.slots
                .map((slot, index) => ({ slot, index }))
                .filter(({ slot }) => slot.char !== '')
                .map(({ index }) => index);

            if (filledIndexes.length === 0) {
                this.clearSelection();
                this.refreshSlots();
                return;
            }

            this.selectedIndexes = filledIndexes;
            this.isFocused = true;
            this.focusInput();

            const input = this.$refs.input;
            if (input) {
                input.setSelectionRange(0, this.value.length);
            }

            this.refreshSlots();
        },

        registerSlot() {
            if (!this.$el || this.$el.dataset.inputOtpSlot !== 'true') return;

            if (!this.slotElements.includes(this.$el)) {
                this.slotElements.push(this.$el);
                this.slotElements.sort((left, right) => Number(left.dataset.index || '0') - Number(right.dataset.index || '0'));
            }

            this.refreshSlots();
        },

        moveLeft() {
            this.activeIndex = this.normalizeIndex(this.activeIndex - 1);
            this.focusInput();
            this.setCaretToActiveIndex();
            this.refreshSlots();
        },

        moveRight() {
            const nextIndex = this.normalizeIndex(this.activeIndex + 1);
            if (!this.canFocusIndex(nextIndex)) {
                return;
            }

            this.activeIndex = nextIndex;
            this.focusInput();
            this.setCaretToActiveIndex();
            this.refreshSlots();
        },

        moveHome() {
            this.activeIndex = 0;
            this.focusInput();
            this.setCaretToActiveIndex();
            this.refreshSlots();
        },

        moveEnd() {
            this.activeIndex = this.getMaxFocusableIndex();
            this.focusInput();
            this.setCaretToActiveIndex();
            this.refreshSlots();
        },

        handleBackspace() {
            const input = this.$refs.input;
            if (!input) return;

            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            if (start !== end) return;
            if (start <= 0) return;

            this.activeIndex = this.normalizeIndex(start - 1);
            this.refreshSlots();
        },

        syncFromInput(sourceInput) {
            const input = sourceInput || this.$refs.input;
            if (!input) return;

            const previousValue = this.value;
            this.value = this.sanitizeValue(input.value || '');
            if (this.value !== input.value) {
                input.value = this.value;
            }

            this.setActiveFromCaret(this.value.length);
            this.refreshSlots();
            this.dispatchInputEvent(previousValue);
            this.dispatchChangeEvent(previousValue);
        },

        sanitizeValue(raw) {
            if (!raw) return '';
            const pattern = this.otpType === 'alphanumeric' ? /[^a-zA-Z0-9]/g : /[^0-9]/g;
            const cleaned = raw.replace(pattern, '').slice(0, this.length);
            return this.applyTextTransform(cleaned);
        },

        applyTextTransform(raw) {
            if (!raw) return '';

            if (this.textTransform === 'to-lower') {
                return raw.toLowerCase();
            }

            if (this.textTransform === 'to-upper') {
                return raw.toUpperCase();
            }

            return raw;
        },

        applyValueToInput() {
            const input = this.$refs.input;
            if (!input) return;
            input.value = this.value;
            this.setCaretToActiveIndex();
        },

        setActiveFromCaret(fallbackIndex) {
            const input = this.$refs.input;
            if (!input) {
                this.activeIndex = this.getMaxFocusableIndex(fallbackIndex ?? 0);
                return;
            }

            const selectionStart = input.selectionStart;
            const caret = selectionStart == null
                ? Number.isFinite(fallbackIndex) ? Number(fallbackIndex) : 0
                : Number(selectionStart);

            const normalizedCaret = this.normalizeIndex(caret);
            if (this.canFocusIndex(normalizedCaret)) {
                this.activeIndex = normalizedCaret;
                return;
            }

            this.activeIndex = this.getMaxFocusableIndex();
        },

        setCaretToActiveIndex() {
            const input = this.$refs.input;
            if (!input) return;
            const index = this.normalizeIndex(this.activeIndex);
            input.setSelectionRange(index, index);
        },

        focusInput() {
            const input = this.$refs.input;
            if (!input) return;
            input.focus();
        },

        hasSelection() {
            return this.selectedIndexes.length > 0;
        },

        clearSelection() {
            this.selectedIndexes = [];
        },

        clearAllSlots() {
            const previousValue = this.value;
            this.clearSelection();
            this.value = '';
            this.activeIndex = 0;
            this.applyValueToInput();
            this.refreshSlots();
            this.dispatchInputEvent(previousValue);
        },

        replaceSelectionWithKey(key) {
            const nextChar = this.sanitizeValue(key).charAt(0);
            if (!nextChar) return;

            const previousValue = this.value;
            this.value = nextChar;
            this.clearSelection();
            this.activeIndex = this.getMaxFocusableIndex();
            this.applyValueToInput();
            this.refreshSlots();
            this.dispatchInputEvent(previousValue);
        },

        replaceActiveSlotWithKey(key) {
            const nextChar = this.sanitizeValue(key).charAt(0);
            if (!nextChar) return;

            const index = this.canFocusIndex(this.activeIndex)
                ? this.normalizeIndex(this.activeIndex)
                : this.getMaxFocusableIndex();

            const chars = this.value.split('');
            while (chars.length < index) {
                chars.push('');
            }

            chars[index] = nextChar;

            const previousValue = this.value;
            this.value = this.applyTextTransform(chars.join('').slice(0, this.length));
            this.clearSelection();
            this.activeIndex = this.getMaxFocusableIndex(index + 1);
            this.applyValueToInput();
            this.refreshSlots();
            this.dispatchInputEvent(previousValue);
            this.dispatchChangeEvent(previousValue);
        },

        isAcceptableInputChar(key) {
            if (!key || key.length !== 1) return false;

            if (this.otpType === 'alphanumeric') {
                return /^[a-zA-Z0-9]$/.test(key);
            }

            return /^[0-9]$/.test(key);
        },

        getNextFillIndex() {
            if (this.length <= 0) return 0;
            return Math.min(this.value.length, this.length - 1);
        },

        getMaxFocusableIndex(fallbackIndex) {
            const safeFallback = Number.isFinite(fallbackIndex) ? this.normalizeIndex(Number(fallbackIndex)) : this.getNextFillIndex();
            return this.canFocusIndex(safeFallback) ? safeFallback : this.getNextFillIndex();
        },

        canFocusIndex(index) {
            const normalizedIndex = this.normalizeIndex(index);
            const char = this.value.charAt(normalizedIndex);
            if (char !== '') {
                return true;
            }

            return normalizedIndex === this.getNextFillIndex();
        },

        dispatchInputEvent(previousValue) {
            if (this.value === previousValue) return;

            this.$dispatch('rz:inputotp:oninput', {
                value: this.value,
                previousValue,
                activeIndex: this.activeIndex,
                isComplete: this.value.length === this.length,
                length: this.length,
                otpType: this.otpType,
                textTransform: this.textTransform
            });
        },

        dispatchChangeEvent(previousValue) {
            if (this.value === previousValue) return;
            if (this.value.length !== this.length) return;

            this.$dispatch('rz:inputotp:onchange', {
                value: this.value,
                previousValue,
                activeIndex: this.activeIndex,
                length: this.length,
                otpType: this.otpType,
                textTransform: this.textTransform
            });
        },

        refreshSlots() {
            this.buildSlotsState();
            this.updateSlotDom();
        },

        buildSlotsState() {
            const next = [];
            let i = 0;
            while (i < this.length) {
                const char = this.value.charAt(i) || '';
                const isSelected = this.selectedIndexes.includes(i);
                const isActive = this.isFocused && !this.hasSelection() && i === this.activeIndex;
                const hasFakeCaret = this.isFocused && !this.hasSelection() && isActive && char === '';
                next.push({ char, isActive, hasFakeCaret, isSelected });
                i += 1;
            }
            this.slots = next;
        },

        updateSlotDom() {
            const fallbackRoot = this.$el?.closest('[data-alpine-root]') || this.$el;
            const slotElements = this.slotElements.length > 0
                ? this.slotElements
                : fallbackRoot.querySelectorAll('[data-input-otp-slot="true"]');

            slotElements.forEach((slotElement) => {
                const index = Number(slotElement.dataset.index || '0');
                const state = this.slots[index] || { char: '', isActive: false, hasFakeCaret: false, isSelected: false };

                slotElement.dataset.active = state.isActive ? 'true' : 'false';
                slotElement.dataset.focused = this.isFocused ? 'true' : 'false';
                slotElement.dataset.selected = state.isSelected ? 'true' : 'false';
                slotElement.dataset.focusable = this.canFocusIndex(index) ? 'true' : 'false';

                if (this.isInvalid) {
                    slotElement.setAttribute('aria-invalid', 'true');
                } else {
                    slotElement.removeAttribute('aria-invalid');
                }

                const charElement = slotElement.querySelector('[data-input-otp-char="true"]');
                if (charElement) {
                    charElement.textContent = state.char;
                }

                const caretWrapper = slotElement.querySelector('[data-input-otp-caret="true"]');
                if (caretWrapper) {
                    if (state.hasFakeCaret) {
                        caretWrapper.classList.remove('hidden');
                    } else {
                        caretWrapper.classList.add('hidden');
                    }
                }
            });
        },

        normalizeIndex(index) {
            if (this.length <= 0) return 0;
            if (index < 0) return 0;
            if (index > this.length - 1) return this.length - 1;
            return index;
        }
    }));
}

import { r as rizzyRequire } from "./bootstrap-DmUTAXwT.js";
function rzCombobox() {
  return {
    tomSelect: null,
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const assets = JSON.parse(this.$el.dataset.assets || "[]");
      const nonce = this.$el.dataset.nonce;
      if (assets.length > 0 && typeof rizzyRequire === "function") {
        rizzyRequire(assets, {
          success: () => this.initTomSelect(),
          error: (err) => console.error("RzCombobox: Failed to load assets.", err)
        }, nonce);
      } else if (window.TomSelect) {
        this.initTomSelect();
      }
    },
    /**
     * Executes the `initTomSelect` operation.
     * @returns {any} Returns the result of `initTomSelect` when applicable.
     */
    initTomSelect() {
      const selectEl = this.$refs.selectInput;
      if (!selectEl) return;
      const configEl = document.getElementById(this.$el.dataset.configId);
      const config = configEl ? JSON.parse(configEl.textContent) : {};
      const render = {};
      const createAlpineRow = (templateRef, data) => {
        if (!templateRef) return null;
        const div = document.createElement("div");
        let parsedItem = data.item;
        if (typeof parsedItem === "string") {
          try {
            parsedItem = JSON.parse(parsedItem);
          } catch (e) {
          }
        }
        const scope = {
          ...data,
          item: parsedItem
        };
        if (Alpine && typeof window.Alpine.addScopeToNode === "function") {
          window.Alpine.addScopeToNode(div, scope);
        } else {
          div._x_dataStack = [scope];
        }
        div.innerHTML = templateRef.innerHTML;
        return div;
      };
      if (this.$refs.optionTemplate) {
        render.option = (data, escape) => createAlpineRow(this.$refs.optionTemplate, data);
      }
      if (this.$refs.itemTemplate) {
        render.item = (data, escape) => createAlpineRow(this.$refs.itemTemplate, data);
      }
      config.dataAttr = "data-item";
      this.tomSelect = new TomSelect(selectEl, {
        ...config,
        render,
        onInitialize: function() {
          this.sync();
        }
      });
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this.tomSelect) {
        this.tomSelect.destroy();
        this.tomSelect = null;
      }
    }
  };
}
function rzFileInput() {
  return {
    files: [],
    hasFiles: false,
    isDragging: false,
    draggingState: "false",
    init() {
      this.syncFromInput();
    },
    trigger() {
      if (this.$refs.input) {
        this.$refs.input.click();
      }
    },
    handleFileChange() {
      this.syncFromInput();
    },
    handleDragOver() {
      this.isDragging = true;
      this.draggingState = "true";
    },
    handleDragLeave() {
      this.isDragging = false;
      this.draggingState = "false";
    },
    handleDrop(event) {
      this.handleDragLeave();
      const input = this.$refs.input;
      const dropped = event?.dataTransfer?.files;
      if (!input || !dropped || dropped.length === 0) {
        return;
      }
      this.applyDroppedFiles(input, dropped);
      this.syncFromInput();
    },
    removeFileByIndex(event) {
      const input = this.$refs.input;
      if (!input?.files) {
        return;
      }
      const indexRaw = event?.currentTarget?.dataset?.index;
      const index = Number.parseInt(indexRaw ?? "-1", 10);
      if (Number.isNaN(index) || index < 0) {
        return;
      }
      const transfer = new DataTransfer();
      Array.from(input.files).forEach((file, fileIndex) => {
        if (fileIndex !== index) {
          transfer.items.add(file);
        }
      });
      input.files = transfer.files;
      this.syncFromInput();
    },
    applyDroppedFiles(input, droppedFiles) {
      const transfer = new DataTransfer();
      const canAppend = input.multiple;
      if (canAppend && input.files) {
        Array.from(input.files).forEach((file) => transfer.items.add(file));
        Array.from(droppedFiles).forEach((file) => transfer.items.add(file));
      } else if (droppedFiles.length > 0) {
        transfer.items.add(droppedFiles[0]);
      }
      input.files = transfer.files;
    },
    syncFromInput() {
      const input = this.$refs.input;
      this.revokePreviews();
      if (!input?.files) {
        this.files = [];
        this.hasFiles = false;
        return;
      }
      this.files = Array.from(input.files).map((file) => {
        const imageFile = file.type.startsWith("image/");
        const previewUrl = imageFile ? URL.createObjectURL(file) : null;
        return {
          name: file.name,
          size: file.size,
          formattedSize: this.formatFileSize(file.size),
          isImage: imageFile,
          previewUrl
        };
      });
      this.hasFiles = this.files.length > 0;
    },
    formatFileSize(size) {
      if (!Number.isFinite(size) || size <= 0) {
        return "0 B";
      }
      const units = ["B", "KB", "MB", "GB", "TB"];
      const power = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
      const formatted = size / 1024 ** power;
      const rounded = formatted >= 10 || power === 0 ? Math.round(formatted) : formatted.toFixed(1);
      return `${rounded} ${units[power]}`;
    },
    revokePreviews() {
      this.files.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    },
    destroy() {
      this.revokePreviews();
    }
  };
}
function rzInputOTP() {
  return {
    value: "",
    length: 0,
    activeIndex: 0,
    isFocused: false,
    isInvalid: false,
    otpType: "numeric",
    textTransform: "none",
    slots: [],
    slotElements: [],
    selectedIndexes: [],
    /**
     * Initializes OTP behavior and hydrates visual slots.
     */
    init() {
      if (this.$el.dataset.rzOtpInitialized === "true") {
        this.syncFromInput();
        return;
      }
      this.$el.dataset.rzOtpInitialized = "true";
      this.slotElements = [];
      this.selectedIndexes = [];
      this.length = Number(this.$el.dataset.length || "0");
      this.otpType = this.$el.dataset.otpType || "numeric";
      this.textTransform = this.$el.dataset.textTransform || "none";
      this.isInvalid = this.$el.dataset.invalid === "true";
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
      const nextValue = this.sanitizeValue(newValue || "");
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
      const text = event.clipboardData ? event.clipboardData.getData("text") : "";
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
      if (this.hasSelection() && (event.key === "Backspace" || event.key === "Delete")) {
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
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this.clearSelection();
        this.moveLeft();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        this.clearSelection();
        this.moveRight();
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        this.clearSelection();
        this.moveHome();
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        this.clearSelection();
        this.moveEnd();
        return;
      }
      if (event.key === "Backspace") {
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
      const index = Number(target.dataset.index || "0");
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
      const filledIndexes = this.slots.map((slot, index) => ({ slot, index })).filter(({ slot }) => slot.char !== "").map(({ index }) => index);
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
      if (!this.$el || this.$el.dataset.inputOtpSlot !== "true") return;
      if (!this.slotElements.includes(this.$el)) {
        this.slotElements.push(this.$el);
        this.slotElements.sort((left, right) => Number(left.dataset.index || "0") - Number(right.dataset.index || "0"));
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
      this.value = this.sanitizeValue(input.value || "");
      if (this.value !== input.value) {
        input.value = this.value;
      }
      this.setActiveFromCaret(this.value.length);
      this.refreshSlots();
      this.dispatchInputEvent(previousValue);
      this.dispatchChangeEvent(previousValue);
    },
    sanitizeValue(raw) {
      if (!raw) return "";
      const pattern = this.otpType === "alphanumeric" ? /[^a-zA-Z0-9]/g : /[^0-9]/g;
      const cleaned = raw.replace(pattern, "").slice(0, this.length);
      return this.applyTextTransform(cleaned);
    },
    applyTextTransform(raw) {
      if (!raw) return "";
      if (this.textTransform === "to-lower") {
        return raw.toLowerCase();
      }
      if (this.textTransform === "to-upper") {
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
      const caret = selectionStart == null ? Number.isFinite(fallbackIndex) ? Number(fallbackIndex) : 0 : Number(selectionStart);
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
      this.value = "";
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
      const index = this.canFocusIndex(this.activeIndex) ? this.normalizeIndex(this.activeIndex) : this.getMaxFocusableIndex();
      const chars = this.value.split("");
      while (chars.length < index) {
        chars.push("");
      }
      chars[index] = nextChar;
      const previousValue = this.value;
      this.value = this.applyTextTransform(chars.join("").slice(0, this.length));
      this.clearSelection();
      this.activeIndex = this.getMaxFocusableIndex(index + 1);
      this.applyValueToInput();
      this.refreshSlots();
      this.dispatchInputEvent(previousValue);
      this.dispatchChangeEvent(previousValue);
    },
    isAcceptableInputChar(key) {
      if (!key || key.length !== 1) return false;
      if (this.otpType === "alphanumeric") {
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
      if (char !== "") {
        return true;
      }
      return normalizedIndex === this.getNextFillIndex();
    },
    dispatchInputEvent(previousValue) {
      if (this.value === previousValue) return;
      this.$dispatch("rz:inputotp:oninput", {
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
      this.$dispatch("rz:inputotp:onchange", {
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
        const char = this.value.charAt(i) || "";
        const isSelected = this.selectedIndexes.includes(i);
        const isActive = this.isFocused && !this.hasSelection() && i === this.activeIndex;
        const hasFakeCaret = this.isFocused && !this.hasSelection() && isActive && char === "";
        next.push({ char, isActive, hasFakeCaret, isSelected });
        i += 1;
      }
      this.slots = next;
    },
    updateSlotDom() {
      const fallbackRoot = this.$el?.closest("[data-alpine-root]") || this.$el;
      const slotElements = this.slotElements.length > 0 ? this.slotElements : fallbackRoot.querySelectorAll('[data-input-otp-slot="true"]');
      slotElements.forEach((slotElement) => {
        const index = Number(slotElement.dataset.index || "0");
        const state = this.slots[index] || { char: "", isActive: false, hasFakeCaret: false, isSelected: false };
        slotElement.dataset.active = state.isActive ? "true" : "false";
        slotElement.dataset.focused = this.isFocused ? "true" : "false";
        slotElement.dataset.selected = state.isSelected ? "true" : "false";
        slotElement.dataset.focusable = this.canFocusIndex(index) ? "true" : "false";
        if (this.isInvalid) {
          slotElement.setAttribute("aria-invalid", "true");
        } else {
          slotElement.removeAttribute("aria-invalid");
        }
        const charElement = slotElement.querySelector('[data-input-otp-char="true"]');
        if (charElement) {
          charElement.textContent = state.char;
        }
        const caretWrapper = slotElement.querySelector('[data-input-otp-caret="true"]');
        if (caretWrapper) {
          if (state.hasFakeCaret) {
            caretWrapper.classList.remove("hidden");
          } else {
            caretWrapper.classList.add("hidden");
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
  };
}
function rzScrollArea() {
  return {
    hideTimer: null,
    type: "hover",
    orientation: "vertical",
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
      this.type = this.$el.dataset.type || "hover";
      this.orientation = this.$el.dataset.orientation || "vertical";
      this.scrollHideDelay = Number(this.$el.dataset.scrollHideDelay || 600);
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      this._viewport = viewport;
      this.onScroll = this.onScroll.bind(this);
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerUp = this.onPointerUp.bind(this);
      viewport.addEventListener("scroll", this.onScroll, { passive: true });
      const update = () => this.update();
      this._roViewport = new ResizeObserver(update);
      this._roContent = new ResizeObserver(update);
      this._roViewport.observe(viewport);
      if (this.$refs.content) this._roContent.observe(this.$refs.content);
      this.setState(this.type === "always" ? "visible" : "hidden");
      this.update();
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this._viewport) this._viewport.removeEventListener("scroll", this.onScroll);
      window.removeEventListener("pointermove", this.onPointerMove);
      window.removeEventListener("pointerup", this.onPointerUp);
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
      const bar = this.$refs[`scrollbar${axis === "vertical" ? "Y" : "X"}`];
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
      this.setBarMounted("horizontal", showX);
      this.setBarMounted("vertical", showY);
      this.updateThumbSizes();
      this.updateThumbPositions();
      this.updateCorner();
      if (this.type === "always") this.setState("visible");
      if (this.type === "auto") this.setState(showX || showY ? "visible" : "hidden");
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
        const pos = viewport.scrollTop / maxScroll * Math.max(track, 0);
        this.$refs.thumbY.style.transform = `translate3d(0, ${pos}px, 0)`;
      }
      if (this.$refs.thumbX && this.$refs.scrollbarX && viewport.scrollWidth > viewport.clientWidth) {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        const track = this.$refs.scrollbarX.clientWidth - this.$refs.thumbX.offsetWidth;
        const pos = viewport.scrollLeft / maxScroll * Math.max(track, 0);
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
      if (this.type === "scroll") {
        this.setState("visible");
        if (this.hideTimer) window.clearTimeout(this.hideTimer);
        this.hideTimer = window.setTimeout(() => this.setState("hidden"), this.scrollHideDelay);
      }
    },
    /**
     * Executes the `onPointerEnter` operation.
     * @returns {any} Returns the result of `onPointerEnter` when applicable.
     */
    onPointerEnter() {
      if (this.type === "hover") {
        if (this.hideTimer) window.clearTimeout(this.hideTimer);
        this.setState("visible");
      }
    },
    /**
     * Executes the `onPointerLeave` operation.
     * @returns {any} Returns the result of `onPointerLeave` when applicable.
     */
    onPointerLeave() {
      if (this.type === "hover") {
        if (this.hideTimer) window.clearTimeout(this.hideTimer);
        this.hideTimer = window.setTimeout(() => this.setState("hidden"), this.scrollHideDelay);
      }
    },
    /**
     * Executes the `onTrackPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onTrackPointerDown` when applicable.
     */
    onTrackPointerDown(event) {
      const axis = event.currentTarget?.dataset.orientation || "vertical";
      const scrollbar = this.$refs[`scrollbar${axis === "vertical" ? "Y" : "X"}`];
      if (!scrollbar || scrollbar.hidden) return;
      if (event.target === this.$refs[`thumb${axis === "vertical" ? "Y" : "X"}`]) return;
      const viewport = this.$refs.viewport;
      const thumb = this.$refs[`thumb${axis === "vertical" ? "Y" : "X"}`];
      if (!viewport || !thumb) return;
      const rect = scrollbar.getBoundingClientRect();
      if (axis === "vertical") {
        const clickPos = event.clientY - rect.top - thumb.offsetHeight / 2;
        const track = scrollbar.clientHeight - thumb.offsetHeight;
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        viewport.scrollTop = clickPos / Math.max(track, 1) * maxScroll;
      } else {
        const clickPos = event.clientX - rect.left - thumb.offsetWidth / 2;
        const track = scrollbar.clientWidth - thumb.offsetWidth;
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        viewport.scrollLeft = clickPos / Math.max(track, 1) * maxScroll;
      }
    },
    /**
     * Executes the `onThumbPointerDown` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onThumbPointerDown` when applicable.
     */
    onThumbPointerDown(event) {
      const axis = event.currentTarget?.dataset.orientation || "vertical";
      const thumb = this.$refs[`thumb${axis === "vertical" ? "Y" : "X"}`];
      const scrollbar = this.$refs[`scrollbar${axis === "vertical" ? "Y" : "X"}`];
      if (!thumb || !scrollbar || scrollbar.hidden) return;
      const rect = thumb.getBoundingClientRect();
      this._dragAxis = axis;
      this._dragPointerOffset = axis === "vertical" ? event.clientY - rect.top : event.clientX - rect.left;
      window.addEventListener("pointermove", this.onPointerMove);
      window.addEventListener("pointerup", this.onPointerUp, { once: true });
    },
    /**
     * Executes the `onPointerMove` operation.
     * @param {any} event Input value for this method.
     * @returns {any} Returns the result of `onPointerMove` when applicable.
     */
    onPointerMove(event) {
      const axis = this._dragAxis;
      const viewport = this.$refs.viewport;
      const scrollbar = this.$refs[`scrollbar${axis === "vertical" ? "Y" : "X"}`];
      const thumb = this.$refs[`thumb${axis === "vertical" ? "Y" : "X"}`];
      if (!axis || !viewport || !scrollbar || !thumb || scrollbar.hidden) return;
      const rect = scrollbar.getBoundingClientRect();
      if (axis === "vertical") {
        const pointer = event.clientY - rect.top;
        const track = scrollbar.clientHeight - thumb.offsetHeight;
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        viewport.scrollTop = (pointer - this._dragPointerOffset) / Math.max(track, 1) * maxScroll;
      } else {
        const pointer = event.clientX - rect.left;
        const track = scrollbar.clientWidth - thumb.offsetWidth;
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        viewport.scrollLeft = (pointer - this._dragPointerOffset) / Math.max(track, 1) * maxScroll;
      }
    },
    /**
     * Executes the `onPointerUp` operation.
     * @returns {any} Returns the result of `onPointerUp` when applicable.
     */
    onPointerUp() {
      this._dragAxis = null;
      window.removeEventListener("pointermove", this.onPointerMove);
    }
  };
}
function rzSlider() {
  return {
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    disabled: false,
    inverted: false,
    minStepsBetweenThumbs: 0,
    values: [],
    activeThumbIndex: null,
    dragging: false,
    trackEl: null,
    thumbEls: [],
    inputEls: [],
    init() {
      const dataset = this.$el.dataset;
      const assets = this.parseJson(dataset.assets, []);
      const nonce = dataset.nonce;
      this.min = this.parseNumber(dataset.min, 0);
      this.max = this.parseNumber(dataset.max, 100);
      this.step = Math.max(this.parseNumber(dataset.step, 1), Number.EPSILON);
      this.orientation = dataset.orientation || "horizontal";
      this.disabled = this.parseBoolean(dataset.disabled, false);
      this.inverted = this.parseBoolean(dataset.inverted, false);
      this.minStepsBetweenThumbs = Math.max(this.parseNumber(dataset.minStepsBetweenThumbs, 0), 0);
      this.values = this.parseJson(dataset.values, []).map((value) => this.parseNumber(value, this.min));
      this.trackEl = this.$refs.track;
      this.thumbEls = this.$el.querySelectorAll("[data-thumb-index]");
      this.inputEls = this.$el.querySelectorAll("[data-slider-input]");
      this.values = this.applyConstraints(this.values, -1, null);
      this.syncDom();
      this.syncHiddenInputs();
      if (assets.length > 0) {
        rizzyRequire(assets, nonce);
      }
    },
    handlePointerDown(event) {
      if (this.disabled) {
        return;
      }
      const thumbIndex = this.parseThumbIndex(event.currentTarget);
      if (thumbIndex < 0) {
        return;
      }
      this.activeThumbIndex = thumbIndex;
      this.dragging = true;
      event.currentTarget.focus();
      event.preventDefault();
    },
    handlePointerMove(event) {
      if (this.disabled || !this.dragging || this.activeThumbIndex === null) {
        return;
      }
      const value = this.getPointerValue(event);
      this.values[this.activeThumbIndex] = value;
      this.values = this.applyConstraints(this.values, this.activeThumbIndex, value);
      this.syncDom();
      this.syncHiddenInputs();
    },
    handlePointerUp() {
      this.dragging = false;
      this.activeThumbIndex = null;
    },
    handleTrackPointerDown(event) {
      if (this.disabled) {
        return;
      }
      const value = this.getPointerValue(event);
      const thumbIndex = this.getNearestThumbIndex(value);
      if (thumbIndex < 0) {
        return;
      }
      this.activeThumbIndex = thumbIndex;
      this.values[thumbIndex] = value;
      this.values = this.applyConstraints(this.values, thumbIndex, value);
      this.syncDom();
      this.syncHiddenInputs();
      this.focusThumb(thumbIndex);
      event.preventDefault();
    },
    handleThumbKeyDown(event) {
      if (this.disabled) {
        return;
      }
      const thumbIndex = this.parseThumbIndex(event.currentTarget);
      if (thumbIndex < 0) {
        return;
      }
      const largeStep = this.step * 10;
      const current = this.values[thumbIndex] ?? this.min;
      let nextValue = current;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        nextValue = current + this.step;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        nextValue = current - this.step;
      } else if (event.key === "PageUp") {
        nextValue = current + largeStep;
      } else if (event.key === "PageDown") {
        nextValue = current - largeStep;
      } else if (event.key === "Home") {
        nextValue = this.min;
      } else if (event.key === "End") {
        nextValue = this.max;
      } else {
        return;
      }
      this.values[thumbIndex] = nextValue;
      this.values = this.applyConstraints(this.values, thumbIndex, nextValue);
      this.syncDom();
      this.syncHiddenInputs();
      event.preventDefault();
    },
    syncDom() {
      const normalized = this.values.map((value) => this.valueToPercent(value));
      const minPercent = Math.min(...normalized);
      const maxPercent = Math.max(...normalized);
      if (this.trackEl) {
        this.trackEl.dataset.orientation = this.orientation;
      }
      const rangeEl = this.$refs.range;
      if (rangeEl) {
        rangeEl.dataset.orientation = this.orientation;
        if (this.orientation === "vertical") {
          rangeEl.style.bottom = `${minPercent}%`;
          rangeEl.style.height = `${Math.max(maxPercent - minPercent, 0)}%`;
          rangeEl.style.left = "0";
          rangeEl.style.right = "0";
          rangeEl.style.width = "100%";
        } else {
          rangeEl.style.left = `${minPercent}%`;
          rangeEl.style.width = `${Math.max(maxPercent - minPercent, 0)}%`;
          rangeEl.style.top = "0";
          rangeEl.style.bottom = "0";
          rangeEl.style.height = "100%";
        }
      }
      this.thumbEls.forEach((thumbEl) => {
        const index = this.parseThumbIndex(thumbEl);
        const value = this.values[index] ?? this.min;
        const percent = this.valueToPercent(value);
        thumbEl.dataset.orientation = this.orientation;
        thumbEl.setAttribute("aria-valuenow", `${value}`);
        thumbEl.style.position = "absolute";
        if (this.orientation === "vertical") {
          thumbEl.style.left = "50%";
          thumbEl.style.bottom = `${percent}%`;
          thumbEl.style.transform = "translate(-50%, 50%)";
        } else {
          thumbEl.style.top = "50%";
          thumbEl.style.left = `${percent}%`;
          thumbEl.style.transform = "translate(-50%, -50%)";
        }
      });
    },
    syncHiddenInputs() {
      this.inputEls.forEach((inputEl) => {
        const index = this.parseNumber(inputEl.dataset.inputIndex, 0);
        const value = this.values[index] ?? this.min;
        inputEl.value = `${value}`;
      });
    },
    applyConstraints(values, changedIndex, requestedValue) {
      const count = values.length;
      if (count === 0) {
        return [this.min];
      }
      let constrained = values.map((value) => this.snapValue(value));
      constrained = constrained.map((value) => this.clampValue(value));
      if (changedIndex >= 0 && changedIndex < count) {
        constrained[changedIndex] = this.snapValue(requestedValue ?? constrained[changedIndex]);
        constrained[changedIndex] = this.clampValue(constrained[changedIndex]);
      } else {
        constrained = [...constrained].sort((a, b) => a - b);
      }
      const gap = this.minStepsBetweenThumbs;
      for (let index = 1; index < count; index += 1) {
        const minimum = constrained[index - 1] + gap;
        if (constrained[index] < minimum) {
          constrained[index] = this.clampValue(this.snapValue(minimum));
        }
      }
      for (let index = count - 2; index >= 0; index -= 1) {
        const maximum = constrained[index + 1] - gap;
        if (constrained[index] > maximum) {
          constrained[index] = this.clampValue(this.snapValue(maximum));
        }
      }
      return constrained;
    },
    snapValue(value) {
      const snapped = this.min + Math.round((value - this.min) / this.step) * this.step;
      return Number(snapped.toFixed(6));
    },
    getNearestThumbIndex(value) {
      if (this.values.length === 0) {
        return -1;
      }
      let nearestIndex = 0;
      let nearestDistance = Number.MAX_VALUE;
      this.values.forEach((current, index) => {
        const distance = Math.abs(current - value);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      return nearestIndex;
    },
    getPointerValue(event) {
      if (!this.trackEl) {
        return this.min;
      }
      const rect = this.trackEl.getBoundingClientRect();
      const denominator = this.orientation === "vertical" ? rect.height : rect.width;
      if (denominator <= 0) {
        return this.min;
      }
      let ratio;
      if (this.orientation === "vertical") {
        ratio = (rect.bottom - event.clientY) / denominator;
      } else {
        ratio = (event.clientX - rect.left) / denominator;
      }
      ratio = Math.min(Math.max(ratio, 0), 1);
      if (this.inverted) {
        ratio = 1 - ratio;
      }
      const value = this.min + ratio * (this.max - this.min);
      return this.snapValue(this.clampValue(value));
    },
    valueToPercent(value) {
      const range = this.max - this.min;
      if (range <= 0) {
        return 0;
      }
      const normalized = (value - this.min) / range;
      const ratio = this.inverted ? 1 - normalized : normalized;
      return Math.min(Math.max(ratio * 100, 0), 100);
    },
    clampValue(value) {
      return Math.min(Math.max(value, this.min), this.max);
    },
    focusThumb(index) {
      const thumb = this.$el.querySelector(`[data-thumb-index="${index}"]`);
      if (thumb) {
        thumb.focus();
      }
    },
    parseThumbIndex(element) {
      if (!element) {
        return -1;
      }
      return this.parseNumber(element.dataset.thumbIndex, -1);
    },
    parseBoolean(value, fallback) {
      if (value === "true") {
        return true;
      }
      if (value === "false") {
        return false;
      }
      return fallback;
    },
    parseNumber(value, fallback) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    },
    parseJson(value, fallback) {
      try {
        return JSON.parse(value || "null") ?? fallback;
      } catch {
        return fallback;
      }
    }
  };
}
export {
  rzCombobox,
  rzFileInput,
  rzInputOTP,
  rzScrollArea,
  rzSlider
};
//# sourceMappingURL=advanced-input-runtime-Dkgw5Eva.js.map

import { r as rizzyRequire } from "./bootstrap-DmUTAXwT.js";
function rzCarousel() {
  function parseJsonFromScriptId(id) {
    if (!id) return {};
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[rzCarousel] JSON script element #${id} not found.`);
      return {};
    }
    try {
      return JSON.parse(el.textContent || "{}");
    } catch (e) {
      console.error(`[rzCarousel] Failed to parse JSON from #${id}:`, e);
      return {};
    }
  }
  return {
    emblaApi: null,
    canScrollPrev: false,
    canScrollNext: false,
    selectedIndex: 0,
    scrollSnaps: [],
    /**
     * Executes the `init` operation.
     * @returns {any} Returns the result of `init` when applicable.
     */
    init() {
      const assetsToLoad = (() => {
        try {
          return JSON.parse(this.$el.dataset.assets || "[]");
        } catch (e) {
          console.error("[rzCarousel] Bad assets JSON:", e);
          return [];
        }
      })();
      const nonce = this.$el.dataset.nonce || "";
      const config = parseJsonFromScriptId(this.$el.dataset.config);
      const options = config.Options || {};
      const pluginsConfig = config.Plugins || [];
      const self = this;
      if (assetsToLoad.length > 0 && typeof rizzyRequire === "function") {
        rizzyRequire(
          assetsToLoad,
          {
            /**
             * Executes the `success` operation.
             * @returns {any} Returns the result of `success` when applicable.
             */
            success() {
              if (window.EmblaCarousel) {
                self.initializeEmbla(options, pluginsConfig);
              } else {
                console.error("[rzCarousel] EmblaCarousel not found on window after loading assets.");
              }
            },
            /**
             * Executes the `error` operation.
             * @param {any} err Input value for this method.
             * @returns {any} Returns the result of `error` when applicable.
             */
            error(err) {
              console.error("[rzCarousel] Failed to load EmblaCarousel assets.", err);
            }
          },
          nonce
        );
      } else {
        if (window.EmblaCarousel) {
          this.initializeEmbla(options, pluginsConfig);
        } else {
          console.error("[rzCarousel] EmblaCarousel not found and no assets specified for loading.");
        }
      }
    },
    /**
     * Executes the `initializeEmbla` operation.
     * @param {any} options Input value for this method.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `initializeEmbla` when applicable.
     */
    initializeEmbla(options, pluginsConfig) {
      const viewport = this.$el.querySelector('[x-ref="viewport"]');
      if (!viewport) {
        console.error('[rzCarousel] Carousel viewport with x-ref="viewport" not found.');
        return;
      }
      const instantiatedPlugins = this.instantiatePlugins(pluginsConfig);
      this.emblaApi = window.EmblaCarousel(viewport, options, instantiatedPlugins);
      this.emblaApi.on("select", this.onSelect.bind(this));
      this.emblaApi.on("reInit", this.onSelect.bind(this));
      this.onSelect();
    },
    /**
     * Executes the `instantiatePlugins` operation.
     * @param {any} pluginsConfig Input value for this method.
     * @returns {any} Returns the result of `instantiatePlugins` when applicable.
     */
    instantiatePlugins(pluginsConfig) {
      if (!Array.isArray(pluginsConfig) || pluginsConfig.length === 0) {
        return [];
      }
      return pluginsConfig.map((pluginInfo) => {
        const constructor = window[pluginInfo.Name];
        if (typeof constructor !== "function") {
          console.error(`[rzCarousel] Plugin constructor '${pluginInfo.Name}' not found on window object.`);
          return null;
        }
        try {
          return constructor(pluginInfo.Options || {});
        } catch (e) {
          console.error(`[rzCarousel] Error instantiating plugin '${pluginInfo.Name}':`, e);
          return null;
        }
      }).filter(Boolean);
    },
    /**
     * Executes the `destroy` operation.
     * @returns {any} Returns the result of `destroy` when applicable.
     */
    destroy() {
      if (this.emblaApi) this.emblaApi.destroy();
    },
    /**
     * Executes the `onSelect` operation.
     * @returns {any} Returns the result of `onSelect` when applicable.
     */
    onSelect() {
      if (!this.emblaApi) return;
      this.selectedIndex = this.emblaApi.selectedScrollSnap();
      this.canScrollPrev = this.emblaApi.canScrollPrev();
      this.canScrollNext = this.emblaApi.canScrollNext();
      this.scrollSnaps = this.emblaApi.scrollSnapList();
    },
    cannotScrollPrev() {
      return !this.canScrollPrev;
    },
    cannotScrollNext() {
      return !this.canScrollNext;
    },
    scrollPrev() {
      this.emblaApi?.scrollPrev();
    },
    scrollNext() {
      this.emblaApi?.scrollNext();
    },
    scrollTo(index) {
      this.emblaApi?.scrollTo(index);
    }
  };
}
function rzChart() {
  return {
    chartInstance: null,
    themeChangeHandler: null,
    init() {
      const assetsToLoad = JSON.parse(this.$el.dataset.assets || "[]");
      const nonce = this.$el.dataset.nonce || "";
      const configScriptId = this.$el.dataset.configId;
      if (assetsToLoad.length > 0 && typeof rizzyRequire === "function") {
        rizzyRequire(assetsToLoad, {
          success: () => this.tryInitializeChart(configScriptId),
          error: (error) => console.error("[rzChart] Failed to load Chart.js assets.", error)
        }, nonce);
        return;
      }
      this.tryInitializeChart(configScriptId);
    },
    tryInitializeChart(configScriptId) {
      if (!window.Chart) {
        console.error("[rzChart] Chart.js was not found on window.");
        return;
      }
      const configEl = document.getElementById(configScriptId);
      if (!configEl) {
        console.error(`[rzChart] Could not find configuration script with ID: ${configScriptId}`);
        return;
      }
      let rawConfig = {};
      try {
        rawConfig = JSON.parse(configEl.textContent || "{}");
      } catch (error) {
        console.error("[rzChart] Failed to parse JSON configuration.", error);
        return;
      }
      this.resolveColorValues(rawConfig);
      this.resolveCallbacks(rawConfig);
      if (rawConfig.options) {
        rawConfig.options.responsive = rawConfig.options.responsive ?? true;
        rawConfig.options.maintainAspectRatio = rawConfig.options.maintainAspectRatio ?? false;
      }
      const canvas = this.$refs.canvas;
      if (!canvas) {
        console.error("[rzChart] Canvas reference was not found.");
        return;
      }
      this.chartInstance = new window.Chart(canvas, rawConfig);
      this.themeChangeHandler = () => {
        if (this.chartInstance) {
          this.chartInstance.update();
        }
      };
      window.addEventListener("rz:theme-change", this.themeChangeHandler);
    },
    resolveColorValues(config) {
      const walk = (value) => {
        if (Array.isArray(value)) {
          return value.map((item) => walk(item));
        }
        if (!value || typeof value !== "object") {
          return value;
        }
        for (const key of Object.keys(value)) {
          const currentValue = value[key];
          if (typeof key === "string" && key.toLowerCase().includes("color")) {
            if (Array.isArray(currentValue)) {
              value[key] = currentValue.map((entry) => this._resolveColor(entry));
              continue;
            }
            if (currentValue && typeof currentValue === "object") {
              walk(currentValue);
              continue;
            }
            value[key] = this._resolveColor(currentValue);
            continue;
          }
          if (currentValue && typeof currentValue === "object") {
            walk(currentValue);
          }
        }
        return value;
      };
      walk(config);
    },
    _resolveColor(color, el = document.documentElement) {
      if (typeof color !== "string") {
        return color;
      }
      const value = color.trim();
      if (!value.startsWith("var(")) {
        return value;
      }
      const inner = value.slice(4, -1).trim();
      const [varName, fallback] = inner.split(",").map((part) => part.trim());
      if (!varName) {
        return value;
      }
      const resolved = getComputedStyle(el).getPropertyValue(varName).trim();
      return resolved || fallback || value;
    },
    resolveCallbacks(config) {
      if (!config || !config.options) {
        return;
      }
      const resolveStringFn = (fnName) => {
        if (typeof fnName !== "string") {
          return fnName;
        }
        const parts = fnName.replace("window.", "").split(".");
        let context = window;
        for (const part of parts) {
          if (context[part] === void 0) {
            return fnName;
          }
          context = context[part];
        }
        return typeof context === "function" ? context : fnName;
      };
      if (config.options.plugins?.tooltip?.callbacks) {
        const callbacks = config.options.plugins.tooltip.callbacks;
        for (const key of Object.keys(callbacks)) {
          callbacks[key] = resolveStringFn(callbacks[key]);
        }
      }
      if (config.options.scales) {
        for (const scaleKey of Object.keys(config.options.scales)) {
          const scale = config.options.scales[scaleKey];
          if (scale.ticks && scale.ticks.callback) {
            scale.ticks.callback = resolveStringFn(scale.ticks.callback);
          }
        }
      }
    },
    destroy() {
      if (this.themeChangeHandler) {
        window.removeEventListener("rz:theme-change", this.themeChangeHandler);
        this.themeChangeHandler = null;
      }
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
    }
  };
}
function rzHighlighter() {
  return {
    annotation: null,
    resizeObserver: null,
    intersectionObserver: null,
    rafId: 0,
    hasShown: false,
    config: null,
    init() {
      this.config = this.readConfig();
      const assets = this.parseAssets(this.$el.dataset.assets);
      const nonce = this.$el.dataset.nonce;
      rizzyRequire(assets, {
        success: () => {
          this.start();
        },
        error: () => {
          console.error("Failed to load assets for rzHighlighter.");
        }
      }, nonce);
    },
    destroy() {
      this.cleanup();
    },
    readConfig() {
      const dataset = this.$el.dataset ?? {};
      return {
        action: dataset.action || "highlight",
        color: dataset.color || "#ffd1dc",
        strokeWidth: this.toNumber(dataset.strokeWidth, 1.5),
        animationDuration: this.toInteger(dataset.animationDuration, 600),
        iterations: this.toInteger(dataset.iterations, 2),
        padding: this.toInteger(dataset.padding, 2),
        multiline: this.toBool(dataset.multiline, true),
        startOnView: this.toBool(dataset.startOnView, false),
        viewMargin: dataset.viewMargin || "-10%"
      };
    },
    parseAssets(value) {
      if (!value) {
        return [];
      }
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },
    start() {
      if (this.config.startOnView) {
        this.observeViewport();
        return;
      }
      this.showAnnotation();
    },
    observeViewport() {
      const target = this.$refs.target;
      if (!target || typeof IntersectionObserver === "undefined") {
        this.showAnnotation();
        return;
      }
      this.intersectionObserver = new IntersectionObserver((entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (!isVisible || this.hasShown) {
          return;
        }
        this.showAnnotation();
        this.intersectionObserver?.disconnect();
        this.intersectionObserver = null;
      }, { rootMargin: this.config.viewMargin });
      this.intersectionObserver.observe(target);
    },
    showAnnotation() {
      const target = this.$refs.target;
      const annotate = window.RoughNotation?.annotate;
      if (!target || typeof annotate !== "function") {
        return;
      }
      if (!this.annotation) {
        this.annotation = annotate(target, {
          type: this.config.action,
          color: this.config.color,
          strokeWidth: this.config.strokeWidth,
          animationDuration: this.config.animationDuration,
          iterations: this.config.iterations,
          padding: this.config.padding,
          multiline: this.config.multiline
        });
      }
      this.annotation.show();
      this.hasShown = true;
      this.observeResize();
    },
    observeResize() {
      const target = this.$refs.target;
      if (!target || typeof ResizeObserver === "undefined" || this.resizeObserver) {
        return;
      }
      this.resizeObserver = new ResizeObserver(() => {
        this.scheduleRefresh();
      });
      this.resizeObserver.observe(target);
      this.resizeObserver.observe(document.body);
    },
    scheduleRefresh() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      this.rafId = requestAnimationFrame(() => {
        this.refreshAnnotation();
      });
    },
    refreshAnnotation() {
      if (!this.hasShown || !this.annotation) {
        return;
      }
      this.annotation.hide();
      this.annotation.show();
    },
    removeAnnotation() {
      if (!this.annotation) {
        return;
      }
      this.annotation.remove();
      this.annotation = null;
    },
    cleanup() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
      this.resizeObserver?.disconnect();
      this.intersectionObserver?.disconnect();
      this.resizeObserver = null;
      this.intersectionObserver = null;
      this.removeAnnotation();
    },
    toBool(value, fallback) {
      if (value === "true") {
        return true;
      }
      if (value === "false") {
        return false;
      }
      return fallback;
    },
    toInteger(value, fallback) {
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? fallback : parsed;
    },
    toNumber(value, fallback) {
      const parsed = Number.parseFloat(value);
      return Number.isNaN(parsed) ? fallback : parsed;
    }
  };
}
function rzNumberTicker() {
  return {
    targetValue: 0,
    startValue: 0,
    currentValue: 0,
    destinationValue: 0,
    direction: "up",
    delayMs: 0,
    decimalPlaces: 0,
    culture: "",
    useGrouping: true,
    triggerOnView: true,
    animateOnce: true,
    disableAnimation: false,
    hasAnimated: false,
    observer: null,
    rafId: null,
    delayTimer: null,
    animationStartTimestamp: 0,
    animationStartValue: 0,
    animationDurationMs: 1200,
    init() {
      this.configure();
      if (this.disableAnimation || this.targetValue === this.startValue || !this.canSafelyAnimate()) {
        this.setDisplay(this.destinationValue);
        return;
      }
      if (this.triggerOnView) {
        this.observe();
        return;
      }
      this.startAnimation();
    },
    configure() {
      const dataset = this.$el.dataset;
      this.targetValue = this.parseNumber(dataset.value, 0);
      this.startValue = this.parseNumber(dataset.startValue, 0);
      this.direction = (dataset.direction || "up").toLowerCase() === "down" ? "down" : "up";
      this.delayMs = Math.max(0, this.parseNumber(dataset.delay, 0) * 1e3);
      this.decimalPlaces = Math.max(0, this.parseInteger(dataset.decimalPlaces, 0));
      this.culture = (dataset.culture || "").trim();
      this.useGrouping = this.parseBoolean(dataset.useGrouping, true);
      this.triggerOnView = this.parseBoolean(dataset.triggerOnView, true);
      this.animateOnce = this.parseBoolean(dataset.animateOnce, true);
      this.disableAnimation = this.parseBoolean(dataset.disableAnimation, false);
      this.currentValue = this.direction === "down" ? this.targetValue : this.startValue;
      this.destinationValue = this.direction === "down" ? this.startValue : this.targetValue;
      const distance = Math.abs(this.destinationValue - this.currentValue);
      this.animationDurationMs = this.resolveDuration(distance);
    },
    observe() {
      if (typeof IntersectionObserver !== "function") {
        this.startAnimation();
        return;
      }
      this.observer = new IntersectionObserver((entries) => {
        this.handleIntersect(entries);
      }, { threshold: 0.1 });
      this.observer.observe(this.$el);
    },
    handleIntersect(entries) {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        if (this.animateOnce && this.hasAnimated) {
          return;
        }
        this.startAnimation();
        if (this.animateOnce && this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
        return;
      }
    },
    startAnimation() {
      this.cleanupAnimation();
      this.currentValue = this.direction === "down" ? this.targetValue : this.startValue;
      this.animationStartValue = this.currentValue;
      this.animationStartTimestamp = 0;
      this.setDisplay(this.currentValue);
      this.delayTimer = window.setTimeout(() => {
        this.delayTimer = null;
        this.rafId = window.requestAnimationFrame((timestamp) => this.tick(timestamp));
      }, this.delayMs);
    },
    tick(timestamp) {
      if (this.animationStartTimestamp === 0) {
        this.animationStartTimestamp = timestamp;
      }
      const elapsed = Math.max(0, timestamp - this.animationStartTimestamp);
      const progress = Math.min(1, elapsed / this.animationDurationMs);
      const easedProgress = this.easeOutCubic(progress);
      const nextValue = this.interpolate(this.animationStartValue, this.destinationValue, easedProgress);
      this.currentValue = this.clampToDirection(nextValue);
      this.setDisplay(this.currentValue);
      if (progress >= 1) {
        this.complete();
        return;
      }
      this.rafId = window.requestAnimationFrame((nextTimestamp) => this.tick(nextTimestamp));
    },
    formatNumber(value) {
      const rounded = Number(value.toFixed(this.decimalPlaces));
      const format = (locale) => new Intl.NumberFormat(locale, {
        minimumFractionDigits: this.decimalPlaces,
        maximumFractionDigits: this.decimalPlaces,
        useGrouping: this.useGrouping
      }).format(rounded);
      try {
        if (this.culture) {
          return format(this.culture);
        }
      } catch (_) {
      }
      try {
        if (navigator.language) {
          return format(navigator.language);
        }
      } catch (_) {
      }
      return format("en-US");
    },
    setDisplay(value) {
      if (this.$refs.value) {
        this.$refs.value.textContent = this.formatNumber(value);
      }
    },
    complete() {
      this.currentValue = this.destinationValue;
      this.hasAnimated = true;
      this.setDisplay(this.destinationValue);
      this.cleanupAnimation();
    },
    cleanupAnimation() {
      if (this.delayTimer !== null) {
        window.clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
      if (this.rafId !== null) {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    },
    cleanup() {
      this.cleanupAnimation();
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },
    canSafelyAnimate() {
      const inSafeRange = (value) => Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
      return inSafeRange(this.startValue) && inSafeRange(this.targetValue);
    },
    resolveDuration(distance) {
      if (distance < 10) {
        return 700;
      }
      if (distance < 100) {
        return 900;
      }
      if (distance < 1e3) {
        return 1200;
      }
      return 1500;
    },
    interpolate(from, to, progress) {
      return from + (to - from) * progress;
    },
    clampToDirection(value) {
      if (this.direction === "down") {
        return Math.max(this.destinationValue, value);
      }
      return Math.min(this.destinationValue, value);
    },
    easeOutCubic(progress) {
      return 1 - Math.pow(1 - progress, 3);
    },
    parseNumber(value, fallback) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    },
    parseInteger(value, fallback) {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) ? parsed : fallback;
    },
    parseBoolean(value, fallback) {
      if (typeof value !== "string") {
        return fallback;
      }
      if (value.toLowerCase() === "true") {
        return true;
      }
      if (value.toLowerCase() === "false") {
        return false;
      }
      return fallback;
    }
  };
}
function rzShineBorder() {
  return {
    computedStyle: "",
    init() {
      const dataset = this.$el.dataset;
      const borderWidth = Math.max(this.parseNumber(dataset.borderWidth, 1), 0);
      const duration = this.parseNumber(dataset.duration, 14) > 0 ? this.parseNumber(dataset.duration, 14) : 14;
      const shineColor = typeof dataset.shineColor === "string" ? dataset.shineColor.trim() : "";
      const shineColors = this.parseJson(dataset.shineColors, []).filter((value) => typeof value === "string").map((value) => value.trim()).filter((value) => value.length > 0);
      const fallbackColors = [
        "var(--color-border)",
        "color-mix(in oklab, var(--color-border) 75%, transparent)"
      ];
      const gradientColors = shineColors.length > 0 ? shineColors.join(",") : shineColor.length > 0 ? shineColor : fallbackColors.join(",");
      this.computedStyle = [
        `--border-width:${borderWidth}px`,
        `--duration:${duration}s`,
        `background-image:radial-gradient(transparent,transparent,${gradientColors},transparent,transparent)`,
        "background-size:300% 300%",
        "mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
        "-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
        "-webkit-mask-composite:xor",
        "mask-composite:exclude",
        "padding:var(--border-width)"
      ].join(";");
    },
    parseNumber(value, fallback) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    },
    parseJson(value, fallback) {
      if (typeof value !== "string" || value.length === 0) {
        return fallback;
      }
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    }
  };
}
function rzTypingAnimation() {
  return {
    config: null,
    words: [],
    segmentedWords: [],
    displayText: "",
    currentWordIndex: 0,
    currentCharIndex: 0,
    phase: "typing",
    started: false,
    completed: false,
    cursorVisible: false,
    cursorChar: "|",
    cursorBlinkClass: "",
    timerId: null,
    observer: null,
    supportsIntersectionObserver: typeof window !== "undefined" && typeof window.IntersectionObserver !== "undefined",
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
        const serialized = this.$el.dataset.config || "{}";
        const parsed = JSON.parse(serialized);
        const typeSpeed = this.clampPositive(parsed.typeSpeed ?? parsed.duration ?? 100);
        const deleteSpeed = this.clampPositive(parsed.deleteSpeed ?? Math.max(Math.floor(typeSpeed / 2), 1));
        this.config = {
          words: Array.isArray(parsed.words) ? parsed.words : null,
          duration: this.clampPositive(parsed.duration ?? 100),
          typeSpeed,
          deleteSpeed,
          delay: this.clampZeroOrGreater(parsed.delay ?? 0),
          pauseDelay: this.clampZeroOrGreater(parsed.pauseDelay ?? 1e3),
          loop: Boolean(parsed.loop),
          startOnView: parsed.startOnView !== false,
          showCursor: parsed.showCursor !== false,
          blinkCursor: parsed.blinkCursor !== false,
          cursorStyle: parsed.cursorStyle || "line"
        };
      } catch {
        this.config = {
          words: null,
          duration: 100,
          typeSpeed: 100,
          deleteSpeed: 50,
          delay: 0,
          pauseDelay: 1e3,
          loop: false,
          startOnView: true,
          showCursor: true,
          blinkCursor: true,
          cursorStyle: "line"
        };
      }
      this.cursorChar = this.getCursorChar(this.config.cursorStyle);
      this.cursorBlinkClass = this.config.blinkCursor ? "animate-blink-cursor" : "";
    },
    resolveWords() {
      const explicitWords = Array.isArray(this.config.words) ? this.config.words.filter((word) => typeof word === "string") : [];
      if (explicitWords.length > 0) {
        this.words = explicitWords;
      } else if (this.$refs.source) {
        const sourceText = (this.$refs.source.textContent || "").trim();
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
      if (this.phase === "typing") {
        this.typeNextCharacter();
        return;
      }
      if (this.phase === "pause") {
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
        this.displayText = graphemes.slice(0, this.currentCharIndex).join("");
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
        this.phase = "pause";
        this.scheduleTick(this.config.pauseDelay);
      }
    },
    pauseBeforeDelete() {
      this.phase = "deleting";
      this.scheduleTick(this.config.deleteSpeed);
    },
    deletePreviousCharacter() {
      const graphemes = this.segmentedWords[this.currentWordIndex] || [];
      if (this.currentCharIndex > 0) {
        this.currentCharIndex -= 1;
        this.displayText = graphemes.slice(0, this.currentCharIndex).join("");
        this.updateCursorState();
        this.scheduleTick(this.config.deleteSpeed);
        return;
      }
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      this.phase = "typing";
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
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
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
      if (style === "block") {
        return "▌";
      }
      if (style === "underscore") {
        return "_";
      }
      return "|";
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
  };
}
export {
  rzCarousel,
  rzChart,
  rzHighlighter,
  rzNumberTicker,
  rzShineBorder,
  rzTypingAnimation
};
//# sourceMappingURL=content-visual-runtime-BPn_T4Hh.js.map

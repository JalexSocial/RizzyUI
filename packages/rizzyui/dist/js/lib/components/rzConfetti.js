import confettiModule from 'canvas-confetti';
import { require } from '../../runtime/rizzyRequire.js';

const DEFAULT_CUSTOM_EVENT = 'rz:confetti';

function parseBool(value, fallback = false) {
    if (typeof value !== 'string') return fallback;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    return fallback;
}

function parseIntSafe(value, fallback = 0) {
    const parsed = Number.parseInt(value ?? '', 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function kebabToCamel(value) {
    return (value || '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function rzConfetti() {
    return {
        confettiFactory: null,
        trigger: 'click',
        mode: 'element-origin',
        preset: 'default-burst',
        disabled: false,
        once: false,
        cooldownMs: 0,
        burstCount: 1,
        burstIntervalMs: 150,
        eventName: DEFAULT_CUSTOM_EVENT,
        launchFromElementCenter: true,
        launchFromPointer: false,
        resizeCanvas: true,
        useWorker: false,
        zIndex: 100,
        options: {},
        hasFired: false,
        lastFiredAt: 0,
        customEventHandler: null,
        intersectionObserver: null,

        init() {
            const assets = JSON.parse(this.$el.dataset.assets || '[]');
            const nonce = this.$el.dataset.nonce || '';
            this.readConfig();

            if (assets.length > 0 && typeof require === 'function') {
                require(assets, {
                    success: () => this.setup(),
                    error: (error) => {
                        console.error('[rzConfetti] Failed to load confetti assets.', error);
                        this.setup();
                    }
                }, nonce);
                return;
            }

            this.setup();
        },

        readConfig() {
            this.trigger = this.$el.dataset.trigger || 'click';
            this.mode = this.$el.dataset.mode || 'element-origin';
            this.preset = this.$el.dataset.preset || 'default-burst';
            this.disabled = parseBool(this.$el.dataset.disabled, false);
            this.once = parseBool(this.$el.dataset.once, false);
            this.cooldownMs = parseIntSafe(this.$el.dataset.cooldownMs, 0);
            this.burstCount = Math.max(1, parseIntSafe(this.$el.dataset.burstCount, 1));
            this.burstIntervalMs = Math.max(0, parseIntSafe(this.$el.dataset.burstIntervalMs, 150));
            this.eventName = this.$el.dataset.eventName || DEFAULT_CUSTOM_EVENT;
            this.launchFromElementCenter = parseBool(this.$el.dataset.launchFromElementCenter, true);
            this.launchFromPointer = parseBool(this.$el.dataset.launchFromPointer, false);
            this.resizeCanvas = parseBool(this.$el.dataset.resizeCanvas, true);
            this.useWorker = parseBool(this.$el.dataset.useWorker, false);
            this.zIndex = parseIntSafe(this.$el.dataset.zIndex, 100);

            try {
                this.options = JSON.parse(this.$el.dataset.options || '{}');
            } catch {
                this.options = {};
            }
        },

        setup() {
            this.bindTriggers();
            this.exposeManualApi();

            if (this.trigger === 'load') {
                this.fire();
            }
        },

        bindTriggers() {
            if (this.trigger === 'custom-event') {
                this.customEventHandler = (event) => this.handleCustomEvent(event);
                window.addEventListener(this.eventName, this.customEventHandler);
            }

            if (this.trigger === 'visible') {
                this.intersectionObserver = new IntersectionObserver((entries) => this.handleVisibility(entries), {
                    threshold: 0.25,
                });
                this.intersectionObserver.observe(this.$el);
            }
        },

        exposeManualApi() {
            this.$el.rzConfetti = {
                fire: (originOverride) => this.fireSequence(originOverride),
                fireOnce: () => this.fire()
            };
        },

        fireFromClick() {
            if (this.trigger !== 'click') return;
            this.fire();
        },

        fireFromHover() {
            if (this.trigger !== 'hover') return;
            this.fire();
        },

        fire(event) {
            const originOverride = this.resolveOrigin(event);
            this.fireSequence(originOverride);
        },

        async fireSequence(originOverride) {
            if (!this.canFire()) return;

            const iterations = this.preset === 'victory' ? Math.max(this.burstCount, 3) : this.burstCount;

            for (let i = 0; i < iterations; i += 1) {
                const options = this.buildOptions(originOverride, i, iterations);
                const instance = this.ensureInstance();
                if (!instance) return;

                instance(options);

                if (i < iterations - 1 && this.burstIntervalMs > 0) {
                    await wait(this.burstIntervalMs);
                }
            }

            this.hasFired = true;
            this.lastFiredAt = Date.now();

            if (this.once && this.intersectionObserver) {
                this.intersectionObserver.disconnect();
                this.intersectionObserver = null;
            }
        },

        buildOptions(originOverride, sequenceIndex = 0, totalIterations = 1) {
            const presetOptions = this.getPresetOptions(sequenceIndex, totalIterations);
            const merged = { ...presetOptions, ...this.options };

            if (originOverride) {
                merged.origin = originOverride;
            }

            if (typeof this.options.originX === 'number' || typeof this.options.originY === 'number') {
                merged.origin = {
                    x: typeof this.options.originX === 'number' ? this.options.originX : (merged.origin?.x ?? 0.5),
                    y: typeof this.options.originY === 'number' ? this.options.originY : (merged.origin?.y ?? 0.5)
                };
            }

            merged.disableForReducedMotion = this.options.disableForReducedMotion ?? true;
            return merged;
        },

        getPresetOptions(sequenceIndex = 0, totalIterations = 1) {
            const common = {
                particleCount: 80,
                spread: 70,
                startVelocity: 45,
                zIndex: this.zIndex,
                scalar: 1,
                origin: { x: 0.5, y: 0.55 }
            };

            const presets = {
                defaultBurst: common,
                cannonLeft: { ...common, angle: 60, origin: { x: 0.1, y: 0.9 } },
                cannonRight: { ...common, angle: 120, origin: { x: 0.9, y: 0.9 } },
                dualCannons: sequenceIndex % 2 === 0
                    ? { ...common, angle: 60, origin: { x: 0.1, y: 0.9 } }
                    : { ...common, angle: 120, origin: { x: 0.9, y: 0.9 } },
                victory: {
                    ...common,
                    particleCount: 120,
                    spread: 100,
                    startVelocity: 55,
                    origin: { x: 0.5, y: Math.max(0.1, 0.65 - (sequenceIndex / Math.max(1, totalIterations - 1)) * 0.3) }
                },
                subtle: { ...common, particleCount: 30, spread: 45, startVelocity: 28, scalar: 0.85 },
                stars: { ...common, shapes: ['star'], particleCount: 60, spread: 80 }
            };

            const presetKey = kebabToCamel(this.preset);
            return presets[presetKey] || common;
        },

        resolveOrigin(event) {
            if (this.mode === 'overlay') {
                return null;
            }

            if (this.mode === 'scoped') {
                return { x: 0.5, y: 0.5 };
            }

            if (this.launchFromPointer && event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
                return {
                    x: event.clientX / window.innerWidth,
                    y: event.clientY / window.innerHeight
                };
            }

            if (this.launchFromElementCenter) {
                const rect = this.$el.getBoundingClientRect();
                return {
                    x: (rect.left + (rect.width / 2)) / window.innerWidth,
                    y: (rect.top + (rect.height / 2)) / window.innerHeight
                };
            }

            return null;
        },

        ensureInstance() {
            if (this.confettiFactory) return this.confettiFactory;

            const confetti = window.confetti || confettiModule;
            if (typeof confetti !== 'function' && typeof confetti?.create !== 'function') {
                console.error('[rzConfetti] canvas-confetti was not found.');
                return null;
            }

            const moduleOrWindowConfetti = typeof confetti === 'function' ? confetti : confettiModule;

            if (this.mode === 'scoped') {
                const canvas = this.$refs.canvas || this.$el.querySelector('canvas');
                if (!canvas) {
                    console.error('[rzConfetti] Scoped mode requires a canvas element.');
                    return null;
                }

                this.confettiFactory = moduleOrWindowConfetti.create(canvas, {
                    resize: this.resizeCanvas,
                    useWorker: this.useWorker
                });
                return this.confettiFactory;
            }

            if (typeof confetti === 'function') {
                this.confettiFactory = confetti;
            } else {
                this.confettiFactory = moduleOrWindowConfetti;
            }

            return this.confettiFactory;
        },

        handleCustomEvent(event) {
            if (this.trigger !== 'custom-event') return;
            this.fireSequence(this.resolveOrigin(event?.detail?.event));
        },

        handleVisibility(entries) {
            const hasIntersection = entries.some((entry) => entry.isIntersecting);
            if (!hasIntersection || this.trigger !== 'visible') return;
            this.fire();
        },

        canFire() {
            if (this.disabled) return false;
            if (this.once && this.hasFired) return false;
            if (this.cooldownMs <= 0) return true;
            return (Date.now() - this.lastFiredAt) >= this.cooldownMs;
        },

        destroy() {
            if (this.customEventHandler) {
                window.removeEventListener(this.eventName, this.customEventHandler);
                this.customEventHandler = null;
            }

            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
                this.intersectionObserver = null;
            }

            if (this.$el && this.$el.rzConfetti) {
                delete this.$el.rzConfetti;
            }
        }
    };
}

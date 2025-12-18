
// --------------------------------------------------------------------------------
// Theme Controller (Singleton)
// Manages localStorage, OS preference listeners, and DOM class manipulation.
// This is pure vanilla JS and can be used outside of Alpine.
// --------------------------------------------------------------------------------

class ThemeController {
    constructor() {
        this.storageKey = 'darkMode';
        this.eventName = 'rz:theme-change';
        this.darkClass = 'dark';

        this._mode = 'auto'; // 'light' | 'dark' | 'auto'
        this._mq = null;

        this._initialized = false;
        this._onMqChange = null;
        this._onStorage = null;

        // Optimization: track last applied state to prevent redundant DOM writes/events.
        // We include prefersDark to ensure we broadcast OS changes even if the 
        // calculated 'effectiveDark' result doesn't change (e.g. in explicit mode).
        this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null };
    }

    init() {
        if (this._initialized) return;
        if (typeof window === 'undefined') return;

        this._initialized = true;

        // Media query support guard
        this._mq = typeof window.matchMedia === 'function'
            ? window.matchMedia('(prefers-color-scheme: dark)')
            : null;

        // Load persisted state (guarded)
        const raw = this._safeReadStorage(this.storageKey);
        this._mode = this._normalizeMode(raw ?? 'auto');

        // Apply immediately to ensure JS state matches DOM (idempotent)
        this._sync();

        // Listen for OS changes
        this._onMqChange = () => {
            // Unconditionally sync. The snapshot guard in _sync() will determine
            // if an event needs to be emitted.
            this._sync();
        };

        if (this._mq) {
            // Compatibility for older browsers/Safari
            if (typeof this._mq.addEventListener === 'function') {
                this._mq.addEventListener('change', this._onMqChange);
            } else if (typeof this._mq.addListener === 'function') {
                this._mq.addListener(this._onMqChange);
            }
        }

        // Cross-tab synchronization
        this._onStorage = (e) => {
            if (e.key !== this.storageKey) return;
            const next = this._normalizeMode(e.newValue ?? 'auto');
            if (next !== this._mode) {
                this._mode = next;
                this._sync();
            }
        };
        window.addEventListener('storage', this._onStorage);
    }

    destroy() {
        if (!this._initialized) return;
        this._initialized = false;

        if (this._mq && this._onMqChange) {
            if (typeof this._mq.removeEventListener === 'function') {
                this._mq.removeEventListener('change', this._onMqChange);
            } else if (typeof this._mq.removeListener === 'function') {
                this._mq.removeListener(this._onMqChange);
            }
        }

        if (typeof window !== 'undefined' && this._onStorage) {
            window.removeEventListener('storage', this._onStorage);
        }

        this._onMqChange = null;
        this._onStorage = null;
        this._mq = null;
        this._lastSnapshot = { mode: null, effectiveDark: null, prefersDark: null };
    }

    // ----- Public State Accessors -----

    get mode() { return this._mode; }

    get prefersDark() { return !!this._mq?.matches; }

    get effectiveDark() {
        return this._mode === 'dark' || (this._mode === 'auto' && this.prefersDark);
    }

    // ----- Public API Surface -----

    isDark() { return this.effectiveDark; }

    isLight() { return !this.effectiveDark; }

    setLight() { this._setMode('light'); }

    setDark() { this._setMode('dark'); }

    setAuto() { this._setMode('auto'); }

    toggle() {
        // Toggles the effective state to the opposite explicit state
        const currentlyDark = this.effectiveDark;
        this._setMode(currentlyDark ? 'light' : 'dark');
    }

    // ----- Internals -----

    _setMode(value) {
        this._mode = this._normalizeMode(value);
        this._persist();
        this._sync();
    }

    _normalizeMode(value) {
        return value === 'light' || value === 'dark' || value === 'auto'
            ? value
            : 'auto';
    }

    _safeReadStorage(key) {
        try {
            return window?.localStorage?.getItem(key);
        } catch (e) {
            // SecurityError or quota exceeded
            return null;
        }
    }

    _persist() {
        try {
            window?.localStorage?.setItem(this.storageKey, this._mode);
        } catch (e) {
            // Ignore errors (e.g. quota exceeded, privacy mode)
        }
    }

    _sync() {
        const effectiveDark = this.effectiveDark;
        const mode = this._mode;
        const prefersDark = this.prefersDark;

        const root = typeof document !== 'undefined' ? document.documentElement : null;
        
        // Self-Healing Check:
        // Ensure the DOM actually matches our desired state. If external code removed
        // the class or changed color-scheme, we must re-apply it even if our internal state hasn't changed.
        const domMatchesState = root 
            ? (root.classList.contains(this.darkClass) === effectiveDark) &&
              (root.style.colorScheme === (effectiveDark ? 'dark' : 'light'))
            : true;

        // Snapshot Optimization: 
        // Exit early ONLY if both internal state AND DOM state are already correct.
        if (
            this._lastSnapshot.mode === mode &&
            this._lastSnapshot.effectiveDark === effectiveDark &&
            this._lastSnapshot.prefersDark === prefersDark &&
            domMatchesState
        ) {
            return;
        }

        // Update Snapshot (using consistent internal naming)
        this._lastSnapshot = { mode, effectiveDark, prefersDark };

        // Apply to DOM
        if (root) {
            root.classList.toggle(this.darkClass, effectiveDark);
            // Sets global color-scheme for scrollbars/form controls.
            // RizzyUI asserts ownership of this property to ensure UI consistency.
            root.style.colorScheme = effectiveDark ? 'dark' : 'light';
        }

        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent(this.eventName, {
                    detail: {
                        mode: mode,
                        darkMode: effectiveDark, // External API uses 'darkMode' convention
                        prefersDark: prefersDark,
                        source: 'RizzyUI'
                    },
                })
            );
        }
    }
}

// Export singleton
export const themeController = new ThemeController();

import { themeController } from "./theme.js";

// --------------------------------------------------------------------------------
// Shared Store Registration
// Used by both standard and CSP builds to ensure consistent behavior.
// --------------------------------------------------------------------------------
export function registerStores(Alpine) {
    
    // Ensure controller is initialized (idempotent).
    // This supports scenarios where registerStores is used without the main bootstrap.
    themeController.init();

    // Register global theme store
    Alpine.store('theme', {
        // Reactive state mirrors
        // We mirror ALL derived properties to ensure Alpine reactivity works 
        // for bindings like x-show="prefersDark" or x-text="mode".
        _mode: themeController.mode,
        _prefersDark: themeController.prefersDark,
        _effectiveDark: themeController.effectiveDark,
        
        // Listener reference to prevent duplicate registration
        _onThemeChange: null,

        init() {
            // Guard against multiple initializations (e.g. HMR or component re-renders).
            // We only attach the listener once.
            if (!this._onThemeChange) {
                this._onThemeChange = () => this._refresh();
                window.addEventListener(themeController.eventName, this._onThemeChange);
            }
            
            // Always resync state on init, even if we were already listening,
            // to ensure we catch up with any changes that happened while component was inert.
            this._refresh();
        },

        _refresh() {
            this._mode = themeController.mode;
            this._prefersDark = themeController.prefersDark;
            this._effectiveDark = themeController.effectiveDark;
        },

        // ----- Reactive Getters -----
        // These return the reactive properties from the store, ensuring Alpine
        // properly tracks dependencies.
        get mode() { return this._mode; },
        get effectiveDark() { return this._effectiveDark; },
        get prefersDark() { return this._prefersDark; },
        
        // Expose as getters (not methods) for consistency
        get isDark() { return this._effectiveDark; },
        get isLight() { return !this._effectiveDark; },

        // ----- Proxy Methods -----
        setLight() { themeController.setLight(); },
        setDark() { themeController.setDark(); },
        setAuto() { themeController.setAuto(); },
        toggle() { themeController.toggle(); }
    });
}
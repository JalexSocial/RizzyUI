
// --------------------------------------------------------------------------------
// Alpine.js component: rzDarkModeToggle
// This is now a lightweight wrapper around the global $store.theme.
// It exposes the API surface on the local scope for backward compatibility
// and ease of use.
// --------------------------------------------------------------------------------
export default function (Alpine) {
    Alpine.data('rzDarkModeToggle', () => ({
        // Proxy all properties to the reactive store
        get mode() { return this.$store.theme.mode; },
        get prefersDark() { return this.$store.theme.prefersDark; },
        get effectiveDark() { return this.$store.theme.effectiveDark; },
        
        // Proxy properties from the store (isDark/isLight are getters on the store)
        get isDark() { return this.$store.theme.isDark; },
        get isLight() { return this.$store.theme.isLight; },

        // Proxy methods
        setLight() { this.$store.theme.setLight(); },
        setDark() { this.$store.theme.setDark(); },
        setAuto() { this.$store.theme.setAuto(); },
        toggle() { this.$store.theme.toggle(); }
    }));
}

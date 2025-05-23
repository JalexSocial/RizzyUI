
// --------------------------------------------------------------------------------
// Alpine.js component: rzDarkModeToggle
// This component toggles between light and dark themes.
// It reads the stored mode, applies the theme, and listens for OS-level changes.
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzDarkModeToggle', () => ({
        mode: 'light',
        applyTheme: null,
        init() {
            const hasLocalStorage = typeof window !== 'undefined' && 'localStorage' in window;
            const allowedModes = ['light', 'dark', 'auto'];
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            let storedMode = "auto";

            if (hasLocalStorage) {
                storedMode = localStorage.getItem('darkMode') ?? 'auto';

                // Validate stored mode against allowed values
                if (!allowedModes.includes(storedMode)) {
                    storedMode = 'light';
                }
            }

            if (hasLocalStorage) {
                localStorage.setItem('darkMode', storedMode);
            }

            // Function to apply the theme based on stored mode and OS preference
            this.applyTheme = () => {
                document.documentElement.classList.toggle('dark',
                    storedMode === 'dark' || (storedMode === 'auto' && prefersDark));
            };
            this.applyTheme();

            // Listen for OS-level color scheme changes to reapply the theme
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.applyTheme);
        },
        // Returns true if dark mode should be active
        isDark() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var storedMode = localStorage.getItem('darkMode');
            return this.mode === 'dark' || (this.mode === 'auto' && prefersDark);
        },
        // Returns true if light mode should be active
        isLight() {
            return !this.isDark();
        },
        // Toggle the dark mode setting and dispatch a custom event
        toggle() {
            let storedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (storedMode === 'light')
                storedMode = 'dark';
            else if (storedMode === 'dark')
                storedMode = 'light';
            else if (storedMode === 'auto') {
                storedMode = prefersDark ? 'light' : 'dark';
            }

            this.mode = storedMode;
            localStorage.setItem('darkMode', storedMode);

            const isDark = storedMode === 'dark' || (storedMode === 'auto' && prefersDark);
            document.documentElement.classList.toggle('dark', isDark);

            const darkModeEvent = new CustomEvent('darkModeToggle', {
                detail: {darkMode: isDark}
            });
            window.dispatchEvent(darkModeEvent);
        },
        destroy() {
            if (this.applyTheme) {
                window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.applyTheme);
            }
        }
    }));
}
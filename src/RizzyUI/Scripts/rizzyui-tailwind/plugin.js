const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

const safelist = require('./safelist');

const rizzyui = plugin(
    function ({ addBase, addVariant, theme }) {
        // Add base styles
        addBase({
            ':root': {
                /* General Colors */
                '--surface': '255 255 255', /* theme('colors.white') */
                '--onSurface': '51 65 85', /* theme('colors.slate.700') */
                '--onSurfaceStrong': '0 0 0', /* theme('colors.black') */
                '--surfaceAlt': '241 245 249', /* theme('colors.slate.100') */
                '--primary': '29 78 216', /* theme('colors.blue.700') */
                '--onPrimary': '241 245 249', /* theme('colors.slate.100') */
                '--secondary': '67 56 202', /* theme('colors.indigo.700') */
                '--onSecondary': '241 245 249', /* theme('colors.slate.100') */
                '--outline': '203 213 225', /* theme('colors.slate.300') */
                '--outlineStrong': '30 41 59', /* theme('colors.slate.800') */

                /* Dark Mode Variables */
                '--surfaceDark': '15 23 42', /* theme('colors.slate.900') */
                '--onSurfaceDark': '203 213 225', /* theme('colors.slate.300') */
                '--onSurfaceStrongDark': '255 255 255', /* theme('colors.white') */
                '--surfaceAltDark': '30 41 59', /* theme('colors.slate.800') */
                '--primaryDark': '37 99 235', /* theme('colors.blue.600') */
                '--onPrimaryDark': '241 245 249', /* theme('colors.slate.100') */
                '--secondaryDark': '79 70 229', /* theme('colors.indigo.600') */
                '--onSecondaryDark': '241 245 249', /* theme('colors.slate.100') */
                '--outlineDark': '51 65 85', /* theme('colors.slate.700') */
                '--outlineStrongDark': '203 213 225', /* theme('colors.slate.300') */

                /* Status Colors */
                '--danger': '220 38 38', /* theme('colors.red.600') */
                '--onDanger': '255 255 255', /* theme('colors.white') */
                '--info': '2 132 199', /* theme('colors.sky.600') */
                '--onInfo': '255 255 255', /* theme('colors.white') */
                '--warning': '245 158 11', /* theme('colors.amber.500') */
                '--onWarning': '255 255 255', /* theme('colors.white') */
                '--success': '22 163 74', /* theme('colors.green.600') */
                '--onSuccess': '255 255 255', /* theme('colors.white') */

                /* Border and Radius */
                '--borderWidth': '1px',
                '--borderRadius': '6px',
            },
        });

        // Add custom variants
        addVariant('htmx-settling', ['&.htmx-settling', '.htmx-settling &']);
        addVariant('htmx-request', ['&.htmx-request', '.htmx-request &']);
        addVariant('htmx-swapping', ['&.htmx-swapping', '.htmx-swapping &']);
        addVariant('htmx-added', ['&.htmx-added', '.htmx-added &']);
    },
    {
        // Theme extensions
        theme: {
            extend: {
                fontFamily: {
                    sans: ['Figtree', 'Open Sans', ...defaultTheme.fontFamily.sans],
                },
                maxWidth: {
                    '8xl': '90rem',
                    '9xl': '105rem',
                    '10xl': '120rem',
                },
                zIndex: {
                    1: 1,
                    60: 60,
                    70: 70,
                    80: 80,
                    90: 90,
                    100: 100,
                },
                keyframes: {
                    'spin-slow': {
                        '100%': {
                            transform: 'rotate(-360deg)',
                        },
                    },
                },
                animation: {
                    'spin-slow': 'spin-slow 8s linear infinite',
                },
                typography: {
                    DEFAULT: {
                        css: {
                            a: {
                                textDecoration: 'none',
                                '&:hover': {
                                    opacity: '.75',
                                },
                            },
                            img: {
                                borderRadius: defaultTheme.borderRadius.lg,
                            },
                        },
                    },
                },
                colors: {
                    surface: 'rgb(var(--surface))',
                    onSurface: 'rgb(var(--onSurface))',
                    onSurfaceStrong: 'rgb(var(--onSurfaceStrong))',
                    surfaceAlt: 'rgb(var(--surfaceAlt))',
                    primary: 'rgb(var(--primary))',
                    onPrimary: 'rgb(var(--onPrimary))',
                    secondary: 'rgb(var(--secondary))',
                    onSecondary: 'rgb(var(--onSecondary))',
                    outline: 'rgb(var(--outline))',
                    outlineStrong: 'rgb(var(--outlineStrong))',

                    /* Dark Mode Colors */
                    surfaceDark: 'rgb(var(--surfaceDark))',
                    onSurfaceDark: 'rgb(var(--onSurfaceDark))',
                    onSurfaceStrongDark: 'rgb(var(--onSurfaceStrongDark))',
                    surfaceAltDark: 'rgb(var(--surfaceAltDark))',
                    primaryDark: 'rgb(var(--primaryDark))',
                    onPrimaryDark: 'rgb(var(--onPrimaryDark))',
                    secondaryDark: 'rgb(var(--secondaryDark))',
                    onSecondaryDark: 'rgb(var(--onSecondaryDark))',
                    outlineDark: 'rgb(var(--outlineDark))',
                    outlineStrongDark: 'rgb(var(--outlineStrongDark))',

                    /* Status Colors */
                    danger: 'rgb(var(--danger))',
                    onDanger: 'rgb(var(--onDanger))',
                    info: 'rgb(var(--info))',
                    onInfo: 'rgb(var(--onInfo))',
                    warning: 'rgb(var(--warning))',
                    onWarning: 'rgb(var(--onWarning))',
                    success: 'rgb(var(--success))',
                    onSuccess: 'rgb(var(--onSuccess))',
                },
                borderWidth: {
                    DEFAULT: 'var(--borderWidth)',
                },
                borderRadius: {
                    DEFAULT: 'var(--borderRadius)',
                },
            },
        },
    }
);

module.exports = rizzyui;
module.exports.safelist = safelist;

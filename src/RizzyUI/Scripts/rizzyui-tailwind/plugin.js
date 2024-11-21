const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

const safelist = require('./safelist');

const rizzyui = plugin(
    function ({ addBase, addVariant, theme }) {
        // Add base styles
        addBase({
            ':root': {
                '--surface': theme('colors.white'),
                '--onSurface': theme('colors.slate.700'),
                '--onSurfaceStrong': theme('colors.black'),
                '--surfaceAlt': theme('colors.slate.100'),
                '--primary': theme('colors.blue.700'),
                '--onPrimary': theme('colors.slate.100'),
                '--secondary': theme('colors.indigo.700'),
                '--onSecondary': theme('colors.slate.100'),
                '--outline': theme('colors.slate.300'),
                '--outlineStrong': theme('colors.slate.800'),

                /* Dark Mode Variables */
                '--surfaceDark': theme('colors.slate.900'),
                '--onSurfaceDark': theme('colors.slate.300'),
                '--onSurfaceStrongDark': theme('colors.white'),
                '--surfaceAltDark': theme('colors.slate.800'),
                '--primaryDark': theme('colors.blue.600'),
                '--onPrimaryDark': theme('colors.slate.100'),
                '--secondaryDark': theme('colors.indigo.600'),
                '--onSecondaryDark': theme('colors.slate.100'),
                '--outlineDark': theme('colors.slate.700'),
                '--outlineStrongDark': theme('colors.slate.300'),

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
                '--borderRadius': '4px',
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
                    sans: ['Nunito Sans', 'Open Sans', ...defaultTheme.fontFamily.sans],
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
                    surface: 'var(--surface)',
                    onSurface: 'var(--onSurface)',
                    onSurfaceStrong: 'var(--onSurfaceStrong)',
                    surfaceAlt: 'var(--surfaceAlt)',
                    primary: 'var(--primary)',
                    onPrimary: 'var(--onPrimary)',
                    secondary: 'var(--secondary)',
                    onSecondary: 'var(--onSecondary)',
                    outline: 'var(--outline)',
                    outlineStrong: 'var(--outlineStrong)',

                    /* Dark Mode Colors */
                    surfaceDark: 'var(--surfaceDark)',
                    onSurfaceDark: 'var(--onSurfaceDark)',
                    onSurfaceStrongDark: 'var(--onSurfaceStrongDark)',
                    surfaceAltDark: 'var(--surfaceAltDark)',
                    primaryDark: 'var(--primaryDark)',
                    onPrimaryDark: 'var(--onPrimaryDark)',
                    secondaryDark: 'var(--secondaryDark)',
                    onSecondaryDark: 'var(--onSecondaryDark)',
                    outlineDark: 'var(--outlineDark)',
                    outlineStrongDark: 'var(--outlineStrongDark)',

                    /* Status Colors */
                    danger: 'rgb(var(--danger))',
                    onDanger: 'var(--onDanger)',
                    info: 'rgb(var(--info))',
                    onInfo: 'var(--onInfo)',
                    warning: 'var(--warning)',
                    onWarning: 'var(--onWarning)',
                    success: 'var(--success)',
                    onSuccess: 'var(--onSuccess)',
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

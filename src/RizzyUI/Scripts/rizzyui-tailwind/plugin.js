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
                '--danger': '220 38 38',
                '--onDanger': theme('colors.white'),
                '--info': theme('colors.sky.600'),
                '--onInfo': theme('colors.white'),
                '--warning': theme('colors.amber.500'),
                '--onWarning': theme('colors.white'),
                '--success': theme('colors.green.600'),
                '--onSuccess': theme('colors.white'),

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
                    onDanger: 'var(--onDanger)',
                    onInfo: 'var(--onInfo)',
                    onWarning: 'var(--onWarning)',
                    onSuccess: 'var(--onSuccess)',
                    danger: 'rgb(var(--danger))',
                    info: {
                        DEFAULT: 'var(--info)',
                        '10': 'rgba(var(--info), 0.1)',
                        '15': 'rgba(var(--info), 0.15)',
                        '20': 'rgba(var(--info), 0.2)',
                    },
                    warning: {
                        DEFAULT: 'var(--warning)',
                        '10': 'rgba(var(--warning), 0.1)',
                        '15': 'rgba(var(--warning), 0.15)',
                        '20': 'rgba(var(--warning), 0.2)',
                    },
                    success: {
                        DEFAULT: 'var(--success)',
                        '10': 'rgba(var(--success), 0.1)',
                        '15': 'rgba(var(--success), 0.15)',
                        '20': 'rgba(var(--success), 0.2)',
                    },
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

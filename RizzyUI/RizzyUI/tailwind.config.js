const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

import aspectRatio from "@tailwindcss/aspect-ratio";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./Components/**/*.{razor,html,cshtml,js}",
        './wwwroot/js/rizzyui.js'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito Sans', 'open sans', ...defaultTheme.fontFamily.sans],
            },
            maxWidth: {
                "8xl": "90rem",
                "9xl": "105rem",
                "10xl": "120rem",
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
                "spin-slow": {
                    "100%": {
                        transform: "rotate(-360deg)",
                    },
                },
            },
            animation: {
                "spin-slow": "spin-slow 8s linear infinite",
            },
            typography: {
                DEFAULT: {
                    css: {
                        a: {
                            textDecoration: "none",
                            "&:hover": {
                                opacity: ".75",
                            },
                        },
                        img: {
                            borderRadius: defaultTheme.borderRadius.lg,
                        },
                    },
                },
            },
            colors: {
                'surface': 'var(--rizzyui-surface)',
                'on-surface': 'var(--rizzyui-on-surface)',
                'on-surface-strong': 'var(--rizzyui-on-surface-strong)',
                'surface-alt': 'var(--rizzyui-surface-alt)',
                'primary': 'var(--rizzyui-primary)',
                'on-primary': 'var(--rizzyui-on-primary)',
                'secondary': 'var(--rizzyui-secondary)',
                'on-secondary': 'var(--rizzyui-on-secondary)',
                'outline': 'var(--rizzyui-outline)',
                'outline-strong': 'var(--rizzyui-outline-strong)',

                /* Dark Mode Colors */
                'dark-surface': 'var(--rizzyui-dark-surface)',
                'dark-on-surface': 'var(--rizzyui-dark-on-surface)',
                'dark-on-surface-strong': 'var(--rizzyui-dark-on-surface-strong)',
                'dark-surface-alt': 'var(--rizzyui-dark-surface-alt)',
                'dark-primary': 'var(--rizzyui-dark-primary)',
                'dark-on-primary': 'var(--rizzyui-dark-on-primary)',
                'dark-secondary': 'var(--rizzyui-dark-secondary)',
                'dark-on-secondary': 'var(--rizzyui-dark-on-secondary)',
                'dark-outline': 'var(--rizzyui-dark-outline)',
                'dark-outline-strong': 'var(--rizzyui-dark-outline-strong)',

                /* Status Colors */
                'danger': 'var(--rizzyui-danger)',
                'on-danger': 'var(--rizzyui-on-danger)',
                'info': 'var(--rizzyui-info)',
                'on-info': 'var(--rizzyui-on-info)',
                'warning': 'var(--rizzyui-warning)',
                'on-warning': 'var(--rizzyui-on-warning)',
                'success': 'var(--rizzyui-success)',
                'on-success': 'var(--rizzyui-on-success)',
            }
        },
    },
    plugins: [
        aspectRatio,
        forms,
        typography,
        plugin(function ({ addBase, theme }) {
            addBase({
                ':root': {
                    '--rizzyui-surface': theme('colors.white'),
                    '--rizzyui-on-surface': theme('colors.slate.700'),
                    '--rizzyui-on-surface-strong': theme('colors.black'),
                    '--rizzyui-surface-alt': theme('colors.slate.100'),
                    '--rizzyui-primary': theme('colors.blue.700'),
                    '--rizzyui-on-primary': theme('colors.slate.100'),
                    '--rizzyui-secondary': theme('colors.indigo.700'),
                    '--rizzyui-on-secondary': theme('colors.slate.100'),
                    '--rizzyui-outline': theme('colors.slate.300'),
                    '--rizzyui-outline-strong': theme('colors.slate.800'),

                    /* Dark Mode Variables */
                    '--rizzyui-dark-surface': theme('colors.slate.900'),
                    '--rizzyui-dark-on-surface': theme('colors.slate.300'),
                    '--rizzyui-dark-on-surface-strong': theme('colors.white'),
                    '--rizzyui-dark-surface-alt': theme('colors.slate.800'),
                    '--rizzyui-dark-primary': theme('colors.blue.600'),
                    '--rizzyui-dark-on-primary': theme('colors.slate.100'),
                    '--rizzyui-dark-secondary': theme('colors.indigo.600'),
                    '--rizzyui-dark-on-secondary': theme('colors.slate.100'),
                    '--rizzyui-dark-outline': theme('colors.slate.700'),
                    '--rizzyui-dark-outline-strong': theme('colors.slate.300'),

                    /* Status Colors */
                    '--rizzyui-danger': theme('colors.red.600'),
                    '--rizzyui-on-danger': theme('colors.white'),
                    '--rizzyui-info': theme('colors.sky.600'),
                    '--rizzyui-on-info': theme('colors.white'),
                    '--rizzyui-warning': theme('colors.amber.500'),
                    '--rizzyui-on-warning': theme('colors.white'),
                    '--rizzyui-success': theme('colors.green.600'),
                    '--rizzyui-on-success': theme('colors.white'),

                    /* Border and Radius */
                    '--rizzyui-border-width': '1px',
                    '--rizzyui-border-width-strong': '2px',
                    '--rizzyui-border-radius': '4px',
                    '--rizzyui-border-radius-large': '8px',
                },
            });
        }),
        plugin(function ({ addVariant }) {
            addVariant('htmx-settling', ['&.htmx-settling', '.htmx-settling &']);
            addVariant('htmx-request', ['&.htmx-request', '.htmx-request &']);
            addVariant('htmx-swapping', ['&.htmx-swapping', '.htmx-swapping &']);
            addVariant('htmx-added', ['&.htmx-added', '.htmx-added &']);
        }),
    ],
};




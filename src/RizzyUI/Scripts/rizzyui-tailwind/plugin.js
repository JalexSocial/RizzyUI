const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

const safelist = require('./safelist');

const rizzyui = plugin(
    function ({addBase, addVariant, addUtilities, theme}) {
        // Add base styles
        addBase({
            ':root': {
                /* Store only numeric L C H in each --color-* var */

                /* Light Mode (example subset, adapt as needed) */
                '--color-surface': '1 0 0', /* theme('colors.white') => L=1, C=0, H=0  */
                '--color-on-surface': '.372 .044 257.287', /* theme('colors.slate.700') */
                '--color-on-surface-strong': '0 0 0', /* black => L=0, C=0, H=0 */
                '--color-surface-alt': '.968 .007 247.896', /* slate.100 => see your list */
                '--color-primary': '.488 .243 264.376', /* blue.700 */
                '--color-on-primary': '.968 .007 247.896', /* slate.100 */
                '--color-secondary': '.457 .24 277.023', /* indigo.700 */
                '--color-on-secondary': '.968 .007 247.896', /* slate.100 */
                '--color-outline': '.869 .022 252.894', /* slate.300 */
                '--color-outline-strong': '.279 .041 260.031', /* slate.800 */

                /* Dark Mode */
                '--color-surface-dark': '.208 .042 265.755', /* slate.900 */
                '--color-on-surface-dark': '.869 .022 252.894', /* slate.300 */
                '--color-on-surface-dark-strong': '1 0 0', /* white => L=1, C=0, H=0 */
                '--color-surface-dark-alt': '.279 .041 260.031', /* slate.800 */
                '--color-primary-dark': '.546 .245 262.881', /* blue.600 */
                '--color-on-primary-dark': '.968 .007 247.896', /* slate.100 */
                '--color-secondary-dark': '.511 .262 276.966', /* indigo.600 */
                '--color-on-secondary-dark': '.968 .007 247.896', /* slate.100 */
                '--color-outline-dark': '.372 .044 257.287', /* slate.700 */
                '--color-outline-dark-strong': '.869 .022 252.894', /* slate.300 */

                /* Status Colors */
                '--color-danger': '.577 .245 27.325', /* red.600 */
                '--color-on-danger': '1 0 0', /* white */
                '--color-info': '.588 .158 241.966', /* sky.600 */
                '--color-onInfo': '1 0 0', /* white */
                '--color-warning': '.769 .188 70.08', /* amber.500 */
                '--color-on-warning': '1 0 0', /* white */
                '--color-success': '.627 .194 149.214', /* green.600 */
                '--color-on-success': '1 0 0', /* white */

                /* Border and Radius (unchanged) */
                '--borderWidth': '1px',
                '--borderRadius': '6px',
            },
            'svg': {
                width: '1em',
                height: '1em',
                'vertical-align': '-.125em',
            },
        });

        // Add custom variants
        addVariant('htmx-settling', ['&.htmx-settling', '.htmx-settling &']);
        addVariant('htmx-request', ['&.htmx-request', '.htmx-request &']);
        addVariant('htmx-swapping', ['&.htmx-swapping', '.htmx-swapping &']);
        addVariant('htmx-added', ['&.htmx-added', '.htmx-added &']);

        const rzUtilities = {
            /* Custom Scrollbar Styles */
            '.scrollbar-hover': {
                '&::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderRadius: '3px',
                    transition: 'background-color 0.3s',
                },
                '&:hover::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(107, 114, 128, 0.7)',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: 'transparent transparent',
                '&:hover': {
                    scrollbarColor: '#6b7280 transparent',
                },
            },
            '.grid-pattern': {
                background: `
          repeating-linear-gradient(
            90deg,
            oklch(var(--color-surface-alt)) 0,
            oklch(var(--color-surface-alt)) 5%,
            transparent 0,
            transparent 50%
          ),
          repeating-linear-gradient(
            180deg,
            oklch(var(--color-surface-alt)) 0,
            oklch(var(--color-surface-alt)) 5%,
            transparent 0,
            transparent 50%
          )
        `,
                'background-size': '1.5em 1.5em',
                'background-color': 'oklch(var(--color-surface))',
                opacity: '1',
            },
            '.dark .grid-pattern': {
                background: `
          repeating-linear-gradient(
            90deg,
            oklch(var(--color-surface-dark-alt)) 0,
            oklch(var(--color-surface-dark-alt)) 5%,
            transparent 0,
            transparent 50%
          ),
          repeating-linear-gradient(
            180deg,
            oklch(var(--color-surface-dark-alt)) 0,
            oklch(var(--color-surface-dark-alt)) 5%,
            transparent 0,
            transparent 50%
          )
        `,
                'background-size': '1.5em 1.5em',
                'background-color': 'oklch(var(--color-surface-dark))',
                opacity: '1',
            },
            '.form-children-spacing': {
                '> *:not(input[type="hidden"]) + *:not(input[type="hidden"])': {
                    marginTop: theme('spacing.6'),
                },
            },
            '.field-validation-error': {
                color: 'oklch(var(--color-danger))',
                fontStyle: 'italic',
            },
            '.input-validation-error': {
                borderColor: 'oklch(var(--color-danger))',
                outlineColor: 'oklch(var(--color-danger))',
            },
            '.input-validation-valid': {
                borderColor: 'oklch(var(--color-success))',
                outlineColor: 'oklch(var(--color-success))',
            },
            '.validation-summary-errors': {
                color: 'oklch(var(--color-danger))',
                fontStyle: 'italic',
            },
            '.validation-summary-valid span': {
                display: 'none',
            },
        };

        addUtilities(rzUtilities, {
            variants: ['responsive', 'hover'],
        });
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
                    // Use oklch(var(--color-*)) references
                    surface: 'oklch(var(--color-surface) / <alpha-value>)',
                    on-surface
:
'oklch(var(--color-on-surface) / <alpha-value>)',
on - surface - strong
:
'oklch(var(--color-on-surface-strong) / <alpha-value>)',
surface - alt
:
'oklch(var(--color-surface-alt) / <alpha-value>)',
    primary
:
'oklch(var(--color-primary) / <alpha-value>)',
on - primary
:
'oklch(var(--color-on-primary) / <alpha-value>)',
    secondary
:
'oklch(var(--color-secondary) / <alpha-value>)',
on - secondary
:
'oklch(var(--color-on-secondary) / <alpha-value>)',
    outline
:
'oklch(var(--color-outline) / <alpha-value>)',
outline - strong
:
'oklch(var(--color-outline-strong) / <alpha-value>)',

    // Dark Mode
surface - dark
:
'oklch(var(--color-surface-dark) / <alpha-value>)',
on - surface - dark
:
'oklch(var(--color-on-surface-dark) / <alpha-value>)',
on - surface - dark - strong
:
'oklch(var(--color-on-surface-dark-strong) / <alpha-value>)',
surface - dark - alt
:
'oklch(var(--color-surface-dark-alt) / <alpha-value>)',
primary - dark
:
'oklch(var(--color-primary-dark) / <alpha-value>)',
on - primary - dark
:
'oklch(var(--color-on-primary-dark) / <alpha-value>)',
secondary - dark
:
'oklch(var(--color-secondary-dark) / <alpha-value>)',
on - secondary - dark
:
'oklch(var(--color-on-secondary-dark) / <alpha-value>)',
outline - dark
:
'oklch(var(--color-outline-dark) / <alpha-value>)',
outline - dark - strong
:
'oklch(var(--color-outline-dark-strong) / <alpha-value>)',

    // Status
    danger
:
'oklch(var(--color-danger) / <alpha-value>)',
on - danger
:
'oklch(var(--color-on-danger) / <alpha-value>)',
    info
:
'oklch(var(--color-info) / <alpha-value>)',
    onInfo
:
'oklch(var(--color-onInfo) / <alpha-value>)',
    warning
:
'oklch(var(--color-warning) / <alpha-value>)',
on - warning
:
'oklch(var(--color-on-warning) / <alpha-value>)',
    success
:
'oklch(var(--color-success) / <alpha-value>)',
on - success
:
'oklch(var(--color-on-success) / <alpha-value>)',
},
{
    'var(--borderWidth)',
}
,
{
    'var(--borderRadius)',
}
,
},
},
}
)

module.exports = rizzyui;
module.exports.safelist = [
    ...safelist,
    'field-validation-error',
    'input-validation-error',
    'input-validation-valid',
    'validation-summary-errors',
];
